"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

// Define the product schema for validation
const productSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  stock: z.coerce.number().int().min(0),
  rating: z.coerce.number().min(0).max(5),
  type: z.string().min(1, { message: "Type is required" }),
  leadTime: z.coerce.number().int().min(0),
  isBestSeller: z.boolean().default(false),
  isActive: z.boolean().default(true),
  image: z.string().default(""),
  imageBlur: z.string().default(""),
  datasheet: z.string().default(""),
  images: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  price: z
    .object({
      amount: z.coerce.number().min(0).default(0),
      scale: z.coerce.number().int().default(100),
      currency: z
        .object({
          code: z.string().min(1).default("USD"),
          base: z.coerce.number().int().default(10),
          exponent: z.coerce.number().int().default(2),
        })
        .default({
          code: "USD",
          base: 10,
          exponent: 2,
        }),
    })
    .default({
      amount: 0,
      scale: 100,
      currency: {
        code: "USD",
        base: 10,
        exponent: 2,
      },
    }),
  discount: z
    .object({
      percent: z.coerce.number().min(0).max(100).default(0),
      expires: z.coerce.number().int().nullable().default(null),
    })
    .default({
      percent: 0,
      expires: null,
    }),
  usedPrice: z
    .object({
      amount: z.coerce.number().min(0).default(0),
      scale: z.coerce.number().int().default(100),
      currency: z
        .object({
          code: z.string().min(1).default("USD"),
          base: z.coerce.number().int().default(10),
          exponent: z.coerce.number().int().default(2),
        })
        .default({
          code: "USD",
          base: 10,
          exponent: 2,
        }),
    })
    .default({
      amount: 0,
      scale: 100,
      currency: {
        code: "USD",
        base: 10,
        exponent: 2,
      },
    }),
})

export type ProductData = z.infer<typeof productSchema>

// Create a new product
export async function createProduct(formData: ProductData) {
  try {
    // Validate the form data
    const validatedData = productSchema.parse(formData)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Here you would typically save the data to your database
    // For example with MongoDB:
    // const result = await db.collection('products').insertOne(validatedData)

    console.log("Product created:", validatedData)

    // Revalidate the products page to show the new product
    // revalidatePath("/products")
    revalidatePath("/");

    return { success: true, data: validatedData }
  } catch (error) {
    console.error("Error creating product:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    return { success: false, error: "Failed to create product" }
  }
}

// Update an existing product
export async function updateProduct(id: string, formData: ProductData) {
  try {
    // Validate the form data
    const validatedData = productSchema.parse(formData)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Here you would typically update the data in your database
    // For example with MongoDB:
    // const result = await db.collection('products').updateOne({ _id: new ObjectId(id) }, { $set: validatedData })

    console.log(`Product ${id} updated:`, validatedData)

    // Revalidate the products page to show the updated product
    revalidatePath("/products")
    revalidatePath(`/products/${id}`)

    return { success: true, data: validatedData }
  } catch (error) {
    console.error("Error updating product:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    return { success: false, error: "Failed to update product" }
  }
}

// Delete a product
export async function deleteProduct(id: string) {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Here you would typically delete the product from your database
    // For example with MongoDB:
    // const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) })

    console.log(`Product ${id} deleted`)

    // Revalidate the products page
    revalidatePath("/products")

    return { success: true }
  } catch (error) {
    console.error("Error deleting product:", error)
    return { success: false, error: "Failed to delete product" }
  }
}

