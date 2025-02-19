import { Product } from "@/lib/definitions";
import { type DineroSnapshot, dinero } from "dinero.js";
import ProductPrice from "./product-price";
import { Ping } from "./ping";
import { Suspense } from "react";
import { withDelay } from "@/lib/utils";
import { delayShippingEstimate } from "@/lib/constants";
import ProductSplitPayments from "./product-split-payments";
import ProductUsedPrice from "./product-used-price";
import ProductEstimatedArrival from "./product-estimated-arrival";
import ProductLowStockWarning from "./product-low-stock-warning";
import AddToCart from "./add-to-cart";
import { cookies } from "next/headers";

async function AddToCartFromCookies() {
  // Get the cart count from the users cookies and pass it to the client
  // AddToCart component
  // const cartCount = Number(cookies().get("_cart_count")?.value || "0");
  const cartCount = Number((await cookies()).get("_cart_count")?.value || 0);
  return <AddToCart initialCartCount={cartCount} />;
}

function LoadingDots() {
  return (
    <div className="text-sm">
      <span className="space-x-0.5">
        <span className="inline-flex animate-[loading_1.4s_ease-in-out_infinite] rounded-full">
          &bull;
        </span>
        <span className="inline-flex animate-[loading_1.4s_ease-in-out_0.2s_infinite] rounded-full">
          &bull;
        </span>
        <span className="inline-flex animate-[loading_1.4s_ease-in-out_0.4s_infinite] rounded-full">
          &bull;
        </span>
      </span>
    </div>
  );
}

async function UserSpecificDetails({ productId }: { productId: string }) {
  const data = await withDelay(
    fetch(
      `https://app-router-api.vercel.app/api/products?id=${productId}&filter=price,usedPrice,leadTime,stock`,
      {
        // We intentionally disable Next.js Cache to better demo
        // streaming
        cache: "no-store",
      }
    ),
    delayShippingEstimate
  );

  const product = (await data.json()) as Product;

  const price = dinero(product.price as DineroSnapshot<number>);

  return (
    <>
      <ProductSplitPayments price={price} />
      {product.usedPrice ? (
        <ProductUsedPrice usedPrice={product.usedPrice} />
      ) : null}
      <ProductEstimatedArrival leadTime={product.leadTime} hasDeliveryTime />
      {product.stock <= 1 ? (
        <ProductLowStockWarning stock={product.stock} />
      ) : null}
    </>
  );
}

export default function Pricing({ product }: { product: Product }) {
  const price = dinero(product.price as DineroSnapshot<number>);

  return (
    // <div className="space-y-4 rounded-lg bg-gray-900 p-3">
    <div className="space-y-4 rounded-lg bg-slate-800 p-3">
      <ProductPrice price={price} discount={product.discount} />

      <Ping />

      <Suspense fallback={<LoadingDots />}>
        <UserSpecificDetails productId={product.id} />
      </Suspense>

      <Suspense fallback={<AddToCart initialCartCount={0} />}>
        <AddToCartFromCookies />
      </Suspense>
    </div>
  );
}