import { NextResponse } from "next/server";
import { listContainers } from "@/lib/cosmosDb";
import { auth } from "@/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ database: string }> }
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { database } = await params;
        const containers = await listContainers(database);
        return NextResponse.json(containers);
    } catch (error) {
        console.error("Error fetching Cosmos DB containers:", error);
        return NextResponse.json({ error: "Failed to fetch containers" }, { status: 500 });
    }
}
