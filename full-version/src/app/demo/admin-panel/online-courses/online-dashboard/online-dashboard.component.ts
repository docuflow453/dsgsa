// angular import
import { Component, ViewEncapsulation, inject } from '@angular/core';

// icons
import {
  ArrowUpOutline,
  BookOutline,
  CreditCardOutline,
  DeleteOutline,
  EditOutline,
  EyeOutline,
  FallOutline,
  RightOutline,
  RiseOutline,
  StarFill,
  UserOutline
} from '@ant-design/icons-angular/icons';
import { IconService } from '@ant-design/icons-angular';

// bootstrap import
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { StatisticsChartComponent } from '../../../../theme/shared/apexchart/statistics-chart/statistics-chart.component';
import { InvitesGoalChartComponent } from './invites-goal-chart/invites-goal-chart.component';
import { CourseReportBarChartComponent } from './course-report-bar-chart/course-report-bar-chart.component';
import { TotalRevenueLineChartComponent } from './total-revenue-line-chart/total-revenue-line-chart.component';
import { StudentStatesChartComponent } from './student-states-chart/student-states-chart.component';
import { ActivityLineChartComponent } from './activity-line-chart/activity-line-chart.component';
import { VisitorsBarChartComponent } from './visitors-bar-chart/visitors-bar-chart.component';
import { EarningCoursesLineChartComponent } from './earning-courses-line-chart/earning-courses-line-chart.component';

@Component({
  selector: 'app-online-dashboard',
  imports: [
    SharedModule,
    StatisticsChartComponent,
    InvitesGoalChartComponent,
    CourseReportBarChartComponent,
    TotalRevenueLineChartComponent,
    StudentStatesChartComponent,
    ActivityLineChartComponent,
    VisitorsBarChartComponent,
    EarningCoursesLineChartComponent
  ],
  templateUrl: './online-dashboard.component.html',
  styleUrl: './online-dashboard.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class OnlineDashboardComponent {
  private iconService = inject(IconService);
  private ngbCalendar = inject(NgbCalendar);
  private dateAdapter = inject<NgbDateAdapter<string>>(NgbDateAdapter);

  // calender
  model1!: string;

  // constructor
  constructor() {
    this.iconService.addIcon(
      ...[
        UserOutline,
        BookOutline,
        EyeOutline,
        CreditCardOutline,
        RightOutline,
        ArrowUpOutline,
        RiseOutline,
        FallOutline,
        DeleteOutline,
        StarFill,
        EditOutline
      ]
    );
  }

  // public props
  dashboard_summary = [
    {
      icon: 'user',
      background: 'bg-light-primary',
      title: 'New Students',
      value: '400+',
      percentage: '30.6%',
      color: 'text-success'
    },
    {
      icon: 'book',
      background: 'bg-light-warning',
      title: 'Total Course',
      value: '520+',
      percentage: '30.6%',
      color: 'text-warning'
    },
    {
      icon: 'eye',
      background: 'bg-light-success',
      title: 'New Visitor',
      value: '800+',
      percentage: '30.6%',
      color: 'text-success'
    },
    {
      icon: 'credit-card',
      background: 'bg-light-danger',
      title: 'Total sale',
      value: '1065',
      percentage: '30.6%',
      color: 'text-danger'
    }
  ];

  course_list = [
    {
      title: 'Bootstrap 5 Beginner Course',
      image: 'assets/images/admin/img-bootstrap.svg'
    },
    {
      title: 'PHP Training Course',
      image: 'assets/images/admin/img-php.svg'
    },
    {
      title: 'UI/UX Training Course',
      image: 'assets/images/admin/img-ux.svg'
    },
    {
      title: 'Web Designing Course',
      image: 'assets/images/admin/img-web.svg'
    }
  ];

  queriesList = [
    {
      image: 'assets/images/user/avatar-2.jpg',
      title: 'Python $ Data Manage'
    },
    {
      image: 'assets/images/user/avatar-1.jpg',
      title: 'Website Error'
    },
    {
      image: 'assets/images/user/avatar-3.jpg',
      title: 'How to Illustrate'
    },
    {
      image: 'assets/images/user/avatar-4.jpg',
      title: 'PHP Learning'
    }
  ];

  userActivity = [
    {
      image: 'assets/images/user/avatar-4.jpg',
      name: 'Airi Satou',
      rating: '5.0',
      qualification: 'Developer'
    },
    {
      image: 'assets/images/user/avatar-1.jpg',
      name: 'Ashton Cox',
      rating: '4.5',
      qualification: 'Junior Technical'
    },
    {
      image: 'assets/images/user/avatar-2.jpg',
      name: 'Bradley Greer',
      rating: '4.3',
      qualification: 'Sales Assistant'
    },
    {
      image: 'assets/images/user/avatar-3.jpg',
      name: 'Brielle Williamson',
      rating: '4.9',
      qualification: 'JavaScript Developer'
    },
    {
      image: 'assets/images/user/avatar-5.jpg',
      name: 'Airi Satou',
      rating: '5.0',
      qualification: 'Developer'
    }
  ];

  trendingCourse = [
    {
      image: 'assets/images/admin/img-bootstrap.svg',
      title: 'Bootstrap 5 Beginner Course'
    },
    {
      image: 'assets/images/admin/img-php.svg',
      title: 'PHP Training Course'
    },
    {
      image: 'assets/images/admin/img-ux.svg',
      title: 'UI/UX Training Course'
    },
    {
      image: 'assets/images/admin/img-web.svg',
      title: 'Web Designing Course'
    },
    {
      image: 'assets/images/admin/img-c.svg',
      title: 'C Training Course'
    },
    {
      image: 'assets/images/admin/img-c.svg',
      title: 'C Training Course'
    }
  ];

  notificationList = [
    {
      image: 'assets/images/user/avatar-1.jpg',
      title: 'Report Successfully',
      time: 'Today | 9:00 AM'
    },
    {
      image: 'assets/images/user/avatar-5.jpg',
      title: 'Reminder: Test time',
      time: 'Yesterday | 6:30 PM'
    },
    {
      image: 'assets/images/user/avatar-3.jpg',
      title: 'Send course pdf',
      time: '05 Feb | 3:45 PM'
    },
    {
      image: 'assets/images/user/avatar-2.jpg',
      title: 'Report Successfully',
      time: '05 Feb | 4:00 PM'
    }
  ];

  course_states = [
    {
      name: 'Web Designing Course',
      teacher: 'Airi Satou',
      rating: '4.8',
      earning: '$200',
      sale: '5/7'
    },
    {
      name: 'UI/UX Training Course',
      teacher: 'Ashton Cox',
      rating: '5.0',
      earning: '$100',
      sale: '4/7'
    },
    {
      name: 'PHP Training Course',
      teacher: '	Bradley Greer',
      rating: '4.9',
      earning: '$80',
      sale: '2/7'
    },
    {
      name: 'Bootstrap 5 Course',
      teacher: 'Brielle Williamson',
      rating: '4.4',
      earning: '$150',
      sale: '6/7'
    },
    {
      name: 'C Training Course',
      teacher: 'Cedric Kelly',
      rating: '4.3',
      earning: '$50',
      sale: '3/7'
    }
  ];

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
}
