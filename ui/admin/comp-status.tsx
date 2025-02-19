import { CheckCircleIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function CompStatus({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs",
        {
          "bg-slate-100 text-slate-500": !isActive,
          "bg-green-500 text-white": isActive,
        },
      )}
    >
      {isActive ? (
        <>
          In Stock
          <CheckCircleIcon className="ml-1 w-4 text-white" />
        </>
      ) : (
        <>
          Out of Stock
          <MinusCircleIcon className="ml-1 w-4 text-slate-500" />
        </>
      )}
    </span>
  );
}