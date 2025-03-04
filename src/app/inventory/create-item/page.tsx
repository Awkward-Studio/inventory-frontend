"use client";

import React, { useState } from "react";
import { productAPI } from "@/backend/api"; // Your API handler
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NewProductPage = () => {
  const [name, setName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [sku, setSku] = useState("");
  const [hsn, setHsn] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState<number | string>("");
  const [itemLocation, setItemLocation] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [location, setLocation] = useState("");
  const [msp, setMsp] = useState<string>("");
  const [mrp, setMrp] = useState<string>("");
  const [gst, setGst] = useState<string>("");
  const [cgst, setCgst] = useState<string>("");
  const [sgst, setSgst] = useState<string>("");
  const [igst, setIgst] = useState<string>("");
  const [vendorCode, setVendorCode] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [purchasePrice, setPurchasePrice] = useState<number | string>("");
  const [purchaseLocation, setPurchaseLocation] = useState("");
  const [purchaseOrderDate, setPurchaseOrderDate] = useState("");
  const [purchaseOrderId, setPurchaseOrderId] = useState("");
  const [warrantyPeriod, setWarrantyPeriod] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const router = useRouter();

  // const createDummyProducts = async (numProducts: number) => {
  //   for (let i = 1; i <= numProducts; i++) {
  //     const productData = {
  //       name: `Product ${i}`,
  //       sku: `SKdU_${i}`,
  //       hsn: `HSN_${i}`,
  //       price: Math.floor(Math.random() * 100) + 50,
  //       quantity: Math.floor(Math.random() * 50) + 10,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //     };

  //     try {
  //       const response = await fetch(
  //         "http://127.0.0.1:8000/api/products/create/",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(productData),
  //         }
  //       );

  //       if (!response.ok) {
  //         console.error(`Failed to create product ${i}`, await response.json());
  //       } else {
  //         console.log(`Product ${i} created successfully`);
  //       }
  //     } catch (error) {
  //       console.error(`Error creating product ${i}`, error);
  //     }
  //   }
  // };

  // const createDummyOrderCards = async (numOrders: number) => {
  //   for (let i = 1; i <= numOrders; i++) {
  //     const orderData = {
  //       customer_name: `Customer ${i}`,
  //       customer_address: `Address ${i}, City ${i}`,
  //       customer_phone: `123456789${i}`,
  //       customer_gst: `GSTIN${i}`,
  //       status: "Pending",
  //     };

  //     try {
  //       const response = await fetch(
  //         "http://127.0.0.1:8000/api/orders/create/",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(orderData),
  //         }
  //       );

  //       if (!response.ok) {
  //         console.error(`Failed to create order ${i}`, await response.json());
  //       } else {
  //         console.log(`Order ${i} created successfully`);
  //       }
  //     } catch (error) {
  //       console.error(`Error creating order ${i}`, error);
  //     }
  //   }
  // };

  // const populateDatabase = async () => {
  //   console.log("Creating dummy orders...");
  //   await createDummyOrderCards(5); // Create 5 dummy orders

  //   console.log("Database population completed!");
  // };

  const handleSubmit = async () => {
    setIsButtonLoading(true);

    try {
      // await productAPI.createProduct({
      //   name,
      //   sku,
      //   category,
      //   quantity: parseInt(quantity as string),
      //   price: parseFloat(price as string),

      //   location,
      //   description,
      // });
      await productAPI.createProduct({
        name,
        itemCode,
        sku,
        hsn,
        category,
        quantity: parseInt(quantity as string),
        itemLocation,
        description,
        price: parseFloat(price as string),
        msp: msp,
        mrp: parseFloat(mrp as string),
        gst: parseFloat(gst as string),
        cgst: cgst,
        sgst: sgst,
        igst: igst,
        vendorCode,
        vendorName,

        purchaseLocation,
        purchaseOrderDate: purchaseOrderDate
          ? new Date(purchaseOrderDate as string).toISOString().split("T")[0]
          : undefined,
        //purchaseOrderDate: purchaseOrderDate ? new Date(purchaseOrderDate as string).toISOString().split('T')[0] : undefined,
        purchaseOrderId,
        warrantyPeriod,
      });

      alert("Product created successfully!");
      router.push("/inventory");
    } catch (error) {
      alert("Failed to create product. Please try again.");
    } finally {
      setIsButtonLoading(false);
    }
  };

  // return (
  //   <div className="flex flex-col items-center justify-center min-h-screen py-4">
  //     {/* Overlay for loading */}
  //     {isButtonLoading && (
  //       <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
  //         <div>Loading...</div>
  //       </div>
  //     )}

  //     {/* Form container */}
  //     <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
  //       {/* Title */}
  //       <h1 className="text-2xl font-bold mb-6 text-center">
  //         Create New Product
  //       </h1>

  //       {/* Form inputs */}
  //       <form
  //         onSubmit={(e) => {
  //           e.preventDefault();
  //           //handleSubmit();
  //           populateDatabase();
  //         }}
  //         className="flex flex-col space-y-5"
  //       >
  //         {/* Input with required asterisk */}
  //         <div>
  //           <label htmlFor="name" className="block text-sm font-medium mb-1">
  //             Product Name <span className="text-red-500">*</span>
  //           </label>
  //           <Input
  //             id="name"
  //             placeholder="Enter product name"
  //             value={name}
  //             onChange={(e) => setName(e.target.value)}
  //             required
  //           />
  //         </div>

  //         <div>
  //           <label htmlFor="sku" className="block text-sm font-medium mb-1">
  //             SKU
  //           </label>
  //           <Input
  //             id="sku"
  //             placeholder="Enter SKU"
  //             value={sku}
  //             onChange={(e) => setSku(e.target.value)}
  //           />
  //         </div>

  //         <div>
  //           <label
  //             htmlFor="category"
  //             className="block text-sm font-medium mb-1"
  //           >
  //             Category
  //           </label>
  //           <Input
  //             id="category"
  //             placeholder="Enter category"
  //             value={category}
  //             onChange={(e) => setCategory(e.target.value)}
  //           />
  //         </div>

  //         <div>
  //           <label
  //             htmlFor="quantity"
  //             className="block text-sm font-medium mb-1"
  //           >
  //             Quantity <span className="text-red-500">*</span>
  //           </label>
  //           <Input
  //             id="quantity"
  //             type="number"
  //             placeholder="Enter quantity"
  //             value={quantity}
  //             onChange={(e) => setQuantity(e.target.value)}
  //             required
  //           />
  //         </div>

  //         <div>
  //           <label htmlFor="price" className="block text-sm font-medium mb-1">
  //             Price <span className="text-red-500">*</span>
  //           </label>
  //           <Input
  //             id="price"
  //             type="number"
  //             step="0.01"
  //             placeholder="Enter price"
  //             value={price}
  //             onChange={(e) => setPrice(e.target.value)}
  //             required
  //           />
  //         </div>

  //         <div>
  //           <label
  //             htmlFor="supplier"
  //             className="block text-sm font-medium mb-1"
  //           >
  //             Supplier
  //           </label>
  //           <Input
  //             id="supplier"
  //             placeholder="Enter supplier"
  //             value={supplier}
  //             onChange={(e) => setSupplier(e.target.value)}
  //           />
  //         </div>

  //         <div>
  //           <label
  //             htmlFor="location"
  //             className="block text-sm font-medium mb-1"
  //           >
  //             Location
  //           </label>
  //           <Input
  //             id="location"
  //             placeholder="Enter location"
  //             value={location}
  //             onChange={(e) => setLocation(e.target.value)}
  //           />
  //         </div>

  //         <div>
  //           <label
  //             htmlFor="description"
  //             className="block text-sm font-medium mb-1"
  //           >
  //             Description<span className="text-red-500">*</span>
  //           </label>

  //           <Input
  //             id="description"
  //             placeholder="Enter description"
  //             value={description}
  //             onChange={(e) => setDescription(e.target.value)}
  //           />
  //         </div>

  //         {/* Submit button */}
  //         <Button
  //           type="submit"
  //           color="#EF4444"
  //           //disabled={isButtonLoading || !name || !quantity || !price}
  //         >
  //           {isButtonLoading ? (
  //             <div>Loading...</div>
  //           ) : (
  //             <div>Create Product</div>
  //           )}
  //         </Button>
  //       </form>
  //     </div>
  //   </div>
  // );
  // return (
  //   <div className="flex flex-col items-center justify-center min-h-screen py-4">
  //     {/* Overlay for loading */}
  //     {isButtonLoading && (
  //       <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
  //         <div>Loading...</div>
  //       </div>
  //     )}

  //     {/* Form container */}
  //     <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
  //       {/* Title */}
  //       <h1 className="text-2xl font-bold mb-6 text-center">
  //         Create New Product
  //       </h1>

  //       {/* Form inputs */}
  //       <form
  //         onSubmit={(e) => {
  //           e.preventDefault();
  //           populateDatabase();
  //         }}
  //         className="flex flex-col space-y-5"
  //       >
  //         {[
  //           { id: "name", label: "Product Name", required: true },
  //           { id: "itemCode", label: "Item Code" },
  //           { id: "sku", label: "SKU" },
  //           { id: "hsn", label: "HSN" },
  //           { id: "category", label: "Category" },
  //           {
  //             id: "quantity",
  //             label: "Quantity",
  //             type: "number",
  //             required: true,
  //           },
  //           { id: "itemLocation", label: "Item Location" },
  //           { id: "description", label: "Description" },
  //           {
  //             id: "price",
  //             label: "Price",
  //             type: "number",
  //             step: "0.01",
  //             required: true,
  //           },
  //           { id: "msp", label: "MSP", type: "number", step: "0.01" },
  //           { id: "mrp", label: "MRP", type: "number", step: "0.01" },
  //           { id: "gst", label: "GST", type: "number", step: "0.01" },
  //           { id: "cgst", label: "CGST", type: "number", step: "0.01" },
  //           { id: "sgst", label: "SGST", type: "number", step: "0.01" },
  //           { id: "igst", label: "IGST", type: "number", step: "0.01" },
  //           { id: "vendorCode", label: "Vendor Code" },
  //           { id: "vendorName", label: "Vendor Name" },
  //           {
  //             id: "purchasePrice",
  //             label: "Purchase Price",
  //             type: "number",
  //             step: "0.01",
  //           },
  //           { id: "purchaseLocation", label: "Purchase Location" },
  //           { id: "purchaseDate", label: "Purchase Date", type: "date" },
  //           {
  //             id: "purchaseOrderDate",
  //             label: "Purchase Order Date",
  //             type: "date",
  //           },
  //           { id: "purchaseOrderId", label: "Purchase Order ID" },
  //           { id: "warrantyPeriod", label: "Warranty Period" },
  //         ].map(({ id, label, type = "text", required, step }) => (
  //           <div key={id}>
  //             <label htmlFor={id} className="block text-sm font-medium mb-1">
  //               {label} {required && <span className="text-red-500">*</span>}
  //             </label>
  //             <Input
  //               id={id}
  //               type={type}
  //               step={step}
  //               placeholder={`Enter ${label.toLowerCase()}`}
  //               value={eval(id)}
  //               onChange={(e) =>
  //                 eval(`set${id.charAt(0).toUpperCase() + id.slice(1)}`)(
  //                   e.target.value
  //                 )
  //               }
  //               required={required}
  //             />
  //           </div>
  //         ))}

  //         {/* Submit button */}
  //         <Button type="submit" color="#EF4444">
  //           {isButtonLoading ? (
  //             <div>Loading...</div>
  //           ) : (
  //             <div>Create Product</div>
  //           )}
  //         </Button>
  //       </form>
  //     </div>
  //   </div>
  // );
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
          {/* Required fields */}
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
              htmlFor="itemCode"
              className="block text-sm font-medium mb-1"
            >
              Item Code
            </label>
            <Input
              id="itemCode"
              placeholder="Enter item code"
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="hsn" className="block text-sm font-medium mb-1">
              HSN
            </label>
            <Input
              id="hsn"
              placeholder="Enter HSN"
              value={hsn}
              onChange={(e) => setHsn(e.target.value)}
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
            <label htmlFor="msp" className="block text-sm font-medium mb-1">
              MSP
            </label>
            <Input
              id="msp"
              type="number"
              step="0.01"
              placeholder="Enter MSP"
              value={msp}
              onChange={(e) => setMsp(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="mrp" className="block text-sm font-medium mb-1">
              MRP
            </label>
            <Input
              id="mrp"
              type="number"
              step="0.01"
              placeholder="Enter MRP"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="gst" className="block text-sm font-medium mb-1">
              GST
            </label>
            <Input
              id="gst"
              type="number"
              step="0.01"
              placeholder="Enter GST"
              value={gst}
              onChange={(e) => setGst(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="cgst" className="block text-sm font-medium mb-1">
              CGST
            </label>
            <Input
              id="cgst"
              type="number"
              step="0.01"
              placeholder="Enter CGST"
              value={cgst}
              onChange={(e) => setCgst(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="sgst" className="block text-sm font-medium mb-1">
              SGST
            </label>
            <Input
              id="sgst"
              type="number"
              step="0.01"
              placeholder="Enter SGST"
              value={sgst}
              onChange={(e) => setSgst(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="igst" className="block text-sm font-medium mb-1">
              IGST
            </label>
            <Input
              id="igst"
              type="number"
              step="0.01"
              placeholder="Enter IGST"
              value={igst}
              onChange={(e) => setIgst(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="vendorName"
              className="block text-sm font-medium mb-1"
            >
              Vendor Name
            </label>
            <Input
              id="vendorName"
              placeholder="Enter vendor name"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="purchasePrice"
              className="block text-sm font-medium mb-1"
            >
              Purchase Price
            </label>
            <Input
              id="purchasePrice"
              type="number"
              step="0.01"
              placeholder="Enter purchase price"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="purchaseOrderDate"
              className="block text-sm font-medium mb-1"
            >
              Purchase Order Date
            </label>
            <Input
              id="purchaseOrderDate"
              type="date"
              value={purchaseOrderDate}
              onChange={(e) => setPurchaseOrderDate(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="warrantyPeriod"
              className="block text-sm font-medium mb-1"
            >
              Warranty Period
            </label>
            <Input
              id="warrantyPeriod"
              placeholder="Enter warranty period"
              value={warrantyPeriod}
              onChange={(e) => setWarrantyPeriod(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full rounded-md"
            />
          </div>

          {/* Submit button */}
          <Button type="submit" color="#EF4444">
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
