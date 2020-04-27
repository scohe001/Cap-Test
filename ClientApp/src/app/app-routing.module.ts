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
import { DownloadDashboardComponent } from './download-dashboard/download-dashboard.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';


const routes: Routes = [
  { path: 'accounts', component: UsertableComponent, canActivate: [AuthorizeGuard], data: {roles: ['Admin', 'Employee']} },
  { path: 'transactions', component: AlltransactiontableComponent, canActivate: [AuthorizeGuard], data: {roles: ['Admin', 'Employee']} },
  { path: 'account/:id', component: AccountPathUpdaterComponent, canActivate: [AuthorizeGuard], data: {roles: ['Admin', 'Employee']} },
  { path: 'a/:id', redirectTo: '/account/:id', pathMatch: 'full' },
  { path: 'account/:id/:name', component: SingleaccountComponent, canActivate: [AuthorizeGuard], data: {roles: ['Admin', 'Employee']} },
  { path: 'a/:id/:name', redirectTo: '/account/:id/:name', pathMatch: 'full' },
  { path: 'transaction-register', component: TransactionRegisterComponent, canActivate: [AuthorizeGuard], data: {roles: ['Admin', 'Employee']} },
  { path: 'transaction-register/:id', component: TransactionRegisterComponent, canActivate: [AuthorizeGuard], data: {roles: ['Admin', 'Employee']} },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthorizeGuard], data: {roles: ['Admin', 'Employee']} },
  { path: 'download', component: DownloadDashboardComponent, canActivate: [AuthorizeGuard], data: {roles: ['Admin', 'Employee']} },
  { path: 'help', component: HelpComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'counter', component: CounterComponent },
  { path: 'fetch-data', component: FetchDataComponent, canActivate: [AuthorizeGuard], data: {roles: ['Admin', 'Employee']} },

  // { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
