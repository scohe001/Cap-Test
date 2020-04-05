import { Component, AfterViewChecked, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation, sideNavAnimation } from './animations';
import { ResponsiveService } from './services/responsive.service';
import { CommonService } from './services/common.service';

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

  sideNavOptions: SideNavOption[] = [
      {link: '/dashboard', icon: 'dashboard', name: 'Dashboard'},
      {link: '/accounts', icon: 'person', name: 'Customers'},
      {link: '/transaction-register', icon: 'credit_card', name: 'Register'},
      {link: '/transactions', icon: 'library_books', name: 'Transactions'},
      {link: '/', icon: 'cloud_download', name: 'Download'},
      {link: '/', icon: 'settings', name: 'Preferences'},
      {link: '/help', icon: 'help', name: 'Help'},
      ]

  constructor(private cdRef: ChangeDetectorRef,
              private responsiveManager: ResponsiveService,
              private commonManager: CommonService) { }

  private readonly smallestSize: number = 768;
  async ngOnInit() {
    this.versionNum = await this.commonManager.GetVersionString()

    if(window.innerWidth < this.smallestSize) {
        this.responsiveManager.setSideNavExpanded(true);
        this.responsiveManager.setSideNavOpen(false);
    }

    this.responsiveManager.onResize$.subscribe((vals: [number, number]) => {
      // Just got too small...
      if(vals[0] > this.smallestSize && vals[1] <= this.smallestSize) {
        console.log("Switching big -> small");
        this.responsiveManager.setSideNavExpanded(true);
        this.responsiveManager.setSideNavOpen(false);
      }
      if(vals[0] <= this.smallestSize && vals[1] > this.smallestSize) {
        console.log("Switching small -> big");
        this.responsiveManager.setSideNavExpanded(true);
        this.responsiveManager.setSideNavOpen(true);
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
      }
      );
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
    } else {
      this.responsiveManager.toggleSideNavOpen();
    }
  }

  closeSideNav() {
    // this.sideNavOpened = false;
  }
}

class SideNavOption {
  link: string;
  icon: string;
  name: string;
}
