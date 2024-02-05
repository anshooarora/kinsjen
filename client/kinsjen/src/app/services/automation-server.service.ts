import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AutomationServer } from '../model/automation-server.model';
import { Page } from '../model/page.model';

@Injectable({
  providedIn: 'root'
})
export class AutomationServerService {

  constructor(private http: HttpClient) { }

  findAll(pageNumber: number): Observable<Page<AutomationServer>> {
    return this.http.get<Page<AutomationServer>>("http://localhost/api/automation-servers?page=" + pageNumber);
  }

  save(automationServer: AutomationServer): Observable<Page<AutomationServer>> {
    return this.http.post<Page<AutomationServer>>("http://localhost/api/automation-servers", automationServer);
  }

  delete(automationServer: AutomationServer): Observable<any> {
    return this.http.delete<any>("http://localhost/api/automation-servers/" + automationServer.id);
  }

}
