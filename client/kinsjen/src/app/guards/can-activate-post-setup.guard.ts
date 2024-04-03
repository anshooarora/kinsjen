import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { OrgService } from '../services/org.service';
import { inject } from '@angular/core';
import { Org } from '../model/org.model';
import { Page } from '../model/page.model';
import { take } from 'rxjs';

export const canActivatePostSetupGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  let result: boolean = true;

  inject(OrgService).findAll().pipe(take(1)).subscribe({
    next: (response: Page<Org>) => {
      if (response.totalElements > 0) {
        result = result && true;
      } else {
        result = false;
      }
      console.log(response)
      console.log(result)
    }
  });

  console.log('ending')
  return result;
};
