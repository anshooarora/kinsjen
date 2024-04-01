import { Suite } from "./suite.model";

export class Result {
    _class: string;
    duration: number;
    failCount: number;
    passCount: number;
    skipCount: number;
    suites: Suite[];
}
