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

  /*
    Useful links for ideas:
      - https://www.primefaces.org/mirage-ng/#/
          Left sidebar is pretty cool. Also like the top bar (also check out how they do it for mobile)
      - 
  */