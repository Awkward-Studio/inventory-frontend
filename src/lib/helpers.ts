import { Product, CurrentOrderPart, OrderPart } from "./types";

export const createTempPartObj = (item: Product) => {
    if (item) {
      let tempSubTotal = roundToTwoDecimals(getSubTotal(item.mrp ?? 0, 1));
      let tempCgstAmt = roundToTwoDecimals(getTaxAmount(tempSubTotal, item.cgst ?? 0));
      let tempSgstAmt = roundToTwoDecimals(getTaxAmount(tempSubTotal, item.sgst ?? 0));
  
      let returnObj: CurrentOrderPart = {
        part_id: item.id,
        part_name: item.name,
        part_number: item.sku ?? "",
        mrp: item.mrp,
        gst: item.gst,
        hsn: item.hsn ?? "",
        cgst: item.cgst ?? 0,
        sgst: item.sgst ?? 0,
        quantity: 1,
        discount: 0,
        sub_total: tempSubTotal,
        cgstAmt: tempCgstAmt,
        sgstAmt: tempSgstAmt,
        total_tax: tempCgstAmt + tempSgstAmt,
        total_amount: tempSubTotal + tempCgstAmt + tempSgstAmt,
      };
  
      return returnObj;
    }
  };

  export const createTempPartZeroObj = (item: CurrentOrderPart) => {
    if (item) {
      item.total_amount = 0;
      item.sgstAmt = 0;
      item.mrp = 0;
      item.sub_total = 0;
      item.total_tax = 0;
      item.cgstAmt = 0;
  
      return item;
    }
  };


  export const removeTempPartObjDiscount = (currentPartObj: CurrentOrderPart) => {
    if (currentPartObj) {
      let tempSubTotal = currentPartObj.sub_total;
      let tempCgstAmt = roundToTwoDecimals(
        getTaxAmount(tempSubTotal, currentPartObj.cgst)
      );
      let tempSgstAmt = roundToTwoDecimals(
        getTaxAmount(tempSubTotal, currentPartObj.sgst)
      );
  
      currentPartObj.discount = 0;
      currentPartObj.discountAmt = 0;
      currentPartObj.cgstAmt = tempCgstAmt;
      currentPartObj.sgstAmt = tempSgstAmt;
      currentPartObj.total_tax = tempCgstAmt + tempSgstAmt;
      currentPartObj.total_amount = tempSubTotal + tempCgstAmt + tempSgstAmt;
  
      return currentPartObj;
    }
  };
  export const updateTempPartObjDiscount = (
    currentPartObj: CurrentOrderPart,
    discount: number
  ) => {
    if (currentPartObj && discount) {
      let actualSubTotal = roundToTwoDecimals(
        getSubTotal(currentPartObj.mrp, currentPartObj.quantity)
      );
      let discountAmt = roundToTwoDecimals(
        getDiscount(actualSubTotal, discount)
      );
      let tempSubTotal = roundToTwoDecimals(
        actualSubTotal - discountAmt
      );
      let tempCgstAmt = roundToTwoDecimals(
        getTaxAmount(tempSubTotal, currentPartObj.cgst)
      );
      let tempSgstAmt = roundToTwoDecimals(
        getTaxAmount(tempSubTotal, currentPartObj.sgst)
      );
  
      // console.log("TEMP OBJECTS = ", tempSubTotal, tempCgstAmt, tempSgstAmt);
  
      currentPartObj.discount = discount;
      currentPartObj.discountAmt = discountAmt;
      currentPartObj.cgstAmt = tempCgstAmt;
      currentPartObj.sgstAmt = tempSgstAmt;
      currentPartObj.total_tax = tempCgstAmt + tempSgstAmt;
      currentPartObj.total_amount = tempSubTotal + tempCgstAmt + tempSgstAmt;
  
      return currentPartObj;
    }
  };

  export const updateTempPartObjQuantity = (
    currentPartObj: CurrentOrderPart,
    quantity: number
  ) => {
    if (currentPartObj && quantity) {
      let newQuantity;
  
      if (quantity > 0) {
        newQuantity = currentPartObj.quantity + 1;
      } else {
        newQuantity = currentPartObj.quantity - 1;
      }
  
      let tempSubTotal, actualSubTotal;
  
      if (
        currentPartObj.discount &&
        currentPartObj.discount > 0
      ) {
        actualSubTotal = roundToTwoDecimals(
          getSubTotal(currentPartObj.mrp, newQuantity)
        );
        let discountAmt = roundToTwoDecimals(
          getDiscount(actualSubTotal, currentPartObj.discount)
        );
  
        tempSubTotal = actualSubTotal - discountAmt;
        currentPartObj.discountAmt = discountAmt;
      } else {
        actualSubTotal = roundToTwoDecimals(
          getSubTotal(currentPartObj.mrp, newQuantity)
        );
        tempSubTotal = actualSubTotal;
      }
      let tempCgstAmt = roundToTwoDecimals(
        getTaxAmount(tempSubTotal, currentPartObj.cgst)
      );
      let tempSgstAmt = roundToTwoDecimals(
        getTaxAmount(tempSubTotal, currentPartObj.sgst)
      );

  
      currentPartObj.quantity = newQuantity;
      currentPartObj.sub_total = actualSubTotal;
      currentPartObj.cgstAmt = tempCgstAmt;
      currentPartObj.sgstAmt = tempSgstAmt;
      currentPartObj.total_tax = tempCgstAmt + tempSgstAmt;
      currentPartObj.total_amount = tempSubTotal + tempCgstAmt + tempSgstAmt;
  
      return currentPartObj;
    }
  };
  
  export const updateTempPartObjMRP = (
    currentPartObj: CurrentOrderPart,
    mrp: number
  ) => {
    if (currentPartObj && mrp) {
  
      let tempSubTotal, actualSubTotal;
  
      if (
        currentPartObj.discount &&
        currentPartObj.discount > 0
      ) {
      
        actualSubTotal = roundToTwoDecimals(
          getSubTotal(mrp, currentPartObj.quantity)
        );
        let discountAmt = roundToTwoDecimals(
          getDiscount(actualSubTotal, currentPartObj.discount)
        );
  
        tempSubTotal = actualSubTotal - discountAmt;
        currentPartObj.discountAmt = discountAmt;
      } else {
        actualSubTotal = roundToTwoDecimals(
          getSubTotal(mrp, currentPartObj.quantity)
        );
        tempSubTotal = actualSubTotal;
      }
      let tempCgstAmt = roundToTwoDecimals(
        getTaxAmount(tempSubTotal, currentPartObj.cgst)
      );
      let tempSgstAmt = roundToTwoDecimals(
        getTaxAmount(tempSubTotal, currentPartObj.sgst)
      );
  
      currentPartObj.mrp = mrp;
      currentPartObj.sub_total = actualSubTotal;
      currentPartObj.cgstAmt = tempCgstAmt;
      currentPartObj.sgstAmt = tempSgstAmt;
      currentPartObj.total_tax = tempCgstAmt + tempSgstAmt;
      currentPartObj.total_amount = tempSubTotal + tempCgstAmt + tempSgstAmt;
  
      return currentPartObj;
    }
  };    

  export const roundToTwoDecimals = (num: number) => {
    let number = Number(num);
  
    return parseFloat(number.toFixed(2));
  };

  export function preciseOperation(operation: string, ...numbers: number[]) {
    const result = numbers.reduce((acc, num) => {
      if (operation === "add") {
        return acc + num;
      } else if (operation === "subtract") {
        return acc - num;
      }
      throw new Error("Unsupported operation. Use 'add' or 'subtract'.");
    }, 0);
  
    return parseFloat((result + Number.EPSILON).toFixed(2));
  }
  
  export const getSubTotal = (mrp: number, quantity: number) => {
    return mrp * quantity;
  };
  
  export const getTaxAmount = (subTotal: number, rate: number) => {
    return roundToTwoDecimals(subTotal * (rate / 100));
  };
  
  export const getDiscount = (subTotal: number, rate: number) => {
    return roundToTwoDecimals(subTotal * (rate / 100));
  };

  export const convertOrderPartsToCurrentOrderParts = (orderParts: OrderPart[]): CurrentOrderPart[] => {
    const x = orderParts.map(({ 
      id, order, part_id, part_name, part_number, hsn, quantity, 
      mrp, discount, sub_total, total_tax, total_amount, gst, cgst, sgst,
    }) => ({
      id,
      order,
      part_id,
      part_name,
      part_number,
      hsn,
      quantity,
      mrp,
      sub_total,
      total_tax,
      total_amount,
      gst,
      cgst,
      sgst,
      discountPercentage: Number(discount),
      cgstAmt: 0,
      sgstAmt: 0,
    }));

    return x;
  };
  