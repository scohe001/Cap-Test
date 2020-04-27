import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ApplicationRole } from '../interfaces/applicationrole';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private url: string,
  ) { }

  public async GetVersionString() {
    return (await this.http.get<VersionObj>(this.url + 'Common/GetVersionString').toPromise()).Version;
  }

  public async GetUserRoles(): Promise<ApplicationRole[]> {
    return await this.http.get<ApplicationRole[]>(this.url + 'Common/GetUserRoles').toPromise();
  }

  public IsGoodIdFormat(id: string): boolean {
    return id && (/^([0-9]+)$/.test(id));
  }

}

export interface VersionObj {
  Version: string;
}

export interface HttpStatusCodeResponse  {
  StatusCode: number;
  StatusDescription: string;
}