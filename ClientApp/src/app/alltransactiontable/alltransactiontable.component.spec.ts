import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlltransactiontableComponent } from './alltransactiontable.component';

describe('AlltransactiontableComponent', () => {
  let component: AlltransactiontableComponent;
  let fixture: ComponentFixture<AlltransactiontableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlltransactiontableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlltransactiontableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
