import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Two Factor Authentication Component - Manage 2FA settings
 */
@Component({
  selector: 'app-two-factor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.scss']
})
export class TwoFactorComponent implements OnInit {
  // 2FA Status
  twoFactorEnabled = false;
  showSetupForm = false;
  showDisableConfirm = false;

  // Setup Process
  setupStep: 'qr' | 'verify' | 'backup' | 'complete' = 'qr';
  qrCodeUrl = '';
  secretKey = '';
  verificationCode = '';
  backupCodes: string[] = [];
  
  // Settings
  emailNotifications = true;
  smsNotifications = false;
  trustedDevices: any[] = [];

  // UI State
  loading = false;
  submitting = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.loadTwoFactorStatus();
    this.loadTrustedDevices();
  }

  loadTwoFactorStatus(): void {
    // TODO: Load from API
    // Simulate API call
    this.loading = true;
    setTimeout(() => {
      this.twoFactorEnabled = false; // Mock: 2FA not enabled
      this.loading = false;
    }, 500);
  }

  loadTrustedDevices(): void {
    // TODO: Load from API
    this.trustedDevices = [
      {
        id: '1',
        name: 'Chrome on Windows',
        location: 'Johannesburg, South Africa',
        lastUsed: new Date('2026-03-15'),
        current: true
      },
      {
        id: '2',
        name: 'Safari on iPhone',
        location: 'Cape Town, South Africa',
        lastUsed: new Date('2026-03-10'),
        current: false
      }
    ];
  }

  startSetup(): void {
    this.showSetupForm = true;
    this.setupStep = 'qr';
    this.generateQRCode();
  }

  generateQRCode(): void {
    // TODO: Call API to generate QR code
    // Mock QR code and secret
    this.qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/DSRiding:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=DSRiding';
    this.secretKey = 'JBSWY3DPEHPK3PXP';
  }

  verifyCode(): void {
    if (!this.verificationCode || this.verificationCode.length !== 6) {
      this.errorMessage = 'Please enter a valid 6-digit code';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    // TODO: Call API to verify code
    setTimeout(() => {
      // Mock successful verification
      this.submitting = false;
      this.setupStep = 'backup';
      this.generateBackupCodes();
    }, 1000);
  }

  generateBackupCodes(): void {
    // TODO: Call API to generate backup codes
    // Mock backup codes
    this.backupCodes = [
      '1234-5678-9012',
      '3456-7890-1234',
      '5678-9012-3456',
      '7890-1234-5678',
      '9012-3456-7890',
      '2345-6789-0123',
      '4567-8901-2345',
      '6789-0123-4567'
    ];
  }

  completeSetup(): void {
    this.setupStep = 'complete';
    this.twoFactorEnabled = true;
    this.successMessage = 'Two-factor authentication has been enabled successfully!';
    
    setTimeout(() => {
      this.showSetupForm = false;
      this.successMessage = '';
    }, 3000);
  }

  cancelSetup(): void {
    this.showSetupForm = false;
    this.setupStep = 'qr';
    this.verificationCode = '';
    this.errorMessage = '';
  }

  disableTwoFactor(): void {
    this.showDisableConfirm = true;
  }

  confirmDisable(): void {
    this.submitting = true;
    
    // TODO: Call API to disable 2FA
    setTimeout(() => {
      this.twoFactorEnabled = false;
      this.showDisableConfirm = false;
      this.submitting = false;
      this.successMessage = 'Two-factor authentication has been disabled';
      
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }, 1000);
  }

  cancelDisable(): void {
    this.showDisableConfirm = false;
  }

  removeTrustedDevice(deviceId: string): void {
    if (!confirm('Are you sure you want to remove this trusted device?')) {
      return;
    }

    // TODO: Call API to remove device
    this.trustedDevices = this.trustedDevices.filter(d => d.id !== deviceId);
  }

  downloadBackupCodes(): void {
    const content = this.backupCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dsriding-backup-codes.txt';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  clearSuccessMessage(): void {
    this.successMessage = '';
  }
}

