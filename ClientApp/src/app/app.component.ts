import { Component, AfterViewChecked, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation, sideNavAnimation } from './animations';
import { ResponsiveService } from './services/responsive.service';
import { CommonService } from './services/common.service';
import { AuthorizeService, IUser } from 'src/api-authorization/authorize.service';
import { RoleType_TypeDef } from './interfaces/applicationrole';
import { ApplicationUserManagerService } from './services/application-user-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideInAnimation, sideNavAnimation],
})
export class AppComponent implements AfterViewChecked, OnInit {
  title = 'ClientApp';
  sideNavOpened: boolean = true;
  // sideNavExpanded: boolean = true;
  versionNum: string = "V1.4.19";
  currentUser: IUser = null;
  isUserAnAdmin: boolean = false;

  showRolesItem = (): boolean => {
    return this.isUserAnAdmin;
  }

  sideNavOptions: SideNavOption[] = [
      new SideNavOption('/dashboard', 'dashboard', 'Dashboard'),
      new SideNavOption('/accounts', 'person', 'Customers'),
      new SideNavOption('/transaction-register', 'credit_card', 'Register'),
      // {link: '/transactions', icon: 'library_books', name: 'Transactions'},
      new SideNavOption('/download', 'cloud_download', 'Download'),
      // Maybe use 'assignment' or 'contacts' for the icon for roles
      {link: '/roles', icon: 'library_books', name: 'Roles', show: this.showRolesItem},
      new SideNavOption('/', 'settings', 'Preferences'),
      new SideNavOption('/help', 'help', 'Help'),
      ]

  constructor(private cdRef: ChangeDetectorRef,
              public responsiveManager: ResponsiveService,
              private commonManager: CommonService,
              public authManager: AuthorizeService,
              private appUserManager: ApplicationUserManagerService) {

    // Setup initial
    if(window.innerWidth < this.smallestSize) {
        this.responsiveManager.setSideNavOpen(false);
        this.responsiveManager.setSideNavExpanded(true);
    }
  }

  private readonly smallestSize: number = 768;
  async ngOnInit() {
    let roles = await this.appUserManager.GetCurrentUserRoles()
    this.isUserAnAdmin = roles.some(role => role.Name === RoleType_TypeDef.Admin);

    this.authManager.getUser().subscribe(user => {
      console.log("Got User!", user);
      this.currentUser = user;
    });

    this.versionNum = await this.commonManager.GetVersionString()

    this.responsiveManager.onResizeActual$.subscribe((vals: [number, number]) => {
      // Just got too small...
      if(vals[1] <= this.smallestSize) {
        this.responsiveManager.setSideNavOpen(false);
        // this.responsiveManager.setSideNavExpanded(true);
      }
      if(vals[1] > this.smallestSize) {
        this.responsiveManager.setSideNavOpen(true);
        // this.responsiveManager.setSideNavExpanded(true);
      }
    });
  }

  private sendResizeOnce: boolean = false;
  ngAfterViewChecked() {
    // Send out an initial resize event after everything comes up so the
    //   Responsive service will catch it and alert everyone
    if(!this.sendResizeOnce) {
      // Super hacky, but we only want to run this code once and we need 
      //    to wait a sec for everything to be up...
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        this.cdRef.detectChanges();
        this.sendResizeOnce = true;
      });
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  isBiggerScreen() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return (width > this.smallestSize);
  }

  toggleClicked() {
    if(this.responsiveManager.Width > this.smallestSize) {
      this.responsiveManager.toggleSideNavSize()
      window.dispatchEvent(new Event('resize')); // push a window resize event to recalc everything
    } else {
      this.responsiveManager.toggleSideNavOpen();
    }
  }

  closeSideNav() {
    // If sidenav is closeable, close it
    if(!this.isBiggerScreen()) { 
      this.responsiveManager.setSideNavOpen(false);
      setTimeout(() => window.dispatchEvent(new Event('resize'))); // push a window resize event to recalc everything
    }
  }

}

class SideNavOption {
  link: string;
  icon: string;
  name: string;
  show: Function;

  constructor(link: string, icon: string, name: string) {
    this.link = link;
    this.icon = icon;
    this.name = name;
    this.show = () => true;
  }
}
