"use client";

import {} from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchComponent from "@/components/PartsSearch";

import { CurrentOrderPart, Product } from "@/lib/types";
import {
  updateTempPartObjQuantity,
  updateTempPartObjMRP,
  updateTempPartObjDiscount,
  removeTempPartObjDiscount,
  roundToTwoDecimals,
  createTempPartZeroObj,
} from "@/lib/helpers";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Minus, Percent, Plus, Trash2, X } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  products: Product[] | null;
  currentParts: CurrentOrderPart[] | null;
  setCurrentParts: React.Dispatch<React.SetStateAction<CurrentOrderPart[]>>;
  setIsEdited: React.Dispatch<React.SetStateAction<boolean>>;
  currentOrderStatus: number;
  partsTotal: number;
}

export function CurrentPartsDataTable<TData, TValue>({
  columns,
  data,
  products,
  currentParts,
  setCurrentParts,
  setIsEdited,
  currentOrderStatus,
  partsTotal,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isAddingParts, setIsAddingParts] = useState(false);

  const [isDiscount, setIsDiscount] = useState(false);
  const [isAlreadyDiscount, setIsAlreadyDiscount] = useState(false);

  useEffect(() => {
    console.log(currentParts);
    let foundIndexDisc = currentParts?.findIndex((part) => {
      return part.discount && part.discount != 0;
    });
    console.log(currentParts![foundIndexDisc || 0], "HERE");
    console.log("FOUND INDEX", foundIndexDisc);
    setIsAlreadyDiscount(foundIndexDisc != -1);
  }, []);

  const deleteRow = (row: any) => {
    let arrayFirstHalf = currentParts!.slice(0, row.index);
    let arraySecondHalf = currentParts!.slice(row.index + 1);

    setCurrentParts([...arrayFirstHalf, ...arraySecondHalf]);
    setIsEdited(true);
  };

  const handleQuantityUpdate = (row: any, toUpdate: number) => {
    let arrayFirstHalf = currentParts!.slice(0, row.index);
    let arraySecondHalf = currentParts!.slice(row.index + 1);

    const partNumber = row.getValue("part_number");
    const prevQty = (row.getValue("quantity") as number) ?? 0;

    if (prevQty == 1 && toUpdate < 0) {
      return deleteRow(row);
    }

    let toUpdateQty = currentParts?.find(
      (part) => part.part_number == partNumber
    );

    let updatedObj;

    if (toUpdateQty) {
      if (toUpdate > 0) {
        updatedObj = updateTempPartObjQuantity(toUpdateQty, 1);
      } else {
        updatedObj = updateTempPartObjQuantity(toUpdateQty, -1);
      }

      setCurrentParts(
        [...arrayFirstHalf, updatedObj, ...arraySecondHalf].filter(
          (part): part is CurrentOrderPart => part !== undefined
        )
      );
      setIsEdited(true);
    } else {
      console.log("Some Error has Occured");
    }
  };

  const handleMRPUpdate = (row: any, mrp: number) => {
    let updatedObj;

    let arrayFirstHalf = currentParts!.slice(0, row.index);
    let arraySecondHalf = currentParts!.slice(row.index + 1);

    const partNumber = row.getValue("part_number");

    let toUpdateMRP = currentParts?.find(
      (part) => part.part_number == partNumber
    );

    if (mrp == 0) {
      if (toUpdateMRP) {
        updatedObj = createTempPartZeroObj(toUpdateMRP);
        console.log("INVALID VALUE - ", updatedObj);

        setCurrentParts(
          [...arrayFirstHalf, updatedObj, ...arraySecondHalf].filter(
            (part): part is CurrentOrderPart => part !== undefined
          )
        );
        setIsEdited(true);
      }
    } else {
      if (toUpdateMRP) {
        updatedObj = updateTempPartObjMRP(toUpdateMRP, mrp);

        setCurrentParts(
          [...arrayFirstHalf, updatedObj, ...arraySecondHalf].filter(
            (part): part is CurrentOrderPart => part !== undefined
          )
        );
        setIsEdited(true);
      } else {
        console.log("Some Error has Occured");
      }
    }
  };

  const handleAllDiscount = (discount: number) => {
    if (!currentParts) {
      return;
    }

    if (Number(discount) > 15) {
      toast("Discount More than 15% is not allowed");
      return;
    }

    // Prepare a new array with updated discount values
    const newArr: CurrentOrderPart[] = currentParts.map((part: any) => {
      if (discount === 0) {
        // Reset discountPercentage and amount if discount is cleared
        return removeTempPartObjDiscount(part);
      } else {
        // Apply the specified discount
        return updateTempPartObjDiscount(part, discount) || part;
      }
    });

    // Only update state if all parts are successfully updated
    if (newArr.length === currentParts.length) {
      setCurrentParts(newArr);
      setIsEdited(true);
    }
  };

  const removeAllDiscount = () => {
    let newArr: CurrentOrderPart[] = [];
    currentParts?.map((part: CurrentOrderPart) => {
      const updatedPartObj = removeTempPartObjDiscount(part);
      newArr.push(updatedPartObj!);
    });
    setCurrentParts([...newArr!]);
    setIsDiscount(false);
    // setIsEdited(true);
  };

  const handleDiscount = (row: any, discount: number) => {
    if (discount > 15) {
      toast("Discount more than 15% is not allowed");
      return;
    }

    const partNumber = row.getValue("part_number");
    const toUpdateDisc = currentParts?.find(
      (part) => part.part_number === partNumber
    );

    if (!toUpdateDisc) {
      console.log("Part not found or invalid part number");
      return;
    }

    let updatedObj;

    if (discount === 0) {
      // Reset discountPercentage to 0 and restore original amount
      updatedObj = removeTempPartObjDiscount(toUpdateDisc);
    } else {
      // Apply the discount using your helper function
      updatedObj = updateTempPartObjDiscount(toUpdateDisc, discount);
    }

    if (!updatedObj) {
      console.log("Failed to update discount. Check helper function.");
      return;
    }

    // Update the parts list with the modified part
    const arrayFirstHalf = currentParts!.slice(0, row.index);
    const arraySecondHalf = currentParts!.slice(row.index + 1);
    setCurrentParts([...arrayFirstHalf, updatedObj, ...arraySecondHalf]);
    setIsEdited(true);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex flex-col rounded-md border">
        <div className="flex flex-row justify-between items-center">
          <div className="font-semibold text-lg p-5">Parts</div>
          {
            <div className="flex flex-row space-x-5 mr-5 items-center">
              {currentOrderStatus == 1 && (
                <>
                  {isDiscount ? (
                    <div className="flex justify-around w-fit items-center space-x-3">
                      <Input
                        placeholder="Discount on All Parts"
                        type="number"
                        onChange={(event) =>
                          handleAllDiscount(Number(event.target.value))
                        }
                        className="max-w-sm"
                      />
                      <X onClick={removeAllDiscount} />
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="border border-red-500 text-red-500"
                      onClick={() => setIsDiscount((prev) => true)}
                    >
                      <Percent />
                    </Button>
                  )}
                </>
              )}
            </div>
          }
        </div>

        <Table className="border-b">
          <TableHeader className="bg-gray-100 w-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (
                    header.id != "quantity" &&
                    header.id != "amount" &&
                    header.id != "mrp" &&
                    header.column.id != "discount" &&
                    header.column.id != "total_amount"
                  ) {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  }
                })}
                <TableHead key={"handleMrp"} className="text-center">
                  Basic Price
                </TableHead>
                <TableHead key={"handleQuantity"} className="text-center">
                  Quantity
                </TableHead>
                {(isDiscount || isAlreadyDiscount) && (
                  <TableHead key={"DISCOUNT"} className="text-center">
                    Discount %
                  </TableHead>
                )}
                <TableHead key={"AMOUNT"}>Amount</TableHead>
                <TableHead key={"DELETE"}> </TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getCoreRowModel().rows?.length ? (
              table.getCoreRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    if (
                      cell.column.id != "quantity" &&
                      cell.column.id != "amount" &&
                      cell.column.id != "mrp" &&
                      cell.column.id != "discount" &&
                      cell.column.id != "total_amount"
                    ) {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    }
                  })}
                  <TableCell
                    key={"MRP"}
                    className="flex justify-center items-center h-full"
                  >
                    <Input
                      placeholder="%"
                      value={roundToTwoDecimals(row.getValue("mrp")) || 0}
                      type="number"
                      onChange={(event) => {
                        handleMRPUpdate(row, Number(event.target.value));
                        console.log(event.target.value);
                      }}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell key={"handleQuantity"} className="space-x-2">
                    <div className="flex flex-row justify-evenly w-full items-center space-x-2">
                      <Button
                        variant="link"
                        size="icon"
                        onClick={() => handleQuantityUpdate(row, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div>{row.getValue("quantity")}</div>
                      <Button
                        variant="link"
                        size="icon"
                        onClick={() => handleQuantityUpdate(row, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  {(isDiscount || isAlreadyDiscount) && (
                    <TableCell
                      key={"DISCOUNT"}
                      className="flex justify-center items-center h-full"
                    >
                      <Input
                        placeholder="%"
                        value={
                          roundToTwoDecimals(row.getValue("discount")) || 0
                        }
                        onChange={(event) =>
                          handleDiscount(row, Number(event.target.value))
                        }
                        className="w-10"
                      />
                    </TableCell>
                  )}

                  <TableCell key={"Amount"}>
                    {<>{roundToTwoDecimals(row.getValue("total_amount"))}</>}
                  </TableCell>

                  <TableCell key={"DELETE"}>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteRow(row)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
        <div className="flex p-2 justify-between items-center px-5">
          {isAddingParts ? (
            <div className="flex px-3 space-x-3">
              <SearchComponent
                items={products}
                setCurrentParts={setCurrentParts}
                currentParts={currentParts}
                setIsEdited={setIsEdited}
              />
              <Button
                variant="link"
                onClick={() => setIsAddingParts((prev) => false)}
              >
                <X />
              </Button>
            </div>
          ) : (
            <Button
              variant="link"
              onClick={() => setIsAddingParts((prev) => true)}
            >
              <div className="flex flex-row space-x-3 text-red-500 items-center">
                <div>+ Add Parts</div>
              </div>
            </Button>
          )}
          <div className="font-semibold text-gray-700">
            Total :{" "}
            <span className="ml-2 text-xl font-bold text-black mb-4">
              &#8377;{partsTotal}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
