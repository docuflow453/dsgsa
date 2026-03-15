// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-role',
  imports: [CommonModule, SharedModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent {
  // public method
  tables = [
    {
      src: 'assets/images/user/avatar-1.jpg',
      name: 'Addie Bass',
      email: 'mareva@gmail.com',
      role: 'Owner',
      role_type: 'bg-primary',
      status_1: 'Joined',
      status_type: 'bg-success'
    },
    {
      src: 'assets/images/user/avatar-4.jpg',
      name: 'Agnes McGee',
      email: 'heba@gmail.com',
      role: 'Manager',
      role_type: ' bg-light-info',
      status_1: 'Joined',
      status_type: 'bg-success'
    },
    {
      src: 'assets/images/user/avatar-5.jpg',
      name: 'Agnes McGee',
      email: 'heba@gmail.com',
      role: 'Staff',
      role_type: 'bg-light-warning',
      status: true,
      status_1: 'Invited',
      status_type: 'bg-outline-info'
    },
    {
      src: 'assets/images/user/avatar-1.jpg',
      name: 'Addie Bass',
      email: 'mareva@gmail.com',
      role: 'Staff',
      role_type: 'bg-light-warning',
      status_1: 'Joined',
      status_type: 'bg-success'
    },
    {
      src: 'assets/images/user/avatar-4.jpg',
      name: 'Agnes McGee',
      email: 'heba@gmail.com',
      role: 'Customer',
      role_type: ' bg-light-success',
      status: true,
      status_1: 'Invited',
      status_type: 'bg-outline-info'
    }
  ];
}
