import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <h2>Checkout</h2>
      <p>Complete your entry payment</p>
    </div>
  `
})
export class CheckoutComponent {}

