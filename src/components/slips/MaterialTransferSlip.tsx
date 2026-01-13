'use client';

import React from 'react';
import { BMRData } from '@/lib/types';
import dayjs from 'dayjs';

interface MaterialTransferSlipProps {
    data: BMRData;
}

const MaterialTransferSlip: React.FC<MaterialTransferSlipProps> = ({ data }) => {
    const allMaterials = [
        ...(data.rawMaterials || []),
        ...(data.packingMaterials || [])
    ];

    return (
        <div className="bmr-container px-8 py-4 bg-white text-black font-serif text-sm">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-xl font-bold uppercase underline">SHI MEDIWEAR PVT. LTD.</h1>
                <div className="flex justify-between mt-2 text-xs font-bold">
                    <div>Format Ref. No. : SMPLMTL-04</div>
                    <div>Rev. No. : 00</div>
                </div>
            </div>

            <h2 className="text-lg font-bold text-center border-y border-black py-1 mb-4">Material Requisition Slip</h2>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-y-2 mb-6 border border-black p-4">
                <div><strong>From:</strong> Production</div>
                <div><strong>Date:</strong> {dayjs().format('DD-MM-YYYY')}</div>
                <div className="col-span-2"><strong>Material Required for:</strong> {data.productName}</div>
                <div><strong>Batch No:</strong> {data.batchNo}</div>
                <div><strong>Department:</strong> Production</div>
            </div>

            {/* Table */}
            <table className="w-full border-collapse border border-black mb-8">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-black p-1 w-12">S. No.</th>
                        <th className="border border-black p-1">Product Description</th>
                        <th className="border border-black p-1 w-16">Unit</th>
                        <th className="border border-black p-1 w-24">Qty. Req.</th>
                        <th className="border border-black p-1 w-24">Qty. Issued</th>
                        <th className="border border-black p-1 w-32">Lot No / Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {allMaterials.map((item, idx) => (
                        <tr key={idx}>
                            <td className="border border-black p-1 text-center">{idx + 1}</td>
                            <td className="border border-black p-1">{item.name}</td>
                            <td className="border border-black p-1 text-center">{item.unit}</td>
                            <td className="border border-black p-1 text-center">{item.requiredQty}</td>
                            <td className="border border-black p-1 text-center">{item.issuedQty}</td>
                            <td className="border border-black p-1">{item.lotNo}</td>
                        </tr>
                    ))}
                    {allMaterials.length === 0 && (
                        <tr>
                            <td colSpan={6} className="border border-black p-4 text-center italic">No materials found for this batch.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Footer Signatures */}
            <div className="grid grid-cols-4 gap-4 mt-20 text-center text-xs font-bold">
                <div className="border-t border-black pt-1">Requisitioned By</div>
                <div className="border-t border-black pt-1">Sanctioned By</div>
                <div className="border-t border-black pt-1">Issued By</div>
                <div className="border-t border-black pt-1">Received By</div>
            </div>

            {/* Print Trigger */}
            <div className="no-print mt-12 text-center">
                <button
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold shadow-md hover:bg-blue-700"
                >
                    Print Material Transfer Slip
                </button>
            </div>
        </div>
    );
};

export default MaterialTransferSlip;
