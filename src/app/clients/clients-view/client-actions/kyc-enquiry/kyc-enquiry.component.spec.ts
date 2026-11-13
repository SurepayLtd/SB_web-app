import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycEnquiryComponent } from './kyc-enquiry.component';

describe('KycEnquiryComponent', () => {
  let component: KycEnquiryComponent;
  let fixture: ComponentFixture<KycEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycEnquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KycEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
