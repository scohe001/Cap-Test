import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ResponsiveService } from 'src/app/services/responsive.service';
import { CommonService } from 'src/app/services/common.service';
import { AuthorizeService, IUser } from 'src/api-authorization/authorize.service';
import { ApplicationUserManagerService } from 'src/app/services/application-user-manager.service';
import { slideInAnimation, sideNavAnimation } from 'src/app/animations';
import { RoleType_TypeDef } from 'src/app/interfaces/applicationrole';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  animations: [slideInAnimation, sideNavAnimation],
})
export class NavigationComponent implements OnInit {
  @Input() MinSideNavWidth: number;

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

  }

  async ngOnInit() {
    let roles = await this.appUserManager.GetCurrentUserRoles()
    this.isUserAnAdmin = roles.some(role => role.Name === RoleType_TypeDef.Admin);
  }

  public closeSideNav() {
    // If sidenav is closeable, close it
    if(!this.isBiggerScreen()) { 
      this.responsiveManager.setSideNavOpen(false);
      setTimeout(() => window.dispatchEvent(new Event('resize'))); // push a window resize event to recalc everything
    }
  }

  public isBiggerScreen() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return (width > this.MinSideNavWidth);
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
