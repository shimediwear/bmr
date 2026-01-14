'use client';

import React from 'react';
import { Form, Input, DatePicker, Select, Button, Card, Table, Space, Divider, Row, Col, Typography, message } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined, PrinterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { BMRData, RawMaterial, PackingMaterial, KitProcessItem, ProcessStep } from '@/lib/types';
import { supabase } from '@/lib/supabase';

const { Title } = Typography;
const { Option } = Select;

interface BMRFormProps {
    initialData?: Partial<BMRData>;
    onSave?: (data: BMRData) => void;
}

const BMRForm: React.FC<BMRFormProps> = ({ initialData, onSave }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const [reports, setReports] = React.useState<any[]>([]);
    const [searching, setSearching] = React.useState(false);
    const bmrType = Form.useWatch('bmrType', form);

    // Transform initialData to include dayjs objects for DatePickers
    const transformedInitialData = React.useMemo(() => {
        if (!initialData) return { bmrType: 'standard' };
        return {
            ...initialData,
            bmrType: initialData.bmrType || 'standard',
            mfgDate: initialData.mfgDate ? dayjs(initialData.mfgDate) : undefined,
            expDate: initialData.expDate ? dayjs(initialData.expDate) : undefined,
            dateOfCommencement: initialData.dateOfCommencement ? dayjs(initialData.dateOfCommencement) : undefined,
            dateOfCompletion: initialData.dateOfCompletion ? dayjs(initialData.dateOfCompletion) : undefined,
        };
    }, [initialData]);

    const calculateYield = () => {
        const batchSizeStr = form.getFieldValue('batchSize') || '';
        const packedQtyStr = form.getFieldValue(['finalPacking', 'finalPackedQty']) || '';
        const fpTestingQtyStr = form.getFieldValue(['finalPacking', 'testingQty']) || '0';

        // Extract numbers
        const batchSize = parseFloat(batchSizeStr.replace(/[^0-9.]/g, ''));
        const packedQty = parseFloat(packedQtyStr.replace(/[^0-9.]/g, ''));
        const testingQty = parseFloat(fpTestingQtyStr.replace(/[^0-9.]/g, '')) || 0;

        const totalOut = packedQty + testingQty;

        if (batchSize > 0 && packedQty >= 0) {
            const yieldVal = ((totalOut / batchSize) * 100).toFixed(2);
            form.setFieldsValue({ finalPacking: { actualYield: `${yieldVal}%` } });
        }
    };

    const handleSearch = async (value: string) => {
        if (!value) {
            setReports([]);
            return;
        }

        setSearching(true);
        try {
            const { data, error } = await supabase
                .from('rm_test_reports')
                .select('id, report_no, product_name, batch_no')
                .or(`report_no.ilike.%${value}%,product_name.ilike.%${value}%`)
                .limit(20);

            if (data) {
                setReports(data);
            }
        } catch (error) {
            console.error('Error searching reports:', error);
        } finally {
            setSearching(false);
        }
    };

    const fetchInitialReport = async (id: number) => {
        try {
            const { data, error } = await supabase
                .from('rm_test_reports')
                .select('id, report_no, product_name, batch_no')
                .eq('id', id)
                .single();

            if (data) {
                setReports([data]);
            }
        } catch (error) {
            console.error('Error fetching initial report:', error);
        }
    };

    React.useEffect(() => {
        if (initialData?.rawMaterialForSpecification) {
            fetchInitialReport(initialData.rawMaterialForSpecification);
        }
    }, [initialData?.rawMaterialForSpecification]);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const bmrData = {
                ...values,
                mfgDate: values.mfgDate?.format?.('YYYY-MM-DD') || values.mfgDate,
                expDate: values.expDate?.format?.('YYYY-MM-DD') || values.expDate,
                dateOfCommencement: values.dateOfCommencement?.format?.('YYYY-MM-DD') || values.dateOfCommencement,
                dateOfCompletion: values.dateOfCompletion?.format?.('YYYY-MM-DD') || values.dateOfCompletion,
            };

            if (onSave) {
                onSave(bmrData);
            } else {
                const { error } = await supabase.from('bmr').insert([{
                    ...bmrData,
                    generated_by: user?.id
                }]);
                if (error) throw error;
                message.success('BMR saved successfully');
            }
        } catch (error: any) {
            message.error('Failed to save BMR: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderProcessStep = (step: string, stepLabel: string) => {
        if (bmrType === 'kit') {
            return (
                <div key={step} className="mb-8 last:mb-0 border-b pb-6 last:border-0 last:pb-0">
                    <Title level={5} className="mb-4">{stepLabel}</Title>
                    <Form.List name={['processSteps', step]}>
                        {(fields, { add, remove }) => (
                            <>
                                <Table
                                    dataSource={fields}
                                    pagination={false}
                                    bordered
                                    size="small"
                                    columns={[
                                        { title: 'Item Name', dataIndex: 'itemName', render: (_, field) => <Form.Item name={[field.name, 'itemName']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                        { title: 'Date', dataIndex: 'date', width: 120, render: (_, field) => <Form.Item name={[field.name, 'date']} className="m-0"><Input variant="borderless" placeholder="YYYY-MM-DD" /></Form.Item> },
                                        { title: 'Start', dataIndex: 'startTime', width: 90, render: (_, field) => <Form.Item name={[field.name, 'startTime']} className="m-0"><Input variant="borderless" placeholder="HH:mm" /></Form.Item> },
                                        { title: 'End', dataIndex: 'endTime', width: 90, render: (_, field) => <Form.Item name={[field.name, 'endTime']} className="m-0"><Input variant="borderless" placeholder="HH:mm" /></Form.Item> },
                                        { title: 'Qty', dataIndex: 'qtyProduced', width: 80, render: (_, field) => <Form.Item name={[field.name, 'qtyProduced']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                        { title: 'Exp', dataIndex: 'expectedQty', width: 80, render: (_, field) => <Form.Item name={[field.name, 'expectedQty']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                        { title: 'Rej', dataIndex: 'rejection', width: 70, render: (_, field) => <Form.Item name={[field.name, 'rejection']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                        { title: 'Operator', dataIndex: 'operator', render: (_, field) => <Form.Item name={[field.name, 'operator']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                        { title: '', key: 'action', width: 50, render: (_, field) => <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)} /> },
                                    ]}
                                />
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} className="mt-2">
                                    Add Item to {stepLabel}
                                </Button>
                                <Row gutter={12} className="mt-4">
                                    <Col span={12}><Form.Item name={['processSteps', step, 'verifiedProduction']} label="Verified Production"><Input /></Form.Item></Col>
                                    <Col span={12}><Form.Item name={['processSteps', step, 'verifiedQA']} label="Verified QA"><Input /></Form.Item></Col>
                                </Row>
                            </>
                        )}
                    </Form.List>
                </div>
            );
        }

        return (
            <div key={step} className="mb-8 last:mb-0 border-b pb-6 last:border-0 last:pb-0">
                <Title level={5} className="mb-4">{stepLabel}</Title>
                <Row gutter={12}>
                    <Col span={4}><Form.Item name={['processSteps', step, 'date']} label="Date"><Input placeholder="DD-MM-YYYY" /></Form.Item></Col>
                    <Col span={3}><Form.Item name={['processSteps', step, 'startTime']} label="Start"><Input placeholder="HH:mm" /></Form.Item></Col>
                    <Col span={3}><Form.Item name={['processSteps', step, 'endTime']} label="End"><Input placeholder="HH:mm" /></Form.Item></Col>
                    <Col span={7}><Form.Item name={['processSteps', step, 'operator']} label="Operator"><Input /></Form.Item></Col>
                    <Col span={7}><Form.Item name={['processSteps', step, 'verifiedProduction']} label="Verified Production"><Input /></Form.Item></Col>
                </Row>
                <Row gutter={12}>
                    <Col span={4}><Form.Item name={['processSteps', step, 'expectedQty']} label="Exp Qty"><Input /></Form.Item></Col>
                    <Col span={4}><Form.Item name={['processSteps', step, 'qtyProduced']} label="Prod Qty"><Input /></Form.Item></Col>
                    <Col span={4}><Form.Item name={['processSteps', step, 'rejection']} label="Rejection"><Input /></Form.Item></Col>
                    <Col span={4}><Form.Item name={['processSteps', step, 'reprocessedQty']} label="Reproc Qty"><Input /></Form.Item></Col>
                    <Col span={8}><Form.Item name={['processSteps', step, 'verifiedQA']} label="Verified QA"><Input /></Form.Item></Col>
                </Row>
            </div>
        );
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={transformedInitialData}
            onValuesChange={(changed) => {
                if (changed.batchSize || (changed.finalPacking && (changed.finalPacking.finalPackedQty || changed.finalPacking.testingQty))) {
                    calculateYield();
                }
            }}
            className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen"
        >

            <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50 z-10 py-4 px-4 border-b">
                <Title level={2} className="m-0">BMR Generator</Title>
                <Space>
                    <Button icon={<SaveOutlined />} type="primary" htmlType="submit" loading={loading} size="large">
                        Save Record
                    </Button>
                </Space>
            </div>

            {/* BMR Type Selection */}
            <Card className="mb-6 shadow-sm bg-blue-50">
                <Form.Item name="bmrType" label="Select BMR Document Type" rules={[{ required: true }]}>
                    <Select size="large">
                        <Option value="standard">Standard BMR (Single Item Process)</Option>
                        <Option value="kit">Kit BMR (Multi-Item Component Assembly)</Option>
                    </Select>
                </Form.Item>
            </Card>

            {/* Kit Contents Section (Only for Kit BMR) */}
            {bmrType === 'kit' && (
                <Card title="Kit Contents detail" className="mb-6 shadow-sm border-2 border-blue-200">
                    <Form.List name="kitContents">
                        {(fields, { add, remove }) => (
                            <>
                                <Table
                                    dataSource={fields}
                                    pagination={false}
                                    bordered
                                    size="small"
                                    columns={[
                                        { title: 'S#', dataIndex: 'sNo', width: 60, render: (_, field, index) => <Form.Item name={[field.name, 'sNo']} initialValue={(index + 1).toString()} className="m-0"><Input variant="borderless" readOnly /></Form.Item> },
                                        { title: 'Item Name', dataIndex: 'itemName', render: (_, field) => <Form.Item name={[field.name, 'itemName']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                        { title: 'Unit', dataIndex: 'unit', width: 80, render: (_, field) => <Form.Item name={[field.name, 'unit']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                        { title: 'Qty', dataIndex: 'qty', width: 80, render: (_, field) => <Form.Item name={[field.name, 'qty']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                        { title: 'Size', dataIndex: 'size', width: 120, render: (_, field) => <Form.Item name={[field.name, 'size']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                        { title: 'Raw Material Used', dataIndex: 'materialUsed', render: (_, field) => <Form.Item name={[field.name, 'materialUsed']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                        { title: 'Supplier Name', dataIndex: 'supplier', render: (_, field) => <Form.Item name={[field.name, 'supplier']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                        { title: '', key: 'action', width: 50, render: (_, field) => <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)} /> },
                                    ]}
                                />
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} className="mt-4">
                                    Add Kit Content Item
                                </Button>
                            </>
                        )}
                    </Form.List>
                </Card>
            )}

            {/* 1. Product & Batch Details */}
            <Card title="1. Product & Batch Details" className="mb-6 shadow-sm">
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="productType" label="Product Type" rules={[{ required: true }]}>
                            <Select placeholder="Select Product Type">
                                <Option value="Gown">Gown</Option>
                                <Option value="Drape">Drape</Option>
                                <Option value="Cover">Cover</Option>
                                <Option value="Kit">Kit</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="productName" label="Product Name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="rawMaterialForSpecification"
                            label="Raw Material Specification"
                            rules={[{ required: true, message: 'Please select a raw material test report' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Search by Report No or Product Name"
                                filterOption={false}
                                onSearch={handleSearch}
                                loading={searching}
                                allowClear
                            >
                                {reports.map((report) => (
                                    <Option key={report.id} value={report.id}>
                                        {report.report_no} - {report.product_name} (Batch: {report.batch_no})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="productCode" label="Product Code" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="brandName" label="Brand Name">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item name="productSize" label="Product Size">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="batchNo" label="Batch No" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="batchSize" label="Batch Size">
                            <Input placeholder="e.g. 42 Set" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="typeOfPacking" label="Type of Packing">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item name="mfgDate" label="Manufacturing Date">
                            <DatePicker className="w-full" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="expDate" label="Expiry Date">
                            <DatePicker className="w-full" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="dateOfCommencement" label="Date of Commencement">
                            <DatePicker className="w-full" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="dateOfCompletion" label="Date of Completion">
                            <DatePicker className="w-full" />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            {/* 2. Raw Material Table */}
            <Card title="2. Raw Material Table" className="mb-6 shadow-sm">
                <Form.List name="rawMaterials">
                    {(fields, { add, remove }) => (
                        <>
                            <Table
                                dataSource={fields}
                                pagination={false}
                                bordered
                                size="small"
                                columns={[
                                    {
                                        title: 'S#',
                                        dataIndex: 'sNo',
                                        width: 60,
                                        render: (_, field, index) => (
                                            <Form.Item name={[field.name, 'sNo']} initialValue={(index + 1).toString()} className="m-0">
                                                <Input variant="borderless" readOnly />
                                            </Form.Item>
                                        ),
                                    },
                                    { title: 'Material Name', dataIndex: 'name', render: (_, field) => <Form.Item name={[field.name, 'name']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                    { title: 'Unit', dataIndex: 'unit', width: 80, render: (_, field) => <Form.Item name={[field.name, 'unit']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                    { title: 'Lot No', dataIndex: 'lotNo', width: 100, render: (_, field) => <Form.Item name={[field.name, 'lotNo']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                    { title: 'Req Qty', dataIndex: 'requiredQty', width: 90, render: (_, field) => <Form.Item name={[field.name, 'requiredQty']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                    { title: 'Iss Qty', dataIndex: 'issuedQty', width: 90, render: (_, field) => <Form.Item name={[field.name, 'issuedQty']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                    { title: 'Measured By', dataIndex: 'measuredBy', width: 120, render: (_, field) => <Form.Item name={[field.name, 'measuredBy']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                    { title: 'Verified By', dataIndex: 'verifiedBy', width: 120, render: (_, field) => <Form.Item name={[field.name, 'verifiedBy']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                    { title: '', key: 'action', width: 50, render: (_, field) => <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)} /> },
                                ]}
                            />
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} className="mt-4">
                                Add Raw Material
                            </Button>
                        </>
                    )}
                </Form.List>
            </Card>

            {/* 3. Packing Material Table */}
            <Card title="3. Packing Material Table" className="mb-6 shadow-sm">
                <Form.List name="packingMaterials">
                    {(fields, { add, remove }) => (
                        <>
                            <Table
                                dataSource={fields}
                                pagination={false}
                                bordered
                                size="small"
                                columns={[
                                    {
                                        title: 'S#',
                                        dataIndex: 'sNo',
                                        width: 60,
                                        render: (_, field, index) => (
                                            <Form.Item name={[field.name, 'sNo']} initialValue={(index + 1).toString()} className="m-0">
                                                <Input variant="borderless" readOnly />
                                            </Form.Item>
                                        ),
                                    },
                                    { title: 'Material', dataIndex: 'name', render: (_, field) => <Form.Item name={[field.name, 'name']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                    { title: 'Unit', dataIndex: 'unit', width: 80, render: (_, field) => <Form.Item name={[field.name, 'unit']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                    { title: 'Lot No', dataIndex: 'lotNo', width: 100, render: (_, field) => <Form.Item name={[field.name, 'lotNo']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                    { title: 'Req', dataIndex: 'requiredQty', width: 80, render: (_, field) => <Form.Item name={[field.name, 'requiredQty']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                    { title: 'Iss', dataIndex: 'issuedQty', width: 80, render: (_, field) => <Form.Item name={[field.name, 'issuedQty']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                    { title: 'Used', dataIndex: 'usedQty', width: 80, render: (_, field) => <Form.Item name={[field.name, 'usedQty']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                    { title: 'Ret', dataIndex: 'returnedQty', width: 80, render: (_, field) => <Form.Item name={[field.name, 'returnedQty']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                    { title: 'Counted', dataIndex: 'measuredBy', width: 100, render: (_, field) => <Form.Item name={[field.name, 'measuredBy']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                    { title: 'Verified', dataIndex: 'verifiedBy', width: 100, render: (_, field) => <Form.Item name={[field.name, 'verifiedBy']} className="m-0"><Input variant="borderless" /></Form.Item> },
                                    { title: '', key: 'action', width: 50, render: (_, field) => <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)} /> },
                                ]}
                            />
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} className="mt-4">
                                Add Packing Material
                            </Button>
                        </>
                    )}
                </Form.List>
            </Card>

            {/* 4. Manufacturing Process */}
            <Card title="4. Manufacturing Process" className="mb-6 shadow-sm">
                {[
                    { key: '4.1 Cutting', label: '4.1 Cutting' },
                    { key: '4.2 Stitching', label: '4.2 Stitching' },
                    { key: '4.3 Draping', label: '4.3 Draping' },
                    { key: '4.4 Folding', label: '4.4 Folding' },
                    { key: '4.5 Packing', label: '4.5 Kit Assemble & Packing' },
                    { key: '4.6 Sealing', label: '4.6 Sealing' },
                    { key: '4.7 Inner Box Packing', label: '4.7 Inner Box Packing' }
                ].map((step) => renderProcessStep(step.key, step.label))}
            </Card>

            {/* 5. Sterilization Section */}
            <Card title="5. Sterilization Section" className="mb-6 shadow-sm">
                <Row gutter={16}>
                    <Col span={4}><Form.Item name={['sterilization', 'type']} label="Type"><Select><Option value="ETO">ETO</Option><Option value="Gamma">Gamma</Option></Select></Form.Item></Col>
                    <Col span={5}><Form.Item name={['sterilization', 'date']} label="Date"><Input placeholder="DD-MM-YYYY" /></Form.Item></Col>
                    <Col span={5}><Form.Item name={['sterilization', 'qty']} label="Quantity"><Input /></Form.Item></Col>
                    <Col span={5}><Form.Item name={['sterilization', 'refNo']} label="Ref No"><Input /></Form.Item></Col>
                    <Col span={5}><Form.Item name={['sterilization', 'verifiedBy']} label="Verified By"><Input /></Form.Item></Col>
                </Row>
            </Card>

            {/* 6. Labeling Section */}
            <Card title="6. Labeling Section" className="mb-6 shadow-sm">
                <Row gutter={16}>
                    <Col span={6}><Form.Item name={['labeling', 'dateTime']} label="Date & Time"><Input placeholder="DD-MM-YYYY HH:mm" /></Form.Item></Col>
                    <Col span={4}><Form.Item name={['labeling', 'qty']} label="Labeled Qty"><Input /></Form.Item></Col>
                    <Col span={4}><Form.Item name={['labeling', 'rejection']} label="Rejection"><Input /></Form.Item></Col>
                    <Col span={10}><Form.Item name={['labeling', 'operator']} label="Operator"><Input /></Form.Item></Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}><Form.Item name={['labeling', 'productionVerification']} label="Production Verification"><Input /></Form.Item></Col>
                    <Col span={12}><Form.Item name={['labeling', 'qaVerification']} label="QA Verification"><Input /></Form.Item></Col>
                </Row>
            </Card>

            {/* 7. Final Packing & Yield */}
            <Card title="7. Final Packing & Yield" className="mb-6 shadow-sm">
                <Row gutter={12}>
                    <Col span={4}><Form.Item name={['finalPacking', 'totalQty']} label="Total Qty"><Input /></Form.Item></Col>
                    <Col span={4}><Form.Item name={['finalPacking', 'controlSampleQty']} label="Control Qty"><Input /></Form.Item></Col>
                    <Col span={4}><Form.Item name={['finalPacking', 'surgeonSampleQty']} label="Surgeon Qty"><Input /></Form.Item></Col>
                    <Col span={4}><Form.Item name={['finalPacking', 'finalPackedQty']} label="Packed Qty"><Input /></Form.Item></Col>
                    <Col span={4}><Form.Item name={['finalPacking', 'actualYield']} label="Yield (%)"><Input readOnly className="bg-gray-50 font-bold" /></Form.Item></Col>
                    <Col span={4}><Form.Item name={['finalPacking', 'testingQty']} label="FP Test Qty"><Input /></Form.Item></Col>
                </Row>
            </Card>

            {/* 8. Declarations & Release */}
            <Card title="8. Declarations & Release" className="mb-6 shadow-sm">
                <Row gutter={16}>
                    <Col span={12}><Form.Item name={['declarations', 'headProduction']} label="Head Production (Name/Sign)"><Input /></Form.Item></Col>
                    <Col span={12}><Form.Item name={['declarations', 'qaHead']} label="QA Head (Name/Sign)"><Input /></Form.Item></Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}><Form.Item name={['declarations', 'releaseDate']} label="Release Date"><Input placeholder="DD-MM-YYYY" /></Form.Item></Col>
                    <Col span={8}><Form.Item name={['declarations', 'testReportNo']} label="Report No"><Input /></Form.Item></Col>
                    <Col span={8}><Form.Item name="status" label="Status"><Select><Option value="draft">Draft</Option><Option value="final">Final</Option><Option value="released">Released</Option></Select></Form.Item></Col>
                </Row>
            </Card>
        </Form>
    );
};

export default BMRForm;
