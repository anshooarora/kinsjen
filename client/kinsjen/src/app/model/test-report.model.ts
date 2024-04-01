import { ChildReport } from "./child-report.model";

export class TestReport {
    _class: string;
    failCount: number;
    skipCount: number;
    totalCount: number;
    urlName: string;
    childReports: ChildReport[];
}
