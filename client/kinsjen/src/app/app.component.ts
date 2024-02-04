import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from './services/breadcrumb.service';
import { Breadcrumb } from './model/breadcrumb.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  
  componentTitle: string | undefined;
  breadcrumbs: Breadcrumb[] | undefined;

  constructor(private breadcrumbService: BreadcrumbService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.breadcrumbService.getTitle().subscribe((title: string) => {
        this.componentTitle = title;
      });
      this.breadcrumbService.getBreadcrumb().subscribe((breadcrumbs: Breadcrumb[]) => {
        this.breadcrumbs = breadcrumbs;
      });
    });
  }

}
