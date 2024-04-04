import { JenkinsBuild } from "./jenkins-build.model";
import { Pipeline } from "./pipeline.model";

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

    saved: boolean;
    checked: boolean;
    org: string;
    orgId: number;
    pipeline: Pipeline;
}
