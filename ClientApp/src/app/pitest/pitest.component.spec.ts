import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PitestComponent } from './pitest.component';

describe('PitestComponent', () => {
  let component: PitestComponent;
  let fixture: ComponentFixture<PitestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PitestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PitestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
