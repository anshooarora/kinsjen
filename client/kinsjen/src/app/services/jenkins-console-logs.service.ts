import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JenkinsConsoleLogsService {

  private readonly PATH = 'external/jenkins/consolelogs';
  private readonly API_ENDPOINT = new URL(this.PATH, environment.apiURL);

  constructor(private http: HttpClient) { }

  find(pipelineId: number, buildNumber: number): Observable<string> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'text/plain; charset=utf-8');
    const params = new HttpParams()
      .set('pipelineId', pipelineId)
      .set('buildNumber', buildNumber);
    return this.http.get<string>(this.API_ENDPOINT.href, 
      { headers: headers, params: params, responseType: 'text' as 'json' });
  }
  
}
