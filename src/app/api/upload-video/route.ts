import { auth } from '@/auth';
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
        const MAX_SIZE = 40 * 1024 * 1024; // 100MB

        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 400 });
        }
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: "File size exceeds the limit of 100MB" }, { status: 400 });
        }

        


        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate a unique public ID based on the file name
        const fileName = file.name.split('.')[0];
        let options: any = {
            folder: "Attachments",
            public_id: fileName,
            unique_filename: true,
        };

        // Customize options based on file type
        if (file.type.startsWith("video")) {
            options = {
                ...options,
                transformation: [{ quality: "auto", fetch_format: "mp4" }],
                resource_type: "video", // Handle as video
            };
        } else if (file.type.startsWith("image")) {
            options = {
                ...options,
                resource_type: "image", // Handle as image
            };
        }

        // Check and delete existing file if necessary

        // Upload new file
        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
               options,
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as CloudinaryUploadResult);
                }
            );
            uploadStream.end(buffer);
        });
        console.log(result.public_id)

      

        return NextResponse.json({ publicId: result.public_id }, { status: 200 });

    } catch (error) {
        console.error("Upload failed:", error);
        return NextResponse.json(
            { error: "Upload failed" }, 
            { status: 500 }
        );
    }
}

export const DELETE = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const publicId = searchParams.get("Id")

    if (!publicId) {
        return NextResponse.json({ error: "No Public ID found" }, { status: 400 });
    }

    try {
        // Try deleting with different resource types
        const resourceTypes = ['video', 'image', 'raw'];
        
        for (const type of resourceTypes) {
            try {
                const deleteResult = await cloudinary.uploader.destroy(
                    publicId, 
                    { resource_type: type }
                );

                if (deleteResult.result === 'ok') {
                    return NextResponse.json({
                        deleted: true,
                        publicId,
                        message: `Deleted successfully as ${type}`
                    });
                }
            } catch (typeError) {
                // Continue to next resource type if deletion fails
                continue;
            }
        }

        // If no deletion succeeded
        return NextResponse.json({
            deleted: false,
            message: "Failed to delete file"
        }, { status: 404 });

    } catch (error) {
        console.error('Deletion error:', error);
        return NextResponse.json({
            deleted: false,
            message: "Error occurred while deleting from Cloudinary"
        }, { status: 500 });
    }
};