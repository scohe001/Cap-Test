import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleaccountComponent } from './singleaccount.component';

describe('SingleaccountComponent', () => {
  let component: SingleaccountComponent;
  let fixture: ComponentFixture<SingleaccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
