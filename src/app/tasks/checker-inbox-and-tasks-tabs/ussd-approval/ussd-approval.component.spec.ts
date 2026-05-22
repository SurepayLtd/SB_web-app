import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UssdApprovalComponent } from './ussd-approval.component';

describe('UssdApprovalComponent', () => {
  let component: UssdApprovalComponent;
  let fixture: ComponentFixture<UssdApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UssdApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UssdApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
