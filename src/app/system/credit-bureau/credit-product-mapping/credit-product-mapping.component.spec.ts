import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditProductMappingComponent } from './credit-product-mapping.component';

describe('CreditProductMappingComponent', () => {
  let component: CreditProductMappingComponent;
  let fixture: ComponentFixture<CreditProductMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditProductMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditProductMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
