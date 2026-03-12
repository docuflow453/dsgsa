import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <h2>Rider Profile</h2>
      <p>Manage your rider profile information</p>
    </div>
  `
})
export class ProfileComponent {}

