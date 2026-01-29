import { NextResponse } from "next/server";
import { queryItems, searchItems } from "@/lib/cosmosDb";
import { auth } from "@/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ database: string; container: string }> }
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { database, container } = await params;
        const { searchParams } = new URL(request.url);
        
        const query = searchParams.get("query");
        const continuationToken = searchParams.get("continuationToken");
        const searchField = searchParams.get("searchField");
        const searchValue = searchParams.get("searchValue");
        const maxItemCount = parseInt(searchParams.get("maxItemCount") || "25", 10);

        // If search parameters are provided, use search
        if (searchField && searchValue) {
            const items = await searchItems(database, container, searchField, searchValue, maxItemCount);
            return NextResponse.json({ items, hasMore: false });
        }

        // Otherwise use query or default query
        const result = await queryItems(
            database,
            container,
            query || undefined,
            continuationToken || undefined,
            maxItemCount
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching Cosmos DB items:", error);
        return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
    }
}
