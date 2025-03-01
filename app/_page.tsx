import ProductForm from "@/components/product-form-fixed"

export default function Home() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Product Management</h1>
      <ProductForm />
    </main>
  )
}

