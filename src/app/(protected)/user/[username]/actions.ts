"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { updateUserProfileSchema, updateUserProfileValues } from "@/lib/zodSchema";
;

export async function updateUserProfile(values: updateUserProfileValues) {
  const validatedValues = updateUserProfileSchema.parse(values);

  const session = await auth();
    const user = session?.user
  if (!user) throw new Error("Unauthorized");

  const updatedUser = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: validatedValues,
      select: getUserDataSelect(user.id),
    });
    // await streamServerClient.partialUpdateUser({
    //   id: user.id,
    //   set: {
    //     name: validatedValues.displayName,
    //   },
    // });
    return updatedUser;
  });

  return updatedUser;
}