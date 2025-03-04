"use client";

import React, { useEffect, useState } from "react";
import { orderAPI, productAPI } from "@/backend/api";
import { OrderCard, CurrentOrderPart, Product, OrderPart } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { CurrentPartsDataTable } from "@/components/data-tables/current-parts-data-table";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  convertOrderPartsToCurrentOrderParts,
  roundToTwoDecimals,
} from "@/lib/helpers";
import DetailsCard from "@/components/DetailsCard";
import { orderPartsColumns } from "@/lib/column-definitions";
import { useParams } from "next/navigation";
import loader from "../../../../../public/t3-loader.gif";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import JobCardsPageSkeleton from "@/components/skeletons/JobCardPageSkeleton";
import { User } from "lucide-react";

export default function orderCardPage() {
  const params = useParams(); // ✅ Fetch params correctly
  const orderId = params?.orderId as string; // Ensure orderId is extracted properly

  const [order, setOrder] = useState<OrderCard | null>(null);
  const [currentParts, setCurrentParts] = useState<CurrentOrderPart[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isEdited, setIsEdited] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<number>(1); // Default to "Save"

  const [customerName, setCustomerName] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerGST, setCustomerGST] = useState<string>("");
  const [partsTotal, setPartsTotal] = useState<number>(0);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [isDisabled, setIsDisabled] = useState<boolean>();

  // Fetch order details and products on load
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderDetails = await orderAPI.getOrderCardById(orderId);
        setOrder(orderDetails);
        const parts = convertOrderPartsToCurrentOrderParts(
          orderDetails.order_parts || []
        );
        console.log(parts);
        setCurrentParts((prev: any) => parts);
        setCustomerName(orderDetails.customer_name);
        setCustomerAddress(orderDetails.customer_address);
        setCustomerPhone(orderDetails.customer_phone);
        setCustomerGST(orderDetails.customer_gst);
        setCurrentStatus(orderDetails.progress_status); // Load the current status from the backend

        const productsList = await productAPI.getProducts({});
        setProducts(productsList);
      } catch (error) {
        console.error("Failed to fetch order details", error);
      }
    };

    fetchOrderDetails();
  }, []);

  // Reset status to "Save" when parts or customer details are edited
  useEffect(() => {
    console.log("EDIT");
    const updateOrderCard = async () => {
      try {
        const res: any = await orderAPI.updateOrderCardStatus(
          orderId,
          1 // Status: "Save"
        );
        console.log(res);

        if (res?.status == 204) {
          console.log("Order status updated successfully");
          console.log(res);
          setCurrentStatus(1); // ✅ Only update status if request succeeds
          setIsEdited(false);
        }
      } catch (error) {
        console.error("Failed to update order:", error);
      }
    };

    if (isEdited == true) {
      updateOrderCard();
      setIsEdited(false);
    }
  }, [isEdited]);

  // Calculate parts total
  useEffect(() => {
    const total = currentParts.reduce(
      (sum, part) => sum + part.total_amount,
      0
    );
    setPartsTotal(roundToTwoDecimals(total));
  }, [currentParts]);

  // Fetch order details and products on load
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderDetails = await orderAPI.getOrderCardById(orderId);
        setOrder(orderDetails);
        setCurrentParts(orderDetails.order_parts || []);
        setCustomerName(orderDetails.customer_name);
        setCustomerAddress(orderDetails.customer_address);
        setCustomerPhone(orderDetails.customer_phone);
        setCustomerGST(orderDetails.customer_gst);
        setCurrentStatus(orderDetails.progress_status); // Load the current status from the backend

        const productsList = await productAPI.getProducts({});
        setProducts(productsList);
      } catch (error) {
        console.error("Failed to fetch order details", error);
      }
    };

    fetchOrderDetails();
  }, []);

  // Save the current parts and customer details to the backend
  const handleSave = async () => {
    try {
      const res = await orderAPI.addPartsToOrder(orderId, currentParts);
      const res1 = await orderAPI.updateOrderCardStatus(orderId, 2);
      console.log(res, res1);
      if (res.status == 204 && res1.status == 204) {
        console.log("Order saved successfully");
        setCurrentStatus(2); // ✅ Only update status if request succeeds
        setIsEdited(false);
        toast.success("Order saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save order", error);
      toast.error("Failed to save order.");
    }
  };

  // Generate a quote
  const generateQuote = async () => {
    try {
      const res = await orderAPI.updateOrderCardStatus(orderId, 3);
      if (res.status === 204) {
        setCurrentStatus(3); // Move to "Tax Invoice"
        setIsEdited(false);
        setTimeout(() => {
          window.location.reload(); // Refreshes the page to get the latest data
        }, 100);
        toast.success("Quote generated successfully!");
      }
    } catch (error) {
      console.error("Failed to generate quote", error);
      toast.error("Failed to generate quote.");
    }
  };

  // Generate tax invoice
  const generateTaxInvoice = async () => {
    try {
      const res = await orderAPI.updateOrderCardStatus(orderId, 4);
      toast.success("Tax invoice generated successfully!");

      if (res.status === 204) {
        setCurrentStatus(4); // Move to "Tax Invoice"
        setIsEdited(false);
        setIsDisabled(true);
        setTimeout(() => {
          window.location.reload(); // Refreshes the page to get the latest data
        }, 100);
        toast.success("Quote generated successfully!");
      }
    } catch (error) {
      console.error("Failed to generate tax invoice", error);
      toast.error("Failed to generate tax invoice.");
    }
  };

  const saveCustomerName = async () => {
    try {
      await orderAPI.updateOrderCardCustomerDetails(
        orderId,
        "customer_name",
        customerName
      );
      toast("Customer Name Changed \u2705");
      setTimeout(() => {
        window.location.reload(); // Refreshes the page to get the latest data
      }, 100);
      return true;
    } catch (error: any) {
      console.error(`Failed to update field: ${error.message}`);
      return null;
    }
  };

  const saveCustomerAddress = async () => {
    try {
      await orderAPI.updateOrderCardCustomerDetails(
        orderId,
        "customer_address",
        customerAddress
      );
      toast("Customer Address Changed \u2705");
      setTimeout(() => {
        window.location.reload(); // Refreshes the page to get the latest data
      }, 100);
      return true;
    } catch (error: any) {
      console.error(`Failed to update field: ${error.message}`);
      return null;
    }
  };

  const saveCustomerPhone = async () => {
    try {
      await orderAPI.updateOrderCardCustomerDetails(
        orderId,
        "customer_phone",
        customerPhone
      );
      toast("Customer PhoneNumber Changed \u2705");
      setTimeout(() => {
        window.location.reload(); // Refreshes the page to get the latest data
      }, 100);
      return true;
    } catch (error: any) {
      console.error(`Failed to update field: ${error.message}`);
      return null;
    }
  };

  const saveCustomerGST = async () => {
    try {
      await orderAPI.updateOrderCardCustomerDetails(
        orderId,
        "customer_gst",
        customerGST
      );
      toast("Customer GST Changed \u2705");
      setTimeout(() => {
        window.location.reload(); // Refreshes the page to get the latest data
      }, 100);
      return true;
    } catch (error: any) {
      console.error(`Failed to update field: ${error.message}`);
      return null;
    }
  };

  return (
    <div className="flex flex-col w-[90%] mt-5 space-y-8">
      {/* Overlay to disable page */}
      {buttonLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Image src={loader} width={50} height={50} alt="Logo" />
        </div>
      )}
      {!(order && currentParts && products) ? (
        <JobCardsPageSkeleton />
      ) : (
        <>
          <div className="sticky top-5 flex w-full justify-between items-center shadow-md p-4 rounded-lg border border-gray-300 bg-white z-50">
            <div className="text-red-700">
              <Link href="/parts" className="flex space-x-4">
                <div>
                  <ArrowLeft />
                </div>
                <div>Back to All Job cards</div>
              </Link>
            </div>
            <div className="flex flex-row space-x-5 justify-normal items-center">
              {
                <>
                  {currentStatus === 1 && (
                    <Button
                      variant="outline"
                      className="px-8 py-2 bg-red-500 text-white hover:bg-red-400 hover:text-white"
                      size="lg"
                      onClick={() => handleSave()}
                    >
                      Save
                    </Button>
                  )}
                  {currentStatus == 2 && (
                    <Button
                      variant="outline"
                      className={`px-8 py-2 bg-red-500 text-white hover:bg-red-400 hover:text-white ${
                        buttonLoading ? "opacity-50" : ""
                      }`}
                      size="lg"
                      onClick={generateQuote}
                      disabled={buttonLoading}
                    >
                      {buttonLoading ? (
                        <>
                          <Image
                            src={loader}
                            width={50}
                            height={50}
                            alt="Logo"
                          />
                        </>
                      ) : (
                        <>Generate Quote</>
                      )}
                    </Button>
                  )}
                  {currentStatus == 3 && (
                    <Button
                      variant="outline"
                      className={`px-8 py-2 bg-red-500 text-white hover:bg-red-400 hover:text-white ${
                        buttonLoading ? "opacity-50" : ""
                      }`}
                      size="lg"
                      onClick={generateTaxInvoice}
                      disabled={buttonLoading}
                    >
                      {buttonLoading ? (
                        <>
                          <Image
                            src={loader}
                            width={50}
                            height={50}
                            alt="Logo"
                          />
                        </>
                      ) : (
                        <>Generate Tax Invoice</>
                      )}
                    </Button>
                  )}
                  {currentStatus == 4 && (
                    <Button
                      variant="outline"
                      className={`px-8 py-2 bg-red-500 text-white hover:bg-red-400 hover:text-white`}
                      size="lg"
                      disabled={true}
                    >
                      <>Tax invoice Generated</>
                    </Button>
                  )}
                </>
              }
            </div>
          </div>
          <div>
            <div>
              <div>
                <span className="font-bold text-3xl">
                  OrderCardNumber : {order.order_number}
                </span>
              </div>
              <div className="font-medium text-gray-500">
                <div>#Order Id : {order.id}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-row space-x-8">
            <div className="flex flex-col space-y-5">
              <DetailsCard
                title="Customer Details"
                icon={<User />}
                dataHead={order?.customer_name}
                data={{
                  customerPhone: order?.customer_phone,
                }}
              />
              <div className="grid grid-cols-2 gap-5">
                <DetailsCard
                  title="Customer Address"
                  dataHead={customerAddress}
                  data={{}}
                />
                <DetailsCard
                  title="Customer GST"
                  dataHead={customerGST}
                  data={{}}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-start space-x-5 items-center">
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border bordre-red-500 text-red-500"
                    disabled={isDisabled}
                  >
                    Edit Customer Name
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] overflow-visible max-h-screen focus:outline-none">
                  <DialogHeader>
                    <DialogTitle>Customer Name</DialogTitle>
                    <DialogDescription>Customer Name Details</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="Customer Name" className="text-right">
                        Customer Name
                      </Label>
                      <Input
                        id="customerName"
                        className="col-span-3"
                        onChange={(event) =>
                          setCustomerName(event.target.value)
                        }
                        value={customerName}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-red-500"
                      onClick={saveCustomerName}
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border bordre-red-500 text-red-500"
                    disabled={isDisabled}
                  >
                    Edit Customer Address
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] overflow-visible max-h-screen focus:outline-none">
                  <DialogHeader>
                    <DialogTitle>Customer Address</DialogTitle>
                    <DialogDescription>
                      Customer Address Details
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="CustomerAddress" className="text-right">
                        Customer Address
                      </Label>
                      <Input
                        id="customerAddress"
                        className="col-span-3"
                        onChange={(event) =>
                          setCustomerAddress(event.target.value)
                        }
                        value={customerAddress}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-red-500"
                      onClick={saveCustomerAddress}
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border bordre-red-500 text-red-500"
                    disabled={isDisabled}
                  >
                    Edit Customer PhoneNumber
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] overflow-visible max-h-screen focus:outline-none">
                  <DialogHeader>
                    <DialogTitle>Customer PhoneNumber</DialogTitle>
                    <DialogDescription>Customer PhoneNumber</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="CustomerPhoneNumber"
                        className="text-right"
                      >
                        Customer PhoneNumber
                      </Label>
                      <Input
                        id="customerAddress"
                        className="col-span-3"
                        onChange={(event) =>
                          setCustomerPhone(event.target.value)
                        }
                        value={customerPhone}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-red-500"
                      onClick={saveCustomerPhone}
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border bordre-red-500 text-red-500"
                    disabled={isDisabled}
                  >
                    Edit Customer GST No.
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] overflow-visible max-h-screen focus:outline-none">
                  <DialogHeader>
                    <DialogTitle>Customer GST</DialogTitle>
                    <DialogDescription>Customer GST Details</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="GSTIN" className="text-right">
                        GSTIN
                      </Label>
                      <Input
                        id="GSTIN"
                        className="col-span-3"
                        onChange={(event) => setCustomerGST(event.target.value)}
                        value={customerGST}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-red-500"
                      onClick={saveCustomerGST}
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="font-semibold text-3xl">Invoice Details</div>

          <div className="flex flex-col space-y-8 mb-10">
            <CurrentPartsDataTable
              columns={orderPartsColumns}
              data={currentParts}
              products={products}
              currentParts={currentParts}
              setCurrentParts={setCurrentParts}
              setIsEdited={setIsEdited}
              currentOrderStatus={currentStatus}
              partsTotal={partsTotal}
            />
          </div>
        </>
      )}
    </div>
  );
}

{
  /* Customer Details in Cards */
}
