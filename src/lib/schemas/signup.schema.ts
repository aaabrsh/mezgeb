import z from "zod";

export const signupSchema = z
  .object({
    full_name: z.string().trim().min(1, "User's full name is required"),
    email: z
      .email("Please enter a valid email address")
      .trim()
      .min(1, "Email is required"),
    password: z
      .string()
      .trim()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters long"),
    confirm_password: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
