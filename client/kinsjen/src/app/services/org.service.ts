import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Org } from '../model/org.model';
import { Page } from '../model/page.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrgService {

  private readonly PATH = 'orgs/';
  private readonly API_ENDPOINT = new URL(this.PATH, environment.apiURL);
  
  constructor(private http: HttpClient) { }

  findAll(page: number = 0, pageSize: number = 20): Observable<Page<Org>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', pageSize);
    return this.http.get<Page<Org>>(this.API_ENDPOINT.href, { params: params });
  }

  saveOrg(org: Org): Observable<any> {
    return this.http.post<any>(this.API_ENDPOINT.href, org);
  }

  deleteOrg(org: Org): Observable<any> {
    const url = new URL(org.id.toString(), this.API_ENDPOINT);
    return this.http.delete<any>(url.href);
  }

}
