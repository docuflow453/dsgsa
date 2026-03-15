// Angular import
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import { FileUploadControl, FileUploadModule, FileUploadValidators } from '@iplab/ngx-file-upload';
import { BehaviorSubject, Subscription } from 'rxjs';

// icons
import { IconService } from '@ant-design/icons-angular';
import { UploadOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-dropzone',
  imports: [CommonModule, SharedModule, FileUploadModule],
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss']
})
export class DropzoneComponent implements OnInit, OnDestroy {
  private iconService = inject(IconService);

  // public props
  animation: boolean = true;
  multiple: boolean = false;

  constructor() {
    this.iconService.addIcon(...[UploadOutline]);
  }

  // private props
  private filesControl = new FormControl<File[]>(null!, FileUploadValidators.filesLimit(2));
  // eslint-disable-next-line
  readonly uploadedFile: BehaviorSubject<any> = new BehaviorSubject(null);
  private subscription!: Subscription;
  readonly control = new FileUploadControl({ listVisible: true, accept: ['image/*'], discardInvalid: true, multiple: false }, [
    FileUploadValidators.accept(['image/*']),
    FileUploadValidators.filesLimit(1)
  ]);
  demoForm = new FormGroup({
    files: this.filesControl
  });

  // life cycle event
  ngOnInit(): void {
    this.subscription = this.control.valueChanges.subscribe((values: Array<File>) => this.getImage(values[0]));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // public method
  toggleStatus(): void {
    // eslint-disable-next-line
    this.filesControl.disabled ? this.filesControl.enable() : this.filesControl.disable();
  }

  toggleMultiple() {
    this.multiple = !this.multiple;
  }

  toggleAnimation() {
    this.animation = !this.animation;
  }

  clear(): void {
    this.filesControl.setValue([]);
  }

  // private method
  private getImage(file: File): void {
    if (FileReader && file) {
      const fr = new FileReader();
      fr.onload = (e) => this.uploadedFile.next(e.target!.result);
      fr.readAsDataURL(file);
    } else {
      this.uploadedFile.next(null);
    }
  }
}
