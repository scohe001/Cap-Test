import { Component, OnInit, Input, ViewChild, ElementRef, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Account } from '../../interfaces/account';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {

  constructor() { }

  @ViewChild('firstNameInput', {static: false}) firstNameElem: ElementRef;

  public currentAccount: Account;
  public editing: boolean = false;

  @Input()
  set account(val: Account) {
    if(!val) { return; }
    this.currentAccount = val;
    // this.RefreshTable();
  }

  @Input()
  set isEdit(val: boolean) {
    this.editing = val;
    // Focus the first name field
    setTimeout(() => this.firstNameElem.nativeElement.focus(), 0);

    // Do some work to make the form editable or nah
  }

  @Output() doneEditingNoChanges = new EventEmitter();
  @Output() doneEditingWithChanges = new EventEmitter();

  ngOnInit() {
  }

  public cancelClicked() {
    this.isEdit = false;
    this.doneEditingNoChanges.emit('');
  }

  public submitClicked() {
    console.log("Submitted!");
    this.doneEditingWithChanges.emit('');
  }

}
