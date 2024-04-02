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
    firstBuild: JenkinsBuild;
    inQueue: boolean;
    keepDependencies: boolean;
    lastBuild: JenkinsBuild;
    lastCompletedBuild: JenkinsBuild;
    lastFailedBuild: JenkinsBuild;
    lastStableBuild: JenkinsBuild;
    lastSuccessfulBuild: JenkinsBuild;
    lastUnstableBuild: JenkinsBuild;
    lastUnsuccessfulBuild: JenkinsBuild;
    nextBuildNumber: number;
    concurrentBuild: boolean;

    checked: boolean;
    org: string;
    orgId: number;
}
