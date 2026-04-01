// angular import
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { IconService } from '@ant-design/icons-angular';
import { AlertOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-coming-soon',
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent implements OnInit {
  private iconService = inject(IconService);

  // public props
  seconds: number = 8;
  minutes: number = 8;
  hours: number = 8;
  days: number = 1;

  // constructor
  constructor() {
    this.iconService.addIcon(...[AlertOutline]);
  }

  // life cycle event
  ngOnInit() {
    setInterval(() => {
      this.seconds++;
      if (this.seconds === 60) {
        this.seconds = 0;
        this.minutes++;
        if (this.minutes === 60) {
          this.minutes = 0;
          this.hours++;
          if (this.hours === 24) {
            this.hours = 0;
            this.days++;
          }
        }
      }
    }, 1000);
  }
}
