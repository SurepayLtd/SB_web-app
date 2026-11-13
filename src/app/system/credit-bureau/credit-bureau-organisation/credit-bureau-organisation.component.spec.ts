import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditBureauOrganisationComponent } from './credit-bureau-organisation.component';

describe('CreditBureauOrganisationComponent', () => {
  let component: CreditBureauOrganisationComponent;
  let fixture: ComponentFixture<CreditBureauOrganisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditBureauOrganisationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditBureauOrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
