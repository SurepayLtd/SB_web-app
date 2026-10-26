import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrbConsentRevokeDialogComponent } from './crb-consent-revoke-dialog.component';

describe('CrbConsentRevokeDialogComponent', () => {
  let component: CrbConsentRevokeDialogComponent;
  let fixture: ComponentFixture<CrbConsentRevokeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrbConsentRevokeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrbConsentRevokeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
