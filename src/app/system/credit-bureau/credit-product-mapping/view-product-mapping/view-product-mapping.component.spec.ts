import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProductMappingComponent } from './view-product-mapping.component';

describe('ViewProductMappingComponent', () => {
  let component: ViewProductMappingComponent;
  let fixture: ComponentFixture<ViewProductMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProductMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProductMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
