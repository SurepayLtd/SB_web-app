import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrbCheckComponent } from './crb-check.component';

describe('CrbCheckComponent', () => {
  let component: CrbCheckComponent;
  let fixture: ComponentFixture<CrbCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrbCheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrbCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
