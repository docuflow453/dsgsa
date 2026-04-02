// angular imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// project import
import { Role } from 'src/app/theme/shared/components/_helpers/role';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'classic-editor',
        loadComponent: () => import('./classic-editor/classic-editor.component').then((c) => c.ClassicEditorComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'quill',
        loadChildren: () => import('./quill-editor/quill-editor.module').then((m) => m.QuillEditorModule),
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
export class TextEditorsRoutingModule {}
