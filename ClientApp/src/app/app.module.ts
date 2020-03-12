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
import { MatSortModule, MatInputModule, MatButtonModule, MatSelectModule, MatBadgeModule, MatRippleModule, MatPaginatorModule } from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    UsertableComponent,
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
    FormsModule,
  ],
  providers: [AccountmanagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
