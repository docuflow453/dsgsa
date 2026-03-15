// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-collapse',
  imports: [CommonModule, SharedModule],
  templateUrl: './collapse.component.html',
  styleUrls: ['./collapse.component.scss']
})
export class CollapseComponent implements OnInit {
  // public props
  isCollapsed!: boolean;
  multiCollapsed1!: boolean;
  multiCollapsed2!: boolean;

  // public method
  panels = ['First', 'Second', 'Third'];

  // life cycle event
  ngOnInit() {
    this.isCollapsed = true;
    this.multiCollapsed1 = true;
    this.multiCollapsed2 = true;
  }
}
