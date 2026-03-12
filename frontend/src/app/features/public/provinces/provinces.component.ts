import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Province {
  name: string;
  code: string;
  clubs: number;
  competitions: number;
  icon: string;
}

@Component({
  selector: 'app-provinces',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './provinces.component.html',
  styleUrls: ['./provinces.component.scss']
})
export class ProvincesComponent {
  provinces: Province[] = [
    { name: 'Eastern Cape', code: 'EC', clubs: 12, competitions: 8, icon: 'bi-geo-alt' },
    { name: 'Free State', code: 'FS', clubs: 8, competitions: 6, icon: 'bi-geo-alt' },
    { name: 'Gauteng', code: 'GP', clubs: 25, competitions: 18, icon: 'bi-geo-alt' },
    { name: 'KwaZulu-Natal', code: 'KZN', clubs: 18, competitions: 12, icon: 'bi-geo-alt' },
    { name: 'Limpopo', code: 'LP', clubs: 6, competitions: 4, icon: 'bi-geo-alt' },
    { name: 'Mpumalanga', code: 'MP', clubs: 7, competitions: 5, icon: 'bi-geo-alt' },
    { name: 'Northern Cape', code: 'NC', clubs: 4, competitions: 3, icon: 'bi-geo-alt' },
    { name: 'North West', code: 'NW', clubs: 9, competitions: 6, icon: 'bi-geo-alt' },
    { name: 'Western Cape', code: 'WC', clubs: 22, competitions: 15, icon: 'bi-geo-alt' }
  ];
}

