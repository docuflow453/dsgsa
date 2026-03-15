import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { RiderNavbarComponent } from './rider-navbar.component';

describe('RiderNavbarComponent', () => {
  let component: RiderNavbarComponent;
  let fixture: ComponentFixture<RiderNavbarComponent>;

  const authServiceStub = {
    currentUser: () => ({
      first_name: 'Ava',
      last_name: 'Smith',
      full_name: 'Ava Smith',
      email: 'ava@example.com'
    }),
    logout: jasmine.createSpy('logout')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiderNavbarComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RiderNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('uses /my routes for rider navigation', () => {
    expect(component.navItems.every(item => item.route.startsWith('/my/'))).toBeTrue();
  });

  it('renders the rider account dropdown', () => {
    component.toggleUserMenu();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Ava');
    expect(text).toContain('My Profile');
    expect(text).toContain('Settings');
  });
});