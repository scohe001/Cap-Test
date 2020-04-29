import { Component, OnInit } from '@angular/core';
import { ApplicationUserManagerService } from '../services/application-user-manager.service';
import { ApplicationRole, RoleList } from '../interfaces/applicationrole';
import { ApplicationUser } from '../interfaces/applicationuser';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-role-center',
  templateUrl: './role-center.component.html',
  styleUrls: ['./role-center.component.css']
})
export class RoleCenterComponent implements OnInit {

  // Make it local for the HTML to use
  public myRoleList: string[] = RoleList;

  public displayedColumns: string[] = ["Username", "Email"].concat(RoleList);
  public users: ApplicationUser[] = null;
  public roles: { [userId: string]: ApplicationRole[] } = null;

  // Maps a user to a map of each of the role types and true/false if they have or don't.
  //    Makes it easy to bind to checkboxes
  public userRoles: { [userId: string]: {[roleName: string]: boolean} } = {};

  constructor(
    private appUserManager: ApplicationUserManagerService,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Roles - Credit Cache");
    this.Refresh()
  }

  public RolesForUser(user: ApplicationUser) {
    console.log("Looking for roles for user: ", user);
    if(!user) return [];
    return this.roles[user.Id];
  }

  public hasChanges() {
    if(!this.refreshedOnce || !this.users || !this.roles || !this.userRoles) { return false; }
    return this.users.some(user => this.userChanged(user.Id));
  }

  public async submit() {
    for (const user of this.users) {
      if (this.userChanged(user.Id)) {
        await this.appUserManager.SetRolesOnUser(this.getRolesForUser(user.Id), user.Id);
      }
    }
    this.Refresh();
  }

  public refreshedOnce: boolean = false;
  private async Refresh() {
    this.users = await this.appUserManager.GetAllUsers();
    console.log("Got some users: ", this.users);

    this.roles = await this.appUserManager.GetAllUsersRoles();
    console.log("Got some roles: ", this.roles);

    this.users.forEach(user => {
      this.userRoles[user.Id] = {};
      RoleList.forEach(roleName => {
        this.userRoles[user.Id][roleName] = this.roles[user.Id].some(userRole => userRole.Name === roleName);
      });
    });
    console.log("Got userroles: ", this.userRoles);

    this.refreshedOnce = true;
  }

  private userChanged(userId: string) {
    let roleRemoved: boolean = this.roles[userId].some(role => !this.userRoles[userId][role.Name]);
    let roleAdded: boolean = false;
    for(let roleName in this.userRoles[userId]) {
      if(this.userRoles[userId][roleName] && !this.roles[userId].some(role => roleName === role.Name)) {
        roleAdded = true;
      }
    }

    return roleRemoved || roleAdded;
  }

  private getRolesForUser(userId: string) {
    var rolesForUser: string[] = [];
    for(let roleName in this.userRoles[userId]) {
      if(this.userRoles[userId][roleName]) {
        rolesForUser.push(roleName);
      }
    }

    return rolesForUser;
  }

}
