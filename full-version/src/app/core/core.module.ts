import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';

// Services
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';
import { LoadingService } from './services/loading.service';

// Interceptors
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';

/**
 * Core Module - Singleton services, guards, and interceptors
 * Should only be imported once in AppModule
 */
@NgModule({
  imports: [CommonModule],
  providers: [
    // Services are already provided in 'root', but listed here for clarity
    AuthService,
    StorageService,
    LoadingService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
}

/**
 * Provide HTTP interceptors for the application
 * Use this in app.config.ts or main.ts
 */
export const provideCore = () => [
  provideHttpClient(
    withInterceptors([
      authInterceptor,
      errorInterceptor,
      loadingInterceptor
    ])
  )
];

