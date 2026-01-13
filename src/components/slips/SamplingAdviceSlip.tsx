'use client';

import React from 'react';
import { BMRData } from '@/lib/types';
import dayjs from 'dayjs';

interface SamplingAdviceSlipProps {
    data: BMRData;
}

const SamplingAdviceSlip: React.FC<SamplingAdviceSlipProps> = ({ data }) => {
    return (
        <div className="bmr-container bg-white text-black font-serif text-sm px-8 py-4">
            {/* 1. Sampling Advice (SMPLQC-12) */}
            <div className="sampling-advice-page min-h-[500px] mb-20 relative border-b-2 border-dashed border-gray-300 pb-10">
                <div className="text-center mb-6">
                    <h1 className="text-xl font-bold underline">SHI MEDIWEAR PVT. LTD.</h1>
                    <div className="flex justify-between mt-2 text-xs font-bold px-4">
                        <div>Format Ref. No. : SMPLQC-12</div>
                        <div>Rev. No. : 00</div>
                    </div>
                </div>

                <h2 className="text-lg font-bold text-center border-y border-black py-1 mb-6">Sampling Advice</h2>

                <div className="flex justify-between mb-6 text-sm">
                    <div><strong>From:</strong> Production</div>
                    <div><strong>Ref. No. :</strong> {data.batchNo || '---'} / SA</div>
                </div>

                <div className="mb-6">
                    <p className="font-bold">To: The Office QC</p>
                    <p>Pls. collect the following sample for Finished Product</p>
                </div>

                <table className="w-full border-collapse border border-black text-sm">
                    <tbody>
                        <tr><th className="border border-black p-2 text-left w-1/3">Name of Item/Product</th><td className="border border-black p-2">{data.productName}</td></tr>
                        <tr><th className="border border-black p-2 text-left">Lot/Batch No.</th><td className="border border-black p-2 font-bold">{data.batchNo}</td></tr>
                        <tr><th className="border border-black p-2 text-left">Lot/Batch/Target Size</th><td className="border border-black p-2">{data.batchSize}</td></tr>
                        <tr><th className="border border-black p-2 text-left">Manufactured By</th><td className="border border-black p-2">SHI Mediwear Pvt. Ltd.</td></tr>
                        <tr><th className="border border-black p-2 text-left">Date of Manufacturing</th><td className="border border-black p-2">{data.mfgDate}</td></tr>
                        <tr><th className="border border-black p-2 text-left">Date of Expiry</th><td className="border border-black p-2">{data.expDate}</td></tr>
                        <tr><th className="border border-black p-2 text-left">Sample Qty.</th><td className="border border-black p-2 font-bold">{data.finalPacking?.controlSampleQty || '2 Units'}</td></tr>
                    </tbody>
                </table>

                <div className="grid grid-cols-2 gap-20 mt-20 text-center font-bold text-xs uppercase">
                    <div>
                        <div className="border-t border-black pt-1">ISSUED BY</div>
                        <div className="mt-1">PRODUCTION</div>
                    </div>
                    <div>
                        <div className="border-t border-black pt-1">DRAWN BY / DATE</div>
                        <div className="mt-1">QC DEPARTMENT</div>
                    </div>
                </div>
            </div>

            <div className="page-break"></div>

            {/* 2. Control Sample Request (SMPLFG-01) */}
            <div className="control-sample-page min-h-[500px] mt-10">
                <div className="text-center mb-6">
                    <h1 className="text-xl font-bold underline">SHI MEDIWEAR PVT. LTD.</h1>
                    <div className="flex justify-between mt-2 text-xs font-bold px-4">
                        <div>Format Ref. No. : SMPLFG-01</div>
                        <div>Rev. No. : 00</div>
                    </div>
                </div>

                <h2 className="text-lg font-bold text-center border-y border-black py-1 mb-6 uppercase">Request Slip for Collection for Control Sample</h2>

                <div className="flex justify-between mb-6 text-sm">
                    <div><strong>From:</strong> Production</div>
                    <div><strong>S. No. :</strong> {data.batchNo || '---'} / CS</div>
                </div>

                <div className="mb-6">
                    <p className="font-bold">To: The Office QC</p>
                    <p>Pls. collect the control sample of following batch No.</p>
                </div>

                <table className="w-full border-collapse border border-black text-sm">
                    <tbody>
                        <tr><th className="border border-black p-2 text-left w-1/3">Name of Product</th><td className="border border-black p-2">{data.productName}</td></tr>
                        <tr><th className="border border-black p-2 text-left">Batch No./Lot No.</th><td className="border border-black p-2 font-bold">{data.batchNo}</td></tr>
                        <tr><th className="border border-black p-2 text-left">Sample Qty.</th><td className="border border-black p-2 font-bold">{data.finalPacking?.controlSampleQty || '02 Unit'}</td></tr>
                        <tr><th className="border border-black p-2 text-left">Mfg Date</th><td className="border border-black p-2">{data.mfgDate}</td></tr>
                        <tr><th className="border border-black p-2 text-left">Exp. Date</th><td className="border border-black p-2">{data.expDate}</td></tr>
                    </tbody>
                </table>

                <div className="grid grid-cols-2 gap-20 mt-24 text-center font-bold text-xs uppercase">
                    <div>
                        <div className="border-t border-black pt-1">Head of Production</div>
                    </div>
                    <div>
                        <div className="border-t border-black pt-1">Received By / Date</div>
                        <div className="mt-1">QC DEPARTMENT</div>
                    </div>
                </div>
            </div>

            {/* Print Trigger */}
            <div className="no-print mt-12 text-center">
                <button
                    onClick={() => window.print()}
                    className="bg-green-600 text-white px-6 py-2 rounded-md font-bold shadow-md hover:bg-green-700"
                >
                    Print All Advice Slips
                </button>
            </div>
        </div>
    );
};

export default SamplingAdviceSlip;
