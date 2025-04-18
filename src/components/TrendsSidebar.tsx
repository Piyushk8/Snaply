import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { Loader2 } from "lucide-react";
import React, { Suspense } from "react";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";
import FollowButton from "./FollowButton";
import ClientCldImage from "./CldImage";
import SearchField from "./searchField";

const TrendsSidebar = () => {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit flex-none md:block lg:w-80 w-72">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin"></Loader2>}>
        <WhoToFollow />
        <TrendingTopicsSection />
      </Suspense>
    </div>
  );
};

const WhoToFollow = async () => {
  const session = await auth();
  if (!session?.user) return null;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: session.user?.id,
      },
      followers: {
        none: {
          followerId: session?.user?.id,
        },
      },
    },
    select: getUserDataSelect(session.user.id),
    take: 5,
  });
  // console.log("users to follow:",usersToFollow)
  return (
    <div className="space-y-5 border border-border rounded-2xl bg-card p-5 shadow-sm">
      <div className="z-30 bg-card w-full relative">
        <SearchField />
      </div>
      <div className="text-xl font-bold"> Who To Follow</div>
      {usersToFollow.map((user) => {
        return (
          <div
            key={user.id}
            className="flex items-center justify-between gap-3"
          >
            <Link
              href={`/user/${user?.username}`}
              className="flex items-center gap-3"
            >
              {/* <UserAvatar image={user.image} className='flex-none'/> */}
              <ClientCldImage src={user?.image} classname="flex-none" />
              <div>
                <p className="line-clamp-1 break-all font-semibold hover:text-gray-500">
                  {user?.name}
                </p>
                <p className="line-clamp-1 break-all text-muted-foreground ">
                  @{user?.username}
                </p>
              </div>
            </Link>
            <FollowButton
              userId={user.id}
              initialState={{
                followers: user._count.followers,
                isFollowedByUser: user.followers.some(
                  (u) => u.followerId === session.user.id
                ),
              }}
            ></FollowButton>
          </div>
        );
      })}
    </div>
  );
};

export default TrendsSidebar;
type LimitType = number | undefined | null;

export const getTrendingTopics = unstable_cache(
  async (Limit?: LimitType) => {
    let result = [];
    if (typeof Limit === "number") {
      // When Limit is a number, include the LIMIT clause
      result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
        SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
        FROM posts
        GROUP BY (hashtag)
        ORDER BY count DESC, hashtag ASC
        LIMIT ${Limit}
      `;
    } else {
      // When Limit is null or undefined, exclude the LIMIT clause
      result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
        SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
        FROM posts
        GROUP BY (hashtag)
        ORDER BY count DESC, hashtag ASC
      `;
    }
    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  {
    revalidate: 3 * 60 * 60, // Revalidate every 3 hours
  }
);


export const TrendingTopicsSection = async () => {
  const TrendingTopics = await getTrendingTopics();
  return (
    <div className="border-border border space-y-5 mt-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Trending Topics</div>
      {TrendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split("#")[1];

        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground ">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
};
