import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PublicNavbarComponent } from './public-navbar.component';

describe('PublicNavbarComponent', () => {
  let component: PublicNavbarComponent;
  let fixture: ComponentFixture<PublicNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicNavbarComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PublicNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('defines the requested public navigation structure', () => {
    expect(component.navItems.map(item => item.label)).toEqual([
      'Home',
      'Login',
      'Provinces',
      'National Calendar',
      'Results',
      'Officials',
      'News',
      'Contact Us'
    ]);
    expect(component.navItems[0].children?.[0].route).toBe('/about');
  });

  it('renders the navigation labels in the mobile menu', () => {
    component.toggleMobileMenu();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Login');
    expect(text).toContain('Contact Us');
  });
});