import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficModelFormComponent } from './traffic-model-form.component';
import { DropZoneComponent } from '../drop-zone/drop-zone.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TrafficModelFormComponent', () => {
  let component: TrafficModelFormComponent;
  let fixture: ComponentFixture<TrafficModelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TrafficModelFormComponent,
        DropZoneComponent,
      ],
      imports: [
        HttpClientTestingModule,

        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TrafficModelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
