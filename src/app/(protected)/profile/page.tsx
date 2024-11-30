"use client"

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { OauthLogin } from "@/actions/OauthLogin";
import { auth } from "@/auth";
import { useSession } from "next-auth/react";
export default  function  CompleteProfile() {
  const router = useRouter();
  const searchParams = useSearchParams()
  
  const email = searchParams.get('email')
  if(!email) throw Error("something went wrong trying to login !")

  const [formData, setFormData] = useState({
    email,
    userName: "",
    bio: "",
    avatarUrl: "",
  });
  const {data:session ,status} = useSession()
  console.log("profile",session)
  const [isPending,startTransition] = useTransition()
  const [error,setError] = useState<String | undefined>("")
  const [success,setSuccess] = useState<String | undefined>("")


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

   
    startTransition( () => {
      OauthLogin(formData).then((data)=>{
       if(data?.error) setError(data?.error)
        if(data.success) {
          setSuccess(data?.success)
          router.push("/")
        }

      })
    });

  };

  return (
    <div className=" flex flex-col items-center justify-center h-screen">
      <h1 className="mb-4 text-lg font-bold">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-80">
        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            Choose a Username
          </label>
          <input
            id="userName"
            type="text"
            value={formData.userName}
            onChange={handleInputChange}
            className="border rounded-md p-2 w-full"
            required
            disabled={isPending}
          />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium">
            Bio
          </label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="border rounded-md p-2 w-full"
            rows={3}
            disabled={isPending}
          />
        </div>
        <div>
          <label htmlFor="avatarUrl" className="block text-sm font-medium">
            Avatar URL (Optional)
          </label>
          <input
            id="avatarUrl"
            type="url"
            value={formData.avatarUrl}
            onChange={handleInputChange}
            className="border rounded-md p-2 w-full"
            disabled={isPending}
         />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Complete Signup"}
        </button>
      </form>
      { <div>{error}</div>}
    </div>
  );
}
