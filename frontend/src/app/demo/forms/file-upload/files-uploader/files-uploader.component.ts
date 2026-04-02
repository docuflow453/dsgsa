// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// third party
import { UploaderModule } from 'angular-uploader';
import { Uploader, UploadWidgetConfig, UploadWidgetResult } from 'uploader';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-files-uploader',
  imports: [CommonModule, UploaderModule, SharedModule],
  templateUrl: './files-uploader.component.html',
  styleUrls: ['./files-uploader.component.scss']
})
export class FilesUploaderComponent {
  uploader = Uploader({ apiKey: 'free' });
  options: UploadWidgetConfig = {
    multi: true
  };
  onComplete = (files: UploadWidgetResult[]) => {
    this.uploadedFileUrl = files[0]?.fileUrl;
  };
  uploadedFileUrl!: string;
}
