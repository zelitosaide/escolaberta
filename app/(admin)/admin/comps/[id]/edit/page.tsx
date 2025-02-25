import { fetchCompById } from "@/lib/data";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/ui/admin/breadcrumbs";
import UpdateCompForm from "@/ui/admin/update-comp-form";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const comp = await fetchCompById(id);

  if (!comp) {
    notFound();
  }

  return (
    <main>
      {/* Breadcrumbs */}
      <Breadcrumbs
        breadcrumbs={[
          { 
            label: "Components", 
            href: "/admin/comps" 
          },
          { 
            label: "Edit Component", 
            href: `/admin/comps/${id}/edit`,
            active: true
          }
        ]}
      />

      {/* Update Comp Form */}
      <UpdateCompForm comp={comp} />
    </main>
  );
}   