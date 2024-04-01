import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../model/page.model';
import { Pipeline } from '../model/pipeline.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PipelineService {

  private readonly PATH = 'pipelines/';
  private readonly API_ENDPOINT = new URL(this.PATH, environment.apiURL);

  constructor(private http: HttpClient) { }

  findAll(orgId: number): Observable<Page<Pipeline>> {
    let params = new HttpParams().append('orgId', orgId);
    return this.http.get<Page<Pipeline>>(this.API_ENDPOINT.href, { params: params });
  }

  find(pipelineId: number): Observable<Pipeline> {
    const url = new URL(pipelineId.toString(), this.API_ENDPOINT.toString())
    return this.http.get<Pipeline>(url.href);
  }

}
