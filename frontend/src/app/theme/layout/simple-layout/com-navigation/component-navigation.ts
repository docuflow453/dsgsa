export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  path?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  link?: string;
  description?: string;
  children?: NavigationItem[];
}

export const componentMenus: NavigationItem[] = [
  {
    id: 'basic',
    title: 'Basic Component',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'alert',
        title: 'Alert',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/basic-component/alert',
        url: '/components/basic/alert',
        link: 'https://getbootstrap.com/docs/5.3/components/alerts/',
        description:
          'Provide contextual feedback messages for typical user actions with the handful of available and flexible alert messages.'
      },
      {
        id: 'button',
        title: 'Button',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/basic-component/button',
        url: '/components/basic/button',
        link: 'https://getbootstrap.com/docs/5.3/components/buttons/',
        description:
          'Use Bootstrap’s custom button styles for actions in forms, dialogs, and more with support for multiple sizes, states, and more.'
      },
      {
        id: 'breadcrumb',
        title: 'Breadcrumb',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/basic-component/breadcrumb',
        url: '/components/basic/breadcrumb',
        link: 'https://getbootstrap.com/docs/5.3/components/breadcrumb/',
        description:
          'Provide contextual feedback messages for typical user actions with the handful of available and flexible alert messages.'
      },
      {
        id: 'cards',
        title: 'Cards',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/basic-component/cards',
        url: '/components/basic/cards',
        link: 'https://getbootstrap.com/docs/5.3/components/card/',
        description: 'Bootstrap’s cards provide a flexible and extensible content container with multiple variants and options.'
      },
      {
        id: 'color',
        title: 'Color',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/basic-component/color',
        url: '/components/basic/color',
        link: 'https://getbootstrap.com/docs/5.3/customize/color/',
        description:
          'Bootstrap is supported by an extensive color system that themes our styles and components. This enables more comprehensive customization and extension for any project.'
      },
      {
        id: 'dropdowns',
        title: 'Dropdowns',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/basic-component/dropdowns',
        url: '/components/basic/dropdowns',
        link: 'https://getbootstrap.com/docs/5.3/components/dropdowns/',
        description: 'Toggle contextual overlays for displaying lists of links and more with the Bootstrap dropdown plugin.'
      },
      {
        id: 'offcanvas',
        title: 'Offcanvas',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/basic-component/offcanvas',
        url: '/components/basic/offcanvas',
        link: 'https://getbootstrap.com/docs/5.3/components/offcanvas/',
        description:
          'Build hidden sidebars into your project for navigation, shopping carts, and more with a few classes and our JavaScript plugin.'
      },
      {
        id: 'progress',
        title: 'Progress',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/basic-component/progress',
        url: '/components/basic/progress',
        link: 'https://getbootstrap.com/docs/5.3/components/progress/',
        description:
          'Documentation and examples for using Bootstrap custom progress bars featuring support for stacked bars, animated backgrounds, and text labels.'
      },
      {
        id: 'modal',
        title: 'Modal',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/basic-component/modal',
        url: '/components/basic/modal',
        link: 'https://getbootstrap.com/docs/5.3/components/modal/',
        description:
          'Use Bootstrap’s JavaScript modal plugin to add dialogs to your site for lightboxes, user notifications, or completely custom content.'
      },
      {
        id: 'spinner',
        title: 'Spinner',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/basic-component/spinner',
        url: '/components/basic/spinner',
        link: 'https://getbootstrap.com/docs/5.3/components/spinners/',
        description:
          'Indicate the loading state of a component or page with Bootstrap spinners, built entirely with HTML, CSS, and no JavaScript.'
      },
      {
        id: 'tabs-pills',
        title: 'Tabs & pills',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/basic-component/tabs-pills',
        url: '/components/basic/tabs-pills',
        link: 'https://getbootstrap.com/docs/5.3/components/navs-tabs/',
        description: 'Takes the basic nav from above and adds the .nav-tabs class to generate a tabbed interface.'
      },
      {
        id: 'toasts',
        title: 'Toasts',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/basic-component/toasts',
        url: '/components/basic/toasts',
        link: 'https://ngx-toastr.vercel.app/',
        description: 'Push notifications to your visitors with a toast, a lightweight and easily customizable alert message.'
      },
      {
        id: 'badges',
        title: 'Badges',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/basic-component/modal',
        url: '/components/basic/badges',
        link: 'https://getbootstrap.com/docs/5.3/components/badge/',
        description: 'Documentation and examples for badges, our small count and labeling component.'
      },
      {
        id: 'tooltip',
        title: ' Tooltip',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/basic-component/tooltip',
        url: '/components/basic/tooltip',
        link: 'https://getbootstrap.com/docs/5.3/components/tooltips/',
        description:
          'Documentation and examples for adding custom Bootstrap tooltips with CSS and JavaScript using CSS3 for animations and data-bs-attributes for local title storage.'
      },
      {
        id: 'list-group',
        title: 'List Group',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/basic-component/list-group',
        url: '/components/basic/list-group',
        link: 'https://getbootstrap.com/docs/5.3/components/list-group/',
        description:
          'List groups are a flexible and powerful component for displaying a series of content. Modify and extend them to support just about any content within.'
      },
      {
        id: 'placeholder',
        title: 'Placeholder',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/basic-component/placeholder',
        url: '/components/basic/placeholder',
        link: 'https://getbootstrap.com/docs/5.3/components/placeholders/',
        description: 'Use loading placeholders for your components or pages to indicate something may still be loading.'
      },
      {
        id: 'collapse',
        title: 'Collapse',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/basic-component/modal',
        url: '/components/basic/collapse',
        link: 'https://getbootstrap.com/docs/5.3/components/collapse/',
        description: 'Toggle the visibility of content across your project with a few classes and our JavaScript plugins.'
      },
      {
        id: 'carousel',
        title: 'Carousel',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/basic-component/carousel',
        url: '/components/basic/carousel',
        link: 'https://getbootstrap.com/docs/5.3/components/carousel/',
        description: 'A slideshow component for cycling through elements—images or slides of text—like a carousel.'
      },
      {
        id: 'other',
        title: 'Other',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/basic-component/other',
        url: '/components/basic/other',
        link: 'https://getbootstrap.com/docs/5.3/utilities/background/',
        description: 'The utility API is a Sass-based tool to generate utility classes.'
      }
    ]
  },
  {
    id: 'advance',
    title: 'Advance Component',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'sweetAlert',
        title: 'SweetAlert',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/advance-component/sweetAlert',
        url: '/components/advance/sweet-alert',
        link: 'https://sweetalert2.github.io/',
        description: "A BEAUTIFUL, RESPONSIVE, CUSTOMIZABLE, ACCESSIBLE (WAI-ARIA) REPLACEMENT FOR JAVASCRIPT'S POPUP BOXES"
      },
      {
        id: 'datepicker',
        title: 'Datepicker',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/advance-component/datepicker',
        url: '/components/advance/date-picker',
        description: 'Highly configurable date picker built for Angular applications',
        link: 'https://wondrous-crostata-172891.netlify.app/daytimePicker'
      },
      {
        id: 'light-box',
        title: 'lightBox',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/advance-component/light-box',
        url: '/components/advance/light-box',
        description: 'Modal image gallery for Angular',
        link: 'https://ks89.github.io/angular-modal-gallery-2023-v11.github.io/demo'
      },
      {
        id: 'AdvModal',
        title: 'Modal',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/advance-component/adv-Modal',
        url: '/components/advance/modal',
        description: 'Use Angular Typescript modal plugin to add dialogs to your site for lightbox or completely custom content',
        link: 'https://getbootstrap.com/docs/5.3/components/modal/'
      },
      {
        id: 'notification',
        title: 'Notification',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/advance-component/notification',
        url: '/components/advance/notification',
        description:
          'A well designed, fully animated, highly customizable, and easy-to-use notification library for your Angular application.',
        link: 'https://github.com/dominique-mueller/angular-notifier'
      },
      {
        id: 'range-slider',
        title: 'Range Slider',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/advance-component/range-slider',
        url: '/components/advance/range-slider',
        description: 'Self-contained, mobile friendly slider component for Angular based on angularjs-slider',
        link: 'https://angular-slider.github.io/ngx-slider/'
      },
      {
        id: 'tree-view',
        title: 'Tree view',
        type: 'item',
        classes: 'nav-item',
        path: 'src/app/demo/component/advance-component/tree-view',
        url: '/components/advance/tree-view',
        description: 'Standalone tree view library',
        link: 'https://material.angular.io/components/tree/examples'
      }
    ]
  }
];
