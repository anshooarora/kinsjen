import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Breadcrumb } from '../../model/breadcrumb.model';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { AutomationServer } from '../../model/automation-server.model';
import { AutomationServerService } from '../../services/automation-server.service';
import { AuthToken } from '../../model/auth-token.model';
import { Page } from '../../model/page.model';
import { Org } from '../../model/org.model';
import { OrgService } from '../../services/org.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent implements OnInit {

  private destroy$: Subject<any> = new Subject<any>();
  private readonly componentTitle: string = 'Start';
  private readonly breadcrumbs: Breadcrumb[] = [
    {
      name: 'start',
      url: ''
    }
  ];

  /* state */
  error: string | undefined;

  /* org */
  orgs: Page<Org> | undefined;
  org: Org = new Org();

  /* automation-server */
  automationServer: AutomationServer = {
    id: 0,
    authTokens: [],
    name: '',
    url: '',
    type: 'Jenkins'
  };
  authToken: AuthToken = new AuthToken();
  automationServerPage: Page<AutomationServer> = new Page();

  
  constructor(private route: ActivatedRoute, 
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private orgService: OrgService,
    private automationServerService: AutomationServerService) { }

  ngOnInit(): void {
    this.setBreadcrumb();
    this.findOrgs();
    this.findAutomationServers();
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
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Page<Org>) => {
          console.log(response)
          this.orgs = response;
        },
        error: (err) => {
          this.error = JSON.stringify(err);
        }
      });
  }

  saveOrg(): void {
    if (!this.org.name) {
      return;
    }
    
    this.orgService.saveOrg(this.org)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.findOrgs();
        },
        error: (err) => {
          this.error = JSON.stringify(err);
        }
      });
  }

  findAutomationServers(): void {
    this.automationServerService.findAll(0)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Page<AutomationServer>) => {
          this.automationServerPage = response;
          if (response.totalElements > 0) {
            this.router.navigate(['/orgs', this.orgs?.content![0].name]);
          }
        },
        error: (err) => {
          this.error = JSON.stringify(err);
        }
      });
  }

  saveAutomationServer(): void {
    this.automationServer.authTokens = [];
    if (this.authToken.name && this.authToken.token) {
      this.automationServer.authTokens.push(this.authToken);
    }

    this.automationServerService.save(this.automationServer)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/orgs', this.orgs?.content![0].name]);
        },
        error: (err) => {
          this.error = JSON.stringify(err);
        }
      });
  }

  enableAddPipelines(): boolean {
    return this.automationServer.name != '' && this.automationServer.url != ''
      && (this.authToken.name == '' && this.authToken.token == '' ||
        this.authToken.name != '' && this.authToken.token != '');
  }

}
