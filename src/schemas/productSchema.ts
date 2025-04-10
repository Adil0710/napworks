import { z } from "zod"

export const productSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a positive number",
    }),
  images: z.array(z.string().url("Invalid image URL")).min(1, "At least one image URL is required").optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>
