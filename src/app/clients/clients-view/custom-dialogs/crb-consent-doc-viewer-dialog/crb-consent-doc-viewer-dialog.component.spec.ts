import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrbConsentDocViewerDialogComponent } from './crb-consent-doc-viewer-dialog.component';

describe('CrbConsentDocViewerDialogComponent', () => {
  let component: CrbConsentDocViewerDialogComponent;
  let fixture: ComponentFixture<CrbConsentDocViewerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrbConsentDocViewerDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrbConsentDocViewerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
