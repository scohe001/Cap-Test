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
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { RoleCenterComponent } from './role-center/role-center.component';
import { RoleType_TypeDef } from './interfaces/applicationrole';


const routes: Routes = [
  { path: 'accounts', component: UsertableComponent, canActivate: [AuthorizeGuard], data: {roles: [RoleType_TypeDef.Admin, RoleType_TypeDef.Employee]} },
  { path: 'transactions', component: AlltransactiontableComponent, canActivate: [AuthorizeGuard], data: {roles: [RoleType_TypeDef.Admin, RoleType_TypeDef.Employee]} },
  { path: 'account/:id', component: AccountPathUpdaterComponent, canActivate: [AuthorizeGuard], data: {roles: [RoleType_TypeDef.Admin, RoleType_TypeDef.Employee]} },
  { path: 'a/:id', redirectTo: '/account/:id', pathMatch: 'full' },
  { path: 'account/:id/:name', component: SingleaccountComponent, canActivate: [AuthorizeGuard], data: {roles: [RoleType_TypeDef.Admin, RoleType_TypeDef.Employee]} },
  { path: 'a/:id/:name', redirectTo: '/account/:id/:name', pathMatch: 'full' },
  { path: 'transaction-register', component: TransactionRegisterComponent, canActivate: [AuthorizeGuard], data: {roles: [RoleType_TypeDef.Admin, RoleType_TypeDef.Employee]} },
  { path: 'transaction-register/:id', component: TransactionRegisterComponent, canActivate: [AuthorizeGuard], data: {roles: [RoleType_TypeDef.Admin, RoleType_TypeDef.Employee]} },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthorizeGuard], data: {roles: [RoleType_TypeDef.Admin, RoleType_TypeDef.Employee]} },
  { path: 'download', component: DownloadDashboardComponent, canActivate: [AuthorizeGuard], data: {roles: [RoleType_TypeDef.Admin, RoleType_TypeDef.Employee]} },
  { path: 'roles', component: RoleCenterComponent, canActivate: [AuthorizeGuard], data: {roles: [RoleType_TypeDef.Admin]} },
  { path: 'help', component: HelpComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

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
