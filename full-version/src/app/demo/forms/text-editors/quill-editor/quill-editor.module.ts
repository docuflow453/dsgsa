// angular import
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { QuillEditorRoutingModule } from './quill-editor-routing.module';
import { QuillEditorComponent } from './quill-editor.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [CommonModule, QuillEditorRoutingModule, QuillModule.forRoot(), SharedModule, QuillEditorComponent]
})
export class QuillEditorModule {}
