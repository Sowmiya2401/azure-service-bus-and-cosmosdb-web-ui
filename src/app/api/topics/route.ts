import { NextResponse } from "next/server";
import { serviceBusAdminClient } from "@/lib/serviceBus";
import { auth } from "@/auth";

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const topics = [];
        for await (const topic of serviceBusAdminClient.listTopics()) {
            const subscriptions = [];
            for await (const sub of serviceBusAdminClient.listSubscriptions(topic.name)) {
                const subRuntime = await serviceBusAdminClient.getSubscriptionRuntimeProperties(topic.name, sub.subscriptionName);
                subscriptions.push({
                    ...sub,
                    activeMessageCount: subRuntime.activeMessageCount,
                    deadLetterMessageCount: subRuntime.deadLetterMessageCount
                });
            }
            topics.push({ ...topic, subscriptions });
        }
        return NextResponse.json(topics);
    } catch (error) {
        console.error("Error fetching topics:", error);
        return NextResponse.json({ error: "Failed to fetch topics" }, { status: 500 });
    }
}
