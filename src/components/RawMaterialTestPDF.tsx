'use client';

import React from 'react';
import { Document as PDFDocument, Page as PDFPage, Text as PDFText, View as PDFView, StyleSheet, Image as PDFImage, Font } from '@react-pdf/renderer';
import { IncomingReport, TestResult } from '@/lib/types';
import dayjs from 'dayjs';

// Cast components to any to resolve React 19 JSX compatibility issues
const Document = PDFDocument as any;
const Page = PDFPage as any;
const Text = PDFText as any;
const View = PDFView as any;
const Image = PDFImage as any;

const styles = StyleSheet.create({
    page: {
        paddingTop: 140,
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
        height: 110,
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
        backgroundColor: '#eeeeee',
        padding: 4,
        borderWidth: 1,
        borderColor: 'black',
        marginTop: 10,
        marginBottom: 0,
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
    labelCol: {
        backgroundColor: '#f9f9f9',
        width: '25%',
        fontWeight: 'bold',
    },
    valueCol: {
        width: '25%',
    },
    fullWidthCell: {
        width: '100%',
    },
    bold: {
        fontWeight: 'bold',
    },
    center: {
        textAlign: 'center',
    },
});

interface Props {
    data: IncomingReport;
    supplierName?: string;
}

const Header: React.FC = () => (
    <View style={styles.header} fixed>
        <View style={styles.headerContent}>
            <View style={styles.logoBox}>
                <Image source="/logo.png" style={{ width: 50, height: 50 }} />
            </View>
            <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>Raw Material Test Report</Text>
                <Text style={styles.companyName}>SHI Mediwear Pvt. Ltd.</Text>
                <Text style={styles.companyAddress}>93/13, Road No. 1A, Mundka Industrial Area, New Delhi - 110041.</Text>
            </View>
            <View style={styles.headerRight}>
                <View style={styles.headerDetailBox}><Text><Text style={styles.bold}>Format No:</Text> SMPL/RM/01</Text></View>
                <View style={styles.headerDetailBox}><Text><Text style={styles.bold}>Rev No:</Text> 00</Text></View>
                <View style={styles.pageNoBox}>
                    <Text render={({ pageNumber, totalPages }: { pageNumber: number, totalPages: number }) => (
                        `Page No: ${pageNumber} of ${totalPages}`
                    )} />
                </View>
            </View>
        </View>
    </View>
);

const Footer: React.FC = () => (
    <View style={styles.footer} fixed>
        <Text>SHI Mediwear Pvt. Ltd.</Text>
        <Text>Raw Material Test Report</Text>
    </View>
);

const ResultTable: React.FC<{ title: string; results: TestResult[]; showUnit?: boolean }> = ({ title, results, showUnit }) => (
    <View wrap={false}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={[styles.tableCell, { width: '8%' }]}><Text style={styles.center}>S.No.</Text></View>
                <View style={[styles.tableCell, { width: showUnit ? '30%' : '37%' }]}><Text>TEST</Text></View>
                <View style={[styles.tableCell, { width: showUnit ? '30%' : '35%' }]}><Text>STANDARD REQUIREMENTS</Text></View>
                {showUnit && <View style={[styles.tableCell, { width: '12%' }]}><Text style={styles.center}>UNIT</Text></View>}
                <View style={[styles.tableCellNoRight, { width: '20%' }]}><Text style={styles.center}>RESULT</Text></View>
            </View>
            {results.map((r, i) => (
                <View key={i} style={i === results.length - 1 ? styles.tableRowNoBorder : styles.tableRow}>
                    <View style={[styles.tableCell, { width: '8%' }]}><Text style={styles.center}>{r.sNo}</Text></View>
                    <View style={[styles.tableCell, { width: showUnit ? '30%' : '37%' }]}><Text>{r.test}</Text></View>
                    <View style={[styles.tableCell, { width: showUnit ? '30%' : '35%' }]}><Text>{r.standard}</Text></View>
                    {showUnit && <View style={[styles.tableCell, { width: '12%' }]}><Text style={styles.center}>{r.unit || '---'}</Text></View>}
                    <View style={[styles.tableCellNoRight, { width: '20%' }]}><Text style={styles.center}>{r.result}</Text></View>
                </View>
            ))}
        </View>
    </View>
);

const RawMaterialTestPDF: React.FC<Props> = ({ data, supplierName }) => {
    return (
        <Document title={`RM_Report_${data.reportNo}`}>
            <Page size="A4" style={styles.page}>
                <Header />
                <Footer />

                {/* Report Header Information */}
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Product Name</Text></View>
                        <View style={[styles.tableCell, { width: '40%' }]}><Text>{data.productName}</Text></View>
                        <View style={[styles.tableCell, { width: '15%', fontWeight: 'bold', backgroundColor: '#f9f9f9' }]}><Text>T.R. No.</Text></View>
                        <View style={[styles.tableCellNoRight, { width: '20%' }]}><Text>{data.reportNo}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Batch No.</Text></View>
                        <View style={[styles.tableCell, styles.valueCol]}><Text>{data.batchNo}</Text></View>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Supplier Name</Text></View>
                        <View style={[styles.tableCellNoRight, styles.valueCol]}><Text>{supplierName || '---'}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Invoice No.</Text></View>
                        <View style={[styles.tableCell, styles.valueCol]}><Text>{data.invoiceNo}</Text></View>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Invoice Date</Text></View>
                        <View style={[styles.tableCellNoRight, styles.valueCol]}><Text>{data.invoiceDate ? dayjs(data.invoiceDate).format('DD.MM.YYYY') : '---'}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Total Batch Size</Text></View>
                        <View style={[styles.tableCell, styles.valueCol]}><Text>{data.batchSize}</Text></View>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Sample Qty.</Text></View>
                        <View style={[styles.tableCellNoRight, styles.valueCol]}><Text>{data.sampleQty}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Date of Sample</Text></View>
                        <View style={[styles.tableCell, styles.valueCol]}><Text>{data.sampleDate ? dayjs(data.sampleDate).format('DD.MM.YYYY') : '---'}</Text></View>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Mfg. Date</Text></View>
                        <View style={[styles.tableCellNoRight, styles.valueCol]}><Text>{data.mfgDate ? dayjs(data.mfgDate).format('MM.YYYY') : '---'}</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Exp. Date</Text></View>
                        <View style={[styles.tableCell, styles.valueCol]}><Text>{data.expDate ? dayjs(data.expDate).format('MM.YYYY') : '---'}</Text></View>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Release Date</Text></View>
                        <View style={[styles.tableCellNoRight, styles.valueCol]}><Text>{data.releaseDate ? dayjs(data.releaseDate).format('DD.MM.YYYY') : '---'}</Text></View>
                    </View>
                    <View style={styles.tableRowNoBorder}>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Performance Level</Text></View>
                        <View style={[styles.tableCell, styles.valueCol]}><Text>{data.performanceLevel}</Text></View>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Fabric Composition</Text></View>
                        <View style={[styles.tableCellNoRight, styles.valueCol]}><Text>{data.fabricComposition}</Text></View>
                    </View>
                </View>

                {/* Tables */}
                <ResultTable title="Fabric Parameters" results={data.parametersResults} showUnit />
                <ResultTable title="Biocompatibility Test (External Lab)" results={data.biocompatibilityResult} />
                <ResultTable title="Visual Defects" results={data.visualResults} />

                {/* Final Result and Signatures */}
                <View wrap={false} style={{ marginTop: 10 }}>
                    <View style={styles.table}>
                        <View style={styles.tableRowNoBorder}>
                            <View style={[styles.tableCell, styles.labelCol, { width: '25%' }]}><Text>Final Result</Text></View>
                            <View style={[styles.tableCellNoRight, { width: '75%', paddingLeft: 10 }]}><Text style={styles.bold}>{data.result}</Text></View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 40 }}>
                        <View style={{ width: '45%', borderTopWidth: 1, borderTopColor: 'black', textAlign: 'center', paddingTop: 5 }}>
                            <Text style={styles.bold}>Tested By</Text>
                            <Text>{data.testedBy}</Text>
                        </View>
                        <View style={{ width: '45%', borderTopWidth: 1, borderTopColor: 'black', textAlign: 'center', paddingTop: 5 }}>
                            <Text style={styles.bold}>Reviewed By</Text>
                            <Text>{data.reviewedBy}</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default RawMaterialTestPDF;
