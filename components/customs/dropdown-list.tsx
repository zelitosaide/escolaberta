"use client";

import { useState } from "react";
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";

interface Item {
  id: number;
  name: string;
}

interface DropdownListProps {
  label: string
  name: string
  defaultValues?: string[]
  items: Item[]
  ariaDescribedby?: string
  errors?: string[]
}

export default function DropdownList({ label, name, defaultValues, items, ariaDescribedby, errors }: DropdownListProps) {
  const [selectedItems, setSelectedItems] = useState<Item[]>(
    defaultValues ? items.filter((item) => defaultValues.includes(item.name)) : []
  );

  return (
    <div className="mb-4">
      <Listbox value={selectedItems} onChange={setSelectedItems} multiple>
        <Label htmlFor={label} className="mb-2 block text-sm font-medium">{label}</Label>
        <div className="relative mt-2">
          <ListboxButton 
            id={label}
            className="grid w-full cursor-default grid-cols-1 peer rounded-md border bg-white border-slate-200 py-2 pl-3.5 pr-2 text-sm outline-1 placeholder:text-slate-500 focus:border-teal-500 focus:border-opacity-60 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 focus:outline-none">
            <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
              {/* <img alt="" src={selected.avatar} className="size-5 shrink-0 rounded-full" /> */}
              <span className="block truncate">{selectedItems.map((item) => item.name).join(", ")}</span>
            </span>
            <ChevronUpDownIcon
              aria-hidden="true"
              className="col-start-1 row-start-1 size-5 self-center justify-self-end text-slate-500 sm:size-4"
            />
          </ListboxButton>

          <ListboxOptions
            transition
            className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white p-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in"
          >
            {items.map((item) => (
              <ListboxOption
                key={item.id}
                value={item}
                className="group relative cursor-default select-none py-2 px-3 rounded-md text-slate-900 data-[focus]:bg-teal-400 data-[focus]:text-white data-[focus]:outline-none"
              >
                <div className="flex items-center">
                  {/* <img alt="" src={person.avatar} className="size-5 shrink-0 rounded-full" /> */}
                  <span className="block truncate font-normal group-data-[selected]:font-semibold">
                    {item.name}
                  </span>
                </div>

                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-teal-500 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                  <CheckIcon aria-hidden="true" className="size-5" />
                </span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
        <div id={ariaDescribedby} aria-live="polite" aria-atomic="true">
          {Boolean(errors?.length) &&
            errors?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            )
          )}
        </div>
      </Listbox>
      <input 
        type="hidden" 
        name={name}
        defaultValue={JSON.stringify(selectedItems.map((item) => item.name))}
      />
    </div>
  );
}
