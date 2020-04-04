import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsertableComponent } from './usertable/usertable.component';
import { AlltransactiontableComponent } from './alltransactiontable/alltransactiontable.component';
import { SingleaccountComponent } from './singleaccount/singleaccount.component';
import { AppComponent } from './app.component';
import { AccountPathUpdaterComponent } from './account-path-updater/account-path-updater.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HelpComponent } from './help/help.component';
import { TransactionRegisterComponent } from './transaction-register/transaction-register.component';


const routes: Routes = [
  { path: 'accounts', component: UsertableComponent, data: {animation: 'AccountTable'} },
  { path: 'transactions', component: AlltransactiontableComponent },
  { path: 'account/:id', component: AccountPathUpdaterComponent },
  { path: 'a/:id', redirectTo: '/account/:id', pathMatch: 'full' },
  { path: 'account/:id/:name', component: SingleaccountComponent, data: {animation: 'SingleAccount'} },
  { path: 'a/:id/:name', redirectTo: '/account/:id/:name', pathMatch: 'full' },
  { path: 'transaction-register', component: TransactionRegisterComponent },
  { path: 'transaction-register/:id', component: TransactionRegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'help', component: HelpComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
