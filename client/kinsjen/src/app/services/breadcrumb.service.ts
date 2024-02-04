import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Breadcrumb } from '../model/breadcrumb.model';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  constructor() { }

  private title: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private breadcrumb: BehaviorSubject<Breadcrumb[]> = new BehaviorSubject<Breadcrumb[]>([]);

  setTitle(title: string): void {
    this.title.next(title);
  }

  getTitle(): Observable<string> {
    return this.title.asObservable();
  }

  setBreadcrumb(breadcrumb: Breadcrumb[]): void {
    setTimeout(() => this.breadcrumb.next(breadcrumb));
  }

  getBreadcrumb(): Observable<Breadcrumb[]> {
    return this.breadcrumb.asObservable();
  }
  
}
