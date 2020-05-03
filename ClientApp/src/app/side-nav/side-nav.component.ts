import { Component, OnInit, Input } from '@angular/core';
import { IUser } from 'src/api-authorization/authorize.service';
import { ResponsiveService } from '../services/responsive.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  @Input() CurrentUser: IUser;
  @Input() MinSideNavWidth: number;
  constructor(public responsiveManager: ResponsiveService,) {
    // Setup initial
    if(window.innerWidth < this.MinSideNavWidth) {
        this.responsiveManager.setSideNavOpen(false);
        this.responsiveManager.setSideNavExpanded(true);
    }
  }

  ngOnInit() {
    this.responsiveManager.onResizeActual$.subscribe((vals: [number, number]) => {
      // Just got too small...
      if(vals[1] <= this.MinSideNavWidth) {
        this.responsiveManager.setSideNavOpen(false);
      }
      if(vals[1] > this.MinSideNavWidth) {
        this.responsiveManager.setSideNavOpen(true);
      }
    });
  }

}
