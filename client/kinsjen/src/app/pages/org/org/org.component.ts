import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import { Breadcrumb } from '../../../model/breadcrumb.model';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { AutomationServer } from '../../../model/automation-server.model';
import { AutomationServerService } from '../../../services/automation-server.service';
import { AuthToken } from '../../../model/auth-token.model';

@Component({
  selector: 'app-org',
  templateUrl: './org.component.html',
  styleUrl: './org.component.scss'
})
export class OrgComponent implements OnInit {
  
  private destroy$: Subject<any> = new Subject<any>();
  private readonly componentTitle: string = 'Orgs';
  private readonly breadcrumbs: Breadcrumb[] = [
    {
      name: 'orgs',
      url: 'orgs'
    },
    {
      name: '',
      url: ''
    }
  ];

  /* state */
  loading: boolean = false;
  error: string | undefined;

  /* jenkins */
  newAutomationServer: AutomationServer = {
    id: 0,
    authTokens: [],
    name: '',
    url: '',
    type: 'Jenkins'
  };
  authToken: AuthToken = new AuthToken();
  automationServers: AutomationServer[] = [];

  constructor(private route: ActivatedRoute, 
    private breadcrumbService: BreadcrumbService, 
    private automationServerService: AutomationServerService) { }

  ngOnInit(): void {
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  setBreadcrumb(): void {
    let org = this.route.snapshot.paramMap.get('org') || "";
    this.breadcrumbs[1].name = org;

    this.breadcrumbService.setTitle(this.componentTitle);
    this.breadcrumbService.setBreadcrumb(this.breadcrumbs);
  }

  findAutomationServers(): void {
    this.automationServerService.findAll(0)
      .pipe(takeUntil(this.destroy$), finalize(() => { 
        this.loading = false;
      }))
      .subscribe({
        next: (response: any) => {
          
        },
        error: (err) => {
          this.error = JSON.stringify(err);
        }
      });
  }

  saveAutomationServer(): void {
    this.newAutomationServer.authTokens = [];
    if (this.authToken.name && this.authToken.token) {
      this.newAutomationServer.authTokens.push(this.authToken);
    }
    this.automationServerService.save(this.newAutomationServer)
      .pipe(takeUntil(this.destroy$), finalize(() => { 
        this.loading = false;
      }))
      .subscribe({
        next: (response: any) => {
          
        },
        error: (err) => {
          this.error = JSON.stringify(err);
        }
      });
  }

}
