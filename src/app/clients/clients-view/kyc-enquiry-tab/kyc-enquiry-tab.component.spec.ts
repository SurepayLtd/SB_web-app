import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycEnquiryTabComponent } from './kyc-enquiry-tab.component';

describe('KycEnquiryTabComponent', () => {
  let component: KycEnquiryTabComponent;
  let fixture: ComponentFixture<KycEnquiryTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycEnquiryTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KycEnquiryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
