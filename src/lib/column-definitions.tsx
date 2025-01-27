import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProductAPI from "@/backend/api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => info.getValue(),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: (info) => info.getValue(),
    enableColumnFilter: true,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: (info) => `$${info.getValue()}`,
    enableSorting: true,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const pathname = usePathname();
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [isButtonLoading, setIsButtonLoading] = useState(false);

      const handleDelete = async () => {
        setIsButtonLoading(true);

        try {
          await ProductAPI.deleteProduct(row.original.id);
          // Optionally, refresh the data or navigate after deletion
          window.location.reload();
        } catch (error) {
          console.error("Error deleting product:", error);
        } finally {
          setIsButtonLoading(false);
          setIsDialogOpen(false); // Close the dialog
        }
      };

      return (
        <div className="flex space-x-4 justify-center items-center">
          {/* Edit Button */}
          <Link
            href={`${pathname}/update-item/${row.original.id}`} // Replace with your route
            className="text-blue-500 hover:underline"
          >
            Edit
          </Link>

          {/* Delete Button with Confirmation Dialog */}
          <Button
            className="text-white bg-red-500 hover:bg-red-600"
            onClick={() => setIsDialogOpen(true)}
          >
            Delete
          </Button>

          {/* Confirmation Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this item? This action cannot
                  be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button"
                  className="bg-gray-500"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isButtonLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-red-500"
                  onClick={handleDelete}
                  disabled={isButtonLoading}
                >
                  {isButtonLoading ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
