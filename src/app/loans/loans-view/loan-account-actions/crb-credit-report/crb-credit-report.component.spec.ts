import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrbCreditReportComponent } from './crb-credit-report.component';

describe('CrbCreditReportComponent', () => {
  let component: CrbCreditReportComponent;
  let fixture: ComponentFixture<CrbCreditReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrbCreditReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrbCreditReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
