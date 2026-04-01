/**
 * Email List Mock Data
 * Realistic test data for the Bulk Email Management feature
 */

import { BulkEmail } from './email-list-type';

/**
 * Mock Bulk Emails Data
 * 15 realistic bulk emails with diverse types and recipients
 */
export const BULK_EMAILS: BulkEmail[] = [
  {
    id: 1,
    subject: 'Upcoming National Dressage Championships 2024',
    content: `<h2>National Dressage Championships 2024</h2>
      <p>Dear Members,</p>
      <p>We are excited to announce the <strong>National Dressage Championships 2024</strong> will be held from March 15-17, 2024 at the Kyalami Equestrian Park.</p>
      <p>Registration is now open. Please visit our website to register your entries.</p>
      <p>Best regards,<br>SAEF Admin Team</p>`,
    sentTo: 'All Members',
    sentBy: 'Sarah Mitchell',
    sentByEmail: 'sarah.mitchell@shyft.com',
    recipientCount: 1245,
    recipientEmails: [
      'rider1@example.com',
      'rider2@example.com',
      'judge1@example.com',
      // ... (truncated for brevity)
    ],
    dateSent: new Date('2024-01-15T14:30:00'),
    dateCreated: new Date('2024-01-15T14:00:00'),
    emailType: 'Important',
    status: 'Sent',
    hasAttachments: true,
    attachments: [
      {
        id: 'att-1',
        fileName: 'Championship_Schedule.pdf',
        fileSize: 245678,
        fileType: 'application/pdf',
        url: '/assets/documents/championship-schedule.pdf'
      },
      {
        id: 'att-2',
        fileName: 'Entry_Form.pdf',
        fileSize: 156789,
        fileType: 'application/pdf',
        url: '/assets/documents/entry-form.pdf'
      }
    ],
    deliveryStats: {
      sent: 1245,
      delivered: 1238,
      failed: 7,
      opened: 892,
      clicked: 456
    }
  },
  {
    id: 2,
    subject: 'New Judge Certification Program Available',
    content: `<h2>Judge Certification Program</h2>
      <p>Dear Judges,</p>
      <p>We are pleased to announce a new <strong>Judge Certification Program</strong> starting in February 2024.</p>
      <p>This program will help you advance your judging credentials and stay updated with the latest FEI standards.</p>
      <p>For more information and registration, please contact our office.</p>
      <p>Kind regards,<br>SAEF Training Department</p>`,
    sentTo: 'Judges',
    sentBy: 'Michael Thompson',
    sentByEmail: 'michael.thompson@byteorbit.com',
    recipientCount: 87,
    recipientEmails: [
      'judge1@dressage.co.za',
      'judge2@dressage.co.za',
      // ... (truncated for brevity)
    ],
    dateSent: new Date('2024-01-10T09:15:00'),
    dateCreated: new Date('2024-01-10T08:45:00'),
    emailType: 'General',
    status: 'Sent',
    hasAttachments: true,
    attachments: [
      {
        id: 'att-3',
        fileName: 'Certification_Program_Details.pdf',
        fileSize: 189234,
        fileType: 'application/pdf',
        url: '/assets/documents/certification-program.pdf'
      }
    ],
    deliveryStats: {
      sent: 87,
      delivered: 87,
      failed: 0,
      opened: 65,
      clicked: 42
    }
  },
  {
    id: 3,
    subject: 'Monthly Newsletter - January 2024',
    content: `<h2>SAEF Monthly Newsletter</h2>
      <p>Dear Members,</p>
      <p>Welcome to the January 2024 edition of our monthly newsletter!</p>
      <h3>In This Issue:</h3>
      <ul>
        <li>Upcoming Events Calendar</li>
        <li>Member Spotlight: Emma Wilson</li>
        <li>Training Tips from Top Riders</li>
        <li>Rule Updates and Clarifications</li>
      </ul>
      <p>Read the full newsletter on our website.</p>
      <p>Best wishes,<br>SAEF Communications Team</p>`,
    sentTo: 'All Members',
    sentBy: 'Jennifer Adams',
    sentByEmail: 'jennifer.adams@shyft.com',
    recipientCount: 1245,
    recipientEmails: [],
    dateSent: new Date('2024-01-05T10:00:00'),
    dateCreated: new Date('2024-01-04T16:30:00'),
    emailType: 'Marketing',
    status: 'Sent',
    hasAttachments: false,
    attachments: [],
    deliveryStats: {
      sent: 1245,
      delivered: 1240,
      failed: 5,
      opened: 678,
      clicked: 234
    }
  },
  {
    id: 5,
    subject: 'Club Membership Renewal Reminder',
    content: `<h2>Membership Renewal</h2>
      <p>Dear Club Representatives,</p>
      <p>This is a friendly reminder that club membership renewals for 2024 are due by January 31st.</p>
      <p>Please ensure all member information is up to date and fees are paid to avoid any disruption in services.</p>
      <p>Thank you for your cooperation.</p>
      <p>Best regards,<br>SAEF Membership Department</p>`,
    sentTo: 'Clubs',
    sentBy: 'Emily Brown',
    sentByEmail: 'emily.brown@shyft.com',
    recipientCount: 45,
    recipientEmails: [],
    dateSent: new Date('2024-01-12T11:30:00'),
    dateCreated: new Date('2024-01-12T10:00:00'),
    emailType: 'General',
    status: 'Sent',
    hasAttachments: true,
    attachments: [
      {
        id: 'att-5',
        fileName: 'Renewal_Instructions.pdf',
        fileSize: 98765,
        fileType: 'application/pdf',
        url: '/assets/documents/renewal-instructions.pdf'
      }
    ],
    deliveryStats: {
      sent: 45,
      delivered: 45,
      failed: 0,
      opened: 43,
      clicked: 38
    }
  },
  {
    id: 6,
    subject: 'Show Holding Body Annual Meeting - February 2024',
    content: `<h2>Annual SHB Meeting</h2>
      <p>Dear Show Holding Bodies,</p>
      <p>You are cordially invited to attend the <strong>Annual Show Holding Body Meeting</strong> on February 10, 2024.</p>
      <p><strong>Details:</strong></p>
      <ul>
        <li>Date: February 10, 2024</li>
        <li>Time: 10:00 AM - 3:00 PM</li>
        <li>Venue: SAEF Headquarters, Johannesburg</li>
      </ul>
      <p>Please RSVP by February 3rd.</p>
      <p>Looking forward to seeing you there!</p>
      <p>Regards,<br>SAEF Events Team</p>`,
    sentTo: 'Show Holding Bodies',
    sentBy: 'Robert Johnson',
    sentByEmail: 'robert.johnson@byteorbit.com',
    recipientCount: 23,
    recipientEmails: [],
    dateSent: new Date('2024-01-18T13:45:00'),
    dateCreated: new Date('2024-01-18T12:00:00'),
    emailType: 'Important',
    status: 'Sent',
    hasAttachments: true,
    attachments: [
      {
        id: 'att-6',
        fileName: 'Meeting_Agenda.pdf',
        fileSize: 134567,
        fileType: 'application/pdf',
        url: '/assets/documents/meeting-agenda.pdf'
      },
      {
        id: 'att-7',
        fileName: 'Venue_Map.jpg',
        fileSize: 456789,
        fileType: 'image/jpeg',
        url: '/assets/images/venue-map.jpg'
      }
    ],
    deliveryStats: {
      sent: 23,
      delivered: 23,
      failed: 0,
      opened: 22,
      clicked: 18
    }
  },
  {
    id: 7,
    subject: 'New Training Resources Available',
    content: `<h2>Training Resources Update</h2>
      <p>Dear Riders,</p>
      <p>We are excited to announce new training resources now available on our website:</p>
      <ul>
        <li>Video tutorials from international coaches</li>
        <li>Downloadable training plans</li>
        <li>Interactive dressage test diagrams</li>
        <li>Nutrition guides for horses</li>
      </ul>
      <p>Access these resources in the Members Area of our website.</p>
      <p>Happy training!</p>
      <p>Best regards,<br>SAEF Training Team</p>`,
    sentTo: 'Riders',
    sentBy: 'Sarah Mitchell',
    sentByEmail: 'sarah.mitchell@shyft.com',
    recipientCount: 856,
    recipientEmails: [],
    dateSent: new Date('2024-01-08T15:20:00'),
    dateCreated: new Date('2024-01-08T14:00:00'),
    emailType: 'Marketing',
    status: 'Sent',
    hasAttachments: false,
    attachments: [],
    deliveryStats: {
      sent: 856,
      delivered: 852,
      failed: 4,
      opened: 567,
      clicked: 389
    }
  },
  {
    id: 8,
    subject: 'Draft: Sponsorship Opportunities for 2024',
    content: `<h2>2024 Sponsorship Opportunities</h2>
      <p>Dear Potential Sponsors,</p>
      <p>We are seeking sponsors for our 2024 competition season...</p>
      <p>[Draft content - not yet finalized]</p>`,
    sentTo: 'All Members',
    sentBy: 'Michael Thompson',
    sentByEmail: 'michael.thompson@byteorbit.com',
    recipientCount: 0,
    recipientEmails: [],
    dateCreated: new Date('2024-01-22T16:00:00'),
    emailType: 'Marketing',
    status: 'Draft',
    hasAttachments: false,
    attachments: []
  },
  {
    id: 9,
    subject: 'Official Certification Renewal Notice',
    content: `<h2>Official Certification Renewal</h2>
      <p>Dear Officials,</p>
      <p>Your official certification is due for renewal. Please complete the following steps:</p>
      <ol>
        <li>Complete the online renewal form</li>
        <li>Submit proof of continued education</li>
        <li>Pay the renewal fee</li>
      </ol>
      <p>Deadline: February 28, 2024</p>
      <p>Thank you,<br>SAEF Certification Department</p>`,
    sentTo: 'Officials',
    sentBy: 'Jennifer Adams',
    sentByEmail: 'jennifer.adams@shyft.com',
    recipientCount: 34,
    recipientEmails: [],
    dateSent: new Date('2024-01-14T09:00:00'),
    dateCreated: new Date('2024-01-13T17:30:00'),
    emailType: 'Important',
    status: 'Sent',
    hasAttachments: true,
    attachments: [
      {
        id: 'att-8',
        fileName: 'Renewal_Form.pdf',
        fileSize: 123456,
        fileType: 'application/pdf',
        url: '/assets/documents/renewal-form.pdf'
      }
    ],
    deliveryStats: {
      sent: 34,
      delivered: 34,
      failed: 0,
      opened: 32,
      clicked: 28
    }
  },
  {
    id: 10,
    subject: 'System Maintenance Notification',
    content: `<h2>Scheduled System Maintenance</h2>
      <p>Dear Members,</p>
      <p>Please be advised that our online systems will be undergoing scheduled maintenance:</p>
      <p><strong>Date:</strong> January 28, 2024<br>
      <strong>Time:</strong> 2:00 AM - 6:00 AM SAST</p>
      <p>During this time, the following services will be unavailable:</p>
      <ul>
        <li>Member portal</li>
        <li>Competition registration</li>
        <li>Online payments</li>
      </ul>
      <p>We apologize for any inconvenience.</p>
      <p>Regards,<br>SAEF IT Department</p>`,
    sentTo: 'All Members',
    sentBy: 'David Williams',
    sentByEmail: 'david.williams@byteorbit.com',
    recipientCount: 1245,
    recipientEmails: [],
    dateSent: new Date('2024-01-25T18:00:00'),
    dateCreated: new Date('2024-01-25T17:00:00'),
    emailType: 'Important',
    status: 'Sent',
    hasAttachments: false,
    attachments: [],
    deliveryStats: {
      sent: 1245,
      delivered: 1242,
      failed: 3,
      opened: 934,
      clicked: 156
    }
  }
];
