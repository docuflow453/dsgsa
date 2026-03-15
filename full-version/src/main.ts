// Angular Import
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { environment } from './environments/environment';
import { provideAnimations } from '@angular/platform-browser/animations';

// project import
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { BasicAuthInterceptor } from 'src/app/theme/shared/components/_helpers/basic-auth.interceptor';
import { ErrorInterceptor } from 'src/app/theme/shared/components/_helpers/error.interceptor';
import { SharedModule } from './app/theme/shared/shared.module';
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';

// third party
import { ToastrModule } from 'ngx-toastr';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule, SharedModule, ToastrModule.forRoot()),
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    [provideHttpClient(withInterceptorsFromDi())],
    provideAnimations(),
    provideSweetAlert2({
      fireOnInit: false,
      dismissOnDestroy: true
    })
  ]
}).catch((err) => console.error(err));
