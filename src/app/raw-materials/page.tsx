'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Card, Modal, Form, Input, message, Popconfirm, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase';
import { Fabric, Supplier } from '@/lib/types';

const { Title } = Typography;
const { Option } = Select;

export default function RawMaterialsPage() {
    const [materials, setMaterials] = useState<Fabric[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<Fabric | null>(null);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [materialsRes, suppliersRes] = await Promise.all([
                supabase.from('fabrics').select('*, suppliers(name)').order('name', { ascending: true }),
                supabase.from('suppliers').select('*').order('name', { ascending: true })
            ]);

            if (materialsRes.error) throw materialsRes.error;
            if (suppliersRes.error) throw suppliersRes.error;

            setMaterials(materialsRes.data || []);
            setSuppliers(suppliersRes.data || []);
        } catch (error: any) {
            message.error('Failed to fetch data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showModal = (material: Fabric | null = null) => {
        setEditingMaterial(material);
        if (material) {
            form.setFieldsValue(material);
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingMaterial(null);
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            if (editingMaterial) {
                const { error } = await supabase
                    .from('fabrics')
                    .update(values)
                    .eq('id', editingMaterial.id);
                if (error) throw error;
                message.success('Raw material updated successfully');
            } else {
                const { error } = await supabase
                    .from('fabrics')
                    .insert([values]);
                if (error) throw error;
                message.success('Raw material added successfully');
            }
            fetchData();
            handleCancel();
        } catch (error: any) {
            message.error('Operation failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const { error } = await supabase
                .from('fabrics')
                .delete()
                .eq('id', id);
            if (error) throw error;
            message.success('Raw material deleted successfully');
            fetchData();
        } catch (error: any) {
            message.error('Delete failed: ' + error.message);
        }
    };

    const columns = [
        {
            title: 'Material Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: Fabric, b: Fabric) => a.name.localeCompare(b.name),
        },
        {
            title: 'Supplier',
            dataIndex: ['suppliers', 'name'],
            key: 'supplier',
            render: (text: string, record: any) => text || 'N/A',
        },
        {
            title: 'Width',
            dataIndex: 'width',
            key: 'width',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 200,
            render: (_: any, record: Fabric) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)}>Edit</Button>
                    <Popconfirm
                        title="Are you sure you want to delete this raw material?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <Title level={2}>Manage Raw Materials</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                >
                    Add Raw Material
                </Button>
            </div>

            <Card className="shadow-sm">
                <Table
                    columns={columns}
                    dataSource={materials}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 15 }}
                />
            </Card>

            <Modal
                title={editingMaterial ? "Edit Raw Material" : "Add Raw Material"}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="name"
                        label="Material Name"
                        rules={[{ required: true, message: 'Please input the material name!' }]}
                    >
                        <Input placeholder="Enter material name" />
                    </Form.Item>
                    <Form.Item
                        name="supplier_id"
                        label="Supplier"
                        rules={[{ required: true, message: 'Please select a supplier!' }]}
                    >
                        <Select placeholder="Select supplier">
                            {suppliers.map(s => (
                                <Option key={s.id} value={s.id}>{s.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="width"
                        label="Width"
                    >
                        <Input placeholder="Enter width (e.g. 150 GSM)" />
                    </Form.Item>
                    <Form.Item className="mb-0 flex justify-end">
                        <Space>
                            <Button onClick={handleCancel}>Cancel</Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {editingMaterial ? "Update" : "Add"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
