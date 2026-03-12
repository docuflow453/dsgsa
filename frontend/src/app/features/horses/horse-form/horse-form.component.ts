import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-horse-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid">
      <h2>Register/Edit Horse</h2>
      <p>Add or update horse information</p>
    </div>
  `
})
export class HorseFormComponent {}

