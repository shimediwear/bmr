'use client';

import React from 'react';
import { Document as PDFDocument, Page as PDFPage, Text as PDFText, View as PDFView, StyleSheet, Font, Image as PDFImage } from '@react-pdf/renderer';
import { BMRData, KitProcessItem, ProcessStep, KitContent, RawMaterial, PackingMaterial } from '@/lib/types';

// Cast components to any to resolve React 19 JSX compatibility issues
const Document = PDFDocument as any;
const Page = PDFPage as any;
const Text = PDFText as any;
const View = PDFView as any;
const Image = PDFImage as any;
// Register fonts if needed, but standard fonts are fine for now

const styles = StyleSheet.create({
    page: {
        paddingTop: 160,
        paddingBottom: 60,
        paddingHorizontal: 30,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    header: {
        position: 'absolute',
        top: 20,
        left: 30,
        right: 30,
        height: 140,
        borderBottom: 2,
        borderBottomColor: 'black',
        paddingBottom: 5,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoBox: {
        width: '20%',
        height: 60,
        borderWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
    },
    logoText: {
        fontSize: 8,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    headerCenter: {
        width: '55%',
        textAlign: 'center',
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    companyName: {
        fontSize: 10,
        fontWeight: 'bold',
        marginVertical: 2,
    },
    companyAddress: {
        fontSize: 7,
    },
    headerRight: {
        width: '25%',
        fontSize: 8,
    },
    headerDetailBox: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 2,
        marginBottom: 2,
    },
    pageNoBox: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 2,
        backgroundColor: '#f9f9f9',
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 30,
        right: 30,
        borderTopWidth: 1,
        borderTopColor: 'black',
        paddingTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 8,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        marginBottom: 5,
        marginTop: 10,
    },
    table: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    tableRowNoBorder: {
        flexDirection: 'row',
    },
    tableHeader: {
        backgroundColor: '#eeeeee',
        fontWeight: 'bold',
    },
    tableCell: {
        padding: 3,
        borderRightWidth: 1,
        borderRightColor: 'black',
    },
    tableCellNoRight: {
        padding: 3,
    },
    bold: {
        fontWeight: 'bold',
    },
    italic: {
        fontStyle: 'italic',
    },
    rejection: {
        color: 'red',
        fontWeight: 'bold',
    },
    labelCol: {
        backgroundColor: '#f9f9f9',
        width: '20%',
    },
    valueCol: {
        width: '30%',
    }
});

interface Props {
    data: BMRData;
}

const Header: React.FC<{ docInfo: any }> = ({ docInfo }) => (
    <View style={styles.header} fixed>
        <View style={styles.headerContent}>
            <View style={styles.logoBox}>
                <Image source="/logo.png" style={{ width: 60, height: 60 }} />
            </View>
            <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>Batch Manufacturing Record</Text>
                <Text style={styles.companyName}>SHI Mediwear Pvt. Ltd.</Text>
                <Text style={styles.companyAddress}>93/13, Road No. 1A, Mundka Industrial Area, New Delhi - 110041.</Text>
            </View>
            <View style={styles.headerRight}>
                <View style={styles.headerDetailBox}><Text><Text style={styles.bold}>Doc No:</Text> {docInfo.docNo}</Text></View>
                <View style={styles.headerDetailBox}><Text><Text style={styles.bold}>Rev No:</Text> {docInfo.revNo}</Text></View>
                <View style={styles.headerDetailBox}><Text><Text style={styles.bold}>Issue No:</Text> {docInfo.issueNo}</Text></View>
                <View style={styles.pageNoBox}>
                    <Text render={({ pageNumber, totalPages }: { pageNumber: number, totalPages: number }) => (
                        `Page No: ${pageNumber} of ${totalPages}`
                    )} />
                </View>
            </View>
        </View>
    </View>
);

const Footer: React.FC<{ docNo: string }> = ({ docNo }) => (
    <View style={styles.footer} fixed>
        <Text>SHI Mediwear Pvt. Ltd.</Text>
        <Text>{docNo}</Text>
    </View>
);

const BMRDownloadView: React.FC<Props> = ({ data }) => {
    const isKit = data.bmrType === 'kit';
    const docInfo = isKit ? {
        docNo: 'SMPL/PRD/BMR/02',
        revNo: '01 & 24.06.2023',
        issueNo: '02 & 01.07.2023'
    } : {
        docNo: 'SMPL/PRD/BMR/01',
        revNo: '01 & 01.01.2023',
        issueNo: '01 & 01.01.2023'
    };

    return (
        <Document title={`BMR_${data.batchNo}`}>
            <Page size="A4" style={styles.page}>
                <Header docInfo={docInfo} />
                <Footer docNo={docInfo.docNo} />

                {/* 1. Product & Batch Details */}
                <Text style={styles.sectionTitle}>1. Product & Batch Details</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Product Name</Text></View>
                        <View style={[styles.tableCell, styles.valueCol]}><Text>{data.productName}</Text></View>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Product Code</Text></View>
                        <View style={[styles.tableCellNoRight, styles.valueCol]}><Text>{data.productCode}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Brand Name</Text></View>
                        <View style={[styles.tableCell, styles.valueCol]}><Text>{data.brandName}</Text></View>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Product Size</Text></View>
                        <View style={[styles.tableCellNoRight, styles.valueCol]}><Text>{data.productSize}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Batch No</Text></View>
                        <View style={[styles.tableCell, styles.valueCol]}><Text style={styles.bold}>{data.batchNo}</Text></View>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Batch Size</Text></View>
                        <View style={[styles.tableCellNoRight, styles.valueCol]}><Text style={styles.bold}>{data.batchSize}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Mfg. Date</Text></View>
                        <View style={[styles.tableCell, styles.valueCol]}><Text>{data.mfgDate}</Text></View>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Exp. Date</Text></View>
                        <View style={[styles.tableCellNoRight, styles.valueCol]}><Text>{data.expDate}</Text></View>
                    </View>
                    <View style={styles.tableRowNoBorder}>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Commencement</Text></View>
                        <View style={[styles.tableCell, styles.valueCol]}><Text>{data.dateOfCommencement}</Text></View>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Completion</Text></View>
                        <View style={[styles.tableCellNoRight, styles.valueCol]}><Text>{data.dateOfCompletion}</Text></View>
                    </View>
                </View>

                {/* Kit Contents Detail */}
                {isKit && (
                    <>
                        <Text style={styles.sectionTitle}>Kit Contents Detail</Text>
                        <View style={styles.table}>
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <View style={[styles.tableCell, { width: '5%' }]}><Text>S#</Text></View>
                                <View style={[styles.tableCell, { width: '25%' }]}><Text>Description</Text></View>
                                <View style={[styles.tableCell, { width: '10%' }]}><Text>Unit</Text></View>
                                <View style={[styles.tableCell, { width: '10%' }]}><Text>Qty</Text></View>
                                <View style={[styles.tableCell, { width: '10%' }]}><Text>Size</Text></View>
                                <View style={[styles.tableCell, { width: '20%' }]}><Text>Material Used</Text></View>
                                <View style={[styles.tableCellNoRight, { width: '20%' }]}><Text>Supplier</Text></View>
                            </View>
                            {(data.kitContents || []).map((item, idx) => (
                                <View key={idx} style={styles.tableRow}>
                                    <View style={[styles.tableCell, { width: '5%' }]}><Text>{idx + 1}</Text></View>
                                    <View style={[styles.tableCell, { width: '25%' }]}><Text>{item.itemName}</Text></View>
                                    <View style={[styles.tableCell, { width: '10%' }]}><Text>{item.unit}</Text></View>
                                    <View style={[styles.tableCell, { width: '10%' }]}><Text>{item.qty}</Text></View>
                                    <View style={[styles.tableCell, { width: '10%' }]}><Text>{item.size}</Text></View>
                                    <View style={[styles.tableCell, { width: '20%' }]}><Text>{item.materialUsed}</Text></View>
                                    <View style={[styles.tableCellNoRight, { width: '20%' }]}><Text>{item.supplier}</Text></View>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {/* 2. Raw Material Table */}
                <Text style={styles.sectionTitle}>2. Raw Material Table</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <View style={[styles.tableCell, { width: '5%' }]}><Text>S#</Text></View>
                        <View style={[styles.tableCell, { width: '30%' }]}><Text>Material Name</Text></View>
                        <View style={[styles.tableCell, { width: '10%' }]}><Text>Unit</Text></View>
                        <View style={[styles.tableCell, { width: '15%' }]}><Text>Lot No</Text></View>
                        <View style={[styles.tableCell, { width: '10%' }]}><Text>Req Qty</Text></View>
                        <View style={[styles.tableCell, { width: '10%' }]}><Text>Iss Qty</Text></View>
                        <View style={[styles.tableCellNoRight, { width: '20%' }]}><Text>Verified By</Text></View>
                    </View>
                    {(data.rawMaterials || []).map((rm, idx) => (
                        <View key={idx} style={styles.tableRow}>
                            <View style={[styles.tableCell, { width: '5%' }]}><Text>{idx + 1}</Text></View>
                            <View style={[styles.tableCell, { width: '30%' }]}><Text>{rm.name}</Text></View>
                            <View style={[styles.tableCell, { width: '10%' }]}><Text>{rm.unit}</Text></View>
                            <View style={[styles.tableCell, { width: '15%' }]}><Text>{rm.lotNo}</Text></View>
                            <View style={[styles.tableCell, { width: '10%' }]}><Text>{rm.requiredQty}</Text></View>
                            <View style={[styles.tableCell, { width: '10%' }]}><Text>{rm.issuedQty}</Text></View>
                            <View style={[styles.tableCellNoRight, { width: '20%' }]}><Text>{rm.verifiedBy}</Text></View>
                        </View>
                    ))}
                </View>

                {/* 3. Packing Material Table */}
                <Text style={styles.sectionTitle}>3. Packing Material Table</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <View style={[styles.tableCell, { width: '5%' }]}><Text>S#</Text></View>
                        <View style={[styles.tableCell, { width: '25%' }]}><Text>Packing Material</Text></View>
                        <View style={[styles.tableCell, { width: '10%' }]}><Text>Unit</Text></View>
                        <View style={[styles.tableCell, { width: '15%' }]}><Text>Lot No</Text></View>
                        <View style={[styles.tableCell, { width: '10%' }]}><Text>Req</Text></View>
                        <View style={[styles.tableCell, { width: '10%' }]}><Text>Iss</Text></View>
                        <View style={[styles.tableCell, { width: '10%' }]}><Text>Used</Text></View>
                        <View style={[styles.tableCellNoRight, { width: '15%' }]}><Text>Verified</Text></View>
                    </View>
                    {(data.packingMaterials || []).map((pm, idx) => (
                        <View key={idx} style={styles.tableRow}>
                            <View style={[styles.tableCell, { width: '5%' }]}><Text>{idx + 1}</Text></View>
                            <View style={[styles.tableCell, { width: '25%' }]}><Text>{pm.name}</Text></View>
                            <View style={[styles.tableCell, { width: '10%' }]}><Text>{pm.unit}</Text></View>
                            <View style={[styles.tableCell, { width: '15%' }]}><Text>{pm.lotNo}</Text></View>
                            <View style={[styles.tableCell, { width: '10%' }]}><Text>{pm.requiredQty}</Text></View>
                            <View style={[styles.tableCell, { width: '10%' }]}><Text>{pm.issuedQty}</Text></View>
                            <View style={[styles.tableCell, { width: '10%' }]}><Text>{pm.usedQty}</Text></View>
                            <View style={[styles.tableCellNoRight, { width: '15%' }]}><Text>{pm.verifiedBy}</Text></View>
                        </View>
                    ))}
                </View>

                {/* 4. Manufacturing Process */}
                <Text style={styles.sectionTitle}>4. Manufacturing Process</Text>
                {Object.entries(data.processSteps || {}).map(([key, step]) => {
                    if (Array.isArray(step)) { // Kit Type
                        return (
                            <View key={key} style={{ marginBottom: 10 }}>
                                <Text style={[styles.bold, { backgroundColor: '#eeeeee', padding: 2, borderWidth: 1, borderColor: 'black' }]}>{key}</Text>
                                <View style={styles.table}>
                                    <View style={[styles.tableRow, styles.tableHeader]}>
                                        <View style={[styles.tableCell, { width: '30%' }]}><Text>Item Name</Text></View>
                                        <View style={[styles.tableCell, { width: '15%' }]}><Text>Date</Text></View>
                                        <View style={[styles.tableCell, { width: '10%' }]}><Text>Start</Text></View>
                                        <View style={[styles.tableCell, { width: '10%' }]}><Text>End</Text></View>
                                        <View style={[styles.tableCell, { width: '10%' }]}><Text>Qty</Text></View>
                                        <View style={[styles.tableCellNoRight, { width: '25%' }]}><Text>Operator</Text></View>
                                    </View>
                                    {step.map((item: any, i: number) => (
                                        <View key={i} style={styles.tableRow}>
                                            <View style={[styles.tableCell, { width: '30%' }]}><Text>{item.itemName}</Text></View>
                                            <View style={[styles.tableCell, { width: '15%' }]}><Text>{item.date}</Text></View>
                                            <View style={[styles.tableCell, { width: '10%' }]}><Text>{item.startTime}</Text></View>
                                            <View style={[styles.tableCell, { width: '10%' }]}><Text>{item.endTime}</Text></View>
                                            <View style={[styles.tableCell, { width: '10%' }]}><Text>{item.qtyProduced}</Text></View>
                                            <View style={[styles.tableCellNoRight, { width: '25%' }]}><Text>{item.operator}</Text></View>
                                        </View>
                                    ))}
                                    <View style={[styles.tableRowNoBorder, { backgroundColor: '#f9f9f9' }]}>
                                        <View style={[styles.tableCell, { width: '50%' }]}><Text>Verified By (Prod): {(step as any).verifiedProduction || '---'}</Text></View>
                                        <View style={[styles.tableCellNoRight, { width: '50%' }]}><Text>Verified By (QA): {(step as any).verifiedQA || '---'}</Text></View>
                                    </View>
                                </View>
                            </View>
                        );
                    } else { // Standard Type
                        const sStep = step as ProcessStep;
                        return (
                            <View key={key} style={{ marginBottom: 10 }}>
                                <Text style={[styles.bold, { backgroundColor: '#eeeeee', padding: 2, borderWidth: 1, borderColor: 'black' }]}>{key}</Text>
                                <View style={styles.table}>
                                    <View style={styles.tableRow}>
                                        <View style={[styles.tableCell, styles.labelCol]}><Text>Date</Text></View>
                                        <View style={[styles.tableCell, styles.valueCol]}><Text>{sStep.date}</Text></View>
                                        <View style={[styles.tableCell, styles.labelCol]}><Text>Start / End</Text></View>
                                        <View style={[styles.tableCellNoRight, styles.valueCol]}><Text>{sStep.startTime} / {sStep.endTime}</Text></View>
                                    </View>
                                    <View style={styles.tableRow}>
                                        <View style={[styles.tableCell, styles.labelCol]}><Text>Operator</Text></View>
                                        <View style={[styles.tableCell, styles.valueCol]}><Text>{sStep.operator}</Text></View>
                                        <View style={[styles.tableCell, styles.labelCol]}><Text>Ver. Prod</Text></View>
                                        <View style={[styles.tableCellNoRight, styles.valueCol]}><Text>{sStep.verifiedProduction}</Text></View>
                                    </View>
                                    <View style={styles.tableRowNoBorder}>
                                        <View style={[styles.tableCell, styles.labelCol]}><Text>Exp / Prod Qty</Text></View>
                                        <View style={[styles.tableCell, styles.valueCol]}><Text>{sStep.expectedQty} / {sStep.qtyProduced}</Text></View>
                                        <View style={[styles.tableCell, styles.labelCol]}><Text>Rej / Ver QA</Text></View>
                                        <View style={[styles.tableCellNoRight, styles.valueCol]}><Text>{sStep.rejection} / {sStep.verifiedQA}</Text></View>
                                    </View>
                                </View>
                            </View>
                        );
                    }
                })}

                {/* 5. Sterilization & 6. Labeling */}
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '48%', marginRight: '4%' }}>
                        <Text style={styles.sectionTitle}>5. Sterilization</Text>
                        <View style={styles.table}>
                            <View style={styles.tableRow}><View style={[styles.tableCell, { width: '40%' }]}><Text>Type</Text></View><View style={[styles.tableCellNoRight, { width: '60%' }]}><Text>{data.sterilization?.type}</Text></View></View>
                            <View style={styles.tableRow}><View style={[styles.tableCell, { width: '40%' }]}><Text>Date</Text></View><View style={[styles.tableCellNoRight, { width: '60%' }]}><Text>{data.sterilization?.date}</Text></View></View>
                            <View style={styles.tableRow}><View style={[styles.tableCell, { width: '40%' }]}><Text>Qty</Text></View><View style={[styles.tableCellNoRight, { width: '60%' }]}><Text>{data.sterilization?.qty}</Text></View></View>
                            <View style={styles.tableRowNoBorder}><View style={[styles.tableCell, { width: '40%' }]}><Text>Verified</Text></View><View style={[styles.tableCellNoRight, { width: '60%' }]}><Text>{data.sterilization?.verifiedBy}</Text></View></View>
                        </View>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={styles.sectionTitle}>6. Labeling</Text>
                        <View style={styles.table}>
                            <View style={styles.tableRow}><View style={[styles.tableCell, { width: '40%' }]}><Text>Labeled Qty</Text></View><View style={[styles.tableCellNoRight, { width: '60%' }]}><Text>{data.labeling?.qty}</Text></View></View>
                            <View style={styles.tableRow}><View style={[styles.tableCell, { width: '40%' }]}><Text>Rejection</Text></View><View style={[styles.tableCellNoRight, { width: '60%' }]}><Text>{data.labeling?.rejection}</Text></View></View>
                            <View style={styles.tableRow}><View style={[styles.tableCell, { width: '40%' }]}><Text>Prod Ver.</Text></View><View style={[styles.tableCellNoRight, { width: '60%' }]}><Text>{data.labeling?.productionVerification}</Text></View></View>
                            <View style={styles.tableRowNoBorder}><View style={[styles.tableCell, { width: '40%' }]}><Text>QA Ver.</Text></View><View style={[styles.tableCellNoRight, { width: '60%' }]}><Text>{data.labeling?.qaVerification}</Text></View></View>
                        </View>
                    </View>
                </View>

                {/* 7. Final Packing & Yield */}
                <Text style={styles.sectionTitle}>7. Final Packing & Yield</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Total Qty</Text></View>
                        <View style={[styles.tableCell, styles.valueCol]}><Text>{data.finalPacking?.totalQty}</Text></View>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Final Packed</Text></View>
                        <View style={[styles.tableCellNoRight, styles.valueCol]}><Text style={styles.bold}>{data.finalPacking?.finalPackedQty}</Text></View>
                    </View>
                    <View style={styles.tableRowNoBorder}>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Testing Qty</Text></View>
                        <View style={[styles.tableCell, styles.valueCol]}><Text>{data.finalPacking?.testingQty}</Text></View>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Actual Yield</Text></View>
                        <View style={[styles.tableCellNoRight, styles.valueCol]}><Text style={[styles.bold, { fontSize: 12 }]}>{data.finalPacking?.actualYield}</Text></View>
                    </View>
                </View>

                {/* 8. Declarations */}
                <Text style={styles.sectionTitle}>8. Declarations & Release</Text>
                <View style={{ borderWidth: 1, borderColor: 'black', padding: 5, marginBottom: 10 }}>
                    <Text style={styles.italic}>{data.declarations?.manufacturingDeclaration || 'I verify that all the raw materials, equipment\'s, machinery and preparations are satisfactory to the best of my knowledge.'}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 30 }}>
                    <View style={{ width: '40%', borderTopWidth: 1, borderTopColor: 'black', textAlign: 'center', paddingTop: 5 }}>
                        <Text style={styles.bold}>Head Production</Text>
                        <Text>({data.declarations?.headProduction || 'SIGNATURE'})</Text>
                    </View>
                    <View style={{ width: '40%', borderTopWidth: 1, borderTopColor: 'black', textAlign: 'center', paddingTop: 5 }}>
                        <Text style={styles.bold}>Head QA</Text>
                        <Text>({data.declarations?.qaHead || 'SIGNATURE'})</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default BMRDownloadView;
