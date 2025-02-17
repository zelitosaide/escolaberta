import { BeakerIcon, CubeIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function NavMenu() {
  return (
    <nav className="flex justify-center space-x-4 my-4">
      <Link
        href="/category/tech"
        className="flex flex-col items-center p-2 bg-gray-800 rounded pixelated-border hover:bg-gray-700 transition-colors"
      >
        <CubeIcon className="w-6 h-6 mb-1" />
        <span className="font-pixel text-xs">Learn</span>
      </Link>
      <Link
        href="/category/art"
        className="flex flex-col items-center p-2 bg-gray-800 rounded pixelated-border hover:bg-gray-700 transition-colors"
      >
        <BeakerIcon className="w-6 h-6 mb-1" />
        <span className="font-pixel text-xs">Projects & Experiments</span>
      </Link>
      <Link
        href="/category/finance"
        className="flex flex-col items-center p-2 bg-gray-800 rounded pixelated-border hover:bg-gray-700 transition-colors"
      >
        <ShoppingCartIcon className="w-6 h-6 mb-1" />
        <span className="font-pixel text-xs">Shop</span>
      </Link>
    </nav>
  );
}