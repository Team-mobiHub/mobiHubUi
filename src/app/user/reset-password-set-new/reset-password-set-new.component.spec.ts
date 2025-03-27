import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordSetNewComponent } from './reset-password-set-new.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthFormComponent } from '../auth-form/auth-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ResetPasswordSetNewComponent', () => {
  let component: ResetPasswordSetNewComponent;
  let fixture: ComponentFixture<ResetPasswordSetNewComponent>;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('mock-token')
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [
        ResetPasswordSetNewComponent,
        AuthFormComponent
      ],
      imports: [
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ResetPasswordSetNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
