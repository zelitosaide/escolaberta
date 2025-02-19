import { CubeIcon, PowerIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { lusitana } from "../fonts";
import NavLinks from "./nav-links";

function ZeptatronicLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row gap-1 items-center leading-none`}
    >
      <CubeIcon className="h-6 w-6 text-teal-500" />
      <p className="text-[24px] font-semibold text-teal-500">EscolAberta.com</p>
    </div>
  );
}

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-slate-800 p-4"
        href="/"
      >
        <div className="w-52">
          <ZeptatronicLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div 
          className="hidden h-auto w-full grow rounded-md md:block"
        />
        <form>
          <button
            className="flex h-[48px] md:h-[46px] w-full grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-slate-800 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}