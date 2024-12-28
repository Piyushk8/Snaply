
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, POstPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") ;

    const pageSize = 10;

    const session = await auth();
    const user = session?.user
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookmarks = await prisma.bookmarks.findMany({
      where: {
        userId: user.id,
      },
      include: {
        post: {
          include: getPostDataInclude(user.id),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
       take: pageSize + 1,
       cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      bookmarks.length > pageSize ? bookmarks[pageSize].id : null;

    const data: POstPage = {
      posts: bookmarks.slice(0, pageSize).map((bookmark) => bookmark.post),
      nextCursor,
    };
    console.log(bookmarks)

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}