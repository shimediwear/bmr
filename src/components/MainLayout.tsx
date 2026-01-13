'use client';

import React from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';

const { Content } = Layout;

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar />
            <Layout style={{ marginLeft: 200 }}>
                <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', borderRadius: 8 }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
