'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Card, Modal, Form, Input, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase';
import { Supplier } from '@/lib/types';

const { Title } = Typography;

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [form] = Form.useForm();

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('suppliers')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            setSuppliers(data || []);
        } catch (error: any) {
            message.error('Failed to fetch suppliers: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const showModal = (supplier: Supplier | null = null) => {
        setEditingSupplier(supplier);
        if (supplier) {
            form.setFieldsValue(supplier);
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingSupplier(null);
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            if (editingSupplier) {
                const { error } = await supabase
                    .from('suppliers')
                    .update(values)
                    .eq('id', editingSupplier.id);
                if (error) throw error;
                message.success('Supplier updated successfully');
            } else {
                const { error } = await supabase
                    .from('suppliers')
                    .insert([values]);
                if (error) throw error;
                message.success('Supplier added successfully');
            }
            fetchSuppliers();
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
                .from('suppliers')
                .delete()
                .eq('id', id);
            if (error) throw error;
            message.success('Supplier deleted successfully');
            fetchSuppliers();
        } catch (error: any) {
            message.error('Delete failed: ' + error.message);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: Supplier, b: Supplier) => a.name.localeCompare(b.name),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 200,
            render: (_: any, record: Supplier) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)}>Edit</Button>
                    <Popconfirm
                        title="Are you sure you want to delete this supplier?"
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
                <Title level={2}>Manage Suppliers</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                >
                    Add Supplier
                </Button>
            </div>

            <Card className="shadow-sm">
                <Table
                    columns={columns}
                    dataSource={suppliers}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 15 }}
                />
            </Card>

            <Modal
                title={editingSupplier ? "Edit Supplier" : "Add Supplier"}
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
                        label="Supplier Name"
                        rules={[{ required: true, message: 'Please input the supplier name!' }]}
                    >
                        <Input placeholder="Enter supplier name" />
                    </Form.Item>
                    <Form.Item className="mb-0 flex justify-end">
                        <Space>
                            <Button onClick={handleCancel}>Cancel</Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {editingSupplier ? "Update" : "Add"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
