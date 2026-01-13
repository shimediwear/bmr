'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, message, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import SamplingAdviceSlip from '@/components/slips/SamplingAdviceSlip';
import { BMRData } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { mapDbToBMRData } from '@/lib/data-utils';

export default function SamplingAdvicePage() {
    const router = useRouter();
    const params = useParams();
    const [record, setRecord] = useState<BMRData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecord = async () => {
            if (!params.id) return;
            try {
                const { data, error } = await supabase
                    .from('bmr')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (error) throw error;
                setRecord(mapDbToBMRData(data));
            } catch (error: any) {
                message.error('Failed to fetch record: ' + error.message);
                router.push('/');
            } finally {
                setLoading(false);
            }
        };
        fetchRecord();
    }, [params.id, router]);

    useEffect(() => {
        if (record) {
            const timer = setTimeout(() => {
                window.print();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [record]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" tip="Generating Sampling Advice..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="p-4 bg-gray-50 border-b no-print flex justify-between items-center sticky top-0 z-20">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.push('/')}
                >
                    Back to Dashboard
                </Button>
                <div className="text-gray-500 font-bold">Sampling Advice: {record?.batchNo}</div>
            </div>

            <div className="print-content">
                <SamplingAdviceSlip data={record!} />
            </div>
        </div>
    );
}
