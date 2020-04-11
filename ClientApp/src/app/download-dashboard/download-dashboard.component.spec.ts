import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadDashboardComponent } from './download-dashboard.component';

describe('DownloadDashboardComponent', () => {
  let component: DownloadDashboardComponent;
  let fixture: ComponentFixture<DownloadDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
