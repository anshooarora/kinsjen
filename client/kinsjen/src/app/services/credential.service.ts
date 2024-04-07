import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Credential } from '../model/credential.model';
import { environment } from '../../environments/environment';
import { Page } from '../model/page.model';

@Injectable({
  providedIn: 'root'
})
export class CredentialService {

  private readonly PATH = 'credentials/';
  private readonly API_ENDPOINT = new URL(this.PATH, environment.apiURL);

  constructor(private http: HttpClient) { }

  find(id: number = 0, jenkinsInstanceId: number = 0): Observable<Page<Credential>> {
    const params = new HttpParams()
      .set('id', id)
      .set('jenkinsInstanceId', jenkinsInstanceId);
      return this.http.get<Page<Credential>>(this.API_ENDPOINT.href, { params: params });
  }

  save(credential: Credential): Observable<Credential> {
    return this.http.post<Credential>(this.API_ENDPOINT.href, credential);
  }

  delete(credentialId: number): Observable<any> {
    const url = new URL(credentialId.toString(), this.API_ENDPOINT);
    return this.http.delete<any>(url.href);
  }

}
