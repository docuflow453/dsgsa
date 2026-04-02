// angular import
import { Component } from '@angular/core';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

// third party
import { QuillEditorComponent as QuillEditorComponent_1 } from 'ngx-quill';

@Component({
  selector: 'app-quill-editor',
  templateUrl: './quill-editor.component.html',
  styleUrls: ['./quill-editor.component.scss'],
  imports: [CardComponent, QuillEditorComponent_1]
})
export class QuillEditorComponent {}
