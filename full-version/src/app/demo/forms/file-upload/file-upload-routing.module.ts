import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dropzone',
        loadComponent: () => import('./dropzone/dropzone.component').then((c) => c.DropzoneComponent)
      },
      {
        path: 'files-dropzone',
        loadComponent: () => import('./files-uploader/files-uploader.component').then((c) => c.FilesUploaderComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileUploadRoutingModule {}
