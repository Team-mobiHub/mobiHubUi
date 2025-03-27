import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultComponent } from './search-result.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SearchBarComponentComponent } from '../../shared/search-bar-component/search-bar-component.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('SearchResultComponent', () => {
  let component: SearchResultComponent;
  let fixture: ComponentFixture<SearchResultComponent>;

  beforeEach(async () => {
    const activatedRouteMock = {
      queryParamMap: of({
        get: jasmine.createSpy('get').and.callFake((key: string) => {
          const params = {
            page: '0',
            pageSize: '10',
            identifier: 'test',
            author: 'author',
            region: 'region',
            modelLevel: ['level1'],
            modelMethod: ['method1'],
            framework: ['framework1']
          };
          return params;
        }),
        getAll: jasmine.createSpy('getAll').and.callFake((key: string) => {
          const params: { [key: string]: string[] } = {
            modelLevel: ['level1'],
            modelMethod: ['method1'],
            framework: ['framework1']
          };
          return params[key] || [];
        })
      })
    };

    await TestBed.configureTestingModule({
      declarations: [
        SearchResultComponent,
        SearchBarComponentComponent
      ],
      imports: [
        HttpClientTestingModule,
        MatPaginatorModule,
        ReactiveFormsModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatExpansionModule,
        MatDividerModule,
        MatSelectModule,
        BrowserAnimationsModule,
        MatChipsModule,
        MatProgressSpinnerModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
