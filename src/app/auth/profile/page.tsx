"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { OauthLogin } from "@/actions/OauthLogin";
import { PulsatingButton } from "@/components/ui/pulsating-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import AvatarPlaceholder from "@/lib/businessman-character-avatar-isolated_24877-60111.jpg";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2} from "lucide-react";
import { AvatarInput } from "@/app/(protected)/user/[username]/EditProfileButton";
import { uploadAvatar } from "@/lib/utility/utility";

export default function CompleteProfile() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  if (!email) {
    throw new Error("Email is required to complete profile setup!");
  }

  const [formData, setFormData] = useState({
    email,
    userName: "",
    bio: "",
    image:""
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setSuccess(undefined);
    const newAvatarFile = croppedAvatar
    ? new File([croppedAvatar], `avatar_${crypto.randomUUID()}.webp`)
    : undefined;
    
    if(newAvatarFile){
      const result = await uploadAvatar(newAvatarFile)
      console.log(result)
      formData.image=result?.publicId
    }

    startTransition(() => {
      OauthLogin(formData)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
            return;
          }
          if (data.success) {
            setSuccess(data.success);
            router.push("/");
          }
        })
        .catch((err) => {
          setError("An unexpected error occurred. Please try again.");
          console.error(err);
        });
    });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-card flex items-center justify-center p-4">
      <Card className="w-full z-20  max-w-md shadow-lg">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground text-center">
            Just a few more details to get you started
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div
                onClick={handleImageClick}
                className="relative cursor-pointer group"
              >
                <AvatarInput
                  src={
                    croppedAvatar
                      ? URL.createObjectURL(croppedAvatar)
                      : croppedAvatar || AvatarPlaceholder
                  }
                  onImageCropped={setCroppedAvatar}
                />
              </div>
            </div>

            {/* Username Section */}
            <div className="space-y-2">
              <Label htmlFor="userName" className="text-sm">
                Username <span className="text-destructive">*</span>
              </Label>
              <Input
                id="userName"
                type="text"
                required
                placeholder="Choose a unique username"
                value={formData.userName}
                onChange={handleInputChange}
                disabled={isPending}
                className="mt-1"
                minLength={3}
                maxLength={30}
                pattern="^[a-zA-Z0-9_-]+$"
                title="Username can only contain letters, numbers, underscores, and hyphens"
              />
            </div>

            {/* Bio Section */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm">
                Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell us a bit about yourself..."
                value={formData.bio}
                onChange={handleInputChange}
                disabled={isPending}
                className="mt-1"
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.bio.length}/160
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Display */}
            {success && (
              <Alert>
                <AlertDescription className="text-primary">{success}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>

        <CardFooter className="text-primary font-bold">
          <PulsatingButton
            className="w-full"
            type="submit"
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isPending ? (
              <div className="flex text-gray-400 items-center justify-between">
                Setting up your profile...
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </div>
            ) : (
              "Complete Profile"
            )}
          </PulsatingButton>
        </CardFooter>
      </Card>
    </div>
  );
}
