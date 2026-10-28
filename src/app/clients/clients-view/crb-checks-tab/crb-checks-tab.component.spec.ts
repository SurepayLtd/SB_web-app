import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrbChecksTabComponent } from './crb-checks-tab.component';

describe('CrbChecksTabComponent', () => {
  let component: CrbChecksTabComponent;
  let fixture: ComponentFixture<CrbChecksTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrbChecksTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrbChecksTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
