import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuillEditorComponent } from './quill-editor.component';

const routes: Routes = [
  {
    path: '',
    component: QuillEditorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuillEditorRoutingModule {}
