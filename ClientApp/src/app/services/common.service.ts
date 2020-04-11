import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private url: string = 'https://localhost:5001/';

  constructor(private http: HttpClient) { } // , @Inject('SERVER_URL') serverUrl: string) {

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
