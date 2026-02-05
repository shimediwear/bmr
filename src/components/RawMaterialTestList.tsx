'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Tag, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase';
import { IncomingReport } from '@/lib/types';
import { mapDbToIncomingReport } from '@/lib/data-utils';
import RawMaterialTestForm from './RawMaterialTestForm';
import { pdf } from '@react-pdf/renderer';
import RawMaterialTestPDF from './RawMaterialTestPDF';

const RawMaterialTestList: React.FC = () => {
    const [reports, setReports] = useState<IncomingReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingReport, setEditingReport] = useState<IncomingReport | null>(null);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const [isDownloadModalVisible, setIsDownloadModalVisible] = useState(false);
    const [downloadRecord, setDownloadRecord] = useState<IncomingReport | null>(null);

    // Pagination and Search State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchText, setSearchText] = useState('');

    const fetchReports = async (page = currentPage, limit = pageSize, search = searchText) => {
        setLoading(true);
        try {
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            let query = supabase
                .from('rm_test_reports')
                .select(`
          *,
          suppliers (name)
        `, { count: 'exact' });

            if (search) {
                // Search in reportNo, productName, batchNo
                query = query.or(`report_no.ilike.%${search}%,product_name.ilike.%${search}%,batch_no.ilike.%${search}%`);
            }

            const { data, count, error } = await query
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;
            const mappedData = (data || []).map(mapDbToIncomingReport);
            setReports(mappedData);
            setTotal(count || 0);
        } catch (error: any) {
            message.error('Failed to fetch reports: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports(currentPage, pageSize, searchText);
    }, [currentPage, pageSize, searchText]);

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleDelete = async (id: number) => {
        try {
            const { error } = await supabase
                .from('rm_test_reports')
                .delete()
                .eq('id', id);

            if (error) throw error;
            if (error) throw error;
            message.success('Report deleted successfully');
            // Refresh current page
            fetchReports();
        } catch (error: any) {
            message.error('Failed to delete report: ' + error.message);
        }
    };

    const handleDownload = async (withSignature: boolean) => {
        if (!downloadRecord || !downloadRecord.id) return;
        setDownloadingId(downloadRecord.id);
        setIsDownloadModalVisible(false);
        try {
            const blob = await pdf(
                <RawMaterialTestPDF data={downloadRecord} supplierName={(downloadRecord as any).suppliers?.name} withSignature={withSignature} />
            ).toBlob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Raw_Material_Test_Report_${downloadRecord.reportNo}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error: any) {
            message.error('Failed to generate PDF: ' + error.message);
        } finally {
            setDownloadingId(null);
            setDownloadRecord(null);
        }
    };

    const showDownloadModal = (record: IncomingReport) => {
        setDownloadRecord(record);
        setIsDownloadModalVisible(true);
    };

    const columns = [
        {
            title: 'Report No',
            dataIndex: 'reportNo',
            key: 'reportNo',
        },
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Batch No',
            dataIndex: 'batchNo',
            key: 'batchNo',
        },
        {
            title: 'Batch Size',
            dataIndex: 'batchSize',
            key: 'batchSize',
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier_name',
            key: 'supplier',
            render: (_: any, record: any) => record.suppliers?.name || 'Unknown',
        },
        {
            title: 'Level',
            dataIndex: 'performanceLevel',
            key: 'performanceLevel',
            render: (level: string) => <Tag color="blue">{level}</Tag>
        },
        {
            title: 'Result',
            dataIndex: 'result',
            key: 'result',
            render: (result: string) => (
                <Tag color={result === 'comply' ? 'success' : 'error'}>
                    {result}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: IncomingReport) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingReport(record);
                            setIsModalVisible(true);
                        }}
                    />
                    <Button
                        icon={downloadingId === record.id ? <LoadingOutlined /> : <DownloadOutlined />}
                        title="Download PDF"
                        disabled={downloadingId === record.id}
                        onClick={() => showDownloadModal(record)}
                    />
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            Modal.confirm({
                                title: 'Are you sure you want to delete this report?',
                                onOk: () => record.id && handleDelete(record.id),
                            });
                        }}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>Raw Material Test Reports</h2>
                <Space>
                    <Input.Search
                        placeholder="Search by Report No, Product Name, or Batch No"
                        onSearch={handleSearch}
                        style={{ width: 300 }}
                        allowClear
                        enterButton
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingReport(null);
                            setIsModalVisible(true);
                        }}
                    >
                        New Report
                    </Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={reports}
                loading={loading}
                rowKey="id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: total,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} items`,
                }}
                onChange={handleTableChange}
            />

            <Modal
                title={editingReport ? "Edit Report" : "New Raw Material Test Report"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={1000}
                maskClosable={false}
                destroyOnHidden
            >
                <RawMaterialTestForm
                    initialValues={editingReport || undefined}
                    onSuccess={() => {
                        // setIsModalVisible(false);
                        fetchReports();
                    }}
                />
            </Modal>

            <Modal
                title="Download Options"
                open={isDownloadModalVisible}
                onCancel={() => {
                    setIsDownloadModalVisible(false);
                    setDownloadRecord(null);
                }}
                footer={null}
                destroyOnHidden
            >
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <p style={{ marginBottom: 20 }}>Do you want to include signatures in the PDF?</p>
                    <Space size="large">
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => handleDownload(true)}
                        >
                            With Signature
                        </Button>
                        <Button
                            size="large"
                            onClick={() => handleDownload(false)}
                        >
                            Without Signature
                        </Button>
                    </Space>
                </div>
            </Modal>
        </div>
    );
};

export default RawMaterialTestList;
