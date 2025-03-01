"use client"

import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Plus, X, Check, ChevronsUpDown, Loader2, AlertCircle } from "lucide-react"
import { z } from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { createProduct, updateProduct, type ProductData } from "@/actions/product-actions"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Update the productFormSchema to match the optional fields in the data model
const productFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  stock: z.coerce.number().int().min(0),
  rating: z.coerce.number().min(0).max(5),
  type: z.string().min(1, { message: "Type is required" }),
  leadTime: z.coerce.number().int().min(0),
  isBestSeller: z.boolean().default(false),
  isActive: z.boolean().default(true),
  image: z.string().optional(),
  imageBlur: z.string().optional(),
  datasheet: z.string().nullable().optional(),
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
        .optional(),
    })
    .optional(),
  discount: z
    .object({
      percent: z.coerce.number().min(0).max(100).default(0),
      expires: z.coerce.number().int().nullable().optional(),
    })
    .optional(),
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
        .optional(),
    })
    .optional(),
  categories: z.array(z.string()).min(1, { message: "At least one category is required" }),
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
  categories: [],
}

// Product type options
const productTypes = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "furniture", label: "Furniture" },
  { value: "books", label: "Books" },
  { value: "toys", label: "Toys" },
  { value: "food", label: "Food & Beverages" },
  { value: "health", label: "Health & Beauty" },
  { value: "sports", label: "Sports & Outdoors" },
  { value: "automotive", label: "Automotive" },
  { value: "jewelry", label: "Jewelry" },
]

// Category options
const categoryOptions = [
  { value: "featured", label: "Featured" },
  { value: "new-arrivals", label: "New Arrivals" },
  { value: "bestseller", label: "Best Seller" },
  { value: "sale", label: "On Sale" },
  { value: "premium", label: "Premium" },
  { value: "limited-edition", label: "Limited Edition" },
  { value: "eco-friendly", label: "Eco-Friendly" },
  { value: "handmade", label: "Handmade" },
  { value: "imported", label: "Imported" },
  { value: "local", label: "Local" },
  { value: "seasonal", label: "Seasonal" },
  { value: "clearance", label: "Clearance" },
]

interface ProductFormProps {
  product?: Partial<ProductFormValues> & { id?: string; images?: string[]; categories?: string[] }
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [categories, setCategories] = useState<string[]>(product?.categories || [])
  const [categoriesError, setCategoriesError] = useState<string | null>(null)
  const [newImage, setNewImage] = useState("")
  const [newImageError, setNewImageError] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState("")
  const [activeTab, setActiveTab] = useState("basic")
  const [categorySearchValue, setCategorySearchValue] = useState("")
  const [showAllErrors, setShowAllErrors] = useState(false)
  // Add new state for images error after the other state declarations
  const [imagesError, setImagesError] = useState<string | null>(null)

  const isEditMode = !!product?.id

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
    mode: "onChange", // Validate on change for immediate feedback
  })

  // Get form errors
  const formErrors = form.formState.errors
  // Update the hasErrors check to include images validation
  const hasErrors = Object.keys(formErrors).length > 0 || (showAllErrors && images.length === 0)

  // Update the validateAllFields function to include images validation
  const validateAllFields = () => {
    form.trigger() // Trigger validation for all fields
    setShowAllErrors(true)

    // Validate categories
    if (categories.length === 0) {
      setCategoriesError("At least one category is required")
    } else {
      setCategoriesError(null)
    }

    // Validate images
    if (images.length === 0) {
      setImagesError("At least one image is required")
    } else {
      setImagesError(null)
    }
  }

  // Replace the existing navigateToTabWithErrors function with this updated version
  const navigateToTabWithErrors = () => {
    // Check tabs in order and return after finding the first one with errors

    // Basic Info Tab
    if (
      formErrors.name ||
      formErrors.description ||
      formErrors.type ||
      formErrors.stock ||
      formErrors.rating ||
      formErrors.leadTime ||
      formErrors.isBestSeller ||
      formErrors.isActive
    ) {
      setActiveTab("basic")
      return
    }

    // Media Tab (moved before pricing to match tab order)
    if (formErrors.image || formErrors.imageBlur || formErrors.datasheet || (showAllErrors && images.length === 0)) {
      setActiveTab("media")
      return
    }

    // Pricing Tab
    if (
      formErrors.price ||
      formErrors.price?.amount ||
      formErrors.price?.scale ||
      formErrors.price?.currency?.code ||
      formErrors.price?.currency?.base ||
      formErrors.price?.currency?.exponent ||
      formErrors.discount ||
      formErrors.discount?.percent ||
      formErrors.usedPrice ||
      formErrors.usedPrice?.amount ||
      formErrors.usedPrice?.scale ||
      formErrors.usedPrice?.currency?.code
    ) {
      setActiveTab("pricing")
      return
    }

    // Categorization Tab
    if (formErrors.categories || (showAllErrors && categories.length === 0)) {
      setActiveTab("categorization")
      return
    }
  }

  // Update the onSubmit function to ensure validation and navigation happen in the correct order
  function onSubmit(data: ProductFormValues) {
    // Validate all fields first
    validateAllFields()

    // Update the form with current categories
    form.setValue("categories", categories, {
      shouldValidate: true,
    })

    // If there are any errors, navigate to the first tab with errors
    if (hasErrors) {
      navigateToTabWithErrors()
      return
    }

    // Check for required arrays
    if (categories.length === 0 || images.length === 0) {
      if (categories.length === 0) {
        setActiveTab("categorization")
        toast({
          title: "Validation Error",
          description: "At least one category is required",
          variant: "destructive",
        })
      } else if (images.length === 0) {
        setActiveTab("media")
        toast({
          title: "Validation Error",
          description: "At least one image is required",
          variant: "destructive",
        })
      }
      return
    }

    // Combine form data with arrays managed separately
    const productData: ProductData = {
      ...data,
      images,
      categories,
    }

    startTransition(async () => {
      try {
        let result

        if (isEditMode && product?.id) {
          result = await updateProduct(product.id, productData)
        } else {
          result = await createProduct(productData)
        }

        if (result.success) {
          toast({
            title: isEditMode ? "Product updated" : "Product created",
            description: `Successfully ${isEditMode ? "updated" : "created"} ${data.name}`,
            variant: "default",
          })

          // Redirect to products page or product detail page
          router.push("/products")
        } else {
          toast({
            title: "Error",
            description: typeof result.error === "string" ? result.error : "Please check the form for errors",
            variant: "destructive",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }
    })
  }

  // Handle array fields
  const addImage = () => {
    // Clear previous error
    setNewImageError(null)

    // Validate URL format
    if (!newImage) {
      setNewImageError("Image URL is required")
      return
    }

    try {
      new URL(newImage)
    } catch {
      setNewImageError("Please enter a valid URL")
      return
    }

    // Check for duplicates
    if (images.includes(newImage)) {
      toast({
        title: "Duplicate image",
        description: "This image URL already exists",
        variant: "destructive",
      })
      return
    }

    setImages([...images, newImage])
    setNewImage("")
    // Clear images error when we have at least one image
    setImagesError(null)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    // Set images error if we remove the last image
    if (newImages.length === 0) {
      setImagesError("At least one image is required")
    } else {
      setImagesError(null)
    }
  }

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      const newCategories = [...categories, newCategory]
      setCategories(newCategories)
      setNewCategory("")
      setCategoriesError(null)
      // Update the form field
      form.setValue("categories", newCategories, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    }
  }

  const removeCategory = (category: string) => {
    const newCategories = categories.filter((c) => c !== category)
    setCategories(newCategories)
    if (newCategories.length === 0) {
      setCategoriesError("At least one category is required")
    } else {
      setCategoriesError(null)
    }
    // Update the form field
    form.setValue("categories", newCategories, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  const toggleCategory = (value: string) => {
    let newCategories: string[]
    if (categories.includes(value)) {
      newCategories = categories.filter((c) => c !== value)
    } else {
      newCategories = [...categories, value]
    }
    setCategories(newCategories)
    setCategoriesError(null)
    // Update the form field
    form.setValue("categories", newCategories, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  // Filter categories based on search
  const filteredCategories = categoryOptions.filter((category) =>
    category.label.toLowerCase().includes(categorySearchValue.toLowerCase()),
  )

  // Add custom category if it doesn't exist in options
  const handleAddCustomCategory = () => {
    if (
      categorySearchValue &&
      !categories.includes(categorySearchValue) &&
      !categoryOptions.some(
        (cat) => cat.value === categorySearchValue || cat.label.toLowerCase() === categorySearchValue.toLowerCase(),
      )
    ) {
      const newCategories = [...categories, categorySearchValue]
      setCategories(newCategories)
      setCategorySearchValue("")
      setCategoriesError(null)
      // Update the form field
      form.setValue("categories", newCategories, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    }
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
        {/* Update the Alert content to show images error consistently */}
        {showAllErrors && hasErrors && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Please fix the following errors:
              <ul className="list-disc pl-5 mt-2">
                {formErrors.name && <li>Name: {formErrors.name.message}</li>}
                {formErrors.description && <li>Description: {formErrors.description.message}</li>}
                {formErrors.type && <li>Type: {formErrors.type.message}</li>}
                {formErrors.stock && <li>Stock: {formErrors.stock.message}</li>}
                {formErrors.rating && <li>Rating: {formErrors.rating.message}</li>}
                {formErrors.leadTime && <li>Lead Time: {formErrors.leadTime.message}</li>}
                {formErrors.price?.currency?.code && <li>Currency Code: {formErrors.price.currency.code.message}</li>}
                {formErrors.categories && <li>Categories: {formErrors.categories.message}</li>}
                {showAllErrors && images.length === 0 && <li>Media: At least one image is required</li>}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-8" disabled={isPending}>
                <TabsTrigger
                  value="basic"
                  className={formErrors.name || formErrors.description || formErrors.type ? "text-destructive" : ""}
                  disabled={isPending}
                >
                  Basic Info {(formErrors.name || formErrors.description || formErrors.type) && "⚠️"}
                </TabsTrigger>
                <TabsTrigger
                  value="pricing"
                  className={
                    formErrors.price?.amount ||
                    formErrors.price?.scale ||
                    formErrors.price?.currency?.code ||
                    formErrors.price?.currency?.base ||
                    formErrors.price?.currency?.exponent ||
                    formErrors.discount?.percent ||
                    formErrors.usedPrice?.amount ||
                    formErrors.usedPrice?.currency?.code
                      ? "text-destructive"
                      : ""
                  }
                  disabled={isPending}
                >
                  Pricing{" "}
                  {(formErrors.price?.amount ||
                    formErrors.price?.scale ||
                    formErrors.price?.currency?.code ||
                    formErrors.price?.currency?.base ||
                    formErrors.price?.currency?.exponent ||
                    formErrors.discount?.percent ||
                    formErrors.usedPrice?.amount ||
                    formErrors.usedPrice?.currency?.code) &&
                    "⚠️"}
                </TabsTrigger>
                <TabsTrigger
                  value="media"
                  className={formErrors.image || (showAllErrors && images.length === 0) ? "text-destructive" : ""}
                  disabled={isPending}
                >
                  Media {(formErrors.image || (showAllErrors && images.length === 0)) && "⚠️"}
                </TabsTrigger>
                <TabsTrigger
                  value="categorization"
                  className={formErrors.categories ? "text-destructive" : ""}
                  disabled={isPending}
                >
                  Categorization {formErrors.categories && "⚠️"}
                </TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Product Name <span className="text-destructive ml-1">*</span>
                        </FormLabel>
                        <FormControl disabled={isPending}>
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
                        <FormLabel className="flex items-center">
                          Product Type <span className="text-destructive ml-1">*</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild disabled={isPending}>
                            <FormControl disabled={isPending}>
                              <Button
                                variant="outline"
                                role="combobox"
                                disabled={isPending}
                                className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                              >
                                {field.value
                                  ? productTypes.find((type) => type.value === field.value)?.label
                                  : "Select product type"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                            <Command className="w-full">
                              <CommandInput placeholder="Search product type..." className="h-9" disabled={isPending} />
                              <CommandList>
                                <CommandEmpty>No product type found.</CommandEmpty>
                                <CommandGroup className="max-h-[200px] overflow-auto">
                                  {productTypes.map((type) => (
                                    <CommandItem
                                      key={type.value}
                                      value={type.value}
                                      onSelect={(value) => {
                                        form.setValue("type", value, {
                                          shouldValidate: true,
                                          shouldDirty: true,
                                          shouldTouch: true,
                                        })
                                      }}
                                      className="flex items-center"
                                      disabled={isPending}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4 flex-shrink-0",
                                          type.value === field.value ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      <span>{type.label}</span>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
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
                      <FormLabel className="flex items-center">
                        Description <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl disabled={isPending}>
                        <Textarea
                          placeholder="Enter product description"
                          className="min-h-32"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault() // Prevent form submission
                            }
                          }}
                          {...field}
                        />
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
                        <FormLabel className="flex items-center">
                          Stock <span className="text-destructive ml-1">*</span>
                        </FormLabel>
                        <FormControl disabled={isPending}>
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
                        <FormLabel className="flex items-center">
                          Rating (0-5) <span className="text-destructive ml-1">*</span>
                        </FormLabel>
                        <FormControl disabled={isPending}>
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
                        <FormLabel className="flex items-center">
                          Lead Time (days) <span className="text-destructive ml-1">*</span>
                        </FormLabel>
                        <FormControl disabled={isPending}>
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
                          <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
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
                          <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
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
                          <FormControl disabled={isPending}>
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
                          <FormControl disabled={isPending}>
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
                          <FormControl disabled={isPending}>
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
                          <FormControl disabled={isPending}>
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
                          <FormControl disabled={isPending}>
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
                          <FormControl disabled={isPending}>
                            <Input type="number" min="0" max="100" placeholder="0-100" {...field} />
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
                          <FormControl disabled={isPending}>
                            <Input
                              type="number"
                              value={field.value === null ? "" : field.value}
                              onChange={(e) => {
                                const value = e.target.value === "" ? null : Number(e.target.value)
                                field.onChange(value)
                              }}
                            />
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
                          <FormControl disabled={isPending}>
                            <Input type="number" min="0" step="0.01" {...field} />
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
                          <FormControl disabled={isPending}>
                            <Input type="number" {...field} />
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
                          <FormControl disabled={isPending}>
                            <Input placeholder="USD" {...field} />
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
                          <FormControl disabled={isPending}>
                            <Input type="number" {...field} />
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
                          <FormControl disabled={isPending}>
                            <Input type="number" {...field} />
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
                      <FormControl disabled={isPending}>
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
                      <FormControl disabled={isPending}>
                        <Input placeholder="data:image/..." {...field} />
                      </FormControl>
                      <FormDescription>Placeholder blur image for loading states</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Update the images section in the Media tab to show the error state */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      Additional Images <span className="text-destructive ml-1">*</span>
                    </h4>
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
                            disabled={isPending}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    {(showAllErrors || imagesError) && images.length === 0 && (
                      <p className="text-sm font-medium text-destructive">
                        {imagesError || "At least one image is required"}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 grid gap-2">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Add image URL"
                          value={newImage}
                          onChange={(e) => {
                            setNewImage(e.target.value)
                            setNewImageError(null)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              if (images.includes(newImage)) {
                                toast({
                                  title: "Duplicate image",
                                  description: "This image URL already exists",
                                  variant: "destructive",
                                })
                                return
                              }
                              addImage()
                            }
                          }}
                          required
                          disabled={isPending}
                          aria-label="Additional image URL"
                          className={cn(newImageError ? "border-destructive" : "", "flex-1")}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addImage}
                          disabled={isPending}
                          className="shrink-0"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      {newImageError && <p className="text-sm font-medium text-destructive">{newImageError}</p>}
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="datasheet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Datasheet URL (Optional)</FormLabel>
                      <FormControl disabled={isPending}>
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
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      Categories <span className="text-destructive ml-1">*</span>
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {categories.map((category) => (
                        <Badge key={category} variant="secondary" className="flex items-center gap-1 p-2">
                          {category}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 ml-1"
                            onClick={() => removeCategory(category)}
                            disabled={isPending}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    {(showAllErrors || categoriesError) && categories.length === 0 && (
                      <p className="text-sm font-medium text-destructive">
                        {categoriesError || "At least one category is required"}
                      </p>
                    )}
                  </div>

                  <Popover>
                    <PopoverTrigger asChild disabled={isPending}>
                      <Button variant="outline" role="combobox" className="w-full justify-between" disabled={isPending}>
                        {categories.length > 0 ? `${categories.length} categories selected` : "Select categories"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                      <Command className="w-full">
                        <CommandInput
                          placeholder="Search categories..."
                          className="h-9"
                          value={categorySearchValue}
                          onValueChange={setCategorySearchValue}
                          disabled={isPending}
                        />
                        <CommandList>
                          <CommandEmpty>
                            <div className="py-2 px-4 text-sm">
                              No category found.
                              <Button
                                variant="link"
                                className="h-auto p-0 ml-1"
                                onClick={handleAddCustomCategory}
                                disabled={isPending}
                              >
                                Add "{categorySearchValue}"
                              </Button>
                            </div>
                          </CommandEmpty>
                          <CommandGroup className="max-h-[200px] overflow-auto">
                            {filteredCategories.map((category) => (
                              <CommandItem
                                key={category.value}
                                value={category.value}
                                onSelect={toggleCategory}
                                className="flex items-center"
                                disabled={isPending}
                              >
                                <div
                                  className={cn(
                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                    categories.includes(category.value)
                                      ? "bg-primary text-primary-foreground"
                                      : "opacity-50",
                                  )}
                                >
                                  {categories.includes(category.value) && <Check className="h-3 w-3" />}
                                </div>
                                <span>{category.label}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <div className="flex items-center gap-2 mt-4">
                    <Input
                      placeholder="Add custom category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      disabled={isPending}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          // Check for duplicates in both value and label
                          const isDuplicate =
                            categories.includes(newCategory) ||
                            categoryOptions.some(
                              (cat) =>
                                cat.value.toLowerCase() === newCategory.toLowerCase() ||
                                cat.label.toLowerCase() === newCategory.toLowerCase(),
                            )
                          if (!isDuplicate && newCategory.trim()) {
                            addCategory()
                          } else if (isDuplicate) {
                            toast({
                              title: "Duplicate category",
                              description: "This category already exists",
                              variant: "destructive",
                            })
                          }
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addCategory} disabled={isPending}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.push("/products")} disabled={isPending}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  validateAllFields()
                  if (!hasErrors) {
                    form.handleSubmit(onSubmit)()
                  } else {
                    navigateToTabWithErrors()
                  }
                }}
                disabled={isPending}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

