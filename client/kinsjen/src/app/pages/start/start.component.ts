import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import { ErrorService } from '../../services/error.service';
import { StartStepper } from './start-stepper.model';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent implements OnInit {

  StartStepper = StartStepper;

  private destroy$: Subject<any> = new Subject<any>();
  private readonly componentTitle: string = '';
  private readonly breadcrumbs: Breadcrumb[] = [];

  /* state */
  error: string | undefined;

  /* steps */
  step: StartStepper = StartStepper.Org;

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

  
  constructor(private router: Router,
    private breadcrumbService: BreadcrumbService,
    private orgService: OrgService,
    private jenkinsInstanceService: JenkinsInstanceService,
    private credentialService: CredentialService,
    private jenkinsConnectionService: JenkinsConnectionService,
    private errorService: ErrorService) { }

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
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Page<Org>) => {
          if (response.totalElements > 0) {
            this.step = StartStepper.Jenkins;
          }
          this.orgs = response;
          this.findJenkinsInstances();
        },
        error: (err) => {
          this.error = this.errorService.getError(err);
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
          this.step = StartStepper.Jenkins;
        },
        error: (err) => {
          this.error = this.errorService.getError(err);
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
          if (this.orgs.totalElements > 0 && response.totalElements > 0) {
            this.router.navigate(['orgs']);
          }
        },
        error: (err) => {
          this.error = this.errorService.getError(err);
        }
      });
  }

  testConnection(): void {
    this.error = undefined;
    this.jenkinsConnectionService.testConnection(this.jenkinsInstance, this.credential)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ConnectionTestResponse) => {
          console.log(response)
          this.isConnValid = response.valid;
        },
        error: (err) => {
          this.isConnValid = false;
          this.error = this.errorService.getError(err);
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
        this.saveCredentials();
      },
      error: (err) => {
        this.error = this.errorService.getError(err);
      }
    });
  }

  saveCredentials(): void {
    this.credentialService.save(this.credential)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (cred) => {
        console.log(cred);
        this.router.navigate(['orgs'])
      },
      error: (err) => {
        this.error += this.errorService.getError(err);
      }
    })
  }

  enableAddPipelines(): boolean {
    return this.jenkinsInstance.name != '' && this.jenkinsInstance.url != ''
      && (this.credential.name == '' && this.credential.apiToken == '' ||
        this.credential.name != '' && this.credential.apiToken != '');
  }

}
