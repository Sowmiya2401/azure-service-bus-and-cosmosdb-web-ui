import { NextResponse } from "next/server";
import { serviceBusClient } from "@/lib/serviceBus";
import { auth } from "@/auth";
import Long from "long";

// Helper to get receiver for active messages
function getReceiver(topic: string, subscription: string) {
    return serviceBusClient.createReceiver(topic, subscription, { receiveMode: "peekLock" });
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

    console.log("Active Messages API called with:", { topic, subscription });

    try {
        const receiver = getReceiver(topic, subscription);
        
        // Peek active messages from sequence number 1
        const messages = await receiver.peekMessages(50, { fromSequenceNumber: Long.ONE });
        await receiver.close();

        console.log(`Active Messages API: Found ${messages.length} messages`);

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
        }));

        return NextResponse.json(serializedMessages);
    } catch (error) {
        console.error("Error fetching active messages:", error);
        return NextResponse.json({ error: "Failed to fetch active messages" }, { status: 500 });
    }
}
