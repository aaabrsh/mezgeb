import z from "zod";

export const tagSchema = z.object({
  name: z.string().min(1, "Name is required").max(20, "Name is too long"),
  color: z
    .string()
    .length(7, "Invalid color code provided")
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
      error: "Invalid color format",
    })
    .transform((val) => val.toLowerCase()), // #fff or #ffffff format
});

export type TagFormData = z.infer<typeof tagSchema>;
