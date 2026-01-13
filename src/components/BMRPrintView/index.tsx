'use client';

import React from 'react';
import { BMRData, KitProcessItem, ProcessStep, KitContent } from '@/lib/types';
import dayjs from 'dayjs';

interface BMRPrintViewProps {
    data: BMRData;
}

const BMRPrintView: React.FC<BMRPrintViewProps> = ({ data }) => {
    const docInfo = data.bmrType === 'kit' ? {
        docNo: 'SMPL/PRD/BMR/02',
        revNo: '01 & 24.06.2023',
        issueNo: '02 & 01.07.2023'
    } : {
        docNo: 'SMPL/PRD/BMR/01',
        revNo: '01 & 01.01.2023',
        issueNo: '01 & 01.01.2023'
    };

    const isKit = data.bmrType === 'kit';

    return (
        <div className="bmr-container print-only">
            {/* Custom Styles for Page Numbering */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .page-number::after {
                        content: counter(page);
                    }
                    /* Reset counter at the start of container */
                    body {
                        counter-reset: page;
                    }
                }
            `}} />

            <table className="w-full border-collapse">
                {/* Header - Repeats on every page */}
                <thead>
                    <tr>
                        <td className="p-0 border-none">
                            <div className="header-space h-[160px]">
                                <div className="flex border-b-2 border-black pb-2 items-center">
                                    <div className="w-1/4">
                                        <div className="w-20 h-20 bg-white flex items-center justify-center text-xs font-bold border border-black p-1">
                                            <span className="text-center">SHI<br />MEDIWEAR</span>
                                        </div>
                                    </div>
                                    <div className="w-2/4 text-center">
                                        <h1 className="text-xl font-bold m-0 uppercase">Batch Manufacturing Record</h1>
                                        <p className="text-sm font-bold m-0 mt-1 uppercase">SHI Mediwear Pvt. Ltd.</p>
                                        <p className="text-[10px] m-0">93/13, Road No. 1A, Mundka Industrial Area, New Delhi - 110041.</p>
                                    </div>
                                    <div className="w-1/4 text-[10px]">
                                        <div className="border border-black p-1 mb-1">
                                            <strong>Doc No:</strong> {docInfo.docNo}
                                        </div>
                                        <div className="border border-black p-1">
                                            <strong>Rev No:</strong> {docInfo.revNo}
                                        </div>
                                        <div className="border border-black p-1 mt-1">
                                            <strong>Issue No:</strong> {docInfo.issueNo}
                                        </div>
                                        <div className="border border-black p-1 mt-1 bg-gray-50 font-bold">
                                            <strong>Page No:</strong> <span className="page-number text-red-600"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </thead>

                {/* Main Content */}
                <tbody>
                    <tr>
                        <td className="p-0 border-none">
                            <div className="bmr-content py-4">

                                {/* 1. Product & Batch Details */}
                                <h3 className="section-title text-sm font-bold mb-2 uppercase border-b border-black">1. Product & Batch Details</h3>
                                <table className="mb-6 w-full text-xs bmr-table">
                                    <tbody>
                                        <tr>
                                            <th className="w-1/4 bg-gray-50 text-left p-1 border border-black">Product Name</th>
                                            <td className="w-1/4 p-1 border border-black">{data.productName}</td>
                                            <th className="w-1/4 bg-gray-50 text-left p-1 border border-black">Product Code</th>
                                            <td className="w-1/4 p-1 border border-black">{data.productCode}</td>
                                        </tr>
                                        <tr>
                                            <th className="bg-gray-50 text-left p-1 border border-black">Brand Name</th>
                                            <td className="p-1 border border-black">{data.brandName}</td>
                                            <th className="bg-gray-50 text-left p-1 border border-black">Product Size</th>
                                            <td className="p-1 border border-black">{data.productSize}</td>
                                        </tr>
                                        <tr>
                                            <th className="bg-gray-50 text-left p-1 border border-black">Batch No</th>
                                            <td className="font-bold p-1 border border-black">{data.batchNo}</td>
                                            <th className="bg-gray-50 text-left p-1 border border-black">Batch Size</th>
                                            <td className="p-1 border border-black font-bold text-blue-800">{data.batchSize}</td>
                                        </tr>
                                        <tr>
                                            <th className="bg-gray-50 text-left p-1 border border-black">Mfg. Date</th>
                                            <td className="p-1 border border-black">{data.mfgDate}</td>
                                            <th className="bg-gray-50 text-left p-1 border border-black">Exp. Date</th>
                                            <td className="p-1 border border-black">{data.expDate}</td>
                                        </tr>
                                        <tr>
                                            <th className="bg-gray-50 text-left p-1 border border-black">Commencement</th>
                                            <td className="p-1 border border-black">{data.dateOfCommencement}</td>
                                            <th className="bg-gray-50 text-left p-1 border border-black">Completion</th>
                                            <td className="p-1 border border-black">{data.dateOfCompletion}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Kit Contents detail (Only for Kit BMR) */}
                                {isKit && (
                                    <>
                                        <h3 className="section-title text-sm font-bold mb-2 uppercase border-b border-black">Kit Contents detail</h3>
                                        <table className="mb-6 w-full text-[10px] bmr-table border border-black">
                                            <thead className="bg-gray-100 uppercase">
                                                <tr>
                                                    <th className="w-8 border border-black p-1">S.No.</th>
                                                    <th className="border border-black p-1 text-left">Description</th>
                                                    <th className="w-10 border border-black p-1">Unit</th>
                                                    <th className="w-10 border border-black p-1">Qty.</th>
                                                    <th className="w-16 border border-black p-1">Size</th>
                                                    <th className="border border-black p-1 text-left">Raw Material Used</th>
                                                    <th className="border border-black p-1 text-left">Supplier Name</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(data.kitContents || []).map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className="text-center border border-black p-1">{idx + 1}</td>
                                                        <td className="border border-black p-1">{item.itemName}</td>
                                                        <td className="text-center border border-black p-1">{item.unit}</td>
                                                        <td className="text-center border border-black p-1">{item.qty}</td>
                                                        <td className="text-center border border-black p-1">{item.size}</td>
                                                        <td className="border border-black p-1">{item.materialUsed}</td>
                                                        <td className="border border-black p-1">{item.supplier}</td>
                                                    </tr>
                                                ))}
                                                {(!data.kitContents || data.kitContents.length === 0) && (
                                                    <tr><td colSpan={7} className="text-center border border-black p-2 italic text-gray-400">No kit contents recorded</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </>
                                )}

                                {/* 2. Raw Material Table */}
                                <h3 className="section-title text-sm font-bold mb-2 uppercase border-b border-black">2. Raw Material Table</h3>
                                <table className="mb-6 w-full text-[10px] bmr-table border border-black">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="text-center w-8 border border-black">S#</th>
                                            <th className="border border-black text-left p-1">Material Name</th>
                                            <th className="w-10 border border-black text-center">Unit</th>
                                            <th className="w-20 border border-black text-center">Lot No</th>
                                            <th className="w-14 border border-black text-center">Req Qty</th>
                                            <th className="w-14 border border-black text-center">Iss Qty</th>
                                            <th className="w-20 border border-black text-center">Measured By</th>
                                            <th className="w-20 border border-black text-center">Verified By</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.rawMaterials?.map?.((rm, idx) => (
                                            <tr key={idx}>
                                                <td className="text-center border border-black">{idx + 1}</td>
                                                <td className="border border-black p-1">{rm.name}</td>
                                                <td className="text-center border border-black">{rm.unit}</td>
                                                <td className="text-center border border-black">{rm.lotNo}</td>
                                                <td className="text-right border border-black p-1">{rm.requiredQty}</td>
                                                <td className="text-right border border-black p-1">{rm.issuedQty}</td>
                                                <td className="border border-black p-1">{rm.measuredBy}</td>
                                                <td className="border border-black p-1">{rm.verifiedBy}</td>
                                            </tr>
                                        )) || <tr><td colSpan={8} className="text-center border border-black p-2 italic">---</td></tr>}
                                    </tbody>
                                </table>

                                {/* 3. Packing Material Table */}
                                <h3 className="section-title text-sm font-bold mb-2 uppercase border-b border-black">3. Packing Material Table</h3>
                                <table className="mb-6 w-full text-[10px] bmr-table border border-black">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="text-center w-8 border border-black">S#</th>
                                            <th className="border border-black text-left p-1">Packing Material</th>
                                            <th className="w-10 border border-black text-center">Unit</th>
                                            <th className="w-20 border border-black text-center">Lot No</th>
                                            <th className="w-10 border border-black text-center">Req</th>
                                            <th className="w-10 border border-black text-center">Iss</th>
                                            <th className="w-10 border border-black text-center">Used</th>
                                            <th className="w-10 border border-black text-center">Ret</th>
                                            <th className="w-16 border border-black text-center">Counted</th>
                                            <th className="w-16 border border-black text-center">Verified</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.packingMaterials?.map?.((pm, idx) => (
                                            <tr key={idx}>
                                                <td className="text-center border border-black">{idx + 1}</td>
                                                <td className="border border-black p-1">{pm.name}</td>
                                                <td className="text-center border border-black">{pm.unit}</td>
                                                <td className="text-center border border-black">{pm.lotNo}</td>
                                                <td className="text-right border border-black p-1">{pm.requiredQty}</td>
                                                <td className="text-right border border-black p-1">{pm.issuedQty}</td>
                                                <td className="text-right border border-black p-1">{pm.usedQty}</td>
                                                <td className="text-right border border-black p-1">{pm.returnedQty}</td>
                                                <td className="border border-black p-1">{pm.measuredBy}</td>
                                                <td className="border border-black p-1">{pm.verifiedBy}</td>
                                            </tr>
                                        )) || <tr><td colSpan={10} className="text-center border border-black p-2 italic">---</td></tr>}
                                    </tbody>
                                </table>

                                <div className="page-break"></div>

                                {/* 4. Manufacturing Process */}
                                <h3 className="section-title text-sm font-bold mb-2 uppercase border-b border-black mt-4">4. Manufacturing Process</h3>

                                {Object.entries(data.processSteps || {}).map(([key, step]) => {
                                    if (Array.isArray(step)) { // Kit Type
                                        return (
                                            <div key={key} className="mb-6">
                                                <h4 className="text-xs font-bold bg-gray-100 p-1 border border-black">{key}</h4>
                                                <table className="w-full text-[10px] bmr-table border-x border-black">
                                                    <thead className="bg-gray-50 uppercase">
                                                        <tr>
                                                            <th className="border border-black p-1 text-left">Item Name</th>
                                                            <th className="border border-black p-1 w-20">Date</th>
                                                            <th className="border border-black p-1 w-12">Start</th>
                                                            <th className="border border-black p-1 w-12">End</th>
                                                            <th className="border border-black p-1 w-12">Total</th>
                                                            <th className="border border-black p-1 w-12">Exp</th>
                                                            <th className="border border-black p-1 w-10">Rej</th>
                                                            <th className="border border-black p-1 text-left">Operator</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {step.map((item: any, i: number) => (
                                                            <tr key={i}>
                                                                <td className="border border-black p-1">{item.itemName}</td>
                                                                <td className="border border-black p-1 text-center">{item.date}</td>
                                                                <td className="border border-black p-1 text-center">{item.startTime}</td>
                                                                <td className="border border-black p-1 text-center">{item.endTime}</td>
                                                                <td className="border border-black p-1 text-center">{item.qtyProduced}</td>
                                                                <td className="border border-black p-1 text-center">{item.expectedQty}</td>
                                                                <td className="border border-black p-1 text-center font-bold text-red-600">{item.rejection || '0'}</td>
                                                                <td className="border border-black p-1">{item.operator}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <div className="flex border border-black border-t-0 text-[10px] p-1 gap-4 font-bold bg-gray-50">
                                                    <div>Verified By (Prod): {(step as any).verifiedProduction || '---'}</div>
                                                    <div>Verified By (QA): {(step as any).verifiedQA || '---'}</div>
                                                </div>
                                            </div>
                                        );
                                    } else { // Standard Type
                                        const sStep = step as ProcessStep;
                                        return (
                                            <div key={key} className="mb-4">
                                                <h4 className="text-xs font-bold bg-gray-100 p-1 border border-black">{key}</h4>
                                                <table className="w-full text-[10px] bmr-table border border-black">
                                                    <tbody>
                                                        <tr>
                                                            <th className="w-1/6 border border-black bg-gray-50 p-1 text-left">Date</th><td className="w-1/6 border border-black p-1">{sStep.date}</td>
                                                            <th className="w-1/6 border border-black bg-gray-50 p-1 text-left">Start</th><td className="w-1/6 border border-black p-1">{sStep.startTime}</td>
                                                            <th className="w-1/6 border border-black bg-gray-50 p-1 text-left">End</th><td className="w-1/6 border border-black p-1">{sStep.endTime}</td>
                                                        </tr>
                                                        <tr>
                                                            <th className="border border-black bg-gray-50 p-1 text-left">Operator</th><td colSpan={2} className="border border-black p-1">{sStep.operator}</td>
                                                            <th className="border border-black bg-gray-50 p-1 text-left">Ver. Prod</th><td colSpan={2} className="border border-black p-1">{sStep.verifiedProduction}</td>
                                                        </tr>
                                                        <tr>
                                                            <th className="border border-black bg-gray-50 p-1 text-left">Exp Qty</th><td className="border border-black p-1">{sStep.expectedQty}</td>
                                                            <th className="border border-black bg-gray-50 p-1 text-left">Prod Qty</th><td className="border border-black p-1">{sStep.qtyProduced}</td>
                                                            <th className="border border-black bg-gray-50 p-1 text-left">Rejection</th><td className="border border-black p-1">{sStep.rejection}</td>
                                                        </tr>
                                                        <tr>
                                                            <th className="border border-black bg-gray-50 p-1 text-left">Reproc.</th><td className="border border-black p-1">{sStep.reprocessedQty}</td>
                                                            <th className="border border-black bg-gray-50 p-1 text-left">Ver. QA</th><td colSpan={3} className="border border-black p-1">{sStep.verifiedQA}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        );
                                    }
                                })}

                                <div className="page-break"></div>

                                {/* 5. Sterilization & 6. Labeling */}
                                <div className="flex gap-4 mb-6 mt-4">
                                    <div className="w-1/2">
                                        <h3 className="section-title text-sm font-bold mb-2 uppercase border-b border-black">5. Sterilization</h3>
                                        <table className="w-full text-[10px] bmr-table border border-black">
                                            <tbody>
                                                <tr><th className="w-1/3 bg-gray-50 text-left p-1 border border-black">Type</th><td className="border border-black p-1">{data.sterilization?.type}</td></tr>
                                                <tr><th className="bg-gray-50 text-left p-1 border border-black">Date</th><td className="border border-black p-1">{data.sterilization?.date}</td></tr>
                                                <tr><th className="bg-gray-50 text-left p-1 border border-black">Quantity</th><td className="border border-black p-1">{data.sterilization?.qty}</td></tr>
                                                <tr><th className="bg-gray-50 text-left p-1 border border-black">Ref No</th><td className="border border-black p-1">{data.sterilization?.refNo}</td></tr>
                                                <tr><th className="bg-gray-50 text-left p-1 border border-black">Verified By</th><td className="border border-black p-1">{data.sterilization?.verifiedBy}</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="w-1/2">
                                        <h3 className="section-title text-sm font-bold mb-2 uppercase border-b border-black">6. Labeling</h3>
                                        <table className="w-full text-[10px] bmr-table border border-black">
                                            <tbody>
                                                <tr><th className="w-1/3 bg-gray-50 text-left p-1 border border-black">Date/Time</th><td className="border border-black p-1">{data.labeling?.dateTime}</td></tr>
                                                <tr><th className="bg-gray-50 text-left p-1 border border-black">Labeled Qty</th><td className="border border-black p-1">{data.labeling?.qty}</td></tr>
                                                <tr><th className="bg-gray-50 text-left p-1 border border-black">Rejection</th><td className="border border-black p-1">{data.labeling?.rejection}</td></tr>
                                                <tr><th className="bg-gray-50 text-left p-1 border border-black">Prod Ver.</th><td className="border border-black p-1">{data.labeling?.productionVerification}</td></tr>
                                                <tr><th className="bg-gray-50 text-left p-1 border border-black">QA Ver.</th><td className="border border-black p-1">{data.labeling?.qaVerification}</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* 7. Final Packing & Yield */}
                                <h3 className="section-title text-sm font-bold mb-2 uppercase border-b border-black">7. Final Packing & Yield</h3>
                                <table className="mb-6 w-full text-[10px] bmr-table border border-black">
                                    <tbody>
                                        <tr>
                                            <th className="w-1/6 bg-gray-50 text-left p-1 border border-black">Total Qty</th><td className="w-1/6 border border-black p-1">{data.finalPacking?.totalQty}</td>
                                            <th className="w-1/6 bg-gray-50 text-left p-1 border border-black">Control Qty</th><td className="w-1/6 border border-black p-1">{data.finalPacking?.controlSampleQty}</td>
                                            <th className="w-1/6 bg-gray-50 text-left p-1 border border-black">Surgeon Qty</th><td className="w-1/6 border border-black p-1">{data.finalPacking?.surgeonSampleQty}</td>
                                        </tr>
                                        <tr>
                                            <th className="bg-gray-50 text-left p-1 border border-black">Packed Qty</th><td className="border border-black p-1 font-bold">{data.finalPacking?.finalPackedQty}</td>
                                            <th className="bg-gray-50 text-left p-1 border border-black">Testing Qty</th><td className="border border-black p-1">{data.finalPacking?.testingQty}</td>
                                            <th className="bg-gray-50 text-left p-1 border border-black">Actual Yield</th><td className="border border-black p-1 font-bold text-lg underline text-center">{data.finalPacking?.actualYield}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* 8. Declarations */}
                                <h3 className="section-title text-sm font-bold mb-2 uppercase border-b border-black">8. Declarations & Release</h3>
                                <div className="border border-black p-2 text-[10px] italic mb-6">
                                    {data.declarations?.manufacturingDeclaration || 'Declaration: I verify that all the raw materials, equipment\'s, machinery and preparations are satisfactory to the best of my knowledge.'}
                                </div>
                                <div className="grid grid-cols-2 gap-20 mt-12 text-center text-xs font-bold uppercase">
                                    <div>
                                        <div className="border-t border-black pt-1">Head Production</div>
                                        <div className="mt-1">({data.declarations?.headProduction || 'SIGNATURE'})</div>
                                    </div>
                                    <div>
                                        <div className="border-t border-black pt-1">Head QA</div>
                                        <div className="mt-1">({data.declarations?.qaHead || 'SIGNATURE'})</div>
                                    </div>
                                </div>

                                <div className="mt-12 text-[10px] italic border-t border-dotted border-black pt-2">
                                    Note: Release date: {data.declarations?.releaseDate || '---'} | Test Report No: {data.declarations?.testReportNo || '---'}
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>

                {/* Footer - Repeats on every page */}
                <tfoot>
                    <tr>
                        <td className="p-0 border-none">
                            <div className="footer-space h-[50px]">
                                <div className="flex justify-between text-[10px] border-t border-black pt-2 mt-4 font-bold uppercase">
                                    <div>SHI Mediwear Pvt. Ltd.</div>
                                    <div>{docInfo.docNo}</div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default BMRPrintView;
