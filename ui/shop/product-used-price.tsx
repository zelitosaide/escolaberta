import { Product } from "@/lib/definitions";
import { type DineroSnapshot, dinero, toDecimal } from "dinero.js";

export default function ProductUsedPrice({
  usedPrice: usedPriceRaw,
}: {
  usedPrice: Product["usedPrice"];
}) {
  const usedPrice = dinero(usedPriceRaw as DineroSnapshot<number>);

  return (
    <div className="text-sm">
      <div className="text-gray-400">More buying choices</div>
      <div className="text-gray-200">
        {/* ${toUnit(usedPrice, { digits: 0, round: up })} (used) */}
        ${Math.ceil(Number(toDecimal(usedPrice)))} (used)
      </div>
    </div>
  );
}