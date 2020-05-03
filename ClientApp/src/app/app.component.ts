import { Component, AfterViewChecked, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResponsiveService } from './services/responsive.service';
import { CommonService } from './services/common.service';
import { AuthorizeService, IUser } from 'src/api-authorization/authorize.service';
import { RoleType_TypeDef } from './interfaces/applicationrole';
import { ApplicationUserManagerService } from './services/application-user-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewChecked, OnInit {
  title = 'ClientApp';
  currentUser: IUser = null;
  private readonly smallestSize: number = 768;

  constructor(private cdRef: ChangeDetectorRef,
              public responsiveManager: ResponsiveService,
              private commonManager: CommonService,
              public authManager: AuthorizeService,
              private appUserManager: ApplicationUserManagerService) { }

  async ngOnInit() {
    this.authManager.getUser().subscribe(user => {
      console.log("Got User!", user);
      this.currentUser = user;
      // Cheat a little and use this as a way to send out initial resize events
      window.dispatchEvent(new Event('resize')); // push a window resize event to recalc everything
    });
    console.log("Init'ed!");
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

}
