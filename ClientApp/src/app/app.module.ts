import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsertableComponent } from './usertable/usertable.component';
import { HttpClientModule } from '@angular/common/http';
import { AccountmanagerService } from './services/accountmanager.service'

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatInputModule, MatButtonModule, MatSelectModule, 
          MatBadgeModule, MatRippleModule, MatPaginatorModule, MatIconModule,
          MatPaginatorIntl, MatDatepickerModule, MatRadioModule,
          MatSidenavModule, MatToolbarModule, MatDividerModule,
          MatListModule, MatGridListModule, MatCardModule,} from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AlltransactiontableComponent } from './alltransactiontable/alltransactiontable.component';
import { SingleaccountComponent } from './singleaccount/singleaccount.component';
import { CustomPaginatorComponent } from './custom-paginator/custom-paginator.component';
import { AccountPathUpdaterComponent } from './account-path-updater/account-path-updater.component';
import { PitestComponent } from './pitest/pitest.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DailyAveragesComponent } from './dashboard/daily-averages/daily-averages.component';
import { TranTypePieChartComponent } from './dashboard/tran-type-pie-chart/tran-type-pie-chart.component';
import { TranHistoryLineGraphComponent } from './dashboard/tran-history-line-graph/tran-history-line-graph.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HelpComponent } from './help/help.component';


@NgModule({
  declarations: [
    AppComponent,
    UsertableComponent,
    AlltransactiontableComponent,
    SingleaccountComponent,
    CustomPaginatorComponent,
    AccountPathUpdaterComponent,
    PitestComponent,
    DashboardComponent,
    DailyAveragesComponent,
    TranTypePieChartComponent,
    TranHistoryLineGraphComponent,
    NotFoundComponent,
    HelpComponent,
  ],
  imports: [
    BrowserModule,
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
    FormsModule,
    NgxChartsModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    AccountmanagerService,
    { provide: MatPaginatorIntl, useClass: CustomPaginatorComponent }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
