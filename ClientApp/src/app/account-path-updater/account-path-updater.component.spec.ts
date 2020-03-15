import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPathUpdaterComponent } from './account-path-updater.component';

describe('AccountPathUpdaterComponent', () => {
  let component: AccountPathUpdaterComponent;
  let fixture: ComponentFixture<AccountPathUpdaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountPathUpdaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPathUpdaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
