'use client';

import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function LoginPage() {
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
            });

            if (error) throw error;

            message.success('Logged in successfully');
            window.location.href = '/';
        } catch (error: any) {
            message.error(error.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <Card className="w-full max-w-md shadow-lg border-t-4 border-blue-500">
                <div className="text-center mb-8">
                    <Title level={2} className="mb-0">BMR Generator</Title>
                    <Text type="secondary">Sign in to your account</Text>
                </div>

                <Form
                    name="login"
                    layout="vertical"
                    onFinish={onFinish}
                    size="large"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Email Address" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Log in
                        </Button>
                    </Form.Item>
                </Form>

                <div className="text-center mt-4">
                    <Text type="secondary" text-xs>
                        Contact administrator for account access.
                    </Text>
                </div>
            </Card>
        </div>
    );
}
