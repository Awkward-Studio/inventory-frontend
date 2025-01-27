"use client";

import React, { useState } from "react";
import ProductAPI from "@/backend/api"; // Your API handler
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NewProductPage = () => {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState<number | string>("");
  const [price, setPrice] = useState<number | string>("");
  const [supplier, setSupplier] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsButtonLoading(true);

    try {
      await ProductAPI.createProduct({
        name,
        sku,
        category,
        quantity: parseInt(quantity as string),
        price: parseFloat(price as string),
        supplier,
        location,
        description,
      });

      alert("Product created successfully!");
      router.push("/inventory");
    } catch (error) {
      alert("Failed to create product. Please try again.");
    } finally {
      setIsButtonLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-4">
      {/* Overlay for loading */}
      {isButtonLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div>Loading...</div>
        </div>
      )}

      {/* Form container */}
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        {/* Title */}
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create New Product
        </h1>

        {/* Form inputs */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col space-y-5"
        >
          {/* Input with required asterisk */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="sku" className="block text-sm font-medium mb-1">
              SKU
            </label>
            <Input
              id="sku"
              placeholder="Enter SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-1"
            >
              Category
            </label>
            <Input
              id="category"
              placeholder="Enter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium mb-1"
            >
              Quantity <span className="text-red-500">*</span>
            </label>
            <Input
              id="quantity"
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Price <span className="text-red-500">*</span>
            </label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="supplier"
              className="block text-sm font-medium mb-1"
            >
              Supplier
            </label>
            <Input
              id="supplier"
              placeholder="Enter supplier"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium mb-1"
            >
              Location
            </label>
            <Input
              id="location"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description<span className="text-red-500">*</span>
            </label>

            <Input
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            color="#EF4444"
            disabled={isButtonLoading || !name || !quantity || !price}
          >
            {isButtonLoading ? (
              <div>Loading...</div>
            ) : (
              <div>Create Product</div>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewProductPage;
