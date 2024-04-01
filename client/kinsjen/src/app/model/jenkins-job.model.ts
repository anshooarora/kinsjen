import { JenkinsBuild } from "./jenkins-build.model";

export class JenkinsJob {
    _class: string;
    actions: [];
    displayName: string;
    displayNameOrNull: string;
    fullDisplayName: string;
    fullName: string;
    name: string;
    url: string;
    buildable: boolean;
    builds: JenkinsBuild[];
    color: string;
    firstBuild: any;
    inQueue: boolean;
    keepDependencies: boolean;
    lastBuild: any;
    lastCompletedBuild: any;
    lastFailedBuild: any;
    lastStableBuild: any;
    lastSuccessfulBuild: any;
    lastUnstableBuild: any;
    lastUnsuccessfulBuild: any;
    nextBuildNumber: number;
    concurrentBuild: boolean;

    checked: boolean;
    org: string;
    orgId: number;
}
