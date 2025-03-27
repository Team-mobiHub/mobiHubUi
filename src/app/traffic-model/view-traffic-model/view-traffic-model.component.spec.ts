import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTrafficModelComponent } from './view-traffic-model.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchBarComponentComponent } from '../../shared/search-bar-component/search-bar-component.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('ViewTrafficModelComponent', () => {
  let component: ViewTrafficModelComponent;
  let fixture: ComponentFixture<ViewTrafficModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ViewTrafficModelComponent,
        SearchBarComponentComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatExpansionModule,
        MatDividerModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ViewTrafficModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
