"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Placeholder from "@tiptap/extension-placeholder";
import characterCount from "@tiptap/extension-character-count";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useCallback, useRef, useState, useTransition } from "react";
// import { SubmitPost } from "./action";
import {
  useQueryClient,
  QueryFilters,
  InfiniteData,
} from "@tanstack/react-query";
import { PostData, POstPage } from "@/lib/types";
import { ImageIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UploadingFile } from "../editor/useMediaUpload";

interface AddAttachmentsButton {
  onFileSelected: (files: File[]) => void;
  disabled: boolean;
}

export function AddAttachmentsButton({
  onFileSelected,
  disabled,
}: AddAttachmentsButton) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant={"outline"}
        className="hover:shadow-xl"
        disabled={disabled}
        onClick={() => fileInputRef?.current?.click()}
      >
        <ImageIcon size={40} />
      </Button>
      <input
        type="file"
        accept="image/*,video/*"
        multiple
        ref={fileInputRef}
        className="hidden sr-only"
        onChange={(e) => {
          const files = Array.from(e.target?.files || []);
          if (files.length) onFileSelected(files);
          //
          e.target.value = "";
        }}
      />
    </>
  );
}

interface AttachmentPreviewProps {
  attachment: UploadingFile;
  onRemoveClick: () => void;
}
interface AttachmentPreviewsProps {
  attachments: UploadingFile[];
  removeAttachment: (fileName: string) => void;
}

export function AttachmentPreviews({
  attachments,
  removeAttachment,
}: AttachmentPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2"
      )}
    >
      {attachments?.map((a) => {
        return (
          <AttachmentPreview
            key={a.file.name}
            attachment={a}
            onRemoveClick={() => removeAttachment(a.file.name)}
          />
        );
      })}
    </div>
  );
}

export function AttachmentPreview({
  attachment: { file, status, progress },
  onRemoveClick,
}: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (src: string) => {
    setSelectedImage(src);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

  return (
    <div
      className={cn(
        "relative flex justify-center items-center  mx-auto size-fit",
        status === "uploading" && "opacity-50"
      )}
    >
      {/* //CLOUDIMAGE */}
      {
        <X
          fill="#111"
          className="absolute z-10 top-1 right-1"
          onClick={() => onRemoveClick()}
        />
      }
      {file.type.startsWith("image") ? (
        <Image
          onClick={() => openModal(src)}
          src={src}
          alt=""
          width={200}
          height={200}
          className="size-fit max-h-[30rem] rounded-2xl"
        />
      ) : (
        <video controls className=" size-fit max-h-[30rem] rounded-2xl ">
          <source src={src} type={file.type} />
        </video>
      )}
      {status === "uploading" && (
        <div className="absolute  ">
          <Loader2 size={48} className="animate-spin" /> {`${progress}%`}
        </div>
      )}

      {/* Full-screen modal for viewing the selected image */}
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={closeModal}>
          {" "}
          {/* Ensure `onClose` is used */}
          <DialogHeader className="flex justify-between">
            <button
              onClick={closeModal}
              className="text-black hover:text-red-500 p-2 rounded-full"
            >
              ✕ {/* Built-in header close button */}
            </button>
          </DialogHeader>
          <DialogContent className="h-[95%] max-h-[95vh] overflow-auto flex flex-col flex-1">
            <DialogTitle className="text-center">Preview</DialogTitle>
            <div className="flex gap-2 justify-between mb-2">
              <Button className="w-1/2 hover:bg-slate-700">Crop</Button>
              <Button className="w-1/2 hover:bg-slate-700">Alt</Button>
            </div>
            <div className="flex-1 flex justify-center items-center bg-black bg-opacity-80 p-2 rounded-lg overflow-auto">
              <Image
                src={selectedImage || "/fallback-image.jpg"} // Replace with a valid fallback image
                alt="Preview"
                height={400}
                width={500}
                // fill // Makes the image take available space while maintaining aspect ratio
                className="object-contain rounded-lg h-fit"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
