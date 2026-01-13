'use client';

import React from 'react';
import { Document as PDFDocument, Page as PDFPage, Text as PDFText, View as PDFView, StyleSheet, Image as PDFImage, Font } from '@react-pdf/renderer';
import { BMRData } from '@/lib/types';
import dayjs from 'dayjs';

// Cast components to any to resolve React 19 JSX compatibility issues
const Document = PDFDocument as any;
const Page = PDFPage as any;
const Text = PDFText as any;
const View = PDFView as any;
const Image = PDFImage as any;

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    header: {
        textAlign: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        textDecoration: 'underline',
        marginBottom: 10,
    },
    formatInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 8,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'black',
        paddingVertical: 5,
        marginBottom: 20,
        textTransform: 'uppercase',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    toSection: {
        marginBottom: 15,
    },
    bold: {
        fontWeight: 'bold',
    },
    table: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 40,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    tableRowNoBorder: {
        flexDirection: 'row',
    },
    tableCellLabel: {
        width: '40%',
        padding: 8,
        borderRightWidth: 1,
        borderRightColor: 'black',
        fontWeight: 'bold',
        backgroundColor: '#f9f9f9',
    },
    tableCellValue: {
        width: '60%',
        padding: 8,
    },
    footerSignatures: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 60,
    },
    signatureBox: {
        width: '45%',
        borderTopWidth: 1,
        borderTopColor: 'black',
        paddingTop: 5,
        textAlign: 'center',
        fontSize: 9,
        fontWeight: 'bold',
    },
    pageDivider: {
        marginTop: 30,
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        borderStyle: 'dashed',
    }
});

interface Props {
    data: BMRData;
}

const SamplingAdvicePDF: React.FC<Props> = ({ data }) => {
    return (
        <Document title={`Sampling_Advice_Slips_${data.batchNo}`}>
            {/* Page 1: Sampling Advice */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>SHI MEDIWEAR PVT. LTD.</Text>
                    <View style={styles.formatInfo}>
                        <Text>Format Ref. No. : SMPLQC-12</Text>
                        <Text>Rev. No. : 00</Text>
                    </View>
                </View>

                <Text style={styles.subTitle}>Sampling Advice</Text>

                <View style={styles.infoRow}>
                    <Text><Text style={styles.bold}>From:</Text> Production</Text>
                    <Text><Text style={styles.bold}>Ref. No. :</Text> {data.batchNo || '---'} / SA</Text>
                </View>

                <View style={styles.toSection}>
                    <Text style={styles.bold}>To: The Office QC</Text>
                    <Text style={{ marginTop: 4 }}>Pls. collect the following sample for Finished Product</Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCellLabel}><Text>Name of Item/Product</Text></View>
                        <View style={styles.tableCellValue}><Text>{data.productName}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCellLabel}><Text>Lot/Batch No.</Text></View>
                        <View style={styles.tableCellValue}><Text style={styles.bold}>{data.batchNo}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCellLabel}><Text>Lot/Batch/Target Size</Text></View>
                        <View style={styles.tableCellValue}><Text>{data.batchSize}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCellLabel}><Text>Manufactured By</Text></View>
                        <View style={styles.tableCellValue}><Text>SHI Mediwear Pvt. Ltd.</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCellLabel}><Text>Date of Manufacturing</Text></View>
                        <View style={styles.tableCellValue}><Text>{data.mfgDate}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCellLabel}><Text>Date of Expiry</Text></View>
                        <View style={styles.tableCellValue}><Text>{data.expDate}</Text></View>
                    </View>
                    <View style={styles.tableRowNoBorder}>
                        <View style={styles.tableCellLabel}><Text>Sample Qty.</Text></View>
                        <View style={styles.tableCellValue}><Text style={styles.bold}>{data.finalPacking?.controlSampleQty || '2 Units'}</Text></View>
                    </View>
                </View>

                <View style={styles.footerSignatures}>
                    <View style={styles.signatureBox}>
                        <Text>ISSUED BY</Text>
                        <Text style={{ marginTop: 2 }}>PRODUCTION</Text>
                    </View>
                    <View style={styles.signatureBox}>
                        <Text>DRAWN BY / DATE</Text>
                        <Text style={{ marginTop: 2 }}>QC DEPARTMENT</Text>
                    </View>
                </View>

                {/* Separator if printed on same sheet, but PDF Document Page break is better */}
            </Page>

            {/* Page 2: Control Sample Request */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>SHI MEDIWEAR PVT. LTD.</Text>
                    <View style={styles.formatInfo}>
                        <Text>Format Ref. No. : SMPLFG-01</Text>
                        <Text>Rev. No. : 00</Text>
                    </View>
                </View>

                <Text style={styles.subTitle}>Request Slip for Collection for Control Sample</Text>

                <View style={styles.infoRow}>
                    <Text><Text style={styles.bold}>From:</Text> Production</Text>
                    <Text><Text style={styles.bold}>S. No. :</Text> {data.batchNo || '---'} / CS</Text>
                </View>

                <View style={styles.toSection}>
                    <Text style={styles.bold}>To: The Office QC</Text>
                    <Text style={{ marginTop: 4 }}>Pls. collect the control sample of following batch No.</Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCellLabel}><Text>Name of Product</Text></View>
                        <View style={styles.tableCellValue}><Text>{data.productName}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCellLabel}><Text>Batch No./Lot No.</Text></View>
                        <View style={styles.tableCellValue}><Text style={styles.bold}>{data.batchNo}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCellLabel}><Text>Sample Qty.</Text></View>
                        <View style={styles.tableCellValue}><Text style={styles.bold}>{data.finalPacking?.controlSampleQty || '02 Unit'}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCellLabel}><Text>Mfg Date</Text></View>
                        <View style={styles.tableCellValue}><Text>{data.mfgDate}</Text></View>
                    </View>
                    <View style={styles.tableRowNoBorder}>
                        <View style={styles.tableCellLabel}><Text>Exp. Date</Text></View>
                        <View style={styles.tableCellValue}><Text>{data.expDate}</Text></View>
                    </View>
                </View>

                <View style={styles.footerSignatures}>
                    <View style={styles.signatureBox}>
                        <Text>Head of Production</Text>
                    </View>
                    <View style={styles.signatureBox}>
                        <Text>Received By / Date</Text>
                        <Text style={{ marginTop: 2 }}>QC DEPARTMENT</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default SamplingAdvicePDF;
