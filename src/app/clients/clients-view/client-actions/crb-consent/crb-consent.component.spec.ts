import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { of } from 'rxjs';

import { CrbConsentComponent } from './crb-consent.component';

describe('CrbConsentComponent', () => {
  let component: CrbConsentComponent;
  let fixture: ComponentFixture<CrbConsentComponent>;

  beforeEach(async () => {
    const snapshot = { params: { clientId: '1' }, paramMap: convertToParamMap({ clientId: '1' }), data: {} };
    const routeData: any = {};
    await TestBed.configureTestingModule({
      imports: [
        CrbConsentComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideNoopAnimations(),
        DatePipe,
        DecimalPipe,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot,
            parent: { snapshot, parent: { snapshot } },
            data: of(routeData),
            paramMap: of(snapshot.paramMap)
          }
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close: jest.fn() } }
      ]
    }).compileComponents();
    TestBed.inject(FaIconLibrary).addIconPacks(fas);

    fixture = TestBed.createComponent(CrbConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
