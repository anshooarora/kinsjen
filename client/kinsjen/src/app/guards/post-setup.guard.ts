import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { take } from 'rxjs';
import { OrgService } from '../services/org.service';
import { Org } from '../model/org.model';
import { Page } from '../model/page.model';

export const PostSetupGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);

  inject(OrgService).findAll().pipe(take(1)).subscribe({
    next: (response: Page<Org>) => {
      if (response.totalElements == 0) {
        router.navigate(['start']);
      }
    }
  });
  return true;
};
