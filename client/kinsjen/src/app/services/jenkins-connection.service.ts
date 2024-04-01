import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JenkinsInstance } from '../model/jenkins-instance.model';
import { Credential } from '../model/credential.model';
import { ConnectionTestResponse } from '../model/connection-test-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JenkinsConnectionService {

  private readonly PATH = 'external/jenkins/connection';
  private readonly API_ENDPOINT = new URL(this.PATH, environment.apiURL);

  constructor(private http: HttpClient) { }

  testConnection(jenkinsInstance: JenkinsInstance, credential: Credential): Observable<ConnectionTestResponse> {
    const jenkinsInstanceCredential = {
        jenkinsInstance: jenkinsInstance, 
        credential: credential
    }
    return this.http.post<ConnectionTestResponse>(this.API_ENDPOINT.href, jenkinsInstanceCredential);
  }

}
