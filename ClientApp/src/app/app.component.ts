import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation, sideNavAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideInAnimation, sideNavAnimation],
})
export class AppComponent {
  title = 'ClientApp';
  sideNavOpened: boolean = true;
  sideNavExpanded: boolean = true;

  sideNavOptions: SideNavOption[] = [
      {link: '/dashboard', icon: 'dashboard', name: 'Dashboard'},
      {link: '/accounts', icon: 'person', name: 'Customers'},
      {link: '/transactions', icon: 'library_books', name: 'Transactions'},
      {link: '/', icon: 'settings', name: 'Preferences'},
      {link: '/', icon: 'help', name: 'Help'},
      ]

  contructor() { }

  prepareRoute(outlet: RouterOutlet) {
    // console.log("Doing a thing!");
    // console.log(outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation']);
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  isBiggerScreen() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return (width < 768);
  }

  toggleSideNavSize() {
    this.sideNavExpanded = !this.sideNavExpanded;
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
