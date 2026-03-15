import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { RiderDashboardComponent } from './rider-dashboard.component';

describe('RiderDashboardComponent', () => {
  let component: RiderDashboardComponent;
  let fixture: ComponentFixture<RiderDashboardComponent>;

  const authServiceStub = {
    currentUser: () => ({
      first_name: 'Ava',
      last_name: 'Smith',
      full_name: 'Ava Smith',
      email: 'ava@example.com'
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiderDashboardComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RiderDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the redesigned dashboard hero without the missing image dependency', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Authenticated rider experience');
    expect(text).toContain('Manage entries');
    expect(text).toContain('Open national calendar');
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
  });

  it('keeps rider dashboard data aligned to dressage routes and content', () => {
    expect(component.upcomingEntries.length).toBe(4);
    expect(component.recentResults.length).toBe(3);
    expect(component.upcomingEntries.every(entry => entry.class.includes('Test'))).toBeTrue();
  });
});