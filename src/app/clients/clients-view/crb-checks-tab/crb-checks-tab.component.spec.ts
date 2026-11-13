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

import { CrbChecksTabComponent } from './crb-checks-tab.component';

describe('CrbChecksTabComponent', () => {
  let component: CrbChecksTabComponent;
  let fixture: ComponentFixture<CrbChecksTabComponent>;

  beforeEach(async () => {
    const snapshot = { params: { clientId: '1' }, paramMap: convertToParamMap({ clientId: '1' }), data: {} };
    const routeData: any = { checks: [] };
    await TestBed.configureTestingModule({
      imports: [
        CrbChecksTabComponent,
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

    fixture = TestBed.createComponent(CrbChecksTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
