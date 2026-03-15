// Angular imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// project import
import { Role } from 'src/app/theme/shared/components/_helpers/role';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'form-basic',
        loadComponent: () => import('./form-basic/form-basic.component').then((c) => c.FormBasicComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'form-floating',
        loadComponent: () => import('./form-floating/form-floating.component').then((c) => c.FormFloatingComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'form-options',
        loadComponent: () => import('./form-options/form-options.component').then((c) => c.FormOptionsComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'input-group',
        loadComponent: () => import('./input-group/input-group.component').then((c) => c.InputGroupComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'checkbox',
        loadComponent: () => import('./frm-checkbox/frm-checkbox.component').then((c) => c.FrmCheckboxComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'radio',
        loadComponent: () => import('./frm-radio/frm-radio.component').then((c) => c.FrmRadioComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'switch',
        loadComponent: () => import('./frm-switch/frm-switch.component').then((c) => c.FrmSwitchComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'mega-option',
        loadComponent: () => import('./mega-option/mega-option.component').then((c) => c.MegaOptionComponent),
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
export class FormsElementsRoutingModule {}
