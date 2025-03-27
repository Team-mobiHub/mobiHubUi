import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowUserComponent } from './show-user.component';
import { of } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../shared/services/auth.service';
import { TrafficModelService } from '../../shared/services/traffic-model.service';
import { UserService } from '../../shared/services/user.service';
import { InteractionService } from '../../traffic-model/shared/interaction.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('ShowUserComponent', () => {
  let component: ShowUserComponent;
  let fixture: ComponentFixture<ShowUserComponent>;

  beforeEach(async () => {
    const authServiceMock = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue(of({ id: 1, isAdmin: true }))
    };

    const userServiceMock = {
      getById: jasmine.createSpy('getById').and.returnValue(of({ name: 'Test User', profilePictureLink: '', teams: [] }))
    };

    const trafficModelServiceMock = {
      getByOwner: jasmine.createSpy('getByOwner').and.returnValue(of([]))
    };

    const interactionServiceMock = {
      getFavoritesOfUser: jasmine.createSpy('getFavoritesOfUser').and.returnValue(of([]))
    };

    const activatedRouteMock = {
      params: of({ id: '123' })
    };

    await TestBed.configureTestingModule({
      declarations: [ShowUserComponent],
      imports: [
        HttpClientTestingModule,

        MatIconModule,
        RouterModule,
        MatButtonToggleModule,
        MatProgressSpinnerModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: TrafficModelService, useValue: trafficModelServiceMock },
        { provide: InteractionService, useValue: interactionServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ShowUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
