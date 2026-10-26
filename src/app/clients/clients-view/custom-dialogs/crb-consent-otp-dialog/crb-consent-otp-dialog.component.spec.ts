import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrbConsentOtpDialogComponent } from './crb-consent-otp-dialog.component';

describe('CrbConsentOtpDialogComponent', () => {
  let component: CrbConsentOtpDialogComponent;
  let fixture: ComponentFixture<CrbConsentOtpDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrbConsentOtpDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrbConsentOtpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
