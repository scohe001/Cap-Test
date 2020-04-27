import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizeService } from './authorize.service';
import { tap } from 'rxjs/operators';
import { ApplicationPaths, QueryParameterNames } from './api-authorization.constants';
import { CommonService } from 'src/app/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeGuard implements CanActivate {
  constructor(
    private authorize: AuthorizeService,
    private router: Router,
    private commonManager: CommonService,) { }

  canActivate(
    _next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      let roles = _next.data.roles as Array<string>;
      return this.authorize.isAuthenticated()
        .pipe(tap(isAuthenticated => this.handleAuthorization(isAuthenticated, state, roles)));
  }

  private async handleAuthorization(isAuthenticated: boolean, state: RouterStateSnapshot, roles: Array<string>) {
    // Unathenticated
    if (!isAuthenticated) {
      this.router.navigate(ApplicationPaths.LoginPathComponents, {
        queryParams: {
          [QueryParameterNames.ReturnUrl]: state.url
        }
      });
      return;
    }

    // Unauthorized
    let currentUserRoles = await this.commonManager.GetUserRoles();
    let userHasRole: boolean = currentUserRoles.some(userRole => roles.some(permittedRole => permittedRole === userRole.Name));
    if(!userHasRole) {
      this.router.navigate(ApplicationPaths.UnauthorizedPath, {
        queryParams: {
          [QueryParameterNames.ReturnUrl]: state.url
        }
      });
    }

  }
}
