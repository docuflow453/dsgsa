// Angular import
import { Component, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import { ColorPickerService, Rgba, ColorPickerDirective } from 'ngx-color-picker';

export class Cmyk {
  constructor(
    public c: number,
    public m: number,
    public y: number,
    public k: number
  ) {}
}

interface MyColors {
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  color5: string;
  [index: string]: string;
}

@Component({
  selector: 'app-color-picker',
  imports: [SharedModule, ColorPickerDirective],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss'
})
export default class ColorPickerComponent {
  cpService = inject(ColorPickerService);

  // public props
  displayMonths = 3;
  navigation = 'select';
  showWeekNumbers = false;
  disabled = true;
  toggle = false;
  lastColor!: string;
  rgbaText!: string;
  color = '#2889e9';
  color2 = 'hsla(300,82%,52%)';
  color3 = '#fff500';
  color4 = 'rgb(236,64,64)';
  color5 = 'rgba(45,208,45,1)';
  color13 = 'rgba(0, 255, 0, 0.5)';
  color14 = 'rgb(0, 255, 255)';
  color15 = '#a51ad633';
  basicColor = '#4099ff';
  cancelButtonColor = '#4099ff';
  okButtonColor = '#4099ff';
  presetColors = '#4099ff';
  bottomColor = '#4099ff';
  topColor = '#4099ff';
  rightColor = '#4099ff';
  leftColor = '#4099ff';
  showColorCode = '#db968d';
  toggleColor = '#4099ff';
  showColorCodeHSAL = 'hsl(149,27%,65%)';
  showColorCodeRGBA = 'rgb(221,14,190)';
  changeMeColor = '#523698';
  selectedColor = 'color';
  cmyk: Cmyk = new Cmyk(0, 0, 0, 0);
  date!: { year: number; month: number };

  // public method
  arrayColors: MyColors = {
    color1: '#2883e9',
    color2: '#e920e9',
    color3: 'rgb(255,245,0)',
    color4: 'rgb(236,64,64)',
    color5: 'rgba(45,208,45,1)'
  };

  rgbaToCmyk(rgba: Rgba): Cmyk {
    const cmyk: Cmyk = new Cmyk(0, 0, 0, 0);
    const k = 1 - Math.max(rgba.r, rgba.g, rgba.b);
    if (k === 1) {
      return new Cmyk(0, 0, 0, 1);
    }
    cmyk.c = (1 - rgba.r - k) / (1 - k);
    cmyk.m = (1 - rgba.g - k) / (1 - k);
    cmyk.y = (1 - rgba.b - k) / (1 - k);
    cmyk.k = k;
    return cmyk;
  }

  onChangeColorHex8(color: string): string {
    return this.cpService.outputFormat(this.cpService.stringToHsva(color, true)!, 'rgba', null);
  }
}
