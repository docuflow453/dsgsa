import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Components
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

// Directives
import { HasRoleDirective } from './directives/has-role.directive';

// Pipes
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

/**
 * Shared Module - Reusable components, directives, and pipes
 * Can be imported in any feature module
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // Standalone components
    LoadingSpinnerComponent,
    HasRoleDirective,
    SafeHtmlPipe
  ],
  exports: [
    // Angular modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // Shared components, directives, pipes
    LoadingSpinnerComponent,
    HasRoleDirective,
    SafeHtmlPipe
  ]
})
export class SharedModule {}

