import { auth } from '@/auth';
import FollowButton from '@/components/FollowButton';
import FollowerCount from '@/components/followerCount';
import TrendsSidebar from '@/components/TrendsSidebar';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/User-Avatar';
import prisma from '@/lib/prisma';
import { FollowerInfo, getUserDataSelect, userData } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { format } from 'date-fns'; // Correct import for `formatDate`
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React, { cache } from 'react';
import UsersPosts from './userPosts';
import Linkify from '@/components/Linkify';
import EditProfileButton from './EditProfileButton';
import { CldImage } from 'next-cloudinary';
import ClientCldImage from '@/components/CldImage';

interface ProfilePageProps {
  params: { username: string };
}

interface UserProfileSectionProps {
  user: userData;
  loggedInUserId: string;
}

const getUser = cache(async (username: string, loggedInUser: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: 'insensitive',
      },
    },
    select: getUserDataSelect(loggedInUser),
  });
  if (!user) notFound();
  return user;
});

export const generateMetadata = async ({
  params,
}: ProfilePageProps): Promise<Metadata> => {
    const {username} = await params
    const session = await auth();
  if (!session?.user?.id) return {};
  const user = await getUser(username, session.user?.id);
  return {
    title: `${user?.name} (@${user.username})`,
  };
};

async function ProfilePage({ params }: ProfilePageProps) {
    const {username} = await params
    const session = await auth();
  if (!session?.user) {
    return (
      <div className="text-destructive">
        You are not an authorized User. Access Denied
      </div>
    );
  }

  const user = await getUser(username, session.user.id);
  return (
    <main className=" flex w-full min-w-0 gap-5">
      <div className="border-border dark:border p-2 w-full min-w-0 space-y-5">
        <UserProfileSection user={user} loggedInUserId={session.user.id} />
        <div className='p-5 bg-card rounded-2xl shadow-sm '>
            <h2 className=' m-2 rounded-sm text-center font-semibold text-2xl'>
                {user.name}'s Posts
            </h2>
        </div>
            <UsersPosts userId={user.id}/>
      </div>
            <TrendsSidebar />
    </main>
  );
}

function UserProfileSection({
  user,
  loggedInUserId,
}: UserProfileSectionProps) {
  
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({followerId}) => followerId === loggedInUserId
    ),
  };
  
  console.log("here",user)
  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
        <ClientCldImage alt='fallback' src={user?.image} size={250} height={250} width={250} />
      {/* User info section */}
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1>{user?.name}</h1>
            <div className="text-muted-foreground ml-3">@{user.username}</div>
          </div>
          <div>Joined {format(new Date(user.createdAt), 'MMMM d, yyyy')}</div>
          <div className="flex items-center gap-3">
            Posts:{' '}
            <span className="font-semibold">
              {formatNumber(user._count.posts)}
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id !== loggedInUserId ? (
          <FollowButton userId={user.id} initialState={followerInfo} />
        ) : (
          <EditProfileButton user={user}/>
        )}
      </div>

      {user.bio && (
        <>
          <hr />
          <Linkify>
          <div className="overflow-hidden whitespace-pre-line break-words">
            {user.bio}
          </div>
          </Linkify>
        </>
      )}
     
    </div>
  );
}

export default ProfilePage;
