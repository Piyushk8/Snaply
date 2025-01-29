import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure prisma is correctly imported
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 } // Set status code for unauthorized access
      );
    }

    console.log("Fetching trending topics...");

    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
      SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
      FROM posts
      GROUP BY (hashtag)
      ORDER BY count DESC, hashtag ASC
    `;

    return NextResponse.json(
      {
        success: true,
        result: result.map(row => ({
          hashtag: row.hashtag,
          count: Number(row.count), // Convert BigInt to Number
        })),
      },
      { status: 200 } // Set successful response status
    );
  } catch (error) {
    console.error("Database fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch trending topics" },
      { status: 500 }
    );
  }
}
