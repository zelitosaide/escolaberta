"use client";

import { XCircleIcon } from "@heroicons/react/24/outline";
import { useState, KeyboardEvent, ChangeEvent } from "react";

interface ChipsInputProps {
  label?: string // Optional label for the input
  name: string // Name attribute for the input
  defaultValues?: string[]
  placeholder?: string // Placeholder text for the input field
  ariaDescribedby?: string
  errors?: string[]
}

export default function ChipsInput ({ label = "Tags", placeholder = "Enter tags...", name, defaultValues, ariaDescribedby, errors }: ChipsInputProps) {
  const [chips, setChips] = useState<string[]>(defaultValues ? defaultValues : []);
  const [inputValue, setInputValue] = useState<string>("");

  const handleAddChip = (): void => {
    const trimmedChip = inputValue.trim();
    if (trimmedChip && !chips.includes(trimmedChip)) {
      setChips((prevChips) => [...prevChips, trimmedChip]);
    }
    setInputValue(""); // Clear the input after adding
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      event.preventDefault();
      handleAddChip();
    }
  };

  const handleRemoveChip = (chipToRemove: string): void => {
    setChips((prevChips) => prevChips.filter((chip) => chip !== chipToRemove));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
  };

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor="chips-input"
          className="mb-2 block text-sm font-medium"
        >
          {label}
        </label>
      )}
      <div className="relative mt-2 rounded-md border bg-white border-slate-200 py-2 pl-3 pr-3 focus-within:border-teal-500 focus-within:border-opacity-60 focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-opacity-50">
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <span 
              key={chip}
              className="inline-flex items-center rounded-full px-3 py-1.5 text-xs bg-slate-100 text-slate-600 font-medium"
            >
              {chip}
              <XCircleIcon
                className="ml-1 w-4"
                onClick={() => handleRemoveChip(chip)}
                aria-label={`Remove ${chip}`}
              />
            </span>
          ))}
          <input
            id="chips-input"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="peer flex-grow rounded-sm border-none bg-transparent text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-opacity-50"
            placeholder={chips.length === 0 ? placeholder : ""}
          />
          <input
            type="hidden" 
            name={name}
            defaultValue={JSON.stringify(chips)}
          />
        </div>
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
    </div>
  );
};