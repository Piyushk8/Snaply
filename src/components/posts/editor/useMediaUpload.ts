import { useToast } from "@/hooks/use-toast";
import { useCallback, useState } from "react";

export interface UploadingFile {
  file: File;
  progress: number;
  status: "uploading" | "completed" | "failed";
  publicId?: string;
  error?: string;
  mediaId?: string;
}

export function useMediaUpload() {
  const { toast } = useToast();
  const [attachmentUploadInfo, setAttachmentUploadInfo] = useState<
    UploadingFile[]
  >([]);
  const [allUploadComplete, setallUploadComplete] = useState(false);

  const allUploadCompleteCheck = useCallback(() => {
    const result = attachmentUploadInfo.every(
      (file) => file.status === "completed" || file.status === "failed"
    );
    if (result) {
      setallUploadComplete(true);
      return;
    }
  }, [allUploadComplete, attachmentUploadInfo]);

  const uploadAttachments = async (files: File[]) => {
    // Create modified files with new names
    const renamedFiles = files.map((file) => {
      const extension = file.name.split(".").pop();
      return new File(
        [file],
        `attachment_${crypto.randomUUID()}.${extension}`,
        { type: file.type }
      );
    });

    // Initialize upload states for all files
    setAttachmentUploadInfo((prev) => [
      ...prev,
      ...renamedFiles.map((file) => ({
        file,
        progress: 0,
        status: "uploading" as const,
      })),
    ]);

    // Upload each file
    const uploadPromises = renamedFiles.map(async (file) => {
      const attachment = attachmentUploadInfo.filter(
        (a) => a.file.name === file.name
      )[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded * 100) / event.total);
            setAttachmentUploadInfo((prev) =>
              prev.map((f) =>
                f.file.name === file.name ? { ...f, progress } : f
              )
            );
          }
        };

        // Create promise to handle upload completion
        const uploadPromise = new Promise((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } else {
              reject(new Error(`Upload failed: ${xhr.statusText}`));
              removeAttachment(file.name);
            }
          };
          xhr.onerror = () => reject(new Error("Network error occurred"));
        });

        // Start upload
        xhr.open("POST", "/api/upload-video", true);
        xhr.send(formData);

        // Wait for upload to complete
        const response = (await uploadPromise) as {
          url: string;
          publicId: string;
        };
        // if(attachment.publicId!==response.publicId) return
        // Update file status on completion
        setAttachmentUploadInfo((prev) =>
          prev.map((f) =>
            f.file.name === file.name
              ? {
                  ...f,
                  status: "completed",
                  publicId: response.publicId,
                  // mediaId: response.id,
                  progress: 100,
                }
              : f
          )
        );
        allUploadCompleteCheck();
        toast({
          title: "Upload complete",
          description: `uploaded successfully`,
        });

        return response;
      } catch (error) {
        // Update file status on error
        setAttachmentUploadInfo((prev) =>
          prev.map((f) =>
            f.file.name === file.name
              ? {
                  ...f,
                  status: "failed",
                  error:
                    error instanceof Error ? error.message : "Upload failed",
                  progress: 0,
                }
              : f
          )
        );
        removeAttachment(file.name);

        toast({
          variant: "destructive",
          title: "Upload failed",
          description: `Failed to upload`,
        });

        throw error;
      }
    });

    // Wait for all uploads to complete
    try {
      const results = await Promise.all(uploadPromises);

      allUploadCompleteCheck();
      // return {...results,uploadStatus}
    } catch (error) {
      console.error("Some uploads failed:", error);
    }
  };

  const removeAttachment = async (fileName: string) => {
    setAttachmentUploadInfo((prev) =>
      prev.filter((f) => f.file.name !== fileName)
    );
    const publicId = attachmentUploadInfo.filter(
      (a) => a.file.name === fileName
    )[0].publicId;
    if (publicId) {
      const response = await fetch(`/api/upload-video?Id=${publicId}`, {
        method: "DELETE",
      });
    }
  };

  const reset = () => {
    setAttachmentUploadInfo([]);
  };

  return {
    allUploadComplete,
    uploadAttachments,
    attachmentUploadInfo,
    removeAttachment,
    reset,
  };
}
