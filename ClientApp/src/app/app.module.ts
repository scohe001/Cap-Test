import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsertableComponent } from './usertable/usertable.component';
import { HttpClientModule } from '@angular/common/http';
import { AccountmanagerService } from './accountmanager.service'

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatInputModule, MatButtonModule, MatSelectModule, 
          MatBadgeModule, MatRippleModule, MatPaginatorModule, MatIconModule, MatPaginatorIntl } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AlltransactiontableComponent } from './alltransactiontable/alltransactiontable.component';
import { SingleaccountComponent } from './singleaccount/singleaccount.component';
import { CustomPaginatorComponent } from './custom-paginator/custom-paginator.component';
import { AccountPathUpdaterComponent } from './account-path-updater/account-path-updater.component';
import { PitestComponent } from './pitest/pitest.component';


@NgModule({
  declarations: [
    AppComponent,
    UsertableComponent,
    AlltransactiontableComponent,
    SingleaccountComponent,
    CustomPaginatorComponent,
    AccountPathUpdaterComponent,
    PitestComponent,
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
    MatIconModule,
    FormsModule,
    NgxChartsModule,
  ],
  providers: [
    AccountmanagerService,
    { provide: MatPaginatorIntl, useClass: CustomPaginatorComponent }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
