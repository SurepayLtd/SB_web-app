import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrbConsentComponent } from './crb-consent.component';

describe('CrbConsentComponent', () => {
  let component: CrbConsentComponent;
  let fixture: ComponentFixture<CrbConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrbConsentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrbConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
