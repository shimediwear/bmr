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
        padding: 30,
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
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'black',
        paddingVertical: 5,
        marginBottom: 15,
        textTransform: 'uppercase',
    },
    infoGrid: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    infoCol: {
        width: '50%',
    },
    bold: {
        fontWeight: 'bold',
    },
    table: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 30,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    tableCell: {
        padding: 5,
        borderRightWidth: 1,
        borderRightColor: 'black',
    },
    tableCellNoRight: {
        padding: 5,
    },
    center: {
        textAlign: 'center',
    },
    footerSignatures: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 50,
    },
    signatureBox: {
        width: '22%',
        borderTopWidth: 1,
        borderTopColor: 'black',
        paddingTop: 5,
        textAlign: 'center',
        fontSize: 8,
        fontWeight: 'bold',
    },
    tableRowNoBorder: {
        flexDirection: 'row',
    },
    italic: {
        fontStyle: 'italic',
    },
    tableRowFull: {
        flexDirection: 'row',
        width: '100%',
        minHeight: 25,
    },
});

interface Props {
    data: BMRData;
}

const MaterialTransferPDF: React.FC<Props> = ({ data }) => {
    const allMaterials = [
        ...(data.rawMaterials || []),
        ...(data.packingMaterials || [])
    ];

    return (
        <Document title={`Material_Transfer_Slip_${data.batchNo}`}>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>SHI MEDIWEAR PVT. LTD.</Text>
                    <View style={styles.formatInfo}>
                        <Text>Format Ref. No. : SMPLMTL-04</Text>
                        <Text>Rev. No. : 00</Text>
                    </View>
                </View>

                <Text style={styles.subTitle}>Material Requisition Slip</Text>

                {/* Info Grid */}
                <View style={styles.infoGrid}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoCol}><Text><Text style={styles.bold}>From:</Text> Production</Text></View>
                        <View style={styles.infoCol}><Text><Text style={styles.bold}>Date:</Text> {dayjs().format('DD-MM-YYYY')}</Text></View>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={{ width: '100%' }}><Text style={styles.bold}>Material Required for:</Text> {data.productName}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoCol}><Text><Text style={styles.bold}>Batch No:</Text> {data.batchNo}</Text></View>
                        <View style={styles.infoCol}><Text><Text style={styles.bold}>Department:</Text> Production</Text></View>
                    </View>
                </View>

                {/* Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <View style={[styles.tableCell, { width: '8%' }]}><Text style={styles.center}>S.No.</Text></View>
                        <View style={[styles.tableCell, { width: '40%' }]}><Text>Product Description</Text></View>
                        <View style={[styles.tableCell, { width: '10%' }]}><Text style={styles.center}>Unit</Text></View>
                        <View style={[styles.tableCell, { width: '12%' }]}><Text style={styles.center}>Qty. Req.</Text></View>
                        <View style={[styles.tableCell, { width: '12%' }]}><Text style={styles.center}>Qty. Iss.</Text></View>
                        <View style={[styles.tableCellNoRight, { width: '18%' }]}><Text>Lot No</Text></View>
                    </View>
                    {allMaterials.map((item, idx) => (
                        <View key={idx} style={[styles.tableRow, { minHeight: 25 }]} wrap={false}>
                            <View style={[styles.tableCell, { width: '8%' }]}><Text style={styles.center}>{idx + 1}</Text></View>
                            <View style={[styles.tableCell, { width: '40%' }]}><Text>{item.name}</Text></View>
                            <View style={[styles.tableCell, { width: '10%' }]}><Text style={styles.center}>{item.unit}</Text></View>
                            <View style={[styles.tableCell, { width: '12%' }]}><Text style={styles.center}>{item.requiredQty}</Text></View>
                            <View style={[styles.tableCell, { width: '12%' }]}><Text style={styles.center}>{item.issuedQty}</Text></View>
                            <View style={[styles.tableCellNoRight, { width: '18%' }]}><Text>{item.lotNo}</Text></View>
                        </View>
                    ))}
                    {allMaterials.length === 0 && (
                        <View style={styles.tableRowNoBorder}>
                            <View style={[styles.tableCellNoRight, { width: '100%', padding: 10, textAlign: 'center' }]}>
                                <Text style={styles.italic}>No materials found for this batch.</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Footer Signatures */}
                <View style={styles.footerSignatures}>
                    <View style={styles.signatureBox}><Text>Requisitioned By</Text></View>
                    <View style={styles.signatureBox}><Text>Sanctioned By</Text></View>
                    <View style={styles.signatureBox}><Text>Issued By</Text></View>
                    <View style={styles.signatureBox}><Text>Received By</Text></View>
                </View>
            </Page>
        </Document>
    );
};

export default MaterialTransferPDF;
