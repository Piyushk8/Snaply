"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {  z } from "zod";
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
import { SubmitPost } from "./action";
import {
  useQueryClient,
  QueryFilters,
  InfiniteData,
} from "@tanstack/react-query";
import { PostData, POstPage } from "@/lib/types";
import { UploadingFile, useMediaUpload } from "./useMediaUpload";
import { ImageIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FormSchema = z.object({
  content: z
    .string()
    .min(1, {
      message: "minimum 1 character required",
    })
    .max(240, {
      message: "Post must not be longer than 240 characters.",
    }),
});

export function TextareaForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");

  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const {
    allUploadComplete,
    uploadAttachments,
    attachmentUploadInfo,
    removeAttachment,
    reset: resetUpload,
  } = useMediaUpload();

  const refreshFeed = async (post: PostData) => {
    const queryFilter: QueryFilters = { queryKey: ["post-feed", "for-you"] };
    await queryClient.cancelQueries(queryFilter);
    queryClient.setQueriesData<InfiniteData<POstPage, string | null>>(
      queryFilter,
      (oldData) => {
        const firstPage = oldData?.pages[0];
        if (firstPage) {
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                posts: [post, ...firstPage.posts],
                nextCursor: firstPage.nextCursor,
              },
              ...oldData.pages.slice(1),
            ],
          };
        }
      }
    );
  };

  // All handlers for drag and drop
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();

    const filelist = e.dataTransfer?.files;
    const files = Array.from(filelist); // Convert FileList to array
    if (files.length) {
      handleFile(files);
    }
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleFileInput = (e: any) => {
    const files = e.target?.files;
    handleFile(files);
  };

  const handleFile = (files: File[]) => {
    if (!files) return;

    // Check file type
    files?.map((file) => {
      const validTypes = ["image/jpeg", "image/png", "image/gif", "video/*"];
      if (!validTypes.includes(file.type)) {
        // setError('Please upload an image (JPG, PNG, GIF) or video (MP4)');
        seterrorMessage("Media type not supported");
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        // setError('File size should be less than 10MB');
        console.log("not valid file type");
        return;
      }
    });
    uploadAttachments(files);
    setIsDragging(false);
  };

  //Form and Submissions
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const {
    control,
    formState: { errors },
    reset,
  } = form;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      await SubmitPost({
        content: data.content,
        media: attachmentUploadInfo
          .map((a) => {
            if (a && a.publicId) {
              return { publicId: a.publicId, type: a.file?.type || "unknown" };
            }
            return undefined; // Use `undefined`, which `filter(Boolean)` will remove
          })
          .filter(Boolean) as { publicId: string; type: string }[],
      }).then((data) => {
        if (data.error) {
          reset({ content: "" });
          toast({
            style: { width: "fit-content" },
            title: data.error,
            variant: "destructive",
          });
        }
        if (data.success) {
          form.reset({ content: "" });
          editor?.commands.setContent("");
          refreshFeed(data?.post);
          resetUpload()
          toast({
            style: { width: "fit-content", backgroundColor: "green" },
            title: "Posted Successfully!",
          });
        }
      });
    });
  }

  const [wordCount, setWordCount] = useState(false);
  const editor = useEditor({
    extensions: [
      characterCount.configure({
        limit: 240,
      }),
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What's on your mind ?",
      }),
    ],
    onUpdate: ({ editor }) => {
      // Update form when editor content changes
      const content = editor.getText();
      setWordCount(true);
      form.setValue("content", content, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    onFocus({ editor }) {
      setWordCount(true);
    },
    onBlur() {
      setWordCount(false);
    },
  });
  
  const getCharacterCount = useCallback(() => {
    if (!editor) return 0;
    return editor.getText().length;
  }, [editor]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div
                  className={cn(
                    "relative rounded-lg  w-full",
                    isDragging && "ring-2 ring-blue-500 bg-blue-50"
                  )}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrag}
                >
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <EditorContent
                        editor={editor}
                        className={cn(
                          "min-h-[150px] w-full rounded-lg border border-input px-3 py-2",
                          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                        )}
                        {...field}
                      />
                    )}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500 space-x-3">
                    {/* <span>{getWordCount()} words</span> */}
                    <span>
                      {wordCount && getCharacterCount() + "/240 characters"}
                    </span>
                  </div>

                  {isDragging && (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-50/80">
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 mx-auto text-blue-500" />
                        <p className="mt-2 text-sm text-gray-600">
                          Drop to attach
                        </p>
                      </div>
                    </div>
                  )}

                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={(e) => handleFileInput}
                  />
                </div>
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations.
              </FormDescription>
              <FormMessage>{errors.content?.message}</FormMessage>
            </FormItem>
          )}
        />
        {form.formState.isSubmitted && (
          <FormMessage>{errors.content?.message}</FormMessage>
        )}
        {!!attachmentUploadInfo.length && (
          <AttachmentPreviews
            attachments={attachmentUploadInfo}
            removeAttachment={removeAttachment}
          />
        )}
        {/* {
           && <span className="text-sm"> {uploadProgress || 0}%</span>
        } */}

        <div className="gap-5 flex justify-end ">
          <AddAttachmentsButton
            onFileSelected={uploadAttachments}
            disabled={false}
          />
          <Button
            disabled={
              !!attachmentUploadInfo.length
                ? isPending && !allUploadComplete
                : isPending
            }
            type="submit"
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

//! all utility components
//upload Button

interface AddAttachmentsButton {
  onFileSelected: (files: File[]) => void;
  disabled: boolean;
}

function AddAttachmentsButton({
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

interface AttachmentPreviewsProps {
  attachments: UploadingFile[];
  removeAttachment: (fileName: string) => void;
}

function AttachmentPreviews({
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

interface AttachmentPreviewProps {
  attachment: UploadingFile;
  onRemoveClick: () => void;
}

function AttachmentPreview({
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
