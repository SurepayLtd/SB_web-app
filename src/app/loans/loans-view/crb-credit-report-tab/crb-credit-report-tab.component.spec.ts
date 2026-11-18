import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrbCreditReportTabComponent } from './crb-credit-report-tab.component';

describe('CrbCreditReportTabComponent', () => {
  let component: CrbCreditReportTabComponent;
  let fixture: ComponentFixture<CrbCreditReportTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrbCreditReportTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrbCreditReportTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
