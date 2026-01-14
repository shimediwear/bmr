'use client';

import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    DatePicker,
    Select,
    Button,
    Table,
    Space,
    Card,
    Row,
    Col,
    Typography,
    Divider,
    message
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { supabase } from '@/lib/supabase';
import { IncomingReport, TestResult, Supplier, Fabric } from '@/lib/types';
import { mapIncomingReportToDb } from '@/lib/data-utils';

const { Title } = Typography;
const { Option } = Select;

const LEVEL_CONFIG: Record<string, Record<string, { standard: string, unit: string, unitOptions?: string[] }>> = {
    'LEVEL 1': {
        'Basic Weight (GSM)': { standard: '35 to 100 GSM ± 2 GSM', unit: 'GSM' },
        'Impact Penetration (gm)': { standard: '≤ 4.5', unit: 'g' },
        'Hydrostatic Resistance': { standard: 'NA', unit: 'cmwc' },
        'Tensile Strength - Dry (MD) (Newton/Kgf)': { standard: '≥ 20 / 2.1', unit: 'N', unitOptions: ['N', 'Kgf'] },
        'Tensile Strength - Dry (CD) (Newton/Kgf)': { standard: '≥ 20 / 2.1', unit: 'N', unitOptions: ['N', 'Kgf'] },
        'Tensile Strength - Wet (MD) (Newton/Kgf)': { standard: '≥ 20 / 2.1', unit: 'N', unitOptions: ['N', 'Kgf'] },
        'Tensile Strength - Wet (CD) (Newton/Kgf)': { standard: '≥ 20 / 2.1', unit: 'N', unitOptions: ['N', 'Kgf'] },
        'Elongation - MD (Dry)': { standard: 'Min 30%', unit: '%' },
        'Elongation - CD (Dry)': { standard: 'Min 30%', unit: '%' },
        'Elongation - MD (Wet)': { standard: 'Min 30%', unit: '%' },
        'Elongation - CD (Wet)': { standard: 'Min 30%', unit: '%' },
        'Bursting Strength - Dry (kPa/kg/cm²)': { standard: '≥ 40 / 0.4', unit: 'kPa', unitOptions: ['kPa', 'Kg/cm²'] },
        'Bursting Strength - Wet (kPa/kg/cm²)': { standard: '≥ 40 / 0.4', unit: 'kPa', unitOptions: ['kPa', 'Kg/cm²'] },
        'Cleanliness Microbial (CFU/100 cm²)': { standard: '≤ 300', unit: 'CFU/100 cm²' },
    },
    'LEVEL 2': {
        'Basic Weight (GSM)': { standard: '35 to 100 GSM ± 2 GSM', unit: 'GSM' },
        'Impact Penetration (gm)': { standard: '≤ 1.0', unit: 'g' },
        'Hydrostatic Resistance': { standard: '≥ 20', unit: 'cmwc' },
        'Tensile Strength - Dry (MD) (Newton/Kgf)': { standard: '≥ 20 / 2.1', unit: 'N', unitOptions: ['N', 'Kgf'] },
        'Tensile Strength - Dry (CD) (Newton/Kgf)': { standard: '≥ 20 / 2.1', unit: 'N', unitOptions: ['N', 'Kgf'] },
        'Tensile Strength - Wet (MD) (Newton/Kgf)': { standard: '≥ 20 / 2.1', unit: 'N', unitOptions: ['N', 'Kgf'] },
        'Tensile Strength - Wet (CD) (Newton/Kgf)': { standard: '≥ 20 / 2.1', unit: 'N', unitOptions: ['N', 'Kgf'] },
        'Elongation - MD (Dry)': { standard: 'Min 30%', unit: '%' },
        'Elongation - CD (Dry)': { standard: 'Min 30%', unit: '%' },
        'Elongation - MD (Wet)': { standard: 'Min 30%', unit: '%' },
        'Elongation - CD (Wet)': { standard: 'Min 30%', unit: '%' },
        'Bursting Strength - Dry (kPa/kg/cm²)': { standard: '≥ 40 / 0.4', unit: 'kPa', unitOptions: ['kPa', 'Kg/cm²'] },
        'Bursting Strength - Wet (kPa/kg/cm²)': { standard: '≥ 40 / 0.4', unit: 'kPa', unitOptions: ['kPa', 'Kg/cm²'] },
        'Cleanliness Microbial (CFU/100 cm²)': { standard: '≤ 300', unit: 'CFU/100 cm²' },
    },
    'LEVEL 3': {
        'Basic Weight (GSM)': { standard: '35 to 100 GSM ± 2 GSM', unit: 'GSM' },
        'Impact Penetration (gm)': { standard: '≤ 1.0', unit: 'g' },
        'Hydrostatic Resistance': { standard: '≥ 50', unit: 'cmwc' },
        'Tensile Strength - Dry (MD) (Newton/Kgf)': { standard: '≥ 20 / 2.1', unit: 'N', unitOptions: ['N', 'Kgf'] },
        'Tensile Strength - Dry (CD) (Newton/Kgf)': { standard: '≥ 20 / 2.1', unit: 'N', unitOptions: ['N', 'Kgf'] },
        'Tensile Strength - Wet (MD) (Newton/Kgf)': { standard: '≥ 20 / 2.1', unit: 'N', unitOptions: ['N', 'Kgf'] },
        'Tensile Strength - Wet (CD) (Newton/Kgf)': { standard: '≥ 20 / 2.1', unit: 'N', unitOptions: ['N', 'Kgf'] },
        'Elongation - MD (Dry)': { standard: 'Min 30%', unit: '%' },
        'Elongation - CD (Dry)': { standard: 'Min 30%', unit: '%' },
        'Elongation - MD (Wet)': { standard: 'Min 30%', unit: '%' },
        'Elongation - CD (Wet)': { standard: 'Min 30%', unit: '%' },
        'Bursting Strength - Dry (kPa/kg/cm²)': { standard: '≥ 40 / 0.4', unit: 'kPa', unitOptions: ['kPa', 'Kg/cm²'] },
        'Bursting Strength - Wet (kPa/kg/cm²)': { standard: '≥ 40 / 0.4', unit: 'kPa', unitOptions: ['kPa', 'Kg/cm²'] },
        'Cleanliness Microbial (CFU/100 cm²)': { standard: '≤ 300', unit: 'CFU/100 cm²' },
    },
    'LEVEL 4': {
        'Basic Weight (GSM)': { standard: '35 to 100 GSM ± 2 GSM', unit: 'GSM' },
        'Impact Penetration (gm)': { standard: 'NA', unit: 'g' },
        'Hydrostatic Resistance': { standard: 'NA', unit: 'cmwc' },
        'Tensile Strength - Dry (MD) (Newton/Kgf)': { standard: '≥ 20 / 2.1', unit: 'N', unitOptions: ['N', 'Kgf'] },
        'Tensile Strength - Dry (CD) (Newton/Kgf)': { standard: '≥ 20 / 2.1', unit: 'N', unitOptions: ['N', 'Kgf'] },
        'Tensile Strength - Wet (MD) (Newton/Kgf)': { standard: '≥ 20 / 2.1', unit: 'N', unitOptions: ['N', 'Kgf'] },
        'Tensile Strength - Wet (CD) (Newton/Kgf)': { standard: '≥ 20 / 2.1', unit: 'N', unitOptions: ['N', 'Kgf'] },
        'Elongation - MD (Dry)': { standard: 'Min 30%', unit: '%' },
        'Elongation - CD (Dry)': { standard: 'Min 30%', unit: '%' },
        'Elongation - MD (Wet)': { standard: 'Min 30%', unit: '%' },
        'Elongation - CD (Wet)': { standard: 'Min 30%', unit: '%' },
        'Bursting Strength - Dry (kPa/kg/cm²)': { standard: '≥ 40 / 0.4', unit: 'kPa', unitOptions: ['kPa', 'Kg/cm²'] },
        'Bursting Strength - Wet (kPa/kg/cm²)': { standard: '≥ 40 / 0.4', unit: 'kPa', unitOptions: ['kPa', 'Kg/cm²'] },
        'Cleanliness Microbial (CFU/100 cm²)': { standard: '≤ 300', unit: 'CFU/100 cm²' },
    },
};

const getDefaultParameters = (level: string): TestResult[] => {
    const config = LEVEL_CONFIG[level] || LEVEL_CONFIG['LEVEL 3'];
    return Object.entries(config).map(([test, details], idx) => ({
        sNo: `${idx + 1}.`,
        test,
        standard: details.standard,
        unit: details.unit,
        result: (test.includes('Impact') || test.includes('Hydrostatic') || test.includes('Cleanliness')) && details.standard === 'NA' ? 'NA' : ''
    }));
};

const defaultBiocompatibility: TestResult[] = [
    { sNo: '1', test: 'Cytotoxicity', standard: 'Non - cytotoxic', result: 'ISO 10993-10:2021 & OECD 406' },
    { sNo: '2', test: 'Skin Irritation', standard: 'Non - irritant', result: 'ISO 10993-23:2021' },
    { sNo: '3', test: 'Skin Sensitization', standard: 'Non - sensitizer', result: 'ISO 10993-5:2009' },
];

const defaultVisualDefects: TestResult[] = [
    { sNo: '1', test: 'Insect', standard: 'Visual', result: 'Not Found' },
    { sNo: '2', test: 'Foreign Material & Oil', standard: 'Visual', result: 'Not Found' },
    { sNo: '3', test: 'Hard Spots', standard: 'Visual', result: 'Not Found' },
    { sNo: '4', test: 'Thin Spots', standard: 'Visual', result: 'Not Found' },
    { sNo: '5', test: 'Holes', standard: 'Visual', result: 'Not Found' },
    { sNo: '6', test: 'Roll Width', standard: 'Visual', result: '' },
    { sNo: '7', test: 'Core Inner Diameter', standard: 'Visual', result: '' },
    { sNo: '8', test: 'Core Length', standard: 'Visual', result: '' },
];

interface RawMaterialTestFormProps {
    initialValues?: Partial<IncomingReport>;
    onSuccess: () => void;
}

const RawMaterialTestForm: React.FC<RawMaterialTestFormProps> = ({ initialValues, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [fabrics, setFabrics] = useState<Fabric[]>([]);

    useEffect(() => {
        fetchMetadata();
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                invoiceDate: initialValues.invoiceDate ? dayjs(initialValues.invoiceDate) : undefined,
                mfgDate: initialValues.mfgDate ? dayjs(initialValues.mfgDate) : undefined,
                expDate: initialValues.expDate ? dayjs(initialValues.expDate) : undefined,
                sampleDate: initialValues.sampleDate ? dayjs(initialValues.sampleDate) : undefined,
                releaseDate: initialValues.releaseDate ? dayjs(initialValues.releaseDate) : undefined,
            });
        } else {
            const defaultLevel = 'LEVEL 3';
            form.setFieldsValue({
                performanceLevel: defaultLevel,
                parametersResults: getDefaultParameters(defaultLevel),
                biocompatibilityResult: defaultBiocompatibility,
                visualResults: defaultVisualDefects,
                result: 'Comply',
                testedBy: 'Monu',
                reviewedBy: 'Jyoti',
            });
        }
    }, [initialValues]);

    const performanceLevel = Form.useWatch('performanceLevel', form);

    useEffect(() => {
        if (!initialValues && performanceLevel) {
            const currentParams = form.getFieldValue('parametersResults') || [];
            const newDefaults = getDefaultParameters(performanceLevel);

            const updatedParams = newDefaults.map((def, idx) => {
                const existing = currentParams[idx];
                return {
                    ...def,
                    result: existing?.result || def.result,
                    unit: existing?.unit || def.unit
                };
            });

            form.setFieldsValue({ parametersResults: updatedParams });
        }
    }, [performanceLevel, initialValues]);

    const fetchMetadata = async () => {
        const { data: sData } = await supabase.from('suppliers').select('*');
        const { data: fData } = await supabase.from('fabrics').select('*');
        if (sData) setSuppliers(sData);
        if (fData) setFabrics(fData);
    };

    const handleFabricChange = (fabricName: string) => {
        const fabric = fabrics.find(f => f.name === fabricName);
        if (fabric && fabric.supplier_id) {
            form.setFieldsValue({ supplierId: fabric.supplier_id });
        }
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const mergeStaticData = (results: any[], defaults: any[]) => {
                return (results || []).map((res, idx) => ({
                    ...defaults[idx],
                    ...res
                }));
            };

            const { data: { user } } = await supabase.auth.getUser();

            const finalValues = {
                ...values,
                parametersResults: mergeStaticData(values.parametersResults, getDefaultParameters(values.performanceLevel)),
                biocompatibilityResult: mergeStaticData(values.biocompatibilityResult, defaultBiocompatibility),
                visualResults: mergeStaticData(values.visualResults, defaultVisualDefects),
                invoiceDate: values.invoiceDate?.toISOString(),
                mfgDate: values.mfgDate?.toISOString(),
                expDate: values.expDate?.toISOString(),
                sampleDate: values.sampleDate?.toISOString(),
                releaseDate: values.releaseDate?.toISOString(),
                updated_at: new Date().toISOString(),
            };

            const dbData = mapIncomingReportToDb(finalValues, user?.id);

            let error;
            if (initialValues?.id) {
                ({ error } = await supabase.from('rm_test_reports').update(dbData).eq('id', initialValues.id));
            } else {
                ({ error } = await supabase.from('rm_test_reports').insert([dbData]));
            }

            if (error) throw error;
            message.success('Report saved successfully');
            onSuccess();
        } catch (error: any) {
            message.error('Failed to save report: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderTable = (fieldName: string, title: string) => (
        <div style={{ marginBottom: 24 }}>
            <Title level={4}>{title}</Title>
            <Form.List name={fieldName}>
                {(fields) => (
                    <Table
                        dataSource={form.getFieldValue(fieldName)}
                        pagination={false}
                        rowKey="sNo"
                        columns={[
                            { title: 'S. No.', dataIndex: 'sNo', key: 'sNo', width: 60 },
                            { title: 'TEST', dataIndex: 'test', key: 'test', width: 250 },
                            { title: 'STANDARD REQUIREMENTS', dataIndex: 'standard', key: 'standard' },
                            ...(fieldName === 'parametersResults' ? [{
                                title: 'UNIT',
                                key: 'unit',
                                width: 120,
                                render: (_: any, record: TestResult, index: number) => {
                                    const level = form.getFieldValue('performanceLevel') || 'LEVEL 3';
                                    const options = LEVEL_CONFIG[level]?.[record.test]?.unitOptions;

                                    if (options) {
                                        return (
                                            <Form.Item name={[index, 'unit']} style={{ margin: 0 }}>
                                                <Select>
                                                    {options.map(o => <Option key={o} value={o}>{o}</Option>)}
                                                </Select>
                                            </Form.Item>
                                        );
                                    }
                                    return <Form.Item name={[index, 'unit']} style={{ margin: 0 }}><Input /></Form.Item>;
                                }
                            }] : []),
                            {
                                title: 'RESULT',
                                key: 'result',
                                width: 150,
                                render: (_, record: any, index: number) => (
                                    <Form.Item
                                        name={[index, 'result']}
                                        style={{ margin: 0 }}
                                    >
                                        <Input />
                                    </Form.Item>
                                )
                            },
                        ]}
                    />
                )}
            </Form.List>
        </div>
    );

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            <Card title="Raw Material Test Report" extra={<Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={loading}>Save Report</Button>}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="productName" label="Product Name" rules={[{ required: true }]}>
                            <Select
                                placeholder="Select Fabric"
                                showSearch
                                optionFilterProp="children"
                                onChange={handleFabricChange}
                            >
                                {fabrics.map(f => <Option key={f.id} value={f.name}>{f.name}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="reportNo" label="T.R. No." rules={[{ required: true }]}>
                            <Input placeholder="e.g. 251227JPF110-1" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="performanceLevel" label="Performance Level" rules={[{ required: true }]}>
                            <Select>
                                <Option value="LEVEL 1">LEVEL 1</Option>
                                <Option value="LEVEL 2">LEVEL 2</Option>
                                <Option value="LEVEL 3">LEVEL 3</Option>
                                <Option value="LEVEL 4">LEVEL 4</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="batchNo" label="Batch No." rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="supplierId" label="Supplier Name" rules={[{ required: true }]}>
                            <Select disabled placeholder="Supplier automatically selected">
                                {suppliers.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="batchSize" label="Total Batch Size" rules={[{ required: true }]}>
                            <Input placeholder="e.g. 7 Roll" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item name="invoiceNo" label="Invoice No." rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="invoiceDate" label="Invoice Date" rules={[{ required: true }]}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="sampleQty" label="Sample Qty." rules={[{ required: true }]}>
                            <Input placeholder="e.g. 5 Mtrs" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="sampleDate" label="Date of Sample" rules={[{ required: true }]}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item name="mfgDate" label="Mfg. Date">
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="expDate" label="Exp. Date">
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="releaseDate" label="Release Date" rules={[{ required: true }]}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="fabricComposition" label="Fabric Composition" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider />

                {renderTable('parametersResults', 'Fabric Parameters')}
                {renderTable('biocompatibilityResult', 'Biocompatibility Test (External Lab)')}
                {renderTable('visualResults', 'Visual Defects')}

                <Divider />

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="result" label="Final Result" rules={[{ required: true }]}>
                            <Select>
                                <Option value="Comply">Comply</Option>
                                <Option value="Does not Comply">Does not Comply</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="testedBy" label="Tested By" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="reviewedBy" label="Reviewed By" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        </Form>
    );
};

export default RawMaterialTestForm;
