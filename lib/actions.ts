"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const FormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: "Please enter the component name",
  }).min(1, { message: "Component name cannot be empty." }),
  type: z.string({
    invalid_type_error: "Please select the component Type",
  }).min(1, { message: "Component type cannot be empty." }),
  description: z.string({
    invalid_type_error: "Please enter the component description",
  }).min(5, { message: "Description must be at least 5 characters long." }),
  datasheet: z.string().url({ message: "Invalid URL format. Please provide a valid datasheet URL." }).optional(), // Campo opcional
  images: z.array(z.string().url({ message: "Invalid image URL format." })).min(1, { message: "At least one image URL is required." }),
  price: z.coerce.number().gt(0, { message: "Price must be greater than 0." }), // Ensures price > 0
  stock: z.coerce.number({
    invalid_type_error: "Stock must be a valid number.",
  }).int({ message: "Stock must be an integer." }),
  categories: z.array(z.string().min(1, { message: "Category cannot be empty." })).min(1, { message: "At least one category is required." }),
  isActive: z.boolean({
    invalid_type_error: "Please specify if the component is active.",
  }),
  createdAt: z.string().datetime({ message: "Invalid createdAt format. Please provide a valid datetime." }),
  updatedAt: z.string().datetime({ message: "Invalid updatedAt format. Please provide a valid datetime." }),
});

const CreateComp = FormSchema.omit({ id: true, createdAt: true, updatedAt: true });

export interface State {
  errors?: {
    name?: string[]
    type?: string[]
    description?: string[]
    datasheet?: string[]
    images?: string[]
    price?: string[]
    stock?: string[]
    categories?: string[]
    isActive?: string[]
  }
  message?: string | null
}

export async function createComp(prevState: State, formData: FormData) {
  let status = null;
  
  if (formData.get("status") === "Out of Stock" ) {
    status = false;
  } else if (formData.get("status") === "In Stock") {
    status = true;
  }

  const validatedFields = CreateComp.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    description: formData.get("description"),
    datasheet: formData.get("datasheet") === "" ? undefined : formData.get("datasheet"),
    images: JSON.parse(formData.get("images") as string),
    price: formData.get("price"),
    stock: formData.get("stock"),
    categories: JSON.parse(formData.get("categories") as string),
    isActive: status,
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Component."
    };
  }

  try {
    await prisma.comp.create({ 
      data: validatedFields.data,
    });
  } catch (error) {
    console.log(error);
    // If a database error occurs, return a more specific error.
    return {
      message: "Database Error: Failed to Create Component.",
    }
  }

  revalidatePath("/admin/comps");
  redirect("/admin/comps");
}

const UpdateComp = FormSchema.omit({ id: true, createdAt: true, updatedAt: true });

export async function updateComp(
  id: string,
  prevState: State,
  formData: FormData,
) {
  let status = null;
  
  if (formData.get("status") === "Out of Stock" ) {
    status = false;
  } else if (formData.get("status") === "In Stock") {
    status = true;
  }

  const validatedFields = UpdateComp.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    description: formData.get("description"),
    datasheet: formData.get("datasheet") === "" ? undefined : formData.get("datasheet"),
    images: JSON.parse(formData.get("images") as string),
    price: formData.get("price"),
    stock: formData.get("stock"),
    categories: JSON.parse(formData.get("categories") as string),
    isActive: status,
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Component."
    };
  }

  try {
    await prisma.comp.update({ 
      where: { id }, 
      data: validatedFields.data,
    });
  } catch (error) {
    console.log(error);
    return {
      message: "Database Error: Failed to Update Component.",
    }
  }

  // Revalidate the cache for the comps page and redirect the user.
  revalidatePath("/admin/comps");
  redirect("/admin/comps");
}

export async function deleteComp(id: string) {
  // throw new Error("Failed to Delete Component");
  await prisma.comp.delete({ where: { id } });
  revalidatePath("/admin/comps");
}