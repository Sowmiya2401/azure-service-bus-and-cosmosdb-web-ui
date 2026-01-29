import { NextResponse } from "next/server";
import { listDatabases } from "@/lib/cosmosDb";
import { auth } from "@/auth";

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const databases = await listDatabases();
        return NextResponse.json(databases);
    } catch (error) {
        console.error("Error fetching Cosmos DB databases:", error);
        return NextResponse.json({ error: "Failed to fetch databases" }, { status: 500 });
    }
}
