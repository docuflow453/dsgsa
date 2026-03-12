import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-horses',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <h2>My Horses</h2>
      <p>Manage your horses</p>
    </div>
  `
})
export class HorsesComponent {}

