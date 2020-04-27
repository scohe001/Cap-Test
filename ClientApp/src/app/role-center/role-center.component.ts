import { Component, OnInit } from '@angular/core';
import { ApplicationUserManagerService } from '../services/application-user-manager.service';
import { ApplicationRole } from '../interfaces/applicationrole';
import { ApplicationUser } from '../interfaces/applicationuser';

@Component({
  selector: 'app-role-center',
  templateUrl: './role-center.component.html',
  styleUrls: ['./role-center.component.css']
})
export class RoleCenterComponent implements OnInit {

  public users: ApplicationUser[] = null;
  public roles: { [userId: string]: ApplicationRole[] } = null;

  constructor(
    private appUserManager: ApplicationUserManagerService) { }

  ngOnInit() {
    this.Refresh()
  }

  public RolesForUser(user: ApplicationUser) {
    console.log("Looking for roles for user: ", user);
    if(!user) return [];
    return this.roles[user.Id];
  }

  public async thing() {
    await this.appUserManager.SetRolesOnUser(["Admin", "Employee"], "86844f58-6fa9-45a8-ac11-e4d223d2f3ad");
    this.Refresh();
  }

  public async thing2() {
    await this.appUserManager.SetRolesOnUser(["Unregistered"], "86844f58-6fa9-45a8-ac11-e4d223d2f3ad");
    this.Refresh();
  }

  private async Refresh() {
    this.users = await this.appUserManager.GetAllUsers();
    console.log("Got some users: ", this.users);

    this.roles = await this.appUserManager.GetAllUsersRoles();
    console.log("Got some roles: ", this.roles);
  }

}
