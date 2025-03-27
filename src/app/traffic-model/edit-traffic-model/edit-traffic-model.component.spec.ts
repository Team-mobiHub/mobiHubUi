import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTrafficModelComponent } from './edit-traffic-model.component';
import { DropZoneComponent } from '../drop-zone/drop-zone.component';
import { TrafficModelFormComponent } from '../traffic-model-form/traffic-model-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TrafficModelService } from '../../shared/services/traffic-model.service';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, of } from 'rxjs';

describe('EditTrafficModelComponent', () => {
  let component: EditTrafficModelComponent;
  let fixture: ComponentFixture<EditTrafficModelComponent>;

  beforeEach(async () => {
    const trafficModelServiceMock = {
      getById(id: number): Observable<any> { return of({}); }
    };

    const activatedRouteMock = {
      paramMap: of({
        get: jasmine.createSpy('get').and.returnValue('123') // Mock the route parameter
      })
    };

    await TestBed.configureTestingModule({
      declarations: [
        EditTrafficModelComponent,
        TrafficModelFormComponent,
        DropZoneComponent
      ],
      imports: [
        HttpClientTestingModule,

        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: TrafficModelService, useValue: trafficModelServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditTrafficModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
