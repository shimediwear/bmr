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

    // Pagination and Search State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchText, setSearchText] = useState('');

    const fetchSuppliers = async (page = currentPage, limit = pageSize, search = searchText) => {
        setLoading(true);
        try {
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            let query = supabase
                .from('suppliers')
                .select('*', { count: 'exact' });

            if (search) {
                query = query.ilike('name', `%${search}%`);
            }

            const { data, count, error } = await query
                .order('name', { ascending: true })
                .range(from, to);

            if (error) throw error;
            setSuppliers(data || []);
            setTotal(count || 0);
        } catch (error: any) {
            message.error('Failed to fetch suppliers: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers(currentPage, pageSize, searchText);
    }, [currentPage, pageSize, searchText]);

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        setCurrentPage(1);
    };

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
                <Space>
                    <Input.Search
                        placeholder="Search supplier name"
                        onSearch={handleSearch}
                        style={{ width: 300 }}
                        allowClear
                        enterButton
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showModal()}
                    >
                        Add Supplier
                    </Button>
                </Space>
            </div>

            <Card className="shadow-sm">
                <Table
                    columns={columns}
                    dataSource={suppliers}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: total,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} items`,
                    }}
                    onChange={handleTableChange}
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
