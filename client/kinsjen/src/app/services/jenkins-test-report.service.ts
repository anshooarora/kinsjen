import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TestReport } from '../model/test-report.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JenkinsTestReportService {

  private readonly PATH = 'external/jenkins/testreports';
  private readonly API_ENDPOINT = new URL(this.PATH, environment.apiURL);

  constructor(private http: HttpClient) { }

  find(pipelineId: number, buildId: number): Observable<TestReport> {
    let params = new HttpParams().append('pipelineId', pipelineId).append('buildId', buildId);
    return this.http.get<TestReport>(this.API_ENDPOINT.href, { params: params });
  }

}
