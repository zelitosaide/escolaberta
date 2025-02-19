import Breadcrumbs from "@/ui/admin/breadcrumbs";
import CreateCompForm from "@/ui/admin/create-comp-form";

const breadcrumbs = [
  { 
    label: "Components", 
    href: "/admin/comps" 
  },
  {
    label: "Create Component",
    href: "/admin/comps/create",
    active: true,
  },
];

export default function Page() {
  return (
    <main>
      {/* Breadcrumbs */}
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      {/* CompForm */}
      <CreateCompForm />
    </main>
  );
}