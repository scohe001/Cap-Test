import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-pitest',
  templateUrl: './pitest.component.html',
  styleUrls: ['./pitest.component.css'],
})
export class PitestComponent {

  view: any[] = [1000, 500];

  single: any[] = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    },
      {
      "name": "UK",
      "value": 6200000
    }
  ];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor() { }
}
