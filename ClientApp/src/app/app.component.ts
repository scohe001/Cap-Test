import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideInAnimation],
})
export class AppComponent {
  title = 'ClientApp';
  sideNavOpened: boolean = false;

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

  closeSideNav() {
    this.sideNavOpened = false;
  }
}
