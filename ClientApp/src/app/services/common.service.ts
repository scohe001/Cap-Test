import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

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