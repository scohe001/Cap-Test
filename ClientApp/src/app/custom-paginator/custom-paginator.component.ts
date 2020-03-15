import { Component, OnInit } from '@angular/core';
import {MatPaginatorIntl} from '@angular/material';

@Component({
  selector: 'app-custom-paginator',
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.css']
})
export class CustomPaginatorComponent extends MatPaginatorIntl {

  itemsPerPageLabel = ''; //customize item per page label

  constructor() { super(); }

}
