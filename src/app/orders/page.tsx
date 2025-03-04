"use client";

import * as React from "react";
import { OrderCardsDataTable } from "@/components/data-tables/orderCards-data-table";
import { orderCardColumns } from "@/lib/column-definitions";
import { orderAPI } from "@/backend/api";
import { OrderCard } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function OrderCardsPage() {
  const [orders, setOrders] = React.useState<OrderCard[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderAPI.getOrderCards();
        console.log(data);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch order cards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading orders...</p>;
  }

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Order Cards</h1>
        <Button
          className="bg-blue-500 text-white hover:bg-blue-400"
          onClick={() => (window.location.href = "/orders/create")}
        >
          + Create Order
        </Button>
      </div>

      <OrderCardsDataTable columns={orderCardColumns} data={orders} />
    </div>
  );
}
