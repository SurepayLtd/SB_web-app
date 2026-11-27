import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycReportComponent } from './kyc-report.component';

describe('KycReportComponent', () => {
  let component: KycReportComponent;
  let fixture: ComponentFixture<KycReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KycReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
