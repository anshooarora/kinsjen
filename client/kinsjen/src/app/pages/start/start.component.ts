import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Breadcrumb } from '../../model/breadcrumb.model';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { JenkinsInstance } from '../../model/jenkins-instance.model';
import { JenkinsInstanceService } from '../../services/jenkins-instance.service';
import { Credential } from '../../model/credential.model';
import { Page } from '../../model/page.model';
import { Org } from '../../model/org.model';
import { OrgService } from '../../services/org.service';
import { JenkinsConnectionService } from '../../services/jenkins-connection.service';
import { CredentialService } from '../../services/credential.service';
import { ConnectionTestResponse } from '../../model/connection-test-response.model';

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
  orgs: Page<Org>;
  org: Org = new Org();

  /* jenkins instance */
  jenkinsInstance: JenkinsInstance = {
    id: 0,
    name: '',
    url: '',
    type: 'Jenkins'
  };
  credential: Credential = new Credential();
  automationServerPage: Page<JenkinsInstance> = new Page();

  /* test connection */
  isConnValid: boolean = false;

  
  constructor(private route: ActivatedRoute, 
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private orgService: OrgService,
    private jenkinsInstanceService: JenkinsInstanceService,
    private credentialService: CredentialService,
    private jenkinsConnectionService: JenkinsConnectionService) { }

  ngOnInit(): void {
    console.log('starting...')
    this.setBreadcrumb();
    this.findOrgs();
    this.findJenkinsInstances();
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

  findJenkinsInstances(): void {
    this.jenkinsInstanceService.findAll(0)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Page<JenkinsInstance>) => {
          this.automationServerPage = response;
          console.log(response)
          if (response.totalElements > 0) {
            this.router.navigate(['orgs']);
          }
        },
        error: (err) => {
          this.error = JSON.stringify(err);
        }
      });
  }

  testConnection(): void {
    this.error = undefined;
    this.jenkinsConnectionService.testConnection(this.jenkinsInstance, this.credential)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ConnectionTestResponse) => {
          this.isConnValid = response.valid;
        },
        error: (err) => {
          this.error = JSON.stringify(err);
        }
      });
  }

  save(): void {
    this.jenkinsInstanceService.save(this.jenkinsInstance)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (jenkinsInstance: JenkinsInstance) => {
          console.log(jenkinsInstance);
          this.credential.jenkinsInstanceId = jenkinsInstance.id;
          this.credentialService.save(this.credential)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (cred) => {
                console.log(cred);
              },
              error: (err) => {
                this.error = JSON.stringify(err);
              }
            })
        },
        error: (err) => {
          this.error = JSON.stringify(err);
        }
      });
  }

  enableAddPipelines(): boolean {
    return this.jenkinsInstance.name != '' && this.jenkinsInstance.url != ''
      && (this.credential.name == '' && this.credential.apiToken == '' ||
        this.credential.name != '' && this.credential.apiToken != '');
  }

}
