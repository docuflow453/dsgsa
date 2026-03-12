from .models import PaymentGateway, PayFastPayment, EFTPayment


class PaymentGatewayService:
    """Service class for PaymentGateway-related business logic."""
    
    @staticmethod
    def get_active_gateways():
        """Get all active payment gateways."""
        return PaymentGateway.objects.filter(is_active=True)
    
    @staticmethod
    def get_gateway_by_code(code):
        """Get payment gateway by code."""
        return PaymentGateway.objects.filter(code=code, is_active=True).first()


class PayFastService:
    """Service class for PayFast payment processing."""
    
    @staticmethod
    def create_payment(transaction, merchant_id, merchant_key, amount, item_name):
        """Create a PayFast payment."""
        return PayFastPayment.objects.create(
            transaction=transaction,
            merchant_id=merchant_id,
            merchant_key=merchant_key,
            amount=amount,
            item_name=item_name
        )
    
    @staticmethod
    def complete_payment(payment, pf_payment_id):
        """Mark a PayFast payment as complete."""
        payment.pf_payment_id = pf_payment_id
        payment.status = 'complete'
        payment.save()
        return payment


class EFTService:
    """Service class for EFT payment processing."""
    
    @staticmethod
    def create_payment(transaction, reference_number, amount, bank_name, account_holder, payment_date):
        """Create an EFT payment."""
        return EFTPayment.objects.create(
            transaction=transaction,
            reference_number=reference_number,
            amount=amount,
            bank_name=bank_name,
            account_holder=account_holder,
            payment_date=payment_date
        )
    
    @staticmethod
    def verify_payment(payment):
        """Verify an EFT payment."""
        payment.status = 'verified'
        payment.save()
        return payment
    
    @staticmethod
    def reject_payment(payment):
        """Reject an EFT payment."""
        payment.status = 'rejected'
        payment.save()
        return payment

