import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

export function getServerUrl() {
  //return document.getElementsByTagName('base')[0].href;
  return 'https:/localhost:50001/';
}

const providers = [
  { provide: 'SERVER_URL', useFactory: getServerUrl, deps: [] }
];

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
