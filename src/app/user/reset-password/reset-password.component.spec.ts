import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordComponent } from './reset-password.component';
import { UserService } from '../../shared/services/user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(async () => {
    const userServiceMock = {
      resetPassword: () => { }
    };

    await TestBed.configureTestingModule({
      declarations: [
        ResetPasswordComponent,
        AuthFormComponent,
      ],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,

        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
