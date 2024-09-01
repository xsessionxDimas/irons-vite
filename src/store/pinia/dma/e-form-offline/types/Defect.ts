export type Defect = {
    type: string;
    assetNumber: string;
    description: string;
    priority: string;
    raisedBy: string;
    date: string;
    title: string;
    isComplete?: boolean;
    plannedDuration?: string;
    instruction?: string;
    parts?: string;
    labours?: string;
    resources?: string;
    symptoms?: string;
    causes?: string;
    actions?: string;
    images?: string;
    requirement?: string;
}

