'use client';

import React from 'react';
import { Layout, Menu } from 'antd';
import {
    FileTextOutlined,
    ExperimentOutlined,
    DashboardOutlined
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
        {
            key: '/',
            icon: <DashboardOutlined />,
            label: 'BMR Dashboard',
        },
        {
            key: '/raw-material-test',
            icon: <ExperimentOutlined />,
            label: 'Raw Material Test',
        },
        {
            key: '/suppliers',
            icon: <FileTextOutlined />,
            label: 'Suppliers',
        },
        {
            key: '/raw-materials',
            icon: <FileTextOutlined />,
            label: 'Raw Materials',
        },
    ];

    return (
        <Sider
            breakpoint="lg"
            collapsedWidth="0"
            theme="light"
            style={{
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                borderRight: '1px solid #f0f0f0',
            }}
        >
            <div style={{ height: 64, margin: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h2 style={{ margin: 0, color: '#1677ff', fontSize: '1.2rem', fontWeight: 'bold' }}>SHI Mediwear</h2>
            </div>
            <Menu
                mode="inline"
                selectedKeys={[pathname]}
                items={menuItems}
                onClick={({ key }) => router.push(key)}
            />
        </Sider>
    );
};

export default Sidebar;
