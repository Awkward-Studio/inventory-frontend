import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { CurrentOrderPart, OrderPart } from "@/lib/types";
import {
  createTaxObj,
  roundToTwoDecimals,
  splitInsuranceAmt,
} from "@/lib/helper";

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 600,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    display: "flex",
    padding: "20px",
    fontFamily: "Open Sans",
  },
  headingRow: {
    width: "100%",
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontFamily: "Open Sans",
    fontWeight: "black",
    textAlign: "center",
  },
  addressRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 30,
  },
  addressBlock: {
    display: "flex",
    flexDirection: "column",
    width: "40%",
  },
  workShopName: {
    fontSize: 9,
    fontFamily: "Open Sans",
    fontWeight: "black",
    alignSelf: "flex-end",
  },
  workShopAddress: {
    fontSize: 9,
    fontFamily: "Open Sans",
    fontWeight: "thin",
    alignSelf: "flex-end",
    textAlign: "right",
  },
  workShopGST: {
    fontSize: 9,
    fontFamily: "Open Sans",
    fontWeight: "black",
    alignSelf: "flex-end",
  },
  invoiceTypeRow: {
    width: "100%",
    marginBottom: 10,
  },
  invoiceType: {
    fontSize: 14,
    fontFamily: "Open Sans",
    fontWeight: "black",
    textAlign: "center",
  },
  detailTablesRow: {
    width: "100%",
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  detailTable: {
    width: 180,
    height: "auto",
    borderWidth: 1.5,
    borderColor: "#000000",
  },
  tableTitleRow: {
    width: "100%",
    backgroundColor: "#D1D5DB",
    textAlign: "center",
  },
  tableTitle: {
    fontSize: 8,
    fontFamily: "Open Sans",
    fontWeight: "black",
    padding: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: "#000000",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  tableCell: {
    borderWidth: 0.5,
    borderColor: "#000000",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tableData: {
    fontSize: 8,
    padding: 5,
    display: "flex",
    flexWrap: "wrap",
    textAlign: "center",
  },
  tableDataEmphasized: {
    fontFamily: "Open Sans",
    fontWeight: "black",
  },
  partsTable: {
    width: "100%",
    height: "auto",
    minHeight: "6%",
    borderWidth: 1.5,
    borderColor: "#000000",
    marginBottom: 20,
  },
  tableHeaderRow: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#D1D5DB",
    width: "100%",
  },
  tableHeader: {
    borderWidth: 0.5,
    borderColor: "#000000",
    width: "100%",
    textAlign: "center",
    fontSize: 8,
  },
  tableFooterRow: {
    backgroundColor: "#D1D5DB",
    height: "auto",
  },
  tableEmptyCell: {
    width: "50%",
    minHeight: "auto",
  },
  footerRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  observationTable: {
    width: "40%",
    height: "auto",
    borderWidth: 1.5,
    borderColor: "#000000",
  },
  observationRow: {},
  totalsTable: {
    width: "50%",
    height: "auto",
    borderWidth: 1.5,
    borderColor: "#000000",
  },
  totalsTableRow: {
    display: "flex",
    flexDirection: "row",
  },
  totalsTableHeadingCell: {
    width: "60%",
    backgroundColor: "#D1D5DB",
    borderWidth: 0.5,
    borderColor: "#000000",
  },
  Maruti_Logo: {
    width: 100,
    height: 100,
  },
  logoView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  signBlock: {
    display: "flex",
    flexDirection: "column",
    width: "40%",
  },
  signName: {
    fontSize: 9,
    fontFamily: "Open Sans",
    fontWeight: "black",
    marginTop: 20,
    // alignSelf: "flex-end",
  },
  signAddress: {
    fontSize: 9,
    fontFamily: "Open Sans",
    fontWeight: "thin",
    // marginTop: 60,
    alignSelf: "flex-end",
  },

  signFooter: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "flex-start",
    // marginBottom: 20,
  },

  customerAcknowledgement: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    marginTop: 40,
  },

  customerAcknowledgementText: {
    fontSize: 8,
  },
  customerAcknowledgementHeading: {
    fontSize: 10,
    fontWeight: "black",
    marginBottom: 5,
    textDecoration: "underline",
  },
});

export const InvoicePDF = ({
  jobCard,
  parts,
  labour,
  logo,
  marutiLogo,
  car,
  currentDate,
  invoiceType,
  invoiceNumber,
  isInsurance,
  liabilityType,
}: any) => {
  let partsTotal = 0;
  let labourTotal = 0;

  let partsSubtotal = 0;
  let labourSubtotal = 0;

  let partsDiscount = 0;
  let labourDiscount = 0;

  let totalTax = 0;
  let totalDiscount = 0;

  let totalSubtotal = 0;
  let insuranceDetails;

  const dateTemp = new Date(currentDate);

  const day = String(dateTemp.getDate()).padStart(2, "0"); // Ensures 2 digits
  const month = String(dateTemp.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = dateTemp.getFullYear();

  // Combine into the desired format
  const formattedDate = `${day}-${month}-${year}`;

  if (isInsurance && invoiceType != "Quote") {
    insuranceDetails = JSON.parse(jobCard.insuranceDetails);
  }

  const taxObj = createTaxObj(parts, labour, isInsurance, liabilityType);

  parts.map((part: CurrentOrderPart) => {
    if (isInsurance && invoiceType != "Quote") {
      if (part.insurancePercentage && part.insurancePercentage != 0) {
        const splitPartAmount = splitInsuranceAmt(
          part.amount,
          part.insurancePercentage
        );

        const splitPartSubTotal = splitInsuranceAmt(
          part.subTotal,
          part.insurancePercentage
        );

        const splitPartCGST = splitInsuranceAmt(
          part.cgstAmt,
          part.insurancePercentage
        );

        const splitPartSGST = splitInsuranceAmt(
          part.sgstAmt,
          part.insurancePercentage
        );

        const splitPartTotalTax = splitInsuranceAmt(
          part.totalTax,
          part.insurancePercentage
        );

        if (liabilityType == "Customer") {
          part.amountCust = splitPartAmount.customerAmt;
          part.subTotalCust = splitPartSubTotal.customerAmt;
          part.cgstAmtCust = splitPartCGST.customerAmt;
          part.sgstAmtCust = splitPartSGST.customerAmt;
          part.totalTaxCust = splitPartTotalTax.customerAmt;

          partsTotal = partsTotal + part.amountCust;
          totalTax = totalTax + part.totalTaxCust;
          totalSubtotal = totalSubtotal + part.subTotalCust;
          partsSubtotal = partsSubtotal + part.subTotalCust;
        } else {
          part.amountIns = splitPartAmount.insuranceAmt;
          part.subTotalIns = splitPartSubTotal.insuranceAmt;
          part.cgstAmtIns = splitPartCGST.insuranceAmt;
          part.sgstAmtIns = splitPartSGST.insuranceAmt;
          part.totalTaxIns = splitPartTotalTax.insuranceAmt;

          partsTotal = partsTotal + part.amountIns;
          totalTax = totalTax + part.totalTaxIns;
          totalSubtotal = totalSubtotal + part.subTotalIns;
          partsSubtotal = partsSubtotal + part.subTotalIns;
        }

        if (
          part.discountPercentage &&
          part.discountAmt &&
          part.discountPercentage != 0
        ) {
          const splitPartDiscAmt = splitInsuranceAmt(
            part.discountAmt,
            part.insurancePercentage
          );

          if (liabilityType == "Customer") {
            part.discountAmtCust = splitPartDiscAmt.customerAmt;

            totalDiscount = totalDiscount + part.discountAmtCust;
            partsDiscount = partsDiscount + part.discountAmtCust;
          } else {
            part.discountAmtIns = splitPartDiscAmt.insuranceAmt;

            totalDiscount = totalDiscount + part.discountAmtIns;
            partsDiscount = partsDiscount + part.discountAmtIns;
          }
        }
      } else {
        if (liabilityType == "Customer") {
          partsTotal = partsTotal + part.amount;
          totalTax = totalTax + part.totalTax;

          totalSubtotal = totalSubtotal + part.subTotal;
          partsSubtotal = partsSubtotal + part.subTotal;
          // totalDiscount = totalDiscount + part.discountAmt

          if (
            part.discountPercentage &&
            part.discountAmt &&
            part.discountPercentage != 0
          ) {
            totalDiscount = totalDiscount + part.discountAmt;
            partsDiscount = partsDiscount + part.discountAmt;
          }
        }
      }
    } else {
      partsTotal = partsTotal + part.amount;
      totalTax = totalTax + part.totalTax;
      totalSubtotal = totalSubtotal + part.subTotal;
      partsSubtotal = partsSubtotal + part.subTotal;

      if (
        part.discountPercentage &&
        part.discountAmt &&
        part.discountPercentage != 0
      ) {
        totalDiscount = totalDiscount + part.discountAmt;
        partsDiscount = partsDiscount + part.discountAmt;
      }
    }
  });

  partsTotal = roundToTwoDecimals(partsTotal);
  totalTax = roundToTwoDecimals(totalTax);
  totalDiscount = roundToTwoDecimals(totalDiscount);
  totalSubtotal = roundToTwoDecimals(totalSubtotal);
  partsSubtotal = roundToTwoDecimals(partsSubtotal - partsDiscount);
  partsDiscount = roundToTwoDecimals(partsDiscount);

  return (
    <Document>
      {jobCard && car && parts && labour && (
        <>
          <Page size="A4" style={styles.page}>
            <View style={styles.addressRow}>
              <View style={styles.logoView}>
                <Image
                  style={styles.Maruti_Logo}
                  src={marutiLogo}
                  alt-text={".."}
                />
                <Image style={styles.logo} src={logo} alt-text={".."} />
              </View>
              <View style={styles.addressBlock}>
                <Text style={styles.workShopName}>
                  Chamunda Motors Pvt. Ltd.
                </Text>
                <Text style={styles.workShopAddress}>
                  21/1-1, Ram Baugh, Off SV Road,
                  <br />
                  Borivali (West), Mumbai Suburban
                </Text>
                <Text style={styles.workShopGST}>GST NO: 27AAACC1903H1Z4</Text>
              </View>
            </View>
            <View style={styles.invoiceTypeRow}>
              <Text style={styles.invoiceType}>
                {isInsurance ? <Text>{liabilityType}</Text> : <></>}
                <Text> </Text>
                {invoiceType}
              </Text>
            </View>
            <View style={styles.detailTablesRow}>
              <View style={styles.detailTable}>
                <View style={styles.tableTitleRow}>
                  <Text style={styles.tableTitle}>Customer Details</Text>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text
                      style={[styles.tableData, styles.tableDataEmphasized]}
                    >
                      Name:
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableData}>
                      {/* {jobCard.customerName} */}
                      {isInsurance && invoiceType != "Quote" ? (
                        <>
                          {liabilityType == "Customer" ? (
                            <>{jobCard.customerName}</>
                          ) : (
                            <>{insuranceDetails.policyProvider || ""}</>
                          )}
                        </>
                      ) : (
                        <>{jobCard.customerName}</>
                      )}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text
                      style={[styles.tableData, styles.tableDataEmphasized]}
                    >
                      Mobile:
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableData}>
                      {isInsurance && invoiceType != "Quote" ? (
                        <>
                          {liabilityType == "Customer" ? (
                            <>{jobCard.customerPhone}</>
                          ) : (
                            <>-</>
                          )}
                        </>
                      ) : (
                        <>{jobCard.customerPhone}</>
                      )}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text
                      style={[styles.tableData, styles.tableDataEmphasized]}
                    >
                      Address:
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableData}>
                      {isInsurance && invoiceType != "Quote" ? (
                        <>
                          {liabilityType == "Customer" ? (
                            <>{jobCard.customerAddress}</>
                          ) : (
                            <>{insuranceDetails.policyProviderAddress}</>
                          )}
                        </>
                      ) : (
                        <>{jobCard.customerAddress}</>
                      )}
                    </Text>
                  </View>
                </View>
                {isInsurance && invoiceType != "Quote" ? (
                  <>
                    {liabilityType == "Customer" ? (
                      <>
                        {jobCard.gstin && (
                          <>
                            <View style={styles.tableRow}>
                              <View style={styles.tableCell}>
                                <Text
                                  style={[
                                    styles.tableData,
                                    styles.tableDataEmphasized,
                                  ]}
                                >
                                  GST Number:
                                </Text>
                              </View>
                              <View style={styles.tableCell}>
                                <Text style={styles.tableData}>
                                  {jobCard.gstin}
                                </Text>
                              </View>
                            </View>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <View style={styles.tableRow}>
                          <View style={styles.tableCell}>
                            <Text
                              style={[
                                styles.tableData,
                                styles.tableDataEmphasized,
                              ]}
                            >
                              GST Number:
                            </Text>
                          </View>
                          <View style={styles.tableCell}>
                            <Text style={styles.tableData}>
                              {insuranceDetails.policyProviderGST}
                            </Text>
                          </View>
                        </View>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {jobCard.gstin && (
                      <>
                        <View style={styles.tableRow}>
                          <View style={styles.tableCell}>
                            <Text
                              style={[
                                styles.tableData,
                                styles.tableDataEmphasized,
                              ]}
                            >
                              GST Number:
                            </Text>
                          </View>
                          <View style={styles.tableCell}>
                            <Text style={styles.tableData}>
                              {jobCard.gstin}
                            </Text>
                          </View>
                        </View>
                      </>
                    )}
                  </>
                )}
              </View>
              <View style={styles.detailTable}>
                <View style={styles.tableTitleRow}>
                  <Text style={styles.tableTitle}>Vehicle Details</Text>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text
                      style={[styles.tableData, styles.tableDataEmphasized]}
                    >
                      Registration:
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableData}> {jobCard?.carNumber}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text
                      style={[styles.tableData, styles.tableDataEmphasized]}
                    >
                      Make:
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableData}> {car?.carMake}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text
                      style={[styles.tableData, styles.tableDataEmphasized]}
                    >
                      Model:
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableData}>{car?.carModel}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text
                      style={[styles.tableData, styles.tableDataEmphasized]}
                    >
                      Odometer:
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableData}>{jobCard.carOdometer}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.detailTable}>
                <View style={styles.tableTitleRow}>
                  <Text style={styles.tableTitle}>Invoice Details</Text>
                </View>
                {invoiceType == "Tax Invoice" && (
                  <>
                    <View style={styles.tableRow}>
                      <View style={styles.tableCell}>
                        <Text
                          style={[styles.tableData, styles.tableDataEmphasized]}
                        >
                          Invoice No:
                        </Text>
                      </View>
                      <View style={styles.tableCell}>
                        <Text style={styles.tableData}>{invoiceNumber}</Text>
                      </View>
                    </View>
                  </>
                )}

                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text
                      style={[styles.tableData, styles.tableDataEmphasized]}
                    >
                      Invoice Date:
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableData}>{formattedDate}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text
                      style={[styles.tableData, styles.tableDataEmphasized]}
                    >
                      Job Card No:
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableData}>
                      {jobCard.jobCardNumber}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text
                      style={[styles.tableData, styles.tableDataEmphasized]}
                    >
                      Service Type:
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableData}>
                      {jobCard.purposeOfVisit}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.partsTable} wrap={true}>
              <View style={styles.tableTitleRow} wrap={false}>
                <Text style={styles.tableTitle}>Parts</Text>
              </View>
              <View style={styles.tableHeaderRow} wrap={false}>
                <View style={[styles.tableHeader, { width: "5%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    Sr.
                  </Text>
                </View>
                <View style={[styles.tableHeader, { width: "20%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    Part No.
                  </Text>
                </View>
                <View style={[styles.tableHeader, { width: "30%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    Name
                  </Text>
                </View>
                <View style={[styles.tableHeader, { width: "5%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    Tax
                  </Text>
                </View>
                <View style={[styles.tableHeader, { width: "10%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    HSN
                  </Text>
                </View>
                <View style={[styles.tableHeader, { width: "5%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    Qty
                  </Text>
                </View>
                <View style={[styles.tableHeader, { width: "10%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    Rate
                  </Text>
                </View>
                <View style={[styles.tableHeader, { width: "5%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    Disc
                  </Text>
                </View>
                <View style={[styles.tableHeader, { width: "10%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    Amount
                  </Text>
                </View>
              </View>
              {parts.map((part: CurrentPart, index: number) => (
                <View key={index} style={styles.tableRow} wrap={false}>
                  <View style={[styles.tableCell, { width: "5%" }]}>
                    <Text style={styles.tableData}>{index + 1}.</Text>
                  </View>
                  <View style={[styles.tableCell, { width: "20%" }]}>
                    <Text style={styles.tableData}>{part.partNumber}</Text>
                  </View>
                  <View style={[styles.tableCell, { width: "30%" }]}>
                    <Text style={styles.tableData}>{part.partName}</Text>
                  </View>
                  <View style={[styles.tableCell, { width: "5%" }]}>
                    <Text style={styles.tableData}>{part.gst}</Text>
                  </View>
                  <View style={[styles.tableCell, { width: "10%" }]}>
                    <Text style={styles.tableData}>{part.hsn}</Text>
                  </View>
                  <View style={[styles.tableCell, { width: "5%" }]}>
                    <Text style={styles.tableData}>{part.quantity}</Text>
                  </View>
                  <View style={[styles.tableCell, { width: "10%" }]}>
                    <Text style={styles.tableData}>{part.mrp}</Text>
                  </View>
                  <View style={[styles.tableCell, { width: "5%" }]}>
                    <Text style={styles.tableData}>
                      {part.discountPercentage}
                    </Text>
                  </View>
                  <View style={[styles.tableCell, { width: "10%" }]}>
                    <Text style={styles.tableData}>
                      {isInsurance && invoiceType != "Quote" ? (
                        <>
                          {part.insurancePercentage &&
                          part.insurancePercentage != 0 ? (
                            <>
                              {liabilityType == "Customer" ? (
                                <>
                                  {part.discountAmt &&
                                  part.discountPercentage != 0 ? (
                                    <>
                                      {roundToTwoDecimals(
                                        Number(part.subTotalCust) -
                                          Number(part.discountAmtCust)
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {roundToTwoDecimals(
                                        Number(part.subTotalCust)
                                      )}
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  {part.discountAmt &&
                                  part.discountPercentage != 0 ? (
                                    <>
                                      {roundToTwoDecimals(
                                        Number(part.subTotalIns) -
                                          Number(part.discountAmtIns)
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {roundToTwoDecimals(
                                        Number(part.subTotalIns)
                                      )}
                                    </>
                                  )}
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              {liabilityType == "Customer" ? (
                                <>
                                  {part.discountAmt &&
                                  part.discountPercentage != 0 ? (
                                    <>
                                      {roundToTwoDecimals(
                                        Number(part.subTotal) -
                                          Number(part.discountAmt)
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {roundToTwoDecimals(
                                        Number(part.subTotal)
                                      )}
                                    </>
                                  )}
                                </>
                              ) : (
                                <>0</>
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {part.discountAmt && part.discountPercentage != 0 ? (
                            <>
                              {roundToTwoDecimals(
                                Number(part.subTotal) - Number(part.discountAmt)
                              )}
                            </>
                          ) : (
                            <>{roundToTwoDecimals(Number(part.subTotal))}</>
                          )}
                        </>
                      )}
                    </Text>
                  </View>
                </View>
              ))}
              <View
                style={[styles.tableRow, styles.tableFooterRow]}
                wrap={false}
              >
                <View
                  style={[
                    styles.tableEmptyCell,
                    { width: "10%", textOverflow: "ellipsis" },
                  ]}
                >
                  <Text style={styles.tableData}></Text>
                </View>
                <View style={[styles.tableEmptyCell, { width: "10%" }]}>
                  <Text style={styles.tableData}></Text>
                </View>
                <View style={[styles.tableEmptyCell, { width: "10%" }]}>
                  <Text style={styles.tableData}></Text>
                </View>
                <View style={[styles.tableEmptyCell, { width: "10%" }]}>
                  <Text style={styles.tableData}></Text>
                </View>
                <View style={[styles.tableEmptyCell, { width: "10%" }]}>
                  <Text style={styles.tableData}></Text>
                </View>
                <View style={[styles.tableEmptyCell, { width: "10%" }]}>
                  <Text style={styles.tableData}></Text>
                </View>
                <View style={[styles.tableEmptyCell, { width: "20%" }]}>
                  <Text style={styles.tableData}></Text>
                </View>
                <View
                  style={[
                    styles.tableEmptyCell,
                    { width: "10%", textOverflow: "ellipsis" },
                  ]}
                >
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    SubTotal
                  </Text>
                </View>
                <View
                  style={[
                    styles.tableCell,
                    { width: "10%", textOverflow: "ellipsis" },
                  ]}
                >
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    {partsSubtotal}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.partsTable} wrap={true}>
              <View style={styles.tableTitleRow} wrap={false}>
                <Text style={styles.tableTitle}>Labour</Text>
              </View>
              <View style={styles.tableHeaderRow} wrap={false}>
                <View style={[styles.tableHeader, { width: "5%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    Sr
                  </Text>
                </View>
                <View style={[styles.tableHeader, { width: "20%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    Labour Code
                  </Text>
                </View>
                <View style={[styles.tableHeader, { width: "30%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    Name
                  </Text>
                </View>
                <View style={[styles.tableHeader, { width: "5%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    Tax
                  </Text>
                </View>
                <View style={[styles.tableHeader, { width: "10%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    HSN
                  </Text>
                </View>
                <View style={[styles.tableHeader, { width: "5%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    Qty
                  </Text>
                </View>
                <View style={[styles.tableHeader, { width: "10%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    Rate
                  </Text>
                </View>
                <View style={[styles.tableHeader, { width: "5%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    Disc
                  </Text>
                </View>
                <View style={[styles.tableHeader, { width: "10%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    Amount
                  </Text>
                </View>
              </View>
              {labour.map((work: CurrentLabour, index: number) => (
                <View key={index} style={styles.tableRow} wrap={false}>
                  <View style={[styles.tableCell, { width: "5%" }]}>
                    <Text style={styles.tableData}>{index + 1}.</Text>
                  </View>
                  <View style={[styles.tableCell, { width: "20%" }]}>
                    <Text style={styles.tableData}>{work.labourCode}</Text>
                  </View>
                  <View style={[styles.tableCell, { width: "30%" }]}>
                    <Text style={styles.tableData}>{work.labourName}</Text>
                  </View>
                  <View style={[styles.tableCell, { width: "5%" }]}>
                    <Text style={styles.tableData}>{work.gst}</Text>
                  </View>
                  <View style={[styles.tableCell, { width: "10%" }]}>
                    <Text style={styles.tableData}>{work.hsn}</Text>
                  </View>
                  <View style={[styles.tableCell, { width: "5%" }]}>
                    <Text style={styles.tableData}>{work.quantity}</Text>
                  </View>
                  <View style={[styles.tableCell, { width: "10%" }]}>
                    <Text style={styles.tableData}>{work.mrp}</Text>
                  </View>
                  <View style={[styles.tableCell, { width: "5%" }]}>
                    <Text style={styles.tableData}>
                      {work.discountPercentage}
                    </Text>
                  </View>
                  <View style={[styles.tableCell, { width: "10%" }]}>
                    <Text style={styles.tableData}>
                      {isInsurance && invoiceType != "Quote" ? (
                        <>
                          {work.insurancePercentage &&
                          work.insurancePercentage != 0 ? (
                            <>
                              {liabilityType == "Customer" ? (
                                <>
                                  {work.discountAmt &&
                                  work.discountPercentage != 0 ? (
                                    <>
                                      {roundToTwoDecimals(
                                        Number(work.subTotalCust) -
                                          Number(work.discountAmtCust)
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {roundToTwoDecimals(
                                        Number(work.subTotalCust)
                                      )}
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  {work.discountAmt &&
                                  work.discountPercentage != 0 ? (
                                    <>
                                      {roundToTwoDecimals(
                                        Number(work.subTotalIns) -
                                          Number(work.discountAmtIns)
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {roundToTwoDecimals(
                                        Number(work.subTotalIns)
                                      )}
                                    </>
                                  )}
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              {liabilityType == "Customer" ? (
                                <>
                                  {work.discountAmt &&
                                  work.discountPercentage != 0 ? (
                                    <>
                                      {roundToTwoDecimals(
                                        Number(work.subTotal) -
                                          Number(work.discountAmt)
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {roundToTwoDecimals(
                                        Number(work.subTotal)
                                      )}
                                    </>
                                  )}
                                </>
                              ) : (
                                <>0</>
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {work.discountAmt && work.discountPercentage != 0 ? (
                            <>
                              {roundToTwoDecimals(
                                Number(work.subTotal) - Number(work.discountAmt)
                              )}
                            </>
                          ) : (
                            <>{roundToTwoDecimals(Number(work.subTotal))}</>
                          )}
                        </>
                      )}
                    </Text>
                  </View>
                </View>
              ))}
              <View
                style={[styles.tableRow, styles.tableFooterRow]}
                wrap={false}
              >
                <View style={[styles.tableEmptyCell, { width: "10%" }]}>
                  <Text style={styles.tableData}></Text>
                </View>
                <View style={[styles.tableEmptyCell, { width: "10%" }]}>
                  <Text style={styles.tableData}></Text>
                </View>
                <View style={[styles.tableEmptyCell, { width: "10%" }]}>
                  <Text style={styles.tableData}></Text>
                </View>
                <View style={[styles.tableEmptyCell, { width: "10%" }]}>
                  <Text style={styles.tableData}></Text>
                </View>
                <View style={[styles.tableEmptyCell, { width: "10%" }]}>
                  <Text style={styles.tableData}></Text>
                </View>
                <View style={[styles.tableEmptyCell, { width: "10%" }]}>
                  <Text style={styles.tableData}></Text>
                </View>
                <View style={[styles.tableEmptyCell, { width: "20%" }]}>
                  <Text style={styles.tableData}></Text>
                </View>
                <View style={[styles.tableEmptyCell, { width: "10%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    SubTotal
                  </Text>
                </View>
                <View style={[styles.tableCell, { width: "10%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    {labourSubtotal}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.partsTable} wrap={true}>
              <View style={styles.tableTitleRow} wrap={false}>
                <Text style={styles.tableTitle}>Taxes</Text>
              </View>
              <View style={styles.tableHeaderRow} wrap={false}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    Tax Type
                  </Text>
                </View>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    Tax Rate
                  </Text>
                </View>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    Tax Name
                  </Text>
                </View>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    Tax Amount
                  </Text>
                </View>
              </View>
              {taxObj.map((obj: any, index) => (
                <View key={index} style={styles.tableRow} wrap={false}>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableData}>
                      {obj.taxType == "GOODS" ? (
                        <>
                          <Text style={styles.tableData}>PARTS</Text>
                        </>
                      ) : (
                        <>
                          <Text style={styles.tableData}>LABOUR</Text>
                        </>
                      )}
                      .
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableData}>{obj.taxRate}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableData}>{obj.taxName}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableData}>{obj.taxAmt}</Text>
                  </View>
                </View>
              ))}
              <View
                style={[styles.tableRow, styles.tableFooterRow]}
                wrap={false}
              >
                <View style={[styles.tableEmptyCell, { width: "10%" }]}>
                  <Text style={styles.tableData}></Text>
                </View>
                <View style={[styles.tableEmptyCell, { width: "10%" }]}>
                  <Text style={styles.tableData}></Text>
                </View>
                <View style={[styles.tableEmptyCell, { width: "10%" }]}>
                  <Text style={styles.tableData}></Text>
                </View>
                <View style={[styles.tableEmptyCell, { width: "10%" }]}>
                  <Text style={styles.tableData}></Text>
                </View>
                <View style={[styles.tableEmptyCell, { width: "10%" }]}>
                  <Text style={styles.tableData}></Text>
                </View>
                <View style={[styles.tableEmptyCell, { width: "10%" }]}>
                  <Text style={styles.tableData}></Text>
                </View>
                <View style={[styles.tableEmptyCell, { width: "5%" }]}>
                  <Text style={styles.tableData}></Text>
                </View>
                <View style={[styles.tableEmptyCell, { width: "10%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    Tax Total
                  </Text>
                </View>
                <View style={[styles.tableCell, { width: "25%" }]}>
                  <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                    {totalTax}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.footerRow} wrap={false}>
              <View style={styles.observationTable}>
                <View style={styles.tableTitleRow}>
                  <Text style={styles.tableTitle}>Observation and Remarks</Text>
                </View>
                <View style={styles.observationRow}>
                  <Text style={styles.tableData}>
                    {jobCard.observationRemarks && (
                      <>{jobCard.observationRemarks}</>
                    )}
                  </Text>
                </View>
              </View>
              <View style={styles.totalsTable}>
                <View style={styles.totalsTableRow}>
                  <View style={styles.totalsTableHeadingCell}>
                    <Text
                      style={[styles.tableData, styles.tableDataEmphasized]}
                    >
                      Total Taxable Value:
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableData}>
                      {roundToTwoDecimals(totalSubtotal - totalDiscount)}
                    </Text>
                  </View>
                </View>
                <View style={styles.totalsTableRow}>
                  <View style={styles.totalsTableHeadingCell}>
                    <Text
                      style={[styles.tableData, styles.tableDataEmphasized]}
                    >
                      Total GST Amount:
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableData}>{totalTax}</Text>
                  </View>
                </View>
                <View style={styles.totalsTableRow}>
                  <View style={styles.totalsTableHeadingCell}>
                    <Text
                      style={[styles.tableData, styles.tableDataEmphasized]}
                    >
                      TOTAL:
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableData}>
                      {roundToTwoDecimals(
                        totalSubtotal - totalDiscount + totalTax
                      )}
                    </Text>
                  </View>
                </View>
                <View style={styles.totalsTableRow}>
                  <View style={styles.totalsTableHeadingCell}>
                    <Text
                      style={[styles.tableData, styles.tableDataEmphasized]}
                    >
                      TOTAL (rounded off):
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableData}>
                      {Math.round(
                        roundToTwoDecimals(
                          totalSubtotal - totalDiscount + totalTax
                        )
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {invoiceType == "Tax Invoice" ||
              (invoiceType == "Pro-Forma Invoice" && (
                <>
                  <View style={styles.customerAcknowledgement} wrap={false}>
                    <Text style={styles.customerAcknowledgementHeading}>
                      Customer Acknowledgement
                    </Text>
                    <Text style={styles.customerAcknowledgementText}>
                      I/We acknowledge that the work being done on my car, as
                      well as the associated costs, were explained to me. I have
                      recieved my vehicle after all repairs have been made to my
                      satisfaction , and I hearby confirm that it is in good
                      condition
                    </Text>
                    <Text style={styles.customerAcknowledgementText}>
                      I/We further authorise Chamunda Motors and its employees
                      to contact me through any channel (Call, SMS, etc.) for
                      service reminders, feedback, product promotion, queries
                      and any other legal purposes
                    </Text>
                    <Text
                      style={[
                        styles.customerAcknowledgementText,
                        { marginTop: 30, alignSelf: "flex-start" },
                      ]}
                    >
                      (Customer Signature)
                    </Text>
                  </View>
                </>
              ))}

            <View style={styles.addressRow} wrap={false}>
              <View style={[styles.signBlock, { marginTop: 20 }]}>
                <Text style={[styles.signName, { marginTop: 60 }]}>
                  For Chamunda Motors Pvt. Ltd.
                </Text>
                <Text
                  style={[
                    styles.signAddress,
                    { marginTop: 60, alignSelf: "flex-start" },
                  ]}
                >
                  (Authorized Signatory)
                </Text>
              </View>
              {invoiceType == "Tax Invoice" && (
                <>
                  <View
                    style={[
                      styles.signBlock,
                      { marginTop: 20, alignSelf: "flex-end" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.signName,
                        { marginTop: 60, alignSelf: "flex-end" },
                      ]}
                    >
                      Chamunda Motors Pvt. Ltd.
                    </Text>
                    <View>
                      <Text style={styles.signAddress}>
                        Punjab National Bank
                      </Text>
                      <Text style={styles.signAddress}>
                        S.V. Road, Borivali West
                      </Text>
                      <Text style={styles.signAddress}>
                        Ac No. : 02874010000070
                      </Text>
                      <Text style={styles.signAddress}>
                        IFSC Code : PUNB0028710
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </Page>
        </>
      )}
    </Document>
  );
};
