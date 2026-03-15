// project import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// project import
import { Role } from 'src/app/theme/shared/components/_helpers/role';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'picker',
        loadComponent: () => import('./forms-picker/forms-picker.component'),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'color-picker',
        loadComponent: () => import('./color-picker/color-picker.component'),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'select',
        loadComponent: () => import('./forms-select/forms-select.component').then((c) => c.FrmSelectComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 're-captcha',
        loadComponent: () => import('./re-captcha/re-captcha.component').then((c) => c.ReCaptchaComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'input-mask',
        loadComponent: () => import('./input-mask/input-mask.component').then((c) => c.InputMaskComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'clipboard',
        loadComponent: () => import('./clipboard/clipboard.component').then((c) => c.ClipboardComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'typeahead',
        loadComponent: () => import('./typeahead/typeahead.component').then((c) => c.TypeaheadComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsPluginsRoutingModule {}
