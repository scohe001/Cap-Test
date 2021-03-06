import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TransactionType, TranType_TypeDef } from '../interfaces/transactiontype';
import { TransactionmanagerService } from '../services/transactionmanager.service';
import { CurrencyPipe } from '@angular/common';
import { AccountmanagerService } from '../services/accountmanager.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-download-dashboard',
  templateUrl: './download-dashboard.component.html',
  styleUrls: ['./download-dashboard.component.css'],
})
export class DownloadDashboardComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private tranManager: TransactionmanagerService,
    private currencyPipe: CurrencyPipe,
    public accountManager: AccountmanagerService,
    private titleService: Title,) { }

  async ngOnInit() {
    this.titleService.setTitle("Download Dashboard - Credit Cache");
  }

  thing() {
    console.log("Testing!");
  }
}
