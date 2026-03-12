import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <h2>User Management</h2>
      <p>Manage system users</p>
    </div>
  `
})
export class UsersComponent {}

