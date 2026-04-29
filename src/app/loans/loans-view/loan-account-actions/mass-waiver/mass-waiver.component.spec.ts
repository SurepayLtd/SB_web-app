import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassWaiverComponent } from './mass-waiver.component';

describe('MassWaiverComponent', () => {
  let component: MassWaiverComponent;
  let fixture: ComponentFixture<MassWaiverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MassWaiverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MassWaiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
