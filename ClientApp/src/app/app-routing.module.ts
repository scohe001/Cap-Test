import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsertableComponent } from './usertable/usertable.component';
import { AlltransactiontableComponent } from './alltransactiontable/alltransactiontable.component';
import { SingleaccountComponent } from './singleaccount/singleaccount.component';
import { AppComponent } from './app.component';
import { AccountPathUpdaterComponent } from './account-path-updater/account-path-updater.component';


const routes: Routes = [
  { path: 'accounts', component: UsertableComponent },
  { path: 'transactions', component: AlltransactiontableComponent },
  { path: 'account/:id', component: AccountPathUpdaterComponent },
  { path: 'a/:id', redirectTo: '/account/:id', pathMatch: 'full' },
  { path: 'account/:id/:name', component: SingleaccountComponent },
  { path: 'a/:id/:name', redirectTo: '/account/:id', pathMatch: 'full' },
  { path: '**', component: AppComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
