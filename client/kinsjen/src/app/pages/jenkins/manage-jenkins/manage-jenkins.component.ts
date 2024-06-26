import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { JenkinsInstance } from '../../../model/jenkins-instance.model';
import { JenkinsInstanceService } from '../../../services/jenkins-instance.service';
import { Credential } from '../../../model/credential.model';
import { Page } from '../../../model/page.model';
import { JenkinsConnectionService } from '../../../services/jenkins-connection.service';
import { CredentialService } from '../../../services/credential.service';
import { ConnectionTestResponse } from '../../../model/connection-test-response.model';
import { ActiveView } from './active-view.model';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-manage-jenkins',
  templateUrl: './manage-jenkins.component.html',
  styleUrl: './manage-jenkins.component.scss'
})
export class ManageJenkinsComponent implements OnInit {

  ActiveView = ActiveView;

  private destroy$: Subject<any> = new Subject<any>();

  /* state */
  error: string | undefined;
  activeView: ActiveView = ActiveView.ManageJenkins;

  /* jenkins instance */
  jenkinsInstancePage: Page<JenkinsInstance>;
  jenkinsInstance: JenkinsInstance = {
    id: 0,
    name: '',
    url: '',
    type: 'Jenkins'
  };
  credential: Credential = new Credential();
  automationServerPage: Page<JenkinsInstance> = new Page();
  jenkinsInstanceDeleteId: number = -1;
  isJenkinsInstanceSaved: boolean;

  /* test connection */
  isConnValid: boolean = false;

  /* credentials */
  credentialListing: Credential[] = [];
  jenkinsInstanceIdForCredential: number;
  isCredentialSaved: boolean; 
  credentialId: number;

  /* */
  title: string;

  constructor(private cdr: ChangeDetectorRef,
    private breadcrumbService: BreadcrumbService, 
    private jenkinsInstanceService: JenkinsInstanceService,
    private credentialService: CredentialService,
    private jenkinsConnectionService: JenkinsConnectionService,
    private errorService: ErrorService) { }

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumb([]);
    this.activateView(ActiveView.AddNewJenkins);
    this.findJenkinsInstances();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
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
    this.error = undefined;
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
                this.jenkinsInstance = new JenkinsInstance();
                this.credential = new Credential();
                this.isConnValid = false;
                this.isJenkinsInstanceSaved = true;
                setTimeout(() => {
                  this.isJenkinsInstanceSaved = false;
                }, 2000);
              },
              error: (err) => {
                this.error = this.errorService.getError(err);
              }
            })
        },
        error: (err) => {
          this.error = this.errorService.getError(err);
        }
      });
  }

  removeJenkinsInstance(jenkins: JenkinsInstance): void {
    this.jenkinsInstanceService.delete(jenkins)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.jenkinsInstancePage.content = this.jenkinsInstancePage.content.filter(x => x.id != jenkins.id);
        }});
  }

  enableAddPipelines(): boolean {
    return this.jenkinsInstance.name != '' && this.jenkinsInstance.url != ''
      && (this.credential.name == '' && this.credential.apiToken == '' ||
        this.credential.name != '' && this.credential.apiToken != '');
  }

  findJenkinsInstances(): void {
    this.jenkinsInstanceService.findAll(0, -1)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Page<JenkinsInstance>) => {
          console.log(response)
          this.jenkinsInstancePage = response;
        },
        error: (err) => {
          this.error = this.errorService.getError(err);
        }
      });
  }

  findJenkinsInstanceFromId(id: number): JenkinsInstance {
    return this.jenkinsInstancePage.content.find(x => x.id == id)!;
  }

  findCredentials(): void {
    this.credentialListing = [];
    for (let jenkinsInstance of this.jenkinsInstancePage.content) {
      this.credentialService.find(0, jenkinsInstance.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: Page<Credential>) => {
            console.log(response)
            this.credentialListing.push(...response.content);
          },
          error: (err) => {
            this.error = this.errorService.getError(err);
          }
        });
    }
  }

  saveCredentials(): void {
    this.error = undefined;
    this.credential.jenkinsInstanceId = this.jenkinsInstance.id;
    this.credentialService.save(this.credential)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cred) => {
          this.isConnValid = false;
          this.isCredentialSaved = true;
          setTimeout(() => {
            this.isCredentialSaved = false;
          }, 2000);
          this.credential = new Credential();
        },
        error: (err) => {
          this.error = this.errorService.getError(err);
        }
      })
  }

  removeCredentials(cred: Credential): void {
    this.error = undefined;
    this.credentialService.delete(this.credentialId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.credentialListing = this.credentialListing.filter(x => x.id != cred.id);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = this.errorService.getError(err);
        }
      })
    setTimeout(() => {
      this.credentialId = -1;
    }, 20);
  }

  onSelectJenkinsHostForCredential(event$: any): void {
    this.jenkinsInstance = this.jenkinsInstancePage.content.find(x => x.id == event$.target.value)!;
  }

  activateView(view: ActiveView): void {
    this.activeView = view;

    if (view == ActiveView.AddNewJenkins) {
      this.title = 'Add new Jenkins instance';
    } else if (view == ActiveView.ManageJenkins) {
      this.title = 'Manage Jenkins instances';
      this.findJenkinsInstances();
    } else if (view == ActiveView.AddNewCredentials) {
      this.title = 'Add new credentials';
    } else if (view == ActiveView.ManageCredentials) {
      this.title = 'Manage credentials';
      this.findCredentials();
    }
  }

}
