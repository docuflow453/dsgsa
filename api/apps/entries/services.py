from django.utils import timezone
from django.db import transaction
from .models import Entry, EntryClass, Transaction, TransactionExtra


class EntryService:
    """Service class for Entry-related business logic."""
    
    @staticmethod
    @transaction.atomic
    def create_entry(rider, horse, competition, classes, extras=None):
        """Create a new entry with classes and extras."""
        # Calculate total amount
        amount = sum(cls.fee for cls in classes)
        if extras:
            amount += sum(extra['price'] * extra['quantity'] for extra in extras)
        
        # Create entry
        entry = Entry.objects.create(
            rider=rider,
            horse=horse,
            competition=competition,
            amount=amount
        )
        
        # Create entry classes
        for comp_class in classes:
            EntryClass.objects.create(
                entry=entry,
                competition_class=comp_class
            )
        
        # Create transaction
        trans = Transaction.objects.create(
            entry=entry,
            amount=amount,
            payment_method='pending',
            payment_status='pending'
        )
        
        # Add extras to transaction
        if extras:
            for extra in extras:
                TransactionExtra.objects.create(
                    transaction=trans,
                    competition_extra=extra['extra'],
                    quantity=extra['quantity'],
                    price=extra['price']
                )
        
        entry.transaction = trans
        entry.save()
        
        return entry
    
    @staticmethod
    def get_rider_entries(rider, competition=None):
        """Get all entries for a rider, optionally filtered by competition."""
        queryset = Entry.objects.filter(rider=rider, is_active=True)
        if competition:
            queryset = queryset.filter(competition=competition)
        return queryset
    
    @staticmethod
    def soft_delete_entry(entry):
        """Soft delete an entry."""
        entry.is_active = False
        entry.deleted_at = timezone.now()
        entry.save()
        return entry


class TransactionService:
    """Service class for Transaction-related business logic."""
    
    @staticmethod
    def approve_transaction(transaction, approved_by):
        """Approve a transaction."""
        transaction.payment_status = 'completed'
        transaction.approved_at = timezone.now()
        transaction.approved_by = approved_by
        transaction.save()
        return transaction
    
    @staticmethod
    def fail_transaction(transaction):
        """Mark a transaction as failed."""
        transaction.payment_status = 'failed'
        transaction.save()
        return transaction
    
    @staticmethod
    def refund_transaction(transaction):
        """Refund a transaction."""
        transaction.payment_status = 'refunded'
        transaction.save()
        return transaction
    
    @staticmethod
    def get_competition_transactions(competition):
        """Get all transactions for a competition."""
        return Transaction.objects.filter(entry__competition=competition)
    
    @staticmethod
    def calculate_competition_revenue(competition):
        """Calculate total revenue for a competition."""
        transactions = Transaction.objects.filter(
            entry__competition=competition,
            payment_status='completed'
        )
        return sum(t.amount for t in transactions)

