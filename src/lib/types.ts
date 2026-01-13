export interface RawMaterial {
    sNo: string;
    name: string;
    unit: string;
    lotNo: string;
    requiredQty: string;
    issuedQty: string;
    measuredBy: string;
    verifiedBy: string;
}

export interface PackingMaterial {
    sNo: string;
    name: string;
    unit: string;
    lotNo: string;
    requiredQty: string;
    issuedQty: string;
    usedQty: string;
    returnedQty: string;
    measuredBy: string;
    verifiedBy: string;
}

export interface ProcessStep {
    date: string;
    startTime: string;
    endTime: string;
    operator: string;
    verifiedProduction: string;
    verifiedQA: string;
    qtyProduced: string;
    rejection: string;
    expectedQty: string;
    reprocessedQty: string;
}

export interface KitProcessItem {
    itemName: string;
    date: string;
    startTime: string;
    endTime: string;
    qtyProduced: string;
    expectedQty: string;
    rejection: string;
    reprocessedQty: string;
    operator: string;
}

export interface KitContent {
    sNo: string;
    itemName: string;
    unit: string;
    qty: string;
    size: string;
    materialUsed: string;
    supplier: string;
}

export interface BMRData {
    id?: number;
    bmrType: 'standard' | 'kit';
    productType?: 'Gown' | 'Drape' | 'Cover' | 'Kit';
    productName: string;
    productCode: string;
    brandName: string;
    productSize: string;
    batchNo: string;
    batchSize: string;
    mfgDate: string;
    expDate: string;
    typeOfPacking: string;
    dateOfCommencement: string;
    dateOfCompletion: string;

    rawMaterials: RawMaterial[];
    packingMaterials: PackingMaterial[];
    kitContents?: KitContent[];

    processSteps: Record<string, ProcessStep | KitProcessItem[]>;

    sterilization: {
        type: 'ETO' | 'Gamma';
        date: string;
        qty: string;
        refNo: string;
        verifiedBy: string;
    };

    labeling: {
        dateTime: string;
        qty: string;
        rejection: string;
        operator: string;
        productionVerification: string;
        qaVerification: string;
    };

    finalPacking: {
        totalQty: string;
        controlSampleQty: string;
        surgeonSampleQty: string;
        finalPackedQty: string;
        actualYield: string;
        testingQty: string;
    };

    declarations: {
        headProduction: string;
        qaHead: string;
        releaseDate: string;
        testReportNo: string;
        manufacturingDeclaration: string;
        batchReleaseOrder: string;
    };

    status: 'draft' | 'final' | 'released';
    rawMaterialForSpecification?: number;
    documentNo: string;
    revisionNo: string;
    issueNo: string;
}

export interface Supplier {
    id: number;
    name: string;
    created_at?: string;
}

export interface Fabric {
    id: number;
    name: string;
    supplier_id: number;
    width: string;
    created_at?: string;
}

export interface TestResult {
    sNo: string;
    test: string;
    standard: string;
    result: string;
    unit?: string;
}

export interface IncomingReport {
    id?: number;
    productName: string;
    reportNo: string;
    performanceLevel: 'LEVEL 1' | 'LEVEL 2' | 'LEVEL 3' | 'LEVEL 4';
    batchNo: string;
    supplierId: number;
    batchSize: string;
    invoiceNo: string;
    invoiceDate: string;
    mfgDate: string;
    expDate: string;
    sampleQty: string;
    sampleDate: string;
    releaseDate: string;
    fabricComposition: string;
    parametersResults: TestResult[];
    biocompatibilityResult: TestResult[];
    visualResults: TestResult[];
    result: 'Comply' | 'Does not Comply';
    testedBy: string;
    reviewedBy: string;
    created_at?: string;
    updated_at?: string;
}
