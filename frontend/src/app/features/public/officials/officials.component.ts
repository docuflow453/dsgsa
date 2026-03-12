import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Official {
  id: number;
  name: string;
  role: string;
  level: string;
  province: string;
  email: string;
}

@Component({
  selector: 'app-officials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './officials.component.html',
  styleUrls: ['./officials.component.scss']
})
export class OfficialsComponent {
  officials: Official[] = [
    {
      id: 1,
      name: 'Sarah Mitchell',
      role: 'Judge',
      level: 'Level 3',
      province: 'Gauteng',
      email: 'sarah.mitchell@shyft.com'
    },
    {
      id: 2,
      name: 'James Thompson',
      role: 'Technical Delegate',
      level: 'Level 2',
      province: 'Western Cape',
      email: 'james.thompson@byteorbit.com'
    },
    {
      id: 3,
      name: 'Linda van der Merwe',
      role: 'Judge',
      level: 'Level 4',
      province: 'KwaZulu-Natal',
      email: 'linda.vandermerwe@shyft.com'
    },
    {
      id: 4,
      name: 'Michael Roberts',
      role: 'Course Designer',
      level: 'Level 3',
      province: 'Gauteng',
      email: 'michael.roberts@byteorbit.com'
    }
  ];
}

