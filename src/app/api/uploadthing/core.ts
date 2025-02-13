
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
// import streamServerClient from "@/lib/stream";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB" },
  })
    .middleware(async () => {
      const session = await auth()
      const user = session?.user
      if (!user) throw new UploadThingError("Unauthorized");
      console.log("middleware:",user)
      return { user };
    })
    .onUploadError(async({error,fileKey})=>{
      console.log("onuploadError:",error,fileKey)
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("metadta",metadata)
      try {
        const oldAvatarUrl = metadata.user.image;

      if (oldAvatarUrl) {
        const key = oldAvatarUrl.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        )[1];

        await new UTApi().deleteFiles(key);
      }

      const newAvatarUrl = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      );

      await Promise.all([
        prisma.user.update({
          where: { id: metadata.user.id },
          data: {
            image: newAvatarUrl,
          },
        }),
        // streamServerClient.partialUpdateUser({
        //   id: metadata.user.id,
        //   set: {
        //     image: newAvatarUrl,
        //   },
        // }),
      ]);

      return { avatarUrl: newAvatarUrl };
   
      } catch (error) {
        console.log(error)
      }  
    }),
    attachments:f({
      image:{maxFileSize:"4MB",maxFileCount:5}
      ,video:{maxFileSize:"64MB",maxFileCount:2}

    })
    .middleware(async()=>{
      const session = await auth()
      const user = session?.user
      if (!user) throw new UploadThingError("Unauthorized");
      console.log("middleware:",user)
      return { user };
    
    })
    //@ts-ignore
    .onUploadComplete(async ({file}) => {
      const media = await prisma.media.create({
        data:{
          url: file.url.replace(
            "/f/",
            `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
          ),
          type:file.type.startsWith("image")?"IMAGE":"VIDEO"    
        }
      })
      return {media}
    })
 
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;