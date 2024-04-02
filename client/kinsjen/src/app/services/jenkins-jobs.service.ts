import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JenkinsJob } from '../model/jenkins-job.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JenkinsJobsService {

  private readonly PATH = 'external/jenkins/jobs/';
  private readonly API_ENDPOINT = new URL(this.PATH, environment.apiURL);

  constructor(private http: HttpClient) { }

  findJobs(jenkinsInstanceId: number = -1, credentialId: number = -1, depth: number = 0, recursive: boolean = true): Observable<JenkinsJob[]> {
    const params = new HttpParams()
      .set('jenkinsInstanceId', jenkinsInstanceId)
      .set('credentialId', credentialId)
      .set('depth', depth)
      .set('recursive', recursive);
    return this.http.get<JenkinsJob[]>(this.API_ENDPOINT.href, { params: params });
  }

  findJob(pipelineId: number, depth: number = 0): Observable<JenkinsJob> {
    const url = new URL(pipelineId.toString(), this.API_ENDPOINT);
    const params = new HttpParams().set('depth', depth);
    return this.http.get<JenkinsJob>(url.href, { params: params });
  }

}
