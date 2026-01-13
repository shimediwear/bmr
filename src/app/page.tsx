'use client';

import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import BMRList from '@/components/BMRList';
import { BMRData } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { mapDbToBMRData } from '@/lib/data-utils';

export default function Home() {
  const [records, setRecords] = useState<BMRData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bmr')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedData = (data || []).map(mapDbToBMRData);
      setRecords(mappedData as BMRData[]);
    } catch (error: any) {
      message.error('Failed to fetch records: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" tip="Loading Records..." />
        </div>
      ) : (
        <BMRList
          records={records}
          loading={loading}
        />
      )}
    </main>
  );
}
