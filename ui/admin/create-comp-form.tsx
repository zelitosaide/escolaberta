"use client";

import { Button } from "@/components/customs/button";
import { RadioGroup } from "@/components/customs/radio-group";
import { TextInput } from "@/components/customs/text-input";
import { Textarea } from "@/components/customs/textarea";
import { State, createComp } from "@/lib/actions";
import { categories, statuses, types } from "@/lib/data";
import { CpuChipIcon, CurrencyDollarIcon, GlobeAltIcon, HashtagIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { useActionState } from "react";
import DropdownList from "@/components/customs/dropdown-list";
import Select from "@/components/customs/select";
import ChipsInput from "@/components/customs/chips-input";
import Link from "next/link";

export default function CreateCompForm() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createComp, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-slate-50 p-4 md:p-6">
        {/* Grid for compact layout */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Component Name */}
          <TextInput
            label="Component Name"
            name="name"
            type="text"
            placeholder="Enter component name"
            icon={CpuChipIcon}
            className="md:col-span-2"
            ariaDescribedby="component-name-error"
            errors={state.errors?.name ? state.errors.name : []}
          />
          
          {/* Component Price */}
          <TextInput
            label="Component Price"
            name="price"
            type="number"
            placeholder="Enter component price"
            icon={CurrencyDollarIcon}
            className="md:col-span-1"
            ariaDescribedby="component-price-error"
            errors={state.errors?.price ? state.errors.price : []}
          />

          {/* Component Stock */}
          <TextInput
            label="Component Stock"
            name="stock"
            type="number"
            placeholder="Enter component stock"
            icon={HashtagIcon}
            className="md:col-span-1"
            ariaDescribedby="component-stock-error"
            errors={state.errors?.stock ? state.errors.stock : []}
          />
        </div>

        {/* Grid for compact layout */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Component Type */}
          <Select
            label="Component Type"
            name="type"
            items={types}
            ariaDescribedby="component-type-error"
            errors={state.errors?.type ? state.errors.type : []}
          />

          {/* Component Categories */}
          <DropdownList
            label="Component Categories"
            name="categories"
            items={categories}
            ariaDescribedby="component-categories-error"
            errors={state.errors?.categories ? state.errors.categories : []}
          />

          {/* Component Datasheet URL */}
          <TextInput
            label="Component Datasheet URL"
            name="datasheet"
            type="url"
            placeholder="Enter component datasheet URL"
            icon={GlobeAltIcon}
            ariaDescribedby="component-datasheet-error"
            errors={state.errors?.datasheet ? state.errors.datasheet : []}
          />
        </div>

        {/* Component Description */}
        <Textarea
          label="Component Description"
          name="description"
          placeholder="Enter component description"
          icon={InformationCircleIcon}
          ariaDescribedby="component-description-error"
          errors={state.errors?.description ? state.errors.description : []}
        />

        {/* Component Images */}
        <ChipsInput
          label="Component Images"
          name="images"
          placeholder="Enter component images URLs"
          ariaDescribedby="component-images-error"
          errors={state.errors?.images ? state.errors.images : []}
        />

        {/* Component Status */}
        <RadioGroup
          label="Set the component status"
          name="status"
          options={statuses}
          ariaDescribedby="component-status-error"
          errors={state.errors?.isActive ? state.errors.isActive : []}
        />

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/admin/comps"
          className="flex h-10 items-center rounded-lg bg-slate-100 px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Component</Button>
      </div>
    </form>
  );
}