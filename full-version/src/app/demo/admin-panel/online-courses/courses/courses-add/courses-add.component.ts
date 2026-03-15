// angular imports
import { Component, OnDestroy, OnInit, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import { FileUploadControl, FileUploadModule, FileUploadValidators } from '@iplab/ngx-file-upload';

// rxjs
import { BehaviorSubject, Subscription } from 'rxjs';

// icons
import { IconService } from '@ant-design/icons-angular';
import { UploadOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-courses-add',
  imports: [SharedModule, FileUploadModule],
  templateUrl: './courses-add.component.html',
  styleUrl: './courses-add.component.scss'
})
export class CoursesAddComponent implements OnInit, OnDestroy {
  private iconService = inject(IconService);

  // public props
  fileSub = new Subscription();

  // private props
  // eslint-disable-next-line
  readonly uploadedFile: BehaviorSubject<any> = new BehaviorSubject(null);
  readonly control = new FileUploadControl({ listVisible: true, accept: ['image/*'], discardInvalid: true, multiple: false }, [
    FileUploadValidators.accept(['image/*']),
    FileUploadValidators.filesLimit(1)
  ]);

  // constructor
  constructor() {
    this.iconService.addIcon(...[UploadOutline]);
  }

  // life cycle
  ngOnInit(): void {
    this.fileSub = this.control.valueChanges.subscribe((values: Array<File>) => this.getImage(values[0]));
  }

  ngOnDestroy(): void {
    this.fileSub.unsubscribe();
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
