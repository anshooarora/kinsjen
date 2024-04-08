import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import { OrgService } from '../../../services/org.service';
import { Org } from '../../../model/org.model';
import { Page } from '../../../model/page.model';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { Breadcrumb } from '../../../model/breadcrumb.model';

@Component({
  selector: 'app-org-listing',
  templateUrl: './org-listing.component.html',
  styleUrl: './org-listing.component.scss'
})
export class OrgListingComponent implements OnInit {

  private destroy$: Subject<any> = new Subject<any>();
  private readonly componentTitle: string = 'Orgs';
  private readonly breadcrumbs: Breadcrumb[] = [
    {
      name: 'orgs',
      url: ''
    }
  ];

  /* state */
  loading: boolean = false;
  error: string | undefined;

  /* org */
  orgs: Page<Org> = new Page();
  showCreateOrgPanel: boolean = false;
  showCreateOrgSearchBox: boolean = false;
  orgName: string | undefined;
  filterOrg: string | undefined;
  orgIdForDeletion: number;

  constructor(private router: Router, private breadcrumbService: BreadcrumbService, private orgService: OrgService) { }

  ngOnInit(): void {
    this.setBreadcrumb();
    this.findOrgs();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  setBreadcrumb(): void {
    this.breadcrumbService.setTitle(this.componentTitle);
    this.breadcrumbService.setBreadcrumb(this.breadcrumbs);
  }

  findOrgs(pageNumber: number = 0): void {
    this.orgService.findAll(pageNumber)
      .pipe(takeUntil(this.destroy$), finalize(() => { 
        this.loading = false;
      }))
      .subscribe({
        next: (response: any) => {
          if (response.numberOfElements == 0) {
            this.showCreateOrgPanel = true;
          } else {
            this.orgs = response;
          }
        },
        error: (err) => {
          this.error = JSON.stringify(err);
        }
      });
  }

  saveOrg(name: string): void {
    if (!name) {
      return;
    }

    this.orgName = undefined;
    let org = new Org();
    org.name = name;
    
    this.orgService.saveOrg(org)
      .pipe(takeUntil(this.destroy$), finalize(() => { 
        this.loading = false;
      }))
      .subscribe({
        next: (response: any) => {
          this.findOrgs();
          this.showCreateOrgSearchBox = false;
        },
        error: (err) => {
          this.error = JSON.stringify(err);
        }
      });
  }

  deleteOrg(org: Org): void {
    this.orgService.deleteOrg(org)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.orgs = new Page();
          this.findOrgs();
        },
        error: (err) => {
          this.error = JSON.stringify(err);
        }
      });
  }

  filterOrgs(filterOrg: string): void {
    this.orgs!.content = this.orgs?.content?.filter(x => x.name.includes(filterOrg));
  }

}
