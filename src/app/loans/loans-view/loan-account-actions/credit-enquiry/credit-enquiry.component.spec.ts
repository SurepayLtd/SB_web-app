import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditEnquiryComponent } from './credit-enquiry.component';

describe('CreditEnquiryComponent', () => {
  let component: CreditEnquiryComponent;
  let fixture: ComponentFixture<CreditEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditEnquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
