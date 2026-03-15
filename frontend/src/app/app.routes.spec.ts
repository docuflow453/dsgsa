import { Routes } from '@angular/router';
import { routes } from './app.routes';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { RiderLayoutComponent } from './shared/components/rider-layout/rider-layout.component';

describe('app routes', () => {
  async function loadChildRoutes(path: string): Promise<Routes> {
    const route = routes.find(entry => entry.path === path);

    expect(route).toBeDefined();

    return await route!.loadChildren!() as Routes;
  }

  it('mounts rider pages on rider layout route trees', async () => {
    const riderAliases = ['my', 'rider'];

    for (const path of riderAliases) {
      const loadedRoutes = await loadChildRoutes(path);

      expect(loadedRoutes[0].component).toBe(RiderLayoutComponent);
    }
  });

  it('keeps compatibility rider routes on the rider layout', async () => {
    const loadedRoutes = await loadChildRoutes('riders');

    expect(loadedRoutes[0].component).toBe(RiderLayoutComponent);
  });

  it('uses the rider layout for rider-facing protected feature modules', async () => {
    const riderFacingPaths = ['horses', 'competitions', 'checkout'];

    for (const path of riderFacingPaths) {
      const loadedRoutes = await loadChildRoutes(path);

      expect(loadedRoutes[0].component).toBe(RiderLayoutComponent);
    }
  });

  it('keeps admin and club sections on the sidebar layout', async () => {
    const sidebarPaths = ['dashboard', 'admin', 'clubs'];

    for (const path of sidebarPaths) {
      const loadedRoutes = await loadChildRoutes(path);

      expect(loadedRoutes[0].component).toBe(LayoutComponent);
    }
  });
});