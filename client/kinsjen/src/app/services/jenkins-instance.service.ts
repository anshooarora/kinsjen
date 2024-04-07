import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { JenkinsInstance } from '../model/jenkins-instance.model';
import { Page } from '../model/page.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JenkinsInstanceService {

  private readonly PATH = 'jenkins/';
  private readonly API_ENDPOINT = new URL(this.PATH, environment.apiURL);

  constructor(private http: HttpClient) { }

  findAll(pageNumber: number = 0, size: number = 20): Observable<Page<JenkinsInstance>> {
    const params = new HttpParams()
      .set('page', pageNumber)
      .set('size', size);
    return this.http.get<Page<JenkinsInstance>>(this.API_ENDPOINT.href, { params: params });
  }

  save(jenkinsInstance: JenkinsInstance): Observable<JenkinsInstance> {
    return this.http.post<JenkinsInstance>(this.API_ENDPOINT.href, jenkinsInstance);
  }

  delete(jenkinsInstance: JenkinsInstance): Observable<any> {
    const url = new URL(jenkinsInstance.id.toString(), this.API_ENDPOINT);
    return this.http.delete<any>(url.href);
  }

}
