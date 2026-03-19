/**
 * Email List Type Definitions
 * Interfaces and types for the Bulk Email Management feature
 */

/**
 * Email Type
 */
export type EmailType = 'General' | 'Important' | 'Marketing';

/**
 * Recipient Group Type
 */
export type RecipientGroup = 
  | 'All Members' 
  | 'Riders' 
  | 'Judges' 
  | 'Clubs' 
  | 'Show Holding Bodies' 
  | 'Officials' 
  | 'SAEF Admins';

/**
 * Email Status
 */
export type EmailStatus = 'Sent' | 'Draft' | 'Archived' | 'Failed';

/**
 * Email Attachment Interface
 */
export interface EmailAttachment {
  id: string;
  fileName: string;
  fileSize: number; // in bytes
  fileType: string;
  url: string;
}

/**
 * Email Delivery Statistics
 */
export interface EmailDeliveryStats {
  sent: number;
  delivered: number;
  failed: number;
  opened: number;
  clicked: number;
}

/**
 * Bulk Email Interface
 */
export interface BulkEmail {
  id: number;
  subject: string;
  content: string; // HTML content
  sentTo: RecipientGroup;
  sentBy: string; // Admin user name
  sentByEmail: string; // Admin user email
  recipientCount: number;
  recipientEmails: string[]; // List of all recipient email addresses
  dateSent?: Date;
  dateCreated: Date;
  emailType: EmailType;
  status: EmailStatus;
  hasAttachments: boolean;
  attachments: EmailAttachment[];
  deliveryStats?: EmailDeliveryStats;
}

/**
 * Sort Column Type
 */
export type SortColumn = keyof BulkEmail | '';

/**
 * Sort Direction Type
 */
export type SortDirection = 'asc' | 'desc' | '';

/**
 * Sort Event Interface
 */
export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

/**
 * Email Filter Interface
 */
export interface EmailFilter {
  emailType?: EmailType;
  sentTo?: RecipientGroup;
  status?: EmailStatus;
}

