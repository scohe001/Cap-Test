import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';

// import { MatTableModule } from '@angular/material/table';
// MatSortModule, MatRippleModule, MatPaginatorModule, MatPaginatorIntl, MatNativeDateModule
import { MatInputModule, MatButtonModule, MatSelectModule, 
          MatBadgeModule, MatIconModule, MatTableModule,
          MatDatepickerModule, MatRadioModule, MatSortModule,
          MatSidenavModule, MatToolbarModule, MatDividerModule,
          MatListModule, MatGridListModule, MatCardModule, 
          MatFormFieldModule, MatAutocompleteModule, MatTooltipModule,
          MatDialogModule, MatStepperModule, MatRippleModule,
          MatSnackBarModule, MatPaginatorModule, MatNativeDateModule,
          } from '@angular/material';
// import { MatTableModule } from '@angular/material/table';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsertableComponent, AreYouSureDeleteDialog } from './usertable/usertable.component';
import { AccountmanagerService } from './services/accountmanager.service'
import { AlltransactiontableComponent } from './alltransactiontable/alltransactiontable.component';
import { SingleaccountComponent } from './singleaccount/singleaccount.component';
import { CustomPaginatorComponent } from './custom-paginator/custom-paginator.component';
import { AccountPathUpdaterComponent } from './account-path-updater/account-path-updater.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DailyAveragesComponent } from './dashboard/daily-averages/daily-averages.component';
import { TranTypePieChartComponent } from './dashboard/tran-type-pie-chart/tran-type-pie-chart.component';
import { TranHistoryLineGraphComponent } from './dashboard/tran-history-line-graph/tran-history-line-graph.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HelpComponent } from './help/help.component';
import { TransactionRegisterComponent, TranPostingErrorDialog } from './transaction-register/transaction-register.component';
import { AccountSelectionComponent } from './transaction-register/account-selection/account-selection.component';
import { DownloadDashboardComponent } from './download-dashboard/download-dashboard.component';
import { TransactionDetailsInputComponent } from './transaction-register/transaction-details-input/transaction-details-input.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoleCenterComponent } from './role-center/role-center.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,

    UsertableComponent,
    AlltransactiontableComponent,
    SingleaccountComponent,
    CustomPaginatorComponent,
    AccountPathUpdaterComponent,
    DashboardComponent,
    DailyAveragesComponent,
    TranTypePieChartComponent,
    TranHistoryLineGraphComponent,
    NotFoundComponent,
    HelpComponent,
    TransactionRegisterComponent,
    AreYouSureDeleteDialog,
    AccountSelectionComponent,
    DownloadDashboardComponent,
    TransactionDetailsInputComponent,
    TranPostingErrorDialog,
    RoleCenterComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),

    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatBadgeModule,
    MatRippleModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatIconModule,
    MatRadioModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDividerModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatDialogModule,
    MatStepperModule,
    MatNativeDateModule,
    MatSnackBarModule,
    FormsModule,
    NgxChartsModule,
    BsDatepickerModule.forRoot(),

    HttpClientModule,
    ApiAuthorizationModule,
    // RouterModule.forRoot([
    //   { path: '', component: HomeComponent, pathMatch: 'full' },
    //   { path: 'counter', component: CounterComponent },
    //   { path: 'fetch-data', component: FetchDataComponent, canActivate: [AuthorizeGuard] },
    // ])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
    AccountmanagerService,
    // { provide: MatPaginatorIntl, useClass: CustomPaginatorComponent },
    CurrencyPipe,
    Title,
  ],
  bootstrap: [AppComponent],
  entryComponents: [AreYouSureDeleteDialog, TranPostingErrorDialog],
})
export class AppModule { }
