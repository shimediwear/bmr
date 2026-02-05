'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Tag } from 'antd';
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

    const fetchReports = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('rm_test_reports')
                .select(`
          *,
          suppliers (name)
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            const mappedData = (data || []).map(mapDbToIncomingReport);
            setReports(mappedData);
        } catch (error: any) {
            message.error('Failed to fetch reports: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const { error } = await supabase
                .from('rm_test_reports')
                .delete()
                .eq('id', id);

            if (error) throw error;
            message.success('Report deleted successfully');
            fetchReports();
        } catch (error: any) {
            message.error('Failed to delete report: ' + error.message);
        }
    };

    const handleDownload = async (record: IncomingReport) => {
        if (!record.id) return;
        setDownloadingId(record.id);
        try {
            const blob = await pdf(
                <RawMaterialTestPDF data={record} supplierName={(record as any).suppliers?.name} />
            ).toBlob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Raw_Material_Test_Report_${record.reportNo}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error: any) {
            message.error('Failed to generate PDF: ' + error.message);
        } finally {
            setDownloadingId(null);
        }
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
                <Tag color={result === 'Comply' ? 'success' : 'error'}>
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
                        onClick={() => handleDownload(record)}
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
            </div>

            <Table
                columns={columns}
                dataSource={reports}
                loading={loading}
                rowKey="id"
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
        </div>
    );
};

export default RawMaterialTestList;
