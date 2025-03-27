import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header/header.component';
import { SearchBarComponentComponent } from './shared/search-bar-component/search-bar-component.component';
import { SearchResultComponent } from './traffic-model/search-result/search-result.component';
import { AuthService } from './shared/services/auth.service';
import { of } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  beforeEach(async () => {
    const authServiceMock = {
      getCurrentUser: () => of(null),
      isAuthenticated: () => false,
      logout: () => of(null)
    };

    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HeaderComponent,
        SearchBarComponentComponent,
        SearchResultComponent
      ],
      imports: [
        RouterTestingModule,

        MatToolbarModule,
        MatDividerModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'mobiHub-Ui' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('mobiHub-Ui');
  });

});
