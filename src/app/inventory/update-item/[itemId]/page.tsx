"use client";

import { productAPI } from "@/backend/api";
import React, { useEffect, useState } from "react";

import { Product } from "@/lib/types";
import { useRouter } from "next/navigation";

const EditProductPage = ({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) => {
  const [itemId, setItemId] = useState<string | null>(null);
  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setItemId(resolvedParams.itemId);
      } catch (err) {
        setError("Failed to resolve route parameters.");
      }
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!itemId) return;

      setLoading(true);
      try {
        const productData = await productAPI.getProductById(itemId);
        setOriginalProduct(productData);
        setProduct(productData);
      } catch (err) {
        setError("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [itemId]);

  useEffect(() => {
    if (!originalProduct || !product) return;

    // Compare original product with the current state
    const isModified =
      JSON.stringify(originalProduct) !== JSON.stringify(product);
    setIsButtonDisabled(!isModified);
  }, [originalProduct, product]);

  const handleSave = async () => {
    if (!itemId || !product) return;

    setLoading(true);
    try {
      await productAPI.editProduct(itemId, product);
      alert("Product updated successfully!");
      router.push("/inventory");
    } catch (err) {
      setError("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>No product found.</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen my-6 mx-auto">
      <div className="p-6 bg-white shadow-md rounded-md max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Product</h1>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SKU</label>
            <input
              type="text"
              value={product.sku || ""}
              onChange={(e) => setProduct({ ...product, sku: e.target.value })}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              value={product.category || ""}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              value={product.quantity}
              onChange={(e) =>
                setProduct({ ...product, quantity: Number(e.target.value) })
              }
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: Number(e.target.value) })
              }
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Supplier</label>
            <input
              type="text"
              value={product.vendorName || ""}
              onChange={(e) =>
                setProduct({ ...product, vendorName: e.target.value })
              }
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              value={product.itemLocation || ""}
              onChange={(e) =>
                setProduct({ ...product, itemLocation: e.target.value })
              }
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={product.description || ""}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              className="border border-gray-300 rounded-md p-2 w-full"
              rows={4}
            />
          </div>
        </div>
        <div className="flex justify-between items-center mt-6 space-x-4">
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-md ${
              isButtonDisabled
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={isButtonDisabled}
          >
            Save Changes
          </button>
          <button
            onClick={() => router.push("/inventory")}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
