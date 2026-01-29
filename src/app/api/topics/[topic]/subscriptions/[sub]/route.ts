import { NextResponse } from "next/server";
import { serviceBusAdminClient } from "@/lib/serviceBus";
import { auth } from "@/auth";

export async function GET(request: Request, { params }: { params: Promise<{ topic: string; sub: string }> }) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { topic, sub } = await params;
        const subscription = await serviceBusAdminClient.getSubscription(topic, sub);
        const runtimeProps = await serviceBusAdminClient.getSubscriptionRuntimeProperties(topic, sub);

        return NextResponse.json({
            subscriptionName: subscription.subscriptionName,
            topicName: subscription.topicName,
            activeMessageCount: runtimeProps.activeMessageCount,
            deadLetterMessageCount: runtimeProps.deadLetterMessageCount,
            createdAt: runtimeProps.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: runtimeProps.modifiedAt?.toISOString() || new Date().toISOString(),
            accessedAt: runtimeProps.accessedAt?.toISOString(),
        });
    } catch (error) {
        console.error("Error fetching subscription:", error);
        return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 });
    }
}
