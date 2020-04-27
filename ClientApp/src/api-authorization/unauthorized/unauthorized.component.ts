import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationPaths, ReturnUrlType } from '../api-authorization.constants';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,)
    { }

  public returnUrl: string = null;

  ngOnInit() {
    this.returnUrl = this.getReturnUrl();
  }

  private getReturnUrl(): string {
    const fromQuery = (this.activatedRoute.snapshot.queryParams as INavigationState).returnUrl;
    // If the url is comming from the query string, check that is either
    // a relative url or an absolute url
    if (fromQuery &&
      !(fromQuery.startsWith(`${window.location.origin}/`) ||
        /\/[^\/].*/.test(fromQuery))) {

      return null;
    }

    return fromQuery ||
      ApplicationPaths.DefaultLoginRedirectPath;
  }

}

interface INavigationState {
  [ReturnUrlType]: string;
}