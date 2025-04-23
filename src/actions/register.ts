"use server";

import { RegisterSchmema } from "@/schemas";
import { hashSync } from "bcrypt-edge";
import * as z from "zod";
import { PrismaClient } from "@prisma/client";
import { getUserByEmail } from "@/data/user";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const register = async (values: z.infer<typeof RegisterSchmema>) => {
  const prisma = new PrismaClient();
  const validatedFields = RegisterSchmema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: "Invalid fields! ",
    };
  }
  const { email, password, name } = values;
  const hashedPass = await hashSync(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) return { error: "Email already Exists!" };

  await prisma.user.create({
    data: {
      username: email.slice(0, 5),
      name: name,
      email,
      password: hashedPass,
    },
  });
  // Sign in the user automatically after registration
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false, // Important: Don't redirect from the server action
    });

    return {
      success: "User Created and logged in automatically",
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    };
  } catch (error) {
    console.error("Error signing in after registration:", error);
    return {
      success: "User Created, please log in",
      redirectTo: "/auth/signin",
    };
  }

  //Send User verification mail
  return { success: "User Created " };
};
