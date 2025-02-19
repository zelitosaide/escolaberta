import { Product } from "@/lib/definitions";
import { multiply, type Dinero, toDecimal } from "dinero.js";
import ProductLighteningDeal from "./product-lightening-deal";
import ProductDeal from "./product-deal";
import ProductCurrencySymbol from "./product-currency-symbol";

function isDiscount(obj: any): obj is { percent: number; expires?: number } {
  return typeof obj?.percent === "number";
}

function formatDiscount(
  price: Dinero<number>,
  discountRaw: Product["discount"],
) {
  return isDiscount(discountRaw)
    ? {
        amount: multiply(price, {
          amount: discountRaw.percent,
          scale: 2,
        }),
        expires: discountRaw.expires,
      }
    : undefined;
}

export default function ProductPrice({
  price,
  discount: discountRaw,
}: {
  price: Dinero<number>;
  discount: Product["discount"];
}) {
  const discount = formatDiscount(price, discountRaw);

  if (discount) {
    if (discount?.expires && typeof discount.expires === "number") {
      return <ProductLighteningDeal price={price} discount={discount} />;
    }
    return <ProductDeal price={price} discount={discount} />;
  }

  return (
    <div className="flex">
      <div className="text-sm leading-snug text-white">
        <ProductCurrencySymbol dinero={price} />
      </div>
      <div className="text-lg font-bold leading-snug text-white">
        {toDecimal(price)}
      </div>
    </div>
  );
}