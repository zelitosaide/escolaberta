import { CubeIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

export default function EscolAbertaBlackWhiteLogo({ className = "" }: { className?: string }) {
  return (
    <CubeIcon className={clsx({
      "h-6 w-6 text-white": true,
      [className]: !!className,
    })} />
  );
}