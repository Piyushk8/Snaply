import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Buffer } from 'buffer';
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

// Configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryUploadResult {
    public_id: string;
    [key: string]: any;
}

export const POST = async (req: NextRequest) => {
    // Auth check
    const session = await auth();
    const user = session?.user
    if (!session?.user) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 400 });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate a unique public ID based on the file name
        const fileName = file.name.split('.')[0];
        const publicId = `Avatars/${fileName}`;

        // Check and delete existing file if necessary
        try {
            const existingResource = await cloudinary.api.resource(publicId);
            if (existingResource) {
                await cloudinary.uploader.destroy(publicId);
                console.log(`Deleted existing file: ${publicId}`);
            }
        } catch (error) {
            console.log("No existing file found, proceeding with upload...");
        }

        // Upload new file
        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "Avatars",
                    public_id: fileName,
                    unique_filename: true,
                    resource_type: "auto", // Automatically detect file type
                    // format: "auto" // Automatically optimize format
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as CloudinaryUploadResult);
                }
            );
            uploadStream.end(buffer);
        });


        await prisma.user.update({
            where:{id:user?.id},
            data:{
                image:result?.public_id
            }
        })

        return NextResponse.json({ publicId: result.public_id }, { status: 200 });

    } catch (error) {
        console.error("Upload failed:", error);
        return NextResponse.json(
            { error: "Upload failed" }, 
            { status: 500 }
        );
    }
}