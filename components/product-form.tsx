"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Plus, X } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// Define the form schema with Zod - making all fields required with defaults
const productFormSchema = z.object({
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
  // Make nested objects required with all fields having defaults
  price: z.object({
    amount: z.coerce.number().min(0).default(0),
    scale: z.coerce.number().int().default(100),
    currency: z.object({
      code: z.string().min(1).default("USD"),
      base: z.coerce.number().int().default(10),
      exponent: z.coerce.number().int().default(2),
    }),
  }),
  discount: z.object({
    percent: z.coerce.number().min(0).max(100).default(0),
    expires: z.coerce.number().int().nullable().default(null),
  }),
  usedPrice: z.object({
    amount: z.coerce.number().min(0).default(0),
    scale: z.coerce.number().int().default(100),
    currency: z.object({
      code: z.string().min(1).default("USD"),
      base: z.coerce.number().int().default(10),
      exponent: z.coerce.number().int().default(2),
    }),
  }),
})

type ProductFormValues = z.infer<typeof productFormSchema>

// Complete default values for the form
const defaultValues: ProductFormValues = {
  name: "",
  description: "",
  stock: 0,
  rating: 0,
  type: "",
  leadTime: 1,
  isBestSeller: false,
  isActive: true,
  image: "",
  imageBlur: "",
  datasheet: "",
  price: {
    amount: 0,
    scale: 100,
    currency: {
      code: "USD",
      base: 10,
      exponent: 2,
    },
  },
  discount: {
    percent: 0,
    expires: null,
  },
  usedPrice: {
    amount: 0,
    scale: 100,
    currency: {
      code: "USD",
      base: 10,
      exponent: 2,
    },
  },
}

export default function ProductForm({ product }: { product?: Partial<ProductFormValues> }) {
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [categories, setCategories] = useState<string[]>(product?.categories || [])
  const [newImage, setNewImage] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [activeTab, setActiveTab] = useState("basic")

  const isEditMode = !!product

  // Prepare initial values by deeply merging default values with product data
  const initialValues = isEditMode
    ? {
        ...defaultValues,
        ...product,
        price: {
          ...defaultValues.price,
          ...(product?.price || {}),
          currency: {
            ...defaultValues.price.currency,
            ...(product?.price?.currency || {}),
          },
        },
        discount: {
          ...defaultValues.discount,
          ...(product?.discount || {}),
        },
        usedPrice: {
          ...defaultValues.usedPrice,
          ...(product?.usedPrice || {}),
          currency: {
            ...defaultValues.usedPrice.currency,
            ...(product?.usedPrice?.currency || {}),
          },
        },
      }
    : defaultValues

  // Initialize the form with complete default values
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialValues,
  })

  function onSubmit(data: ProductFormValues) {
    // Combine form data with arrays managed separately
    const productData = {
      ...data,
      images,
      categories,
    }

    console.log("Form submitted:", productData)
    // Here you would typically send this data to your API
    // For create: fetch('/api/products', { method: 'POST', body: JSON.stringify(productData) })
    // For update: fetch(`/api/products/${product.id}`, { method: 'PUT', body: JSON.stringify(productData) })
  }

  // Handle array fields
  const addImage = () => {
    if (newImage && !images.includes(newImage)) {
      setImages([...images, newImage])
      setNewImage("")
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
      setNewCategory("")
    }
  }

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Product" : "Create New Product"}</CardTitle>
        <CardDescription>
          {isEditMode ? "Update the details of your existing product" : "Fill in the details to create a new product"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="categorization">Categorization</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Type</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product type" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter product description" className="min-h-32" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating (0-5)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="5" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="leadTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lead Time (days)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="isBestSeller"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Best Seller</FormLabel>
                          <FormDescription>Mark this product as a best seller</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active Status</FormLabel>
                          <FormDescription>Is this product active and available for purchase?</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Pricing Tab */}
              <TabsContent value="pricing" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Regular Price</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price.amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price.scale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scale</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>Typically 100 for displaying as dollars</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <h4 className="text-md font-medium mt-4">Currency</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="price.currency.code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency Code</FormLabel>
                          <FormControl>
                            <Input placeholder="USD" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price.currency.base"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price.currency.exponent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exponent</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Discount (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="discount.percent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Percentage</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="0-100"
                              value={field.value || 0}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription>Enter a percentage between 0-100</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discount.expires"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiration (Unix Timestamp)</FormLabel>
                          <FormControl>
                            <Input type="number" value={field.value || ""} onChange={field.onChange} />
                          </FormControl>
                          <FormDescription>Optional: When the discount expires</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Used Price (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="usedPrice.amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={field.value || 0}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="usedPrice.scale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scale</FormLabel>
                          <FormControl>
                            <Input type="number" value={field.value || 100} onChange={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <h4 className="text-md font-medium mt-4">Currency</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="usedPrice.currency.code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency Code</FormLabel>
                          <FormControl>
                            <Input placeholder="USD" value={field.value || "USD"} onChange={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="usedPrice.currency.base"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base</FormLabel>
                          <FormControl>
                            <Input type="number" value={field.value || 10} onChange={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="usedPrice.currency.exponent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exponent</FormLabel>
                          <FormControl>
                            <Input type="number" value={field.value || 2} onChange={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media" className="space-y-6">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>Primary product image URL</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageBlur"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image Blur Data URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="data:image/..." {...field} />
                      </FormControl>
                      <FormDescription>Placeholder blur image for loading states</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium mb-2">Additional Images</h4>
                  <div className="flex flex-wrap gap-2">
                    {images.map((image, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1 p-2">
                        {image.length > 30 ? `${image.substring(0, 30)}...` : image}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 ml-1"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Add image URL" value={newImage} onChange={(e) => setNewImage(e.target.value)} />
                    <Button type="button" variant="outline" size="sm" onClick={addImage}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="datasheet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Datasheet URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/datasheet.pdf" {...field} />
                      </FormControl>
                      <FormDescription>Link to product specifications or documentation</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Categorization Tab */}
              <TabsContent value="categorization" className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1 p-2">
                        {category}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 ml-1"
                          onClick={() => removeCategory(index)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addCategory}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">{isEditMode ? "Update Product" : "Create Product"}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

