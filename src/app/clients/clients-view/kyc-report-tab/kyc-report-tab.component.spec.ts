import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycReportTabComponent } from './kyc-report-tab.component';

describe('KycReportTabComponent', () => {
  let component: KycReportTabComponent;
  let fixture: ComponentFixture<KycReportTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycReportTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KycReportTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
