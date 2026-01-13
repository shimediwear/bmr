'use client';

import React, { useState, useMemo } from 'react';
import { Table, Button, Space, Tag, Typography, Card, Dropdown, MenuProps, Input, message } from 'antd';
import { EditOutlined, EyeOutlined, PlusOutlined, FileTextOutlined, ExperimentOutlined, MoreOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { BMRData } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { pdf } from '@react-pdf/renderer';
import BMRDownloadView from '@/components/BMRPrintView/BMRDownloadView';
import MaterialTransferPDF from '@/components/slips/MaterialTransferPDF';
import SamplingAdvicePDF from '@/components/slips/SamplingAdvicePDF';

const { Title } = Typography;

interface BMRListProps {
    records: BMRData[];
    loading?: boolean;
}

const BMRList: React.FC<BMRListProps> = ({ records, loading }) => {
    const router = useRouter();
    const [searchText, setSearchText] = useState('');
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    const filteredRecords = useMemo(() => {
        return records.filter(record =>
            record.batchNo?.toLowerCase().includes(searchText.toLowerCase()) ||
            record.productName?.toLowerCase().includes(searchText.toLowerCase()) ||
            record.productCode?.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [records, searchText]);

    const handleDownloadPDF = async (record: BMRData) => {
        if (!record.id) return;
        setDownloadingId(record.id);
        const hide = message.loading('Generating BMR PDF...', 0);

        try {
            const blob = await pdf(<BMRDownloadView data={record} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `BMR_${record.batchNo}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            message.success('BMR Downloaded successfully');
        } catch (error: any) {
            console.error('PDF Generation Error:', error);
            message.error('Failed to generate PDF: ' + (error.message || 'Unknown error'));
        } finally {
            setDownloadingId(null);
            hide();
        }
    };

    const handleDownloadTransferSlip = async (record: BMRData) => {
        if (!record.id) return;
        setDownloadingId(record.id);
        const hide = message.loading('Generating Transfer Slip...', 0);

        try {
            const blob = await pdf(<MaterialTransferPDF data={record} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Transfer_Slip_${record.batchNo}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            message.success('Transfer Slip Downloaded successfully');
        } catch (error: any) {
            console.error('PDF Generation Error:', error);
            message.error('Failed to generate PDF: ' + (error.message || 'Unknown error'));
        } finally {
            setDownloadingId(null);
            hide();
        }
    };

    const handleDownloadSamplingAdvice = async (record: BMRData) => {
        if (!record.id) return;
        setDownloadingId(record.id);
        const hide = message.loading('Generating Sampling Advice...', 0);

        try {
            const blob = await pdf(<SamplingAdvicePDF data={record} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Sampling_Advice_${record.batchNo}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            message.success('Sampling Advice Downloaded successfully');
        } catch (error: any) {
            console.error('PDF Generation Error:', error);
            message.error('Failed to generate PDF: ' + (error.message || 'Unknown error'));
        } finally {
            setDownloadingId(null);
            hide();
        }
    };

    const columns = [
        {
            title: 'Type',
            dataIndex: 'bmrType',
            key: 'bmrType',
            render: (type: string) => <Tag color={type === 'kit' ? 'purple' : 'default'}>{type?.toUpperCase() || 'STANDARD'}</Tag>,
        },
        {
            title: 'Batch No',
            dataIndex: 'batchNo',
            key: 'batchNo',
            render: (text: string) => <span className="font-bold">{text}</span>,
        },
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Mfg Date',
            dataIndex: 'mfgDate',
            key: 'mfgDate',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = status === 'released' ? 'green' : status === 'final' ? 'blue' : 'orange';
                return <Tag color={color}>{status?.toUpperCase() || 'DRAFT'}</Tag>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: BMRData) => {
                const isDownloading = downloadingId === record.id;
                const items: MenuProps['items'] = [
                    {
                        key: 'print',
                        label: isDownloading ? 'Generating...' : 'Download PDF',
                        icon: <DownloadOutlined />,
                        disabled: isDownloading,
                        onClick: () => handleDownloadPDF(record),
                    },
                    {
                        key: 'transfer',
                        label: isDownloading ? 'Generating...' : 'Material Transfer Slip',
                        icon: <FileTextOutlined />,
                        disabled: isDownloading,
                        onClick: () => handleDownloadTransferSlip(record),
                    },
                    {
                        key: 'sampling',
                        label: isDownloading ? 'Generating...' : 'Sampling Advice Slip',
                        icon: <ExperimentOutlined />,
                        disabled: isDownloading,
                        onClick: () => handleDownloadSamplingAdvice(record),
                    },
                ];

                return (
                    <Space size="middle">
                        <Button icon={<EditOutlined />} onClick={() => router.push(`/bmr/${record.id}/edit`)}>Edit</Button>
                        <Dropdown menu={{ items }}>
                            <Button icon={<MoreOutlined />}>Documents</Button>
                        </Dropdown>
                    </Space>
                );
            },
        },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto no-print">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Title level={2} className="m-0">Batch Manufacturing Records</Title>
                </div>
                <Space size="large">
                    <Input
                        placeholder="Search Batch No, Product..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        className="w-80"
                        allowClear
                        onChange={e => setSearchText(e.target.value)}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={() => router.push('/bmr/new')}
                    >
                        Create New BMR
                    </Button>
                </Space>
            </div>

            <Card className="shadow-sm">
                <Table
                    columns={columns}
                    dataSource={filteredRecords}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
};

export default BMRList;
