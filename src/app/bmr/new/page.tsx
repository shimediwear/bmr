'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import BMRForm from '@/components/BMRForm';
import { BMRData } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { mapBMRDataToDb } from '@/lib/data-utils';

export default function NewBMR() {
    const router = useRouter();

    const handleSave = async (data: BMRData) => {
        try {
            const dbData = mapBMRDataToDb(data);
            const { error } = await supabase.from('bmr').insert([dbData]);

            if (error) throw error;

            message.success('BMR created successfully');
            router.push('/');
        } catch (error: any) {
            message.error('Error saving BMR: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="p-4 bg-white border-b shadow-sm sticky top-0 z-20 flex justify-between items-center">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.push('/')}
                >
                    Back to Dashboard
                </Button>
                <div className="text-gray-500 font-bold">New Batch Manufacturing Record</div>
            </div>

            <div className="mt-6">
                <BMRForm initialData={{}} onSave={handleSave} />
            </div>
        </div>
    );
}
