'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Spin, message } from 'antd';
import { supabase } from '@/lib/supabase';

// This page auto-detects the BMR type and redirects to the correct edit page
export default function EditBMRRedirect() {
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const detectAndRedirect = async () => {
            if (!params.id) return;
            try {
                const { data, error } = await supabase
                    .from('bmr')
                    .select('bmr_type')
                    .eq('id', params.id)
                    .single();

                if (error) throw error;

                const bmrType = data.bmr_type || 'standard';
                router.replace(`/bmr/${params.id}/edit-${bmrType}`);
            } catch (error: any) {
                message.error('Failed to fetch record: ' + error.message);
                router.push('/');
            }
        };
        detectAndRedirect();
    }, [params.id, router]);

    return (
        <div className="flex justify-center items-center h-screen">
            <Spin size="large" />
        </div>
    );
}
