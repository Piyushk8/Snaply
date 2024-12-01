import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { postDataInclude, POstPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;

    const session = await auth();
    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized access" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch posts with pagination
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: pageSize + 1, // Fetch one extra to determine next cursor
      cursor: cursor ? { id: cursor } : undefined,
      include: postDataInclude,
    });

    // Determine next cursor
    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    // Prepare data
    const data: POstPage = {
      posts: posts.slice(0, pageSize), // Return only `pageSize` posts
      nextCursor,
    };

    // Return JSON response
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error!" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
