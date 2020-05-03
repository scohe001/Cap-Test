import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ResponsiveService } from 'src/app/services/responsive.service';
import { CommonService } from 'src/app/services/common.service';
import { AuthorizeService, IUser } from 'src/api-authorization/authorize.service';
import { ApplicationUserManagerService } from 'src/app/services/application-user-manager.service';
import { ApplicationUser } from 'src/app/interfaces/applicationuser';

@Component({
  selector: 'app-nav-toolbar',
  templateUrl: './nav-toolbar.component.html',
  styleUrls: ['./nav-toolbar.component.css']
})
export class NavToolbarComponent implements OnInit {

  constructor(private cdRef: ChangeDetectorRef,
              public responsiveManager: ResponsiveService,
              private commonManager: CommonService,
              public authManager: AuthorizeService,
              private appUserManager: ApplicationUserManagerService) { }

  @Input() CurrentUser: IUser;
  @Input() MinSideNavWidth: number;
  ngOnInit() {
  }

  public toggleClicked() {
    if(this.responsiveManager.Width > this.MinSideNavWidth) {
      this.responsiveManager.toggleSideNavSize()
      setTimeout(() => window.dispatchEvent(new Event('resize'))); // push a window resize event to recalc everything
    } else {
      this.responsiveManager.toggleSideNavOpen();
    }
  }

}
