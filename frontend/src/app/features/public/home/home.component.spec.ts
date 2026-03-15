import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('renders the coming-soon hero and countdown content', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('A refined digital home for South African dressage is taking shape.');
    expect(text).toContain('National Calendar');
    expect(text).toContain('Learn more about DSRiding');
    expect(component.countdown.length).toBe(4);
  });
});