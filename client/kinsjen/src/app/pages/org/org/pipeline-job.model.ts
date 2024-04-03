import { JenkinsJob } from "../../../model/jenkins-job.model";
import { Page } from "../../../model/page.model";
import { Pipeline } from "../../../model/pipeline.model";

export class PipelineJob extends Page<Pipeline> {
    jenkinsJob: JenkinsJob = new JenkinsJob();
}