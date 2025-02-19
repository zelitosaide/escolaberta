import { toDecimal, type Dinero, allocate } from "dinero.js";
import ProductCurrencySymbol from "./product-currency-symbol";

export default function ProductSplitPayments({ price }: { price: Dinero<number> }) {
// only offer split payments for more expensive items
  if (Number(toDecimal(price)) < 150) {
    return null;
  }

  const [perMonth] = allocate(price, [1, 2]);
  // Convert to decimal and round up
  const amount = Math.ceil(Number(toDecimal(perMonth))); // toUnit(perMonth, { digits: 0, round: up })
  
  return (
    <div className="text-sm text-gray-400">
      Or <ProductCurrencySymbol dinero={price} />
      {amount}/month for 3 months
    </div>
  );
}