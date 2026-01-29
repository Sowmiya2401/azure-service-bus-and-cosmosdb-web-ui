import { NextResponse } from "next/server";
import { serviceBusClient } from "@/lib/serviceBus";
import { ServiceBusMessage } from "@azure/service-bus";
import { auth } from "@/auth";
import Long from "long";

// Helper to get receiver for DLQ
function getReceiver(topic: string, subscription: string) {
    return serviceBusClient.createReceiver(topic, subscription, { subQueueType: "deadLetter" });
}

export async function GET(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const topic = searchParams.get("topic");
    const subscription = searchParams.get("subscription");

    if (!topic || !subscription) {
        return NextResponse.json({ error: "Topic and subscription are required" }, { status: 400 });
    }

    console.log("DLQ API called with:", { topic, subscription });

    try {
        const receiver = getReceiver(topic, subscription);
        
        // Try peeking from sequence number 1 to ensure we get all messages
        const messages = await receiver.peekMessages(50, { fromSequenceNumber: Long.ONE });
        await receiver.close();

        console.log(`DLQ API: Found ${messages.length} messages`);

        // Serialize messages - handle BigInt sequenceNumber and Date objects
        const serializedMessages = messages.map(msg => ({
            messageId: msg.messageId,
            body: msg.body,
            sequenceNumber: msg.sequenceNumber?.toString(),
            enqueuedTimeUtc: msg.enqueuedTimeUtc?.toISOString(),
            subject: msg.subject,
            applicationProperties: msg.applicationProperties,
            contentType: msg.contentType,
            correlationId: msg.correlationId,
            deadLetterReason: msg.deadLetterReason,
            deadLetterErrorDescription: msg.deadLetterErrorDescription,
        }));

        return NextResponse.json(serializedMessages);
    } catch (error) {
        console.error("Error fetching DLQ messages:", error);
        return NextResponse.json({ error: "Failed to fetch DLQ messages" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { topic, message } = body;

    if (!topic || !message) {
        return NextResponse.json({ error: "Topic and message are required" }, { status: 400 });
    }

    try {
        // Resubmit means sending to the topic
        const sender = serviceBusClient.createSender(topic);

        // Construct new message
        const newMessage: ServiceBusMessage = {
            body: message.body,
            subject: message.subject,
            applicationProperties: message.applicationProperties,
            contentType: message.contentType,
            correlationId: message.correlationId,
            messageId: message.messageId, // Keep ID? Or generate new? Service Bus might dedupe if same ID.
            // Usually better to let it generate or keep if we want exact copy.
            // But if we want to "reprocess", maybe we want it to be treated as new?
            // Let's keep it but maybe modify if needed.
        };

        await sender.sendMessages(newMessage);
        await sender.close();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error resubmitting message:", error);
        return NextResponse.json({ error: "Failed to resubmit message" }, { status: 500 });
    }
}
