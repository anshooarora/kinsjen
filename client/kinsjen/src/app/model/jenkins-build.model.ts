import { JenkinsBuildActions } from "./jenkins-build-actions.model";

export class JenkinsBuild {
    actions: JenkinsBuildActions[];
    building: boolean;
    builtOn: string;
    culprits: any;
    description: string;
    displayName: string;
    duration: number;
    estimatedDuration: number;
    fullDisplayName: string;
    id: string;
    inProgress: boolean;
    keepLog: boolean;
    number: number;
    queueId: number;
    result: string;
    timestamp: number;
    url: string;
}
