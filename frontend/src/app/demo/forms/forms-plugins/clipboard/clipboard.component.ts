// Angular import
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// third party
import { ClipboardService } from 'ngx-clipboard';
import { ClipboardModule } from 'ngx-clipboard';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-clipboard',
  imports: [CommonModule, SharedModule, ClipboardModule],
  templateUrl: './clipboard.component.html',
  styleUrls: ['./clipboard.component.scss']
})
export class ClipboardComponent implements OnInit {
  private _clipboardService = inject(ClipboardService);

  // private props
  text1!: string;
  text2!: string;
  textModal!: string;
  isCopied1!: boolean;
  isCopied2!: boolean;
  isCopied3!: boolean;
  basic = false;

  // Life cycle events
  ngOnInit(): void {
    this._clipboardService.copyResponse$.subscribe((re) => {
      if (re.isSuccess) {
        alert('copy success!');
      }
    });
    this._clipboardService.configure({ cleanUpAfterCopy: true });
  }

  // private method
  callServiceToCopy() {
    this._clipboardService.copy('This is copy thru service copyFromContent directly');
  }

  onCopyFailure() {
    alert('copy fail!');
  }
}
