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

  private readonly PATH = 'jenkins';
  private readonly API_ENDPOINT = new URL(this.PATH, environment.apiURL);

  constructor(private http: HttpClient) { }

  findAll(pageNumber: number): Observable<Page<JenkinsInstance>> {
    const params = new HttpParams().set('page', pageNumber);
    return this.http.get<Page<JenkinsInstance>>(this.API_ENDPOINT.href, { params: params });
  }

  save(jenkinsInstance: JenkinsInstance): Observable<JenkinsInstance> {
    return this.http.post<JenkinsInstance>(this.API_ENDPOINT.href, jenkinsInstance);
  }

  delete(jenkinsInstance: JenkinsInstance): Observable<any> {
    const url = new URL(this.API_ENDPOINT, jenkinsInstance.id.toString());
    return this.http.delete<any>(url.href);
  }

}
