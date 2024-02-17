import { Injectable } from '@angular/core';
import { AutomationServerService } from './automation-server.service';
import { OrgService } from './org.service';
import { combineLatest } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor(private automationServerService: AutomationServerService,
    private orgService: OrgService,
    private router: Router) { }

  redirectIfUninitialized(): void {
    let servers$ = this.automationServerService.findAll(0);
    let orgs$ = this.orgService.findAll(0);
    combineLatest([servers$, orgs$]).subscribe(v => {
      let anyUninitialized = v.filter(x => x.totalElements == 0).length;
      if (anyUninitialized) {
        this.router.navigate(['/start']);
      }
    })
  }

}
