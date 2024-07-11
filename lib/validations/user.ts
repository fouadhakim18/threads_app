import * as z from "zod";
export const userValidation = z.object({
  profile_photo: z.string().url().min(1),
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .max(1000, { message: "Username must be less than 100 characters" }),
  bio: z
    .string()
    .min(1, { message: "Bio is required" })
    .max(1000, { message: "Bio must be less than 100 characters" }),
});
