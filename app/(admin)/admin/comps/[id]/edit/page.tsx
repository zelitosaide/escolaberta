import { Button } from "@/components/customs/button";
import { CpuChipIcon, CurrencyDollarIcon, GlobeAltIcon, HashtagIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { RadioGroup } from "@/components/customs/radio-group";
import { TextInput } from "@/components/customs/text-input";
import { Textarea } from "@/components/customs/textarea";
import { categories, statuses, types } from "@/lib/data";
import { fetchCompById } from "@/lib/data";
import { updateComp } from "@/lib/actions";
import { notFound } from "next/navigation";
import ChipsInput from "@/components/customs/chips-input";
import DropdownList from "@/components/customs/dropdown-list";
import Select from "@/components/customs/select";
import Breadcrumbs from "@/ui/admin/breadcrumbs";
import Link from "next/link";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const comp = await fetchCompById(id);

  if (!comp) {
    notFound();
  }
  
  const updateCompWithId = updateComp.bind(null, comp.id);

  return (
    <main>
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

      {/* CompForm */}
      <form action={updateCompWithId}>
        <div className="rounded-md bg-slate-50 p-4 md:p-6">
          {/* Grid for compact layout */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Component Name */}
            <TextInput
              label="Component Name"
              name="name"
              type="text"
              placeholder="Enter component name"
              defaultValue={comp.name}
              icon={CpuChipIcon}
              className="md:col-span-2"
            />
            
            {/* Component Price */}
            <TextInput
              label="Component Price"
              name="price"
              type="number"
              placeholder="Enter component price"
              defaultValue={comp.price.toString()}
              icon={CurrencyDollarIcon}
              className="md:col-span-1"
            />

            {/* Component Stock */}
            <TextInput
              label="Component Stock"
              name="stock"
              type="number"
              placeholder="Enter component stock"
              defaultValue={comp.stock.toString()}
              icon={HashtagIcon}
              className="md:col-span-1"
            />
          </div>

          {/* Grid for compact layout */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Component Type */}
            <Select
              label="Component Type"
              name="type"
              items={types}
              defaultValue={comp.type}
            />

            {/* Component Categories */}
            <DropdownList
              label="Component Categories"
              name="categories"
              items={categories}
              defaultValues={comp.categories}
            />

            {/* Component Datasheet URL */}
            <TextInput
              label="Component Datasheet URL"
              name="datasheet"
              type="url"
              placeholder="Enter component datasheet URL"
              defaultValue={comp.datasheet || ""}
              icon={GlobeAltIcon}
            />
          </div>

          <Textarea
            label="Component Description"
            name="description"
            placeholder="Enter component description"
            defaultValue={comp.description}
            icon={InformationCircleIcon}
          />

          {/* Component Images */}
          <ChipsInput
            label="Component Images"
            name="images"
            placeholder="Enter component images URLs"
            defaultValues={comp.images}
          />

          {/* Component Status */}
          <RadioGroup
            label="Set the component status"
            name="status"
            options={statuses}
            defaultChecked={comp.isActive}
          />
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/admin/comps"
            className="flex h-10 items-center rounded-lg bg-slate-100 px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
          >
            Cancel
          </Link>
          <Button type="submit">Edit Component</Button>
        </div>
      </form>
    </main>
  );
}   