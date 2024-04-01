import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Credential } from '../model/credential.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CredentialService {

  private readonly PATH = 'credentials';

  constructor(private http: HttpClient) { }

  save(credential: Credential): Observable<Credential> {
    const url = new URL(environment.apiURL, this.PATH);
    return this.http.post<Credential>(url.href, credential);
  }

}
