interface TextareaProps {
  label: string
  name: string
  placeholder: string
  defaultValue?: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  ariaDescribedby?: string
  errors?: string[]
}

export function Textarea({ label, name, placeholder, defaultValue, icon, ariaDescribedby, errors }: TextareaProps) {
  const Icon = icon;
  
  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <textarea
            id={name}
            name={name}
            placeholder={placeholder}
            defaultValue={defaultValue}
            aria-describedby={ariaDescribedby}
            className="peer block w-full rounded-md border border-slate-200 py-2 pl-10 text-sm outline-2 placeholder:text-slate-500 min-h-16  focus:border-teal-500 focus:border-opacity-60 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
          />
          <Icon className="pointer-events-none absolute left-3 top-[10px] h-[18px] w-[18px] text-slate-500 peer-focus:text-slate-900" />
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
    </div>
  );
}