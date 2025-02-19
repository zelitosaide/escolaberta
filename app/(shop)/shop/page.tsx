import { Ping } from "@/ui/shop/ping";
import { RecommendedProducts, RecommendedProductsSkeleton } from "@/ui/shop/recommended-products";
import { Reviews, ReviewsSkeleton } from "@/ui/shop/reviews";
import SingleProduct from "@/ui/shop/single-product";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="space-y-8 lg:space-y-14">
      <SingleProduct />

      <Ping />

      <Suspense fallback={<RecommendedProductsSkeleton />}>
        <RecommendedProducts />
      </Suspense>

      <Ping />

      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews />
      </Suspense>
    </div>
  );
}