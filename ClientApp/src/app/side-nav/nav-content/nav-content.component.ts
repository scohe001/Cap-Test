import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ResponsiveService } from 'src/app/services/responsive.service';
import { CommonService } from 'src/app/services/common.service';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { ApplicationUserManagerService } from 'src/app/services/application-user-manager.service';

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.css']
})
export class NavContentComponent implements OnInit {

  versionNum: string = "V1.4.19";

  constructor(private cdRef: ChangeDetectorRef,
              public responsiveManager: ResponsiveService,
              private commonManager: CommonService,
              public authManager: AuthorizeService,
              private appUserManager: ApplicationUserManagerService) { }

  async ngOnInit() {
    this.versionNum = await this.commonManager.GetVersionString()
  }

}
