import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleCenterComponent } from './role-center.component';

describe('RoleCenterComponent', () => {
  let component: RoleCenterComponent;
  let fixture: ComponentFixture<RoleCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
