import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Org } from '../model/org.model';
import { Page } from '../model/page.model';

@Injectable({
  providedIn: 'root'
})
export class OrgService {

  constructor(private http: HttpClient) { }

  findAll(page: number): Observable<Page<Org>> {
    return this.http.get<Page<Org>>("http://localhost/api/orgs");
  }

  saveOrg(org: Org): Observable<any> {
    return this.http.post<any>("http://localhost/api/orgs", org);
  }

  deleteOrg(org: Org): Observable<any> {
    return this.http.delete<any>("http://localhost/api/orgs/" + org.id);
  }

}
