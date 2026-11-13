import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditScoreComponent } from './credit-score.component';

describe('CreditScoreComponent', () => {
  let component: CreditScoreComponent;
  let fixture: ComponentFixture<CreditScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditScoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
