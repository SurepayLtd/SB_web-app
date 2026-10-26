import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrbConsentTabComponent } from './crb-consent-tab.component';

describe('CrbConsentTabComponent', () => {
  let component: CrbConsentTabComponent;
  let fixture: ComponentFixture<CrbConsentTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrbConsentTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrbConsentTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
