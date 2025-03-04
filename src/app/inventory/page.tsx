"use client";

import React, { useEffect, useCallback, useState } from "react";

import { ProductTable } from "@/components/data-tables/products-data-table";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { productColumns } from "@/lib/column-definitions";
import { Product } from "@/lib/types";
import { productAPI } from "@/backend/api";

type Props = {};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await productAPI.getProducts(filters);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>
      {/* Product Table */}
      <ProductTable data={products || []} columns={productColumns} />
    </div>
  );
}
