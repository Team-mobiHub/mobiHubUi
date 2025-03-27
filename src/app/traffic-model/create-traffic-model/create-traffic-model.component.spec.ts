import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrafficModelComponent } from './create-traffic-model.component';
import { TrafficModelService } from '../../shared/services/traffic-model.service';
import { TrafficModelFormComponent } from '../traffic-model-form/traffic-model-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DropZoneComponent } from '../drop-zone/drop-zone.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateTrafficModelComponent', () => {
  let component: CreateTrafficModelComponent;
  let fixture: ComponentFixture<CreateTrafficModelComponent>;

  beforeEach(async () => {
    const trafficModelServiceMock = {
      // Add mock methods and properties as needed
    };

    await TestBed.configureTestingModule({
      declarations: [
        CreateTrafficModelComponent,
        TrafficModelFormComponent,
        DropZoneComponent
      ],
      imports: [
        HttpClientTestingModule,

        MatFormField,
        MatLabel,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: TrafficModelService, useValue: trafficModelServiceMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateTrafficModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
