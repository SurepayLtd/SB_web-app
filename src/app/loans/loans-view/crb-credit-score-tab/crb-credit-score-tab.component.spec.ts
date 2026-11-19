import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrbCreditScoreTabComponent } from './crb-credit-score-tab.component';

describe('CrbCreditScoreTabComponent', () => {
  let component: CrbCreditScoreTabComponent;
  let fixture: ComponentFixture<CrbCreditScoreTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrbCreditScoreTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrbCreditScoreTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
