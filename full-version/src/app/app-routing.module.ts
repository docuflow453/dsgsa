// Angular Imports
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminLayout } from './theme/layout/admin-layout/admin-layout.component';
import { GuestLayouts } from './theme/layout/guest-layout/guest-layout.component';
import { AuthGuardChild } from './theme/shared/components/_helpers/auth.guard';
import { SimpleLayouts } from './theme/layout/simple-layout/simple-layout.component';
import { Role } from './theme/shared/components/_helpers/role';

const routes: Routes = [
  // Default route - redirect to login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  // Primary login route
  {
    path: 'login',
    loadComponent: () => import('./demo/pages/authentication/auth-login/auth-login.component').then((c) => c.AuthLoginComponent)
  },
  // Authentication routes (public - no auth required)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./demo/pages/authentication/auth-register/auth-register.component').then((c) => c.AuthRegisterComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./demo/pages/authentication/forgot-password/forgot-password.component').then((c) => c.ForgotPasswordComponent)
  },
  // All protected routes use AdminLayout
  {
    path: '',
    component: AdminLayout,
    // canActivateChild: [AuthGuardChild],
    children: [
      // Rider routes (role: RIDER)
      {
        path: 'my',
        loadChildren: () => import('./features/rider/rider.routes').then((m) => m.RIDER_ROUTES)
      },
      // Show Holding Body routes (role: SHOW_HOLDING_BODY)
      {
        path: 'shb',
        loadChildren: () => import('./features/show-holding-body/show-holding-body.routes').then((m) => m.SHOW_HOLDING_BODY_ROUTES)
      },
      // Admin routes (role: ADMIN)
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
        data: { roles: [Role.Admin] }
      },
      // Admin dashboard routes
      {
        path: 'dashboard',
        loadChildren: () => import('./demo/dashboard/dashboard.module').then((m) => m.DashboardModule),
        data: { roles: [Role.Admin, Role.User] }
      },
      {
        path: 'widget/statistics',
        loadComponent: () => import('./demo/widget/statistics/statistics.component').then((c) => c.StatisticsComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'widget/data',
        loadComponent: () => import('./demo/widget/widget-data/widget-data.component').then((c) => c.WidgetDataComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'widget/chart',
        loadComponent: () => import('./demo/widget/widget-chart/widget-chart.component').then((c) => c.WidgetChartComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'online-course',
        loadChildren: () => import('./demo/admin-panel/online-courses/online-courses.module').then((m) => m.OnlineCoursesModule),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'membership',
        loadChildren: () => import('./demo/admin-panel/membership/membership.module').then((m) => m.MembershipModule),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'helpdesk',
        loadChildren: () => import('./demo/admin-panel/helpdesk/helpdesk.module').then((m) => m.HelpdeskModule),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'invoice',
        loadChildren: () => import('./demo/admin-panel/invoice/invoice.module').then((m) => m.InvoiceModule),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'layout',
        loadChildren: () => import('./demo/layouts/layouts.module').then((m) => m.LayoutsModule),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'chat',
        loadComponent: () => import('./demo/application/chat/chat.component').then((c) => c.ChatComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'calendar',
        loadChildren: () => import('./demo/application/calender/calender.module').then((m) => m.CalenderModule),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'user',
        loadChildren: () => import('./demo/application/user/user.module').then((m) => m.UserModule),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'customer',
        loadChildren: () => import('./demo/application/customer/customer.module').then((m) => m.CustomerModule),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'e-commerce',
        loadChildren: () => import('./demo/application/e-commerce/e-commerce.module').then((m) => m.ECommerceModule),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'form',
        loadChildren: () => import('./demo/forms/forms-elements/forms-elements.module').then((m) => m.FormsElementsModule),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'form-plugin',
        loadChildren: () => import('./demo/forms/forms-plugins/forms-plugins.module').then((m) => m.FormsPluginsModule),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'editor',
        loadChildren: () => import('./demo/forms/text-editors/text-editors.module').then((m) => m.TextEditorsModule),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'form-layouts',
        loadChildren: () => import('./demo/forms/forms-layouts/forms-layouts.module').then((m) => m.FormsLayoutsModule),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'file-upload',
        loadChildren: () => import('./demo/forms/file-upload/file-upload.module').then((m) => m.FileUploadModule),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'form/form-validator',
        loadComponent: () => import('./demo/forms/forms-validator/forms-validator.component'),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'images-cropper',
        loadComponent: () => import('./demo/forms/image-cropper/image-cropper.component').then((c) => c.ImageCropperComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'bootstrap-table',
        loadChildren: () => import('./demo/table/bootstrap-table/bootstrap-table.module').then((m) => m.BootstrapTableModule),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'ag-grid-table',
        loadChildren: () => import('./demo/table/ag-grid-table/ag-grid-table-module').then((m) => m.AgGridTableModule),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'apex-chart',
        loadComponent: () => import('./demo/chart/apex-chart/apex-chart.component').then((c) => c.ApexChartComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'price',
        loadComponent: () => import('./demo/pages/price/price.component').then((c) => c.PriceComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/others/sample-page/sample-page.component').then((c) => c.SamplePageComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      }
    ]
  },
  {
    path: '',
    component: SimpleLayouts,
    children: [
      {
        path: 'components',
        loadChildren: () => import('./theme/layout/simple-layout/com-navigation/com-navigation.module').then((m) => m.ComNavigationModule)
      },
      {
        path: 'contact-us',
        canActivateChild: [AuthGuardChild],
        loadComponent: () => import('./demo/pages/contact-us/contact-us.component').then((c) => c.ContactUsComponent)
      }
    ]
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./demo/pages/maintenance/unauthorize-error/unauthorize-error.component').then((c) => c.UnauthorizeErrorComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./demo/pages/maintenance/error/error.component').then((c) => c.ErrorComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
