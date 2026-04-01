import { DASHBOARD_PATH, DOCUMENTATION_PATH } from 'src/app/app-config';
import { Role } from 'src/app/theme/shared/components/_helpers/role';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
  role?: string[];
  disabled?: boolean;
  isMainParent?: boolean; // specify if item is main parent
}

export const NavigationItems: NavigationItem[] = [
  // Rider Dashboard (for RIDER role)
  {
    id: 'rider-dashboard',
    title: 'My Dashboard',
    type: 'group',
    classes: 'first-group',
    icon: 'icon-navigation',
    role: [Role.Rider],
    children: [
      {
        id: 'rider-home',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/my/dashboard',
        icon: 'dashboard',
        breadcrumbs: false,
        role: [Role.Rider]
      },
      {
        id: 'rider-profile',
        title: 'My Profile',
        type: 'item',
        classes: 'nav-item',
        url: '/my/profile',
        icon: 'user',
        breadcrumbs: false,
        role: [Role.Rider]
      },
      {
        id: 'rider-horses',
        title: 'My Horses',
        type: 'item',
        classes: 'nav-item',
        url: '/my/horses',
        icon: 'heart',
        breadcrumbs: false,
        role: [Role.Rider]
      },
      {
        id: 'rider-entries',
        title: 'My Entries',
        type: 'item',
        classes: 'nav-item',
        url: '/my/entries',
        icon: 'file-text',
        breadcrumbs: false,
        role: [Role.Rider]
      },
      {
        id: 'rider-transactions',
        title: 'Transactions',
        type: 'item',
        classes: 'nav-item',
        url: '/my/transactions',
        icon: 'dollar',
        breadcrumbs: false,
        role: [Role.Rider]
      },
      {
        id: 'rider-invoices',
        title: 'Invoices',
        type: 'item',
        classes: 'nav-item',
        url: '/my/invoices',
        icon: 'file-text',
        breadcrumbs: false,
        role: [Role.Rider]
      }
    ]
  },
  {
    id: 'rider-account',
    title: 'Account',
    type: 'group',
    icon: 'icon-navigation',
    role: [Role.Rider],
    children: [
      {
        id: 'rider-clubs',
        title: 'My Clubs',
        type: 'item',
        classes: 'nav-item',
        url: '/my/clubs',
        icon: 'usergroup-add',
        breadcrumbs: false,
        role: [Role.Rider]
      },
      {
        id: 'rider-memberships',
        title: 'Memberships',
        type: 'item',
        classes: 'nav-item',
        url: '/my/memberships',
        icon: 'idcard',
        breadcrumbs: false,
        role: [Role.Rider]
      },
      {
        id: 'rider-security',
        title: 'Security',
        type: 'item',
        classes: 'nav-item',
        url: '/my/security',
        icon: 'lock',
        breadcrumbs: false,
        role: [Role.Rider]
      },
      {
        id: 'rider-two-factor',
        title: 'Two-Factor Auth',
        type: 'item',
        classes: 'nav-item',
        url: '/my/two-factor',
        icon: 'safety-certificate',
        breadcrumbs: false,
        role: [Role.Rider]
      }
    ]
  },
  // Show Holding Body Dashboard (for SHOW_HOLDING_BODY role)
  {
    id: 'shb-dashboard',
    title: 'Show Holding Body',
    type: 'group',
    classes: 'first-group',
    icon: 'icon-navigation',
    role: [Role.ShowHoldingBody],
    children: [
      {
        id: 'shb-home',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/shb/dashboard',
        icon: 'dashboard',
        breadcrumbs: false,
        role: [Role.ShowHoldingBody]
      },
      {
        id: 'shb-profile',
        title: 'My Profile',
        type: 'item',
        classes: 'nav-item',
        url: '/shb/profile',
        icon: 'user',
        breadcrumbs: false,
        role: [Role.ShowHoldingBody]
      },
      {
        id: 'shb-members',
        title: 'Members',
        type: 'item',
        classes: 'nav-item',
        url: '/shb/members',
        icon: 'usergroup-add',
        breadcrumbs: false,
        role: [Role.ShowHoldingBody]
      },
      {
        id: 'shb-competitions',
        title: 'Competitions',
        type: 'collapse',
        icon: 'award',
        role: [Role.ShowHoldingBody],
        children: [
          {
            id: 'shb-competitions-list',
            title: 'Competitions',
            type: 'item',
            url: '/shb/competitions',
            breadcrumbs: false,
            role: [Role.ShowHoldingBody]
          },
          {
            id: 'shb-extras',
            title: 'Extras',
            type: 'item',
            url: '/shb/extras',
            breadcrumbs: false,
            role: [Role.ShowHoldingBody]
          },
          {
            id: 'shb-levies',
            title: 'Levies',
            type: 'item',
            url: '/shb/levies',
            breadcrumbs: false,
            role: [Role.ShowHoldingBody]
          },
          {
            id: 'shb-arenas',
            title: 'Arenas',
            type: 'item',
            url: '/shb/arenas',
            breadcrumbs: false,
            role: [Role.ShowHoldingBody]
          },
          {
            id: 'shb-payment-methods',
            title: 'Payment Methods',
            type: 'item',
            url: '/shb/payment-methods',
            breadcrumbs: false,
            role: [Role.ShowHoldingBody]
          }
        ]
      }
    ]
  },
  // Admin Navigation (for ADMIN role)
  {
    id: 'admin-dashboard',
    title: 'Administration',
    type: 'group',
    classes: 'first-group',
    icon: 'icon-navigation',
    role: [Role.Admin],
    children: [
      {
        id: 'admin-home',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/dashboard',
        icon: 'dashboard',
        breadcrumbs: false,
        role: [Role.Admin]
      },
      {
        id: 'admin-members-management',
        title: 'Members',
        type: 'collapse',
        icon: 'usergroup-add',
        role: [Role.Admin],
        children: [
          {
            id: 'admin-members',
            title: 'Members',
            type: 'item',
            url: '/admin/members',
            icon: 'user',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-administrators',
            title: 'Administrators',
            type: 'item',
            url: '/admin/administrators',
            icon: 'safety-certificate',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-show-holding-bodies',
            title: 'Show Holding Bodies',
            type: 'item',
            url: '/admin/show-holding-bodies',
            icon: 'shop',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-clubs',
            title: 'Clubs',
            type: 'item',
            url: '/admin/clubs',
            icon: 'usergroup-add',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-judges',
            title: 'Judges',
            type: 'item',
            url: '/admin/judges',
            icon: 'solution',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-horses',
            title: 'Horses',
            type: 'item',
            url: '/admin/horses',
            icon: 'heart',
            breadcrumbs: false,
            role: [Role.Admin]
          }
        ]
      },
      {
        id: 'admin-dressage-documents',
        title: 'Dressage Documents',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/documents',
        icon: 'file-text',
        breadcrumbs: false,
        role: [Role.Admin]
      },
      {
        id: 'admin-horse-settings',
        title: 'Horse Settings',
        type: 'collapse',
        icon: 'heart',
        role: [Role.Admin],
        children: [
          {
            id: 'admin-horse-grades',
            title: 'Grades',
            type: 'item',
            url: '/admin/horse-settings/grades',
            icon: 'rise',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-horse-breeds',
            title: 'Breeds',
            type: 'item',
            url: '/admin/horse-settings/breeds',
            icon: 'branches',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-horse-colors',
            title: 'Colors',
            type: 'item',
            url: '/admin/horse-settings/colors',
            icon: 'bg-colors',
            breadcrumbs: false,
            role: [Role.Admin]
          }
        ]
      },
      {
        id: 'admin-grading-tests',
        title: 'Grading and Tests',
        type: 'collapse',
        icon: 'gold',
        role: [Role.Admin],
        children: [
          {
            id: 'admin-grading-grades',
            title: 'Grades',
            type: 'item',
            url: '/admin/grading/grades',
            icon: 'gold',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-class-types',
            title: 'Class Types',
            type: 'item',
            url: '/admin/grading/class-types',
            icon: 'appstore',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-upgrade-points',
            title: 'Upgrade Points',
            type: 'item',
            url: '/admin/grading/upgrade-points',
            icon: 'rise',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-grading-points',
            title: 'Grading Points',
            type: 'item',
            url: '/admin/grading/grading-points',
            icon: 'star',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-grade-sequences',
            title: 'Grade Sequences',
            type: 'item',
            url: '/admin/grading/grade-sequences',
            icon: 'ordered-list',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-rule-groups',
            title: 'Rule Groups',
            type: 'item',
            url: '/admin/grading/rule-groups',
            icon: 'folder',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-rules-management',
            title: 'Rules Management',
            type: 'item',
            url: '/admin/grading/rules',
            icon: 'read',
            breadcrumbs: false,
            role: [Role.Admin]
          }
        ]
      },
      {
        id: 'admin-competitions',
        title: 'Competitions',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/competitions',
        icon: 'award',
        breadcrumbs: false,
        role: [Role.Admin]
      },
      {
        id: 'admin-email',
        title: 'Email',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/email',
        icon: 'mail',
        breadcrumbs: false,
        role: [Role.Admin]
      },
      {
        id: 'admin-reports',
        title: 'Reports',
        type: 'collapse',
        icon: 'file-text',
        role: [Role.Admin],
        children: [
          {
            id: 'admin-membership-by-type',
            title: 'Membership by Type',
            type: 'item',
            url: '/admin/reports/membership-by-type',
            icon: 'pie-chart',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-members-report',
            title: 'Members Report',
            type: 'item',
            url: '/admin/reports/members',
            icon: 'file-text',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-horse-ages',
            title: 'Horse Ages',
            type: 'item',
            url: '/admin/reports/horse-ages',
            icon: 'calendar',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-recreational-members',
            title: 'Recreational Members',
            type: 'item',
            url: '/admin/reports/recreational-members',
            icon: 'team',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-judges-report',
            title: 'Judges',
            type: 'item',
            url: '/admin/reports/judges',
            icon: 'profile',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-temporary-memberships',
            title: 'Temporary Memberships',
            type: 'item',
            url: '/admin/reports/temporary-memberships',
            icon: 'clock-circle',
            breadcrumbs: false,
            role: [Role.Admin]
          }
        ]
      },
      {
        id: 'admin-settings',
        title: 'Settings',
        type: 'collapse',
        icon: 'setting',
        role: [Role.Admin],
        children: [
          {
            id: 'admin-years',
            title: 'Years',
            type: 'item',
            url: '/admin/settings/years',
            icon: 'calendar-event',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-membership-types',
            title: 'Membership Types',
            type: 'item',
            url: '/admin/settings/membership-types',
            icon: 'id',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-schools',
            title: 'Schools',
            type: 'item',
            url: '/admin/settings/schools',
            icon: 'school',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-districts',
            title: 'Districts',
            type: 'item',
            url: '/admin/settings/districts',
            icon: 'map-pin',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-accounting-periods',
            title: 'Accounting Periods',
            type: 'item',
            url: '/admin/settings/accounting-periods',
            icon: 'calendar-stats',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'admin-vat-codes',
            title: 'VAT Codes',
            type: 'item',
            url: '/admin/settings/vat-codes',
            icon: 'receipt-tax',
            breadcrumbs: false,
            role: [Role.Admin]
          }
        ]
      }
    ]
  },
  // Demo Admin Dashboard (for ADMIN and USER roles)
  {
    id: 'Dashboard',
    title: 'Dashboard',
    type: 'group',
    classes: 'first-group',
    icon: 'icon-navigation',
    role: [Role.Admin, Role.User],
    children: [
      {
        id: 'Dashboard',
        title: 'Dashboard',
        type: 'collapse',
        icon: 'dashboard',
        groupClasses: 'arrow-edge',
        role: [Role.Admin, Role.User],
        children: [
          {
            id: 'default',
            title: 'Default',
            type: 'item',
            url: DASHBOARD_PATH,
            breadcrumbs: false,
            role: [Role.Admin, Role.User]
          },
          {
            id: 'analytics',
            title: 'Analytics',
            type: 'item',
            url: '/dashboard/analytics',
            breadcrumbs: false,
            role: [Role.Admin]
          },
          {
            id: 'finance',
            title: 'Finance',
            type: 'item',
            url: '/dashboard/finance',
            breadcrumbs: false,
            role: [Role.Admin]
          }
        ]
      },
      {
        id: 'component',
        title: 'Components',
        type: 'item',
        classes: 'nav-item',
        url: '/components/basic/alert',
        icon: 'gold',
        target: true,
        breadcrumbs: false,
        role: [Role.Admin, Role.User]
      }
    ]
  },
  {
    id: 'widget',
    title: 'Widget',
    type: 'group',
    icon: 'icon-navigation',
    role: [Role.Admin, Role.User],
    children: [
      {
        id: 'statistics',
        title: 'Statistics',
        type: 'item',
        classes: 'nav-item',
        url: '/widget/statistics',
        icon: 'idcard'
      },
      {
        id: 'data',
        title: 'Data',
        type: 'item',
        classes: 'nav-item',
        url: '/widget/data',
        icon: 'database'
      },
      {
        id: 'chart',
        title: 'Chart',
        type: 'item',
        classes: 'nav-item',
        url: '/widget/chart',
        icon: 'line-chart'
      }
    ]
  },
  {
    id: 'admin',
    title: 'Admin Panel',
    type: 'group',
    icon: 'icon-navigation',
    role: [Role.Admin, Role.User],
    children: [
      {
        id: 'Online-Courses',
        title: 'Online Courses',
        type: 'collapse',
        icon: 'read',
        isMainParent: true,
        role: [Role.Admin, Role.User],
        children: [
          {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/online-course/dashboard',
            role: [Role.Admin]
          },
          {
            id: 'teacher',
            title: 'Teacher',
            type: 'collapse',
            role: [Role.Admin, Role.User],
            children: [
              {
                id: 'list',
                title: 'List',
                type: 'item',
                url: '/online-course/teacher/list'
              },
              {
                id: 'apply',
                title: 'Apply',
                type: 'item',
                url: '/online-course/teacher/apply'
              },
              {
                id: 'add',
                title: 'Add',
                type: 'item',
                url: '/online-course/teacher/add',
                classes: 'no-icon',
                role: [Role.Admin]
              }
            ]
          },
          {
            id: 'student',
            title: 'Student',
            type: 'collapse',
            role: [Role.Admin, Role.User],
            children: [
              {
                id: 'list',
                title: 'List',
                type: 'item',
                url: '/online-course/student/list'
              },
              {
                id: 'apply',
                title: 'Apply',
                type: 'item',
                url: '/online-course/student/apply'
              },
              {
                id: 'add',
                title: 'Add',
                type: 'item',
                url: '/online-course/student/add',
                classes: 'no-icon',
                role: [Role.Admin]
              }
            ]
          },
          {
            id: 'courses',
            title: 'Courses',
            type: 'collapse',
            role: [Role.Admin, Role.User],
            children: [
              {
                id: 'view',
                title: 'View',
                type: 'item',
                url: '/online-course/courses/view'
              },
              {
                id: 'add',
                title: 'Add',
                type: 'item',
                url: '/online-course/courses/add',
                role: [Role.Admin]
              }
            ]
          },
          {
            id: 'pricing',
            title: 'Pricing',
            type: 'item',
            url: '/online-course/pricing',
            role: [Role.Admin, Role.User]
          },
          {
            id: 'site',
            title: 'Site',
            type: 'item',
            url: '/online-course/site',
            role: [Role.Admin, Role.User]
          },
          {
            id: 'setting',
            title: 'Setting',
            type: 'collapse',
            role: [Role.Admin, Role.User],
            children: [
              {
                id: 'payment',
                title: 'Payment',
                type: 'item',
                url: '/online-course/setting/payment',
                role: [Role.Admin, Role.User]
              },
              {
                id: 'pricing',
                title: 'Pricing',
                type: 'item',
                url: '/online-course/setting/price',
                role: [Role.Admin, Role.User]
              },
              {
                id: 'notification',
                title: 'Notification',
                type: 'item',
                url: '/online-course/setting/notification',
                role: [Role.Admin, Role.User]
              }
            ]
          }
        ]
      },
      {
        id: 'membership',
        title: 'Membership',
        type: 'collapse',
        role: [Role.Admin, Role.User],
        icon: 'user',
        children: [
          {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/membership/dashboard',
            role: [Role.Admin]
          },
          {
            id: 'list',
            title: 'List',
            type: 'item',
            url: '/membership/list'
          },
          {
            id: 'price',
            title: 'Pricing',
            type: 'item',
            url: '/membership/price'
          },
          {
            id: 'setting',
            title: 'Setting',
            type: 'item',
            url: '/membership/setting'
          }
        ]
      },
      {
        id: 'helpdesk',
        title: 'Helpdesk',
        type: 'collapse',
        icon: 'question-circle',
        isMainParent: true,
        role: [Role.Admin, Role.User],
        children: [
          {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/helpdesk/dashboard',
            role: [Role.Admin]
          },
          {
            id: 'ticket',
            title: 'Ticket',
            type: 'collapse',
            role: [Role.Admin, Role.User],
            children: [
              {
                id: 'create',
                title: 'Create',
                type: 'item',
                url: '/helpdesk/ticket/create'
              },
              {
                id: 'list',
                title: 'List',
                type: 'item',
                url: '/helpdesk/ticket/list'
              },
              {
                id: 'details',
                title: 'Details',
                type: 'item',
                url: '/helpdesk/ticket/details'
              }
            ]
          },
          {
            id: 'customer',
            title: 'Customer',
            type: 'item',
            url: '/helpdesk/customer'
          }
        ]
      },
      {
        id: 'invoice',
        title: 'Invoice',
        type: 'collapse',
        icon: 'file-text',
        role: [Role.Admin, Role.User],
        children: [
          {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/invoice/dashboard'
          },
          {
            id: 'create',
            title: 'Create',
            type: 'item',
            url: '/invoice/create'
          },
          {
            id: 'details',
            title: 'Details',
            type: 'item',
            url: '/invoice/details'
          },
          {
            id: 'list',
            title: 'List',
            type: 'item',
            url: '/invoice/list'
          },
          {
            id: 'edit',
            title: 'Edit',
            type: 'item',
            url: '/invoice/edit',
            role: [Role.Admin]
          }
        ]
      }
    ]
  },
  {
    id: 'app',
    title: 'Application',
    type: 'group',
    icon: 'icon-navigation',
    role: [Role.Admin, Role.User],
    children: [
      {
        id: 'chat',
        title: 'Chat',
        type: 'item',
        classes: 'nav-item',
        url: '/chat',
        icon: 'message',
        breadcrumbs: false
      },
      {
        id: 'calendar',
        title: 'Calendar',
        type: 'item',
        classes: 'nav-item',
        url: '/calendar',
        icon: 'calendar'
      },
      {
        id: 'customer',
        title: 'Customer',
        type: 'collapse',
        icon: 'customer-service',
        role: [Role.Admin, Role.User],
        children: [
          {
            id: 'customer-list',
            title: 'Customer List',
            type: 'item',
            url: '/customer/customer-list'
          }
        ]
      },
      {
        id: 'Profile',
        title: 'Profile',
        type: 'collapse',
        icon: 'user',
        role: [Role.Admin, Role.User],
        children: [
          {
            id: 'user-profile',
            title: 'User Profile',
            type: 'item',
            url: '/user/user-profile',
            breadcrumbs: false
          },
          {
            id: 'account-profile',
            title: 'Account Profile',
            type: 'item',
            url: '/user/account-profile'
          },
          {
            id: 'user-list',
            title: 'User List',
            type: 'item',
            url: '/user/user-list'
          },
          {
            id: 'user-card',
            title: 'User Card',
            type: 'item',
            url: '/user/user-card'
          }
        ]
      },
      {
        id: 'E Commerce',
        title: 'E-commerce',
        type: 'collapse',
        icon: 'shopping-cart',
        role: [Role.Admin, Role.User],
        children: [
          {
            id: 'product',
            title: 'Product',
            type: 'item',
            url: '/e-commerce/product'
          },
          {
            id: 'product-details',
            title: 'Product Details',
            type: 'item',
            url: '/e-commerce/product-details',
            breadcrumbs: false
          },
          {
            id: 'product-list',
            title: 'Product List',
            type: 'item',
            url: '/e-commerce/product-list'
          },
          {
            id: 'new-product',
            title: 'Add New Product',
            type: 'item',
            url: '/e-commerce/new-product'
          },
          {
            id: 'checkout',
            title: 'Checkout',
            type: 'item',
            url: '/e-commerce/checkout'
          }
        ]
      }
    ]
  },
  {
    id: 'layouts',
    title: 'Layout Demo',
    type: 'group',
    icon: 'icon-navigation',
    role: [Role.Admin, Role.User],
    children: [
      {
        id: 'vertical',
        title: 'Vertical',
        type: 'item',
        url: '/layout/vertical',
        icon: 'layout',
        target: true
      },
      {
        id: 'horizontal',
        title: 'Horizontal',
        type: 'item',
        url: '/layout/horizontal',
        icon: 'credit-card',
        target: true
      },
      {
        id: 'compact',
        title: 'Compact',
        type: 'item',
        url: '/layout/compact',
        icon: 'layout',
        target: true
      }
    ]
  },
  {
    id: 'icons',
    title: 'Icons',
    type: 'group',
    icon: 'icon-navigation',
    role: [Role.Admin, Role.User],
    children: [
      {
        id: 'icon',
        title: 'Icons',
        type: 'collapse',
        icon: 'share-alt',
        role: [Role.Admin, Role.User],
        children: [
          {
            id: 'feather',
            title: 'Feather',
            type: 'item',
            url: 'https://feathericons.com/',
            target: true,
            external: true
          },
          {
            id: 'ant',
            title: 'Ant Icons',
            type: 'item',
            url: 'https://ant.design/components/icon',
            target: true,
            external: true
          },

          {
            id: 'tabler',
            title: 'Tabler',
            type: 'item',
            url: 'https://tablericons.com/',
            target: true,
            external: true
          }
        ]
      }
    ]
  },
  {
    id: 'forms',
    title: 'Forms',
    type: 'group',
    icon: 'icon-navigation',
    role: [Role.Admin, Role.User],
    children: [
      {
        id: 'forms-element',
        title: 'Forms Elements',
        type: 'collapse',
        icon: 'file-text',
        role: [Role.Admin, Role.User],
        children: [
          {
            id: 'form-basic',
            title: 'Form Basic',
            type: 'item',
            url: '/form/form-basic'
          },
          {
            id: 'form-floating',
            title: 'Form Floating',
            type: 'item',
            url: '/form/form-floating'
          },
          {
            id: 'form-options',
            title: 'Form Options',
            type: 'item',
            url: '/form/form-options'
          },
          {
            id: 'input-group',
            title: 'Input Groups',
            type: 'item',
            url: '/form/input-group'
          },
          {
            id: 'checkbox',
            title: 'CheckBox',
            type: 'item',
            url: '/form/checkbox'
          },
          {
            id: 'radio',
            title: 'Radio',
            type: 'item',
            url: '/form/radio'
          },
          {
            id: 'switch',
            title: 'Switch',
            type: 'item',
            url: '/form/switch'
          },
          {
            id: 'mega-option',
            title: 'Mega Option',
            type: 'item',
            url: '/form/mega-option'
          }
        ]
      },
      {
        id: 'forms-plugin',
        title: 'Forms Plugins',
        type: 'collapse',
        icon: 'cloud-upload',
        role: [Role.Admin, Role.User],
        children: [
          {
            id: 'frm-picker',
            title: 'Date Picker',
            type: 'item',
            url: '/form-plugin/picker'
          },
          {
            id: 'color-picker',
            title: 'Color Picker',
            type: 'item',
            url: '/form-plugin/color-picker'
          },
          {
            id: 'frm-select',
            title: 'Form Select',
            type: 'item',
            url: '/form-plugin/select'
          },
          {
            id: 're-captcha',
            title: 'Google reCaptcha',
            type: 'item',
            url: '/form-plugin/re-captcha'
          },
          {
            id: 'input-mask',
            title: 'Input Masks',
            type: 'item',
            url: '/form-plugin/input-mask'
          },
          {
            id: 'clipboard',
            title: 'Clipboard',
            type: 'item',
            url: '/form-plugin/clipboard'
          },
          {
            id: 'typeahead',
            title: 'Typeahead',
            type: 'item',
            url: '/form-plugin/typeahead'
          }
        ]
      },
      {
        id: 'text-editor',
        title: 'Text Editor',
        type: 'collapse',
        role: [Role.Admin, Role.User],
        icon: 'edit',
        children: [
          {
            id: 'quill',
            title: 'Quill',
            type: 'item',
            url: '/editor/quill'
          },
          {
            id: 'classic-editor',
            title: 'Classic Editor',
            type: 'item',
            url: '/editor/classic-editor'
          }
        ]
      },
      {
        id: 'forms-layouts',
        title: 'Forms Layouts',
        type: 'collapse',
        icon: 'form',
        role: [Role.Admin, Role.User],
        children: [
          {
            id: 'layouts',
            title: 'Layouts',
            type: 'item',
            url: '/form-layouts/layouts'
          },
          {
            id: 'form-multiColumn',
            title: 'MultiColumn',
            type: 'item',
            url: '/form-layouts/multiColumn'
          },
          {
            id: 'actionBars',
            title: 'ActionBars',
            type: 'item',
            url: '/form-layouts/actionBars'
          },
          {
            id: 'stickyBar',
            title: 'Sticky Action Bars',
            type: 'item',
            url: '/form-layouts/stickyBar'
          }
        ]
      },
      {
        id: 'file-upload',
        title: 'File Upload',
        type: 'collapse',
        icon: 'upload',
        role: [Role.Admin, Role.User],
        children: [
          {
            id: 'dropzone',
            title: 'Dropzone',
            type: 'item',
            url: '/file-upload/dropzone'
          },
          {
            id: 'files-uploader',
            title: 'Files Uploader',
            type: 'item',
            url: '/file-upload/files-dropzone'
          }
        ]
      },
      {
        id: 'form-validator',
        title: 'Forms Validator',
        type: 'item',
        classes: 'nav-item',
        url: '/form/form-validator',
        icon: 'file-protect',
        role: [Role.Admin]
      },
      {
        id: 'image-cropper',
        title: 'images Cropper',
        type: 'item',
        classes: 'nav-item',
        url: '/images-cropper',
        icon: 'file-image'
      }
    ]
  },
  {
    id: 'table',
    title: 'Table',
    type: 'group',
    icon: 'icon-navigation',
    role: [Role.Admin, Role.User],
    children: [
      {
        id: 'bootstrap-table',
        title: 'Bootstrap Table',
        type: 'collapse',
        icon: 'insert-row-above',
        role: [Role.Admin, Role.User],
        children: [
          {
            id: 'basic-table',
            title: 'Basic',
            type: 'item',
            url: '/bootstrap-table/basic-table'
          },
          {
            id: 'size-table',
            title: 'Sizing',
            type: 'item',
            url: '/bootstrap-table/sizing-table'
          },
          {
            id: 'border-table',
            title: 'Border',
            type: 'item',
            url: '/bootstrap-table/border-table'
          },
          {
            id: 'styling-table',
            title: 'Styling',
            type: 'item',
            url: '/bootstrap-table/styling-table'
          }
        ]
      },
      {
        id: 'ag grid-table',
        title: 'Ag Grid Table',
        type: 'collapse',
        icon: 'table',
        role: [Role.Admin, Role.User],
        children: [
          {
            id: 'ag-grid-basic-table',
            title: 'Basic',
            type: 'item',
            url: '/ag-grid-table/basic'
          },
          {
            id: 'column-moving-table',
            title: 'Column Moving',
            type: 'item',
            url: '/ag-grid-table/column-moving'
          },
          {
            id: 'row-pagination-table',
            title: 'Row Pagination',
            type: 'item',
            url: '/ag-grid-table/row-pagination'
          },
          {
            id: 'highlight-change-table',
            title: 'Highlight Change',
            type: 'item',
            url: '/ag-grid-table/highlight-change'
          },
          {
            id: 'column-filter-table',
            title: 'Column Filter',
            type: 'item',
            url: '/ag-grid-table/column-filter'
          }
        ]
      }
    ]
  },
  {
    id: 'chart',
    title: 'Charts',
    type: 'group',
    icon: 'icon-navigation',
    role: [Role.Admin, Role.User],
    children: [
      {
        id: 'charts',
        title: 'Charts',
        type: 'collapse',
        icon: 'pie-chart',
        role: [Role.Admin, Role.User],
        children: [
          {
            id: 'apex-chart',
            title: 'Apex Chart',
            type: 'item',
            url: '/apex-chart'
          }
        ]
      }
    ]
  },
  {
    id: 'pages',
    title: 'Pages',
    type: 'group',
    icon: 'icon-navigation',
    role: [Role.Admin, Role.User],
    children: [
      {
        id: 'authentication',
        title: 'Authentication',
        type: 'collapse',
        icon: 'login',
        role: [Role.Admin, Role.User],
        children: [
          {
            id: 'login',
            title: 'Login',
            type: 'item',
            url: '/auth/login',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'register',
            title: 'Register',
            type: 'item',
            url: '/auth/register',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'forgot',
            title: 'Forgot Password',
            type: 'item',
            url: '/auth/forgot-password',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'reset',
            title: 'Reset Password',
            type: 'item',
            url: '/auth/reset-password',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'check-mail',
            title: 'Check Mail',
            type: 'item',
            url: '/auth/check-mail',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'code-verify',
            title: 'Code Verification',
            type: 'item',
            url: '/auth/code-verify',
            target: true,
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'maintenance',
        title: 'Maintenance',
        type: 'collapse',
        icon: 'rocket',
        role: [Role.Admin, Role.User],
        children: [
          {
            id: 'error-404',
            title: 'Error 404',
            type: 'item',
            url: '/maintenance/error-404',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'error-500',
            title: 'Error 500',
            type: 'item',
            url: '/maintenance/error-500',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'error-401',
            title: 'Error 401',
            type: 'item',
            url: '/maintenance/error-401',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'coming-soon',
            title: 'Coming Soon',
            type: 'item',
            url: '/maintenance/coming-soon',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'under',
            title: 'Under Construction',
            type: 'item',
            url: '/maintenance/under-construct',
            target: true,
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'contact-us',
        title: 'Contact Us',
        type: 'item',
        classes: 'nav-item',
        url: '/contact-us',
        icon: 'phone',
        target: true,
        breadcrumbs: false
      },
      {
        id: 'price',
        title: 'Pricing',
        type: 'item',
        classes: 'nav-item',
        url: '/price',
        icon: 'dollar'
      }
    ]
  },
  {
    id: 'other',
    title: 'Other',
    type: 'group',
    icon: 'icon-navigation',
    role: [Role.Admin, Role.User],
    children: [
      {
        id: 'menu-levels',
        title: 'Menu levels',
        type: 'collapse',
        icon: 'menu-unfold',
        role: [Role.Admin, Role.User],
        children: [
          {
            id: 'menu-level-2-1',
            title: 'Menu Level 2.1',
            type: 'item',
            url: 'javascript:',
            external: true
          },
          {
            id: 'menu-level-2.2',
            title: 'Menu Level 2.2',
            type: 'collapse',
            role: [Role.Admin, Role.User],
            classes: 'edge',
            children: [
              {
                id: 'menu-level-3.1',
                title: 'Menu Level 3.1',
                type: 'item',
                url: 'javascript:',
                external: true
              },
              {
                id: 'menu-level-3.2',
                title: 'Menu Level 3.2',
                type: 'item',
                url: 'javascript:',
                external: true
              },
              {
                id: 'menu-level-2.2',
                title: 'Menu Level 2.2',
                type: 'collapse',
                role: [Role.Admin, Role.User],
                classes: 'edge',
                children: [
                  {
                    id: 'menu-level-4.1',
                    title: 'Menu Level 4.1',
                    type: 'item',
                    url: 'javascript:',
                    external: true
                  },
                  {
                    id: 'menu-level-4.2',
                    title: 'Menu Level 4.2',
                    type: 'item',
                    url: 'javascript:',
                    external: true
                  }
                ]
              }
            ]
          },
          {
            id: 'menu-level-2.3',
            title: 'Menu Level 2.3',
            type: 'collapse',
            role: [Role.Admin, Role.User],
            classes: 'edge',
            children: [
              {
                id: 'menu-level-3.1',
                title: 'Menu Level 3.1',
                type: 'item',
                url: 'javascript:',
                external: true
              },
              {
                id: 'menu-level-3.2',
                title: 'Menu Level 3.2',
                type: 'item',
                url: 'javascript:',
                external: true
              },
              {
                id: 'menu-level-3.3',
                title: 'Menu Level 3.3',
                type: 'collapse',
                classes: 'edge',
                role: [Role.Admin, Role.User],
                children: [
                  {
                    id: 'menu-level-4.1',
                    title: 'Menu Level 4.1',
                    type: 'item',
                    url: 'javascript:',
                    external: true
                  },
                  {
                    id: 'menu-level-4.2',
                    title: 'Menu Level 4.2',
                    type: 'item',
                    url: 'javascript:',
                    external: true
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'sample-page',
        title: 'Sample Page',
        type: 'item',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'chrome'
      },
      {
        id: 'document',
        title: 'Document',
        type: 'item',
        classes: 'nav-item',
        url: DOCUMENTATION_PATH,
        icon: 'question',
        target: true,
        external: true
      }
    ]
  }
];
