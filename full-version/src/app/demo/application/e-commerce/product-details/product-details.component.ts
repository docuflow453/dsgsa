// angular import
import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';

// icons
import { IconService } from '@ant-design/icons-angular';
import {
  MinusOutline,
  PlusOutline,
  RedoOutline,
  ShoppingCartOutline,
  StarFill,
  StarOutline,
  ZoomInOutline,
  ZoomOutOutline
} from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  private iconService = inject(IconService);
  private themeService = inject(ThemeService);

  // public props
  themeDark!: boolean;
  img = 'assets/images/application/prod-img-1.png';
  array = [0];
  description =
    'This watch from Apple is highly known for its features, like you can control your apple smartphone with this watch and you can do everything you would want to do on smartphone';

  // constructor
  constructor() {
    this.iconService.addIcon(
      ...[ZoomInOutline, ZoomOutOutline, RedoOutline, ShoppingCartOutline, StarFill, StarOutline, MinusOutline, PlusOutline]
    );
    effect(() => {
      this.isDarkTheme(this.themeService.isDarkMode());
    });
  }

  // private methods
  private isDarkTheme(isDark: boolean) {
    this.themeDark = isDark;
  }

  // public method
  images = [
    {
      src: 'assets/images/application/prod-img-1.png'
    },
    {
      src: 'assets/images/application/prod-img-2.png'
    },
    {
      src: 'assets/images/application/prod-img-3.png'
    },
    {
      src: 'assets/images/application/prod-img-4.png'
    },
    {
      src: 'assets/images/application/prod-img-5.png'
    },
    {
      src: 'assets/images/application/prod-img-6.png'
    },
    {
      src: 'assets/images/application/prod-img-7.png'
    },
    {
      src: 'assets/images/application/prod-img-8.png'
    }
  ];

  colors = [
    {
      type: 'text-primary'
    },
    {
      type: 'text-secondary'
    },
    {
      type: 'text-danger'
    },
    {
      type: 'text-dark'
    }
  ];

  feature = [
    {
      title: 'Band',
      value: 'Smart Band'
    },
    {
      title: 'Compatible Devices',
      value: 'Smartphones'
    },
    {
      title: 'Ideal For',
      value: 'Unisex'
    },
    {
      title: 'Lifestyle',
      value: 'Fitness | Indoor | Sports | Swimming | Outdoor'
    },
    {
      title: 'Basic Features',
      value: 'Calendar | Date & Time | Timer/Stop Watch'
    },
    {
      title: 'Health Tracker',
      value: 'Heart Rate | Exercise Tracker'
    }
  ];

  specifications = [
    {
      main: 'Product Category',
      title: 'Wearable Device Type:',
      text: 'Smart Band',
      title_1: 'Compatible Devices',
      text_1: 'Smartphones',
      title_2: 'Ideal For',
      text_2: 'Unisex'
    },
    {
      main: 'Manufacturer Details',
      title: 'Brand:',
      text: 'Apple',
      title_1: 'Model Series',
      text_1: 'Watch SE',
      title_2: 'Model Number',
      text_2: 'MYDT2HN/A'
    }
  ];

  ratings = [
    {
      value: 30,
      star: '5 Stars'
    },
    {
      value: 60,
      star: '4 Stars'
    },
    {
      value: 75,
      star: '3 Stars'
    },
    {
      value: 40,
      star: '2 Stars'
    },
    {
      value: 55,
      star: '1 Stars'
    }
  ];

  reviewer = [
    {
      src: 'assets/images/user/avatar-1.jpg',
      name: 'Harriet Wilson',
      rating: 'fas fa-star-half-alt text-warning'
    },
    {
      src: 'assets/images/user/avatar-2.jpg',
      name: 'Lou Olson',
      rating: 'far fa-star text-muted'
    },
    {
      src: 'assets/images/user/avatar-3.jpg',
      name: 'Emilie Wheeler',
      rating: 'fas fa-star-half-alt text-warning'
    }
  ];

  related_product = [
    {
      src: 'assets/images/application/prod-img-1.png'
    },
    {
      src: 'assets/images/application/prod-img-2.png'
    },
    {
      src: 'assets/images/application/prod-img-3.png'
    },
    {
      src: 'assets/images/application/prod-img-4.png'
    },
    {
      src: 'assets/images/application/prod-img-5.png'
    },
    {
      src: 'assets/images/application/prod-img-6.png'
    },
    {
      src: 'assets/images/application/prod-img-1.png'
    },
    {
      src: 'assets/images/application/prod-img-2.png'
    },
    {
      src: 'assets/images/application/prod-img-3.png'
    },
    {
      src: 'assets/images/application/prod-img-4.png'
    },
    {
      src: 'assets/images/application/prod-img-5.png'
    },
    {
      src: 'assets/images/application/prod-img-6.png'
    }
  ];

  inputNumber = 0;

  plus() {
    this.inputNumber = this.inputNumber + 1;
  }
  minus() {
    if (this.inputNumber != 0) {
      this.inputNumber = this.inputNumber - 1;
    }
  }

  showImages(event: { target: { src: string } }) {
    if (event.target.src) {
      this.img = event.target.src;
    }
  }

  onLikeChange(event: Event): void {
    const prodLike = event.target as HTMLInputElement;
    const parent = prodLike.parentNode as HTMLElement;

    if (prodLike.checked) {
      parent.insertAdjacentHTML(
        'beforeend',
        '<div class="pc-like"><div class="like-wrapper"><span><span class="pc-group"><span class="pc-dots"></span><span class="pc-dots"></span><span class="pc-dots"></span><span class="pc-dots"></span></span></span></div></div>'
      );
      parent.querySelector('.pc-like')?.classList.add('pc-like-animate');
      setTimeout(() => {
        parent.querySelector('.pc-like')?.remove();
      }, 3000);
    } else {
      parent.querySelector('.pc-like')?.remove();
    }
  }
}
