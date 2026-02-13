'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Typography } from 'antd';
import { ArrowLeftOutlined, FileTextOutlined, AppstoreOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function NewBMRSelection() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="p-4 bg-white border-b shadow-sm sticky top-0 z-20 flex justify-between items-center">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.push('/')}
                >
                    Back to Dashboard
                </Button>
                <div className="text-gray-500 font-bold">Create New Batch Manufacturing Record</div>
            </div>

            <div className="max-w-3xl mx-auto mt-16 px-4">
                <Title level={3} className="text-center mb-8">Select BMR Type</Title>
                <div className="grid grid-cols-2 gap-8">
                    <Card
                        hoverable
                        className="text-center shadow-md cursor-pointer border-2 hover:border-blue-500 transition-all"
                        onClick={() => router.push('/bmr/new/standard')}
                    >
                        <FileTextOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                        <Title level={4} className="mt-4">Standard BMR</Title>
                        <Text type="secondary">Single Item Process — Gown, Drape, Cover</Text>
                    </Card>
                    <Card
                        hoverable
                        className="text-center shadow-md cursor-pointer border-2 hover:border-green-500 transition-all"
                        onClick={() => router.push('/bmr/new/kit')}
                    >
                        <AppstoreOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                        <Title level={4} className="mt-4">Kit BMR</Title>
                        <Text type="secondary">Multi-Item Component Assembly</Text>
                    </Card>
                </div>
            </div>
        </div>
    );
}
