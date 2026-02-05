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

    // Pagination and Search State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchText, setSearchText] = useState('');

    const fetchMaterials = async (page = currentPage, limit = pageSize, search = searchText) => {
        setLoading(true);
        try {
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            let query = supabase
                .from('fabrics')
                .select('*, suppliers(name)', { count: 'exact' });

            if (search) {
                query = query.ilike('name', `%${search}%`);
            }

            const { data, count, error } = await query
                .order('created_at', { ascending: false }) // Changed to created_at desc for better UX on new items, or keep name ascending if preferred. Let's stick to name ascending as per previous code but paginated? Usually list is latest first. Previous was name asc. Let's keeping name asc.
                .order('name', { ascending: true })
                .range(from, to);

            if (error) throw error;
            setMaterials(data || []);
            setTotal(count || 0);
        } catch (error: any) {
            message.error('Failed to fetch materials: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const { data, error } = await supabase.from('suppliers').select('*').order('name', { ascending: true });
            if (error) throw error;
            setSuppliers(data || []);
        } catch (error: any) {
            message.error('Failed to fetch suppliers: ' + error.message);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    useEffect(() => {
        fetchMaterials(currentPage, pageSize, searchText);
    }, [currentPage, pageSize, searchText]);

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        setCurrentPage(1);
    };

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
            fetchMaterials();
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
            fetchMaterials();
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
                <Space>
                    <Input.Search
                        placeholder="Search material name"
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
                        Add Raw Material
                    </Button>
                </Space>
            </div>

            <Card className="shadow-sm">
                <Table
                    columns={columns}
                    dataSource={materials}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: total,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} items`,
                        onChange: handleTableChange // Note: Antd Table onChange handles pagination if configured like this, but we are using controlled pagination
                    }}
                    onChange={handleTableChange}
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
                        <Select
                            showSearch
                            placeholder="Select supplier"
                            optionFilterProp="label"
                            options={suppliers.map(s => ({
                                value: s.id,
                                label: s.name,
                            }))}
                        />

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
