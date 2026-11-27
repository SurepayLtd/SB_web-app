import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrbCreditEnquiryTabComponent } from './crb-credit-enquiry-tab.component';

describe('CrbCreditEnquiryTabComponent', () => {
  let component: CrbCreditEnquiryTabComponent;
  let fixture: ComponentFixture<CrbCreditEnquiryTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrbCreditEnquiryTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrbCreditEnquiryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
