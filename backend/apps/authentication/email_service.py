from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending authentication-related emails."""
    
    DEFAULT_FROM_EMAIL = settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@shyft.com'
    
    @staticmethod
    def send_password_reset_email(
        user_email: str,
        reset_token: str,
        user_name: Optional[str] = None,
        frontend_url: Optional[str] = None
    ) -> bool:
        """
        Send password reset email to user.
        
        Args:
            user_email: Recipient email address
            reset_token: Password reset token
            user_name: User's name for personalization
            frontend_url: Frontend URL for building reset link
        
        Returns:
            bool: True if email was sent successfully, False otherwise
        """
        try:
            # Get frontend URL from settings if not provided
            if not frontend_url:
                frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:4200')
            
            # Build the reset link
            reset_link = f"{frontend_url}/auth/reset-password?token={reset_token}"
            
            # Prepare email context
            context = {
                'user_name': user_name or user_email.split('@')[0],
                'reset_link': reset_link,
                'reset_token': reset_token,
                'valid_hours': 1,  # Token validity period
                'support_email': getattr(settings, 'SUPPORT_EMAIL', 'support@shyft.com'),
            }
            
            # Subject
            subject = 'Password Reset Request - Dressage Riding System'
            
            # Create HTML message (you can create a template later)
            html_message = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #4a90e2; color: white; padding: 20px; text-align: center; }}
                    .content {{ background-color: #f9f9f9; padding: 30px; border-radius: 5px; }}
                    .button {{ display: inline-block; padding: 12px 24px; background-color: #4a90e2; 
                              color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                    .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #666; }}
                    .warning {{ background-color: #fff3cd; border: 1px solid #ffc107; padding: 10px; 
                              border-radius: 5px; margin: 20px 0; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset Request</h1>
                    </div>
                    <div class="content">
                        <p>Hello {context['user_name']},</p>
                        
                        <p>We received a request to reset your password for your Dressage Riding System account.</p>
                        
                        <p>Click the button below to reset your password:</p>
                        
                        <div style="text-align: center;">
                            <a href="{reset_link}" class="button">Reset Password</a>
                        </div>
                        
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #4a90e2;">{reset_link}</p>
                        
                        <div class="warning">
                            <strong>⚠️ Important:</strong>
                            <ul>
                                <li>This link will expire in {context['valid_hours']} hour(s)</li>
                                <li>This link can only be used once</li>
                                <li>If you didn't request this reset, please ignore this email</li>
                            </ul>
                        </div>
                        
                        <p>If you have any questions or need assistance, please contact our support team at 
                           <a href="mailto:{context['support_email']}">{context['support_email']}</a></p>
                        
                        <p>Best regards,<br>The Dressage Riding System Team</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated email. Please do not reply to this message.</p>
                        <p>&copy; 2026 Dressage Riding System. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Plain text version (fallback)
            plain_message = f"""
            Hello {context['user_name']},
            
            We received a request to reset your password for your Dressage Riding System account.
            
            Please click the following link to reset your password:
            {reset_link}
            
            This link will expire in {context['valid_hours']} hour(s) and can only be used once.
            
            If you didn't request this reset, please ignore this email.
            
            If you have any questions, contact us at {context['support_email']}
            
            Best regards,
            The Dressage Riding System Team
            """
            
            # Send email
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=EmailService.DEFAULT_FROM_EMAIL,
                recipient_list=[user_email],
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"Password reset email sent to {user_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send password reset email to {user_email}: {str(e)}")
            return False

