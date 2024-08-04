import * as z from "zod";

export const threadValidation = z.object({
  thread: z.string().min(1, { message: "Name is required" }),
  profile_photo: z.string().optional(),
  accoutId: z.string(),
});

export const commentValidation = z.object({
  thread: z.string().min(1, { message: "Name is required" }),

  accoutId: z.string(),
});
