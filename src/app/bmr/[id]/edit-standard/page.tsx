'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, message, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import BMRForm from '@/components/BMRForm';
import { BMRData } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { mapBMRDataToDb, mapDbToBMRData } from '@/lib/data-utils';

export default function EditStandardBMR() {
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
                const mapped = mapDbToBMRData(data);
                console.log('Edit Standard - Raw DB:', data);
                console.log('Edit Standard - Mapped:', mapped);
                setRecord(mapped);
            } catch (error: any) {
                message.error('Failed to fetch record: ' + error.message);
                router.push('/');
            } finally {
                setLoading(false);
            }
        };
        fetchRecord();
    }, [params.id, router]);

    const handleSave = async (data: BMRData) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const dbData = mapBMRDataToDb(data, user?.id);
            const { error } = await supabase
                .from('bmr')
                .update(dbData)
                .eq('id', params.id);

            if (error) throw error;

            message.success('BMR updated successfully');
            router.push('/');
        } catch (error: any) {
            message.error('Error updating BMR: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="p-4 bg-white border-b shadow-sm sticky top-0 z-20 flex justify-between items-center">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.push('/')}
                >
                    Back to Dashboard
                </Button>
                <div className="text-gray-500 font-bold">Editing Standard BMR — Batch: {record?.batchNo}</div>
            </div>

            <div className="mt-6">
                {record && (
                    <BMRForm
                        key={record.id}
                        bmrType="standard"
                        initialData={record}
                        onSave={handleSave}
                    />
                )}
            </div>
        </div>
    );
}
