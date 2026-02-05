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

// Register Roboto font to fix rendering issues with symbols like < and >
Font.register({
    family: 'Roboto',
    fonts: [
        { src: '/fonts/Roboto-Regular.ttf' },
        { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' }
    ]
});

const styles = StyleSheet.create({
    page: {
        paddingTop: 140,
        paddingBottom: 60,
        paddingHorizontal: 30,
        fontSize: 10,
        fontFamily: 'Roboto',
    },
    header: {
        position: 'absolute',
        top: 20,
        left: 30,
        right: 30,
    },
    headerTable: {
        borderWidth: 1,
        borderColor: 'black',
        flexDirection: 'row',
    },
    // Column 1: Logo
    headerLogoCol: {
        width: '20%',
        borderRightWidth: 1,
        borderRightColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    // Column 2: Company Info
    headerCenterCol: {
        width: '50%',
        borderRightWidth: 1,
        borderRightColor: 'black',
    },
    companyNameRow: {
        height: '33%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    companyAddressRow: {
        height: '34%', // Slightly larger for multi-line text
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        paddingHorizontal: 2,
    },
    certTitleRow: {
        height: '33%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Column 3: Doc Details
    headerRightCol: {
        width: '30%',
    },
    docDetailRow: {
        flexDirection: 'row',
        height: '25%',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        alignItems: 'center',
    },
    docDetailRowLast: {
        flexDirection: 'row',
        height: '25%',
        alignItems: 'center',
    },
    docLabel: {
        width: '50%',
        paddingLeft: 2,
        fontSize: 8,
    },
    docValue: {
        width: '50%',
        paddingLeft: 2,
        fontSize: 8,
        borderLeftWidth: 1,
        borderLeftColor: 'black',
        height: '100%',
        justifyContent: 'center',
    },
    // Typography
    companyNameText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    companyAddressText: {
        fontSize: 8,
        textAlign: 'center',
    },
    certTitleText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    // Existing styles
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
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        backgroundColor: '#ABD6FF',
        padding: 4,
        borderWidth: 1,
        borderColor: 'black',
        marginTop: 10,
        marginBottom: 0,
        textAlign: 'center',
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
        backgroundColor: '#E6F3FF',
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
    border: {
        position: 'absolute',
        top: 15,
        left: 15,
        right: 15,
        bottom: 15,
        borderWidth: 2,
        borderColor: 'black',
        zIndex: -1,
    },
});

interface Props {
    data: IncomingReport;
    supplierName?: string;
}

const PageBorder: React.FC = () => (
    <View style={styles.border} fixed />
);

const Header: React.FC = () => (
    <View style={styles.header} fixed>
        <View style={styles.headerTable}>
            {/* Logo Column */}
            <View style={styles.headerLogoCol}>
                <Image source="/logo.png" style={{ width: 70, height: 70, objectFit: 'contain' }} />
            </View>

            {/* Center Information Column */}
            <View style={styles.headerCenterCol}>
                <View style={styles.companyNameRow}>
                    <Text style={styles.companyNameText}>SHI Mediwear Pvt. Ltd.</Text>
                </View>
                <View style={styles.companyAddressRow}>
                    <Text style={styles.companyAddressText}>93/13, Road No. 1A, Mundka Industrial Area, New Delhi - 110041.</Text>
                </View>
                <View style={styles.certTitleRow}>
                    <Text style={styles.certTitleText}>IN-HOUSE RAW MATERIAL TEST REPORT</Text>
                </View>
            </View>

            {/* Right Document Details Column */}
            <View style={styles.headerRightCol}>
                <View style={styles.docDetailRow}>
                    <Text style={styles.docLabel}>Document No.</Text>
                    <View style={styles.docValue}><Text>SMPL/QC/RM/01</Text></View>
                </View>
                <View style={styles.docDetailRow}>
                    <Text style={styles.docLabel}>Revision No & Date</Text>
                    <View style={styles.docValue}><Text>01 & 05.08.2025</Text></View>
                </View>
                <View style={styles.docDetailRow}>
                    <Text style={styles.docLabel}>Issue No & Date</Text>
                    <View style={styles.docValue}><Text>01 & 06.08.2025</Text></View>
                </View>
                <View style={styles.docDetailRowLast}>
                    <Text style={styles.docLabel}>Page No.</Text>
                    <View style={styles.docValue}>
                        <Text render={({ pageNumber, totalPages }: { pageNumber: number, totalPages: number }) => (
                            `${pageNumber} of ${totalPages}`
                        )} />
                    </View>
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

const ResultTable: React.FC<{ title: string; results: TestResult[]; showUnit?: boolean, style?: any }> = ({ title, results, showUnit, style }) => (
    <View wrap={false} style={style}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={[styles.tableCell, { width: '8%' }]}><Text style={styles.center}>S.No.</Text></View>
                <View style={[styles.tableCell, { width: showUnit ? '30%' : '37%' }]}><Text>TEST</Text></View>
                <View style={[styles.tableCell, { width: showUnit ? '30%' : '35%', textAlign: 'center' }]}><Text>STANDARD REQUIREMENTS</Text></View>
                {showUnit && <View style={[styles.tableCell, { width: '12%' }]}><Text style={styles.center}>UNIT</Text></View>}
                <View style={[styles.tableCellNoRight, { width: '20%' }]}><Text style={styles.center}>RESULT</Text></View>
            </View>
            {results.map((r, i) => (
                <View key={i} style={i === results.length - 1 ? styles.tableRowNoBorder : styles.tableRow}>
                    <View style={[styles.tableCell, { width: '8%' }]}><Text style={styles.center}>{r.sNo}</Text></View>
                    <View style={[styles.tableCell, { width: showUnit ? '30%' : '37%' }]}><Text>{r.test}</Text></View>
                    <View style={[styles.tableCell, { width: showUnit ? '30%' : '35%', textAlign: 'center' }]}><Text>{r.standard}</Text></View>
                    {showUnit && <View style={[styles.tableCell, { width: '12%' }]}><Text style={styles.center}>{r.unit || '---'}</Text></View>}
                    <View style={[styles.tableCellNoRight, { width: '20%' }]}><Text style={[styles.center, { fontWeight: 'bold' }]}>{r.result}</Text></View>
                </View>
            ))}
        </View>
    </View>
);

const RawMaterialTestPDF: React.FC<Props> = ({ data, supplierName }) => {
    return (
        <Document title={`RM_Report_${data.reportNo}`}>
            <Page size="A4" style={styles.page}>
                <PageBorder />
                <Header />
                <Footer />

                {/* Report Header Information */}
                <View style={[styles.table, { marginTop: -20 }]}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, styles.labelCol]}><Text>Product Name</Text></View>
                        <View style={[styles.tableCell, { width: '37%' }]}><Text>{data.productName}</Text></View>
                        <View style={[styles.tableCell, { width: '13%', fontWeight: 'bold', backgroundColor: '#f9f9f9' }]}><Text>T.R. No.</Text></View>
                        <View style={[styles.tableCellNoRight]}><Text>{data.reportNo}</Text></View>
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
                <ResultTable title="Fabric Test Parameters" results={data.parametersResults} showUnit />
                <ResultTable title="Biocompatibility Test (External Lab)" results={data.biocompatibilityResult} />
                <ResultTable title="Visual Defects" results={data.visualResults} style={{ marginTop: -20 }} />

                {/* Final Result and Signatures */}
                <View wrap={false} style={{ marginTop: 10 }}>
                    <View style={styles.table}>
                        <View style={styles.tableRowNoBorder}>
                            <View style={[styles.tableCell, styles.labelCol, { width: '25%' }]}><Text>Final Result</Text></View>
                            <View style={[styles.tableCellNoRight, { width: '75%', paddingLeft: 10 }]}><Text style={styles.bold}>The samples {data.result} with all the specifications as per the standard</Text></View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                        <View style={{ width: '35%', textAlign: 'center', paddingTop: 5 }}>
                            <Image src="/monu.png" style={{ width: 40, height: 40, alignSelf: 'center', paddingBottom: 5 }} />
                            <Text style={styles.bold}>Tested By</Text>
                            <Text>{data.testedBy}</Text>
                        </View>
                        <View style={{ width: '55%', textAlign: 'center', paddingTop: 5 }}>
                            <Image src="/sign.png" style={{ width: 50, height: 50, alignSelf: 'center', paddingBottom: 5 }} />
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
