"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { getPostDataInclude } from "@/lib/types"
import { createPostSchema } from "@/lib/zodSchema"

interface Media {
  publicId:string,
  type:string
}

export async function SubmitPost(input: { content: string; media:{
  publicId:string,
  type:string
}[]  }) {
    const session = await auth();
    if (!session?.user || !session?.user?.id)
      throw new Error("Please log in to post. Not a valid user.");
  
    const { content, media} = createPostSchema.parse(input);
  
    
  // Step 1: Create the Post
  const post = await prisma.post.create({
    data: {
      content,
      userId: session.user.id,
    },
  });

  // Step 2: Create Media and Associate with Post
  if (media.length > 0) {
    await prisma.media.createMany({
      data: media.map((m) => ({
        publicId: m.publicId,
        type:(m.type.startsWith("image")?"IMAGE":"VIDEO"),
        postId: post.id, // Associate with the newly created post
      })),
    });
  }

  // Step 3: Fetch Full Post Data (Optional)
  const fullPost = await prisma.post.findUnique({
    where: { id: post.id },
    include: getPostDataInclude(session?.user?.id) // Include the associated media
  });
  if(fullPost) return {post:fullPost,success:"Post Created Successfully"}
          return {error :"Error uploading post ,Try again Later"}
        
}

