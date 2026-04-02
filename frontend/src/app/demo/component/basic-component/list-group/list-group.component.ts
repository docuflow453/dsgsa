// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-list-group',
  imports: [CommonModule, SharedModule],
  templateUrl: './list-group.component.html',
  styleUrls: ['./list-group.component.scss']
})
export class ListGroupComponent {
  // public method
  item = [
    {
      text: 'Cras justo odio'
    },
    {
      text: 'Dapibus ac facilisis in'
    },
    {
      text: 'Morbi leo risus'
    },
    {
      text: 'Porta ac consectetur ac'
    },
    {
      text: 'Vestibulum at eros'
    }
  ];
}
