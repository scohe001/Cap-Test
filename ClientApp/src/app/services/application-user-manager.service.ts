import { Injectable, Inject } from '@angular/core';
import { ApplicationRole } from '../interfaces/applicationrole';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApplicationUser } from '../interfaces/applicationuser';

@Injectable({
  providedIn: 'root'
})
export class ApplicationUserManagerService {

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private url: string,
  ) { }
  
  public async GetCurrentUserRoles(): Promise<ApplicationRole[]> {
    return await this.http.get<ApplicationRole[]>(this.url + 'Common/GetCurrentUserRoles').toPromise();
  }

  public async GetAllUsersRoles() {
    return await this.http.get<{ [userId: string] : ApplicationRole[]; }>(this.url + 'Common/GetAllUsersRoles').toPromise().catch(reason => null);
  }

  public async GetAllUsers() {
    return await this.http.get<ApplicationUser[]>(this.url + 'Common/GetAllUsers').toPromise().catch(reason => null);
  }

  // public async Task<IActionResult> SetRolesOnUser(List<string> roleNames, string userId) {
  public async SetRolesOnUser(roleNames: string[], userId: string) {
    return await this.http.get<any>(this.url + 'Common/SetRolesOnUser',
                                    { 
                                      params: new HttpParams()
                                                .set('roleNamesCommaSeparated', roleNames.join(","))
                                                .set('userId', userId)
                                    }).toPromise().catch(reason => null);

  }

}
