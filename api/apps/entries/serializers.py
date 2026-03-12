from rest_framework import serializers
from .models import Entry, EntryClass, Transaction, TransactionExtra, RidingOrder


class EntryClassSerializer(serializers.ModelSerializer):
    competition_class_name = serializers.SerializerMethodField()
    
    class Meta:
        model = EntryClass
        fields = ['id', 'entry', 'competition_class', 'competition_class_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_competition_class_name(self, obj):
        return f"{obj.competition_class.grade.name if obj.competition_class.grade else 'No Grade'}"


class TransactionExtraSerializer(serializers.ModelSerializer):
    extra_name = serializers.CharField(source='competition_extra.name', read_only=True)
    
    class Meta:
        model = TransactionExtra
        fields = ['id', 'transaction', 'competition_extra', 'extra_name', 'quantity', 'price', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class TransactionSerializer(serializers.ModelSerializer):
    entry_details = serializers.SerializerMethodField()
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
    extras = TransactionExtraSerializer(source='transaction_extras', many=True, read_only=True)
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'entry', 'entry_details', 'amount', 'payment_status', 'payment_method',
            'approved_at', 'approved_by', 'approved_by_name', 'extras', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_entry_details(self, obj):
        return {
            'id': obj.entry.id,
            'rider': obj.entry.rider.user.get_full_name(),
            'horse': obj.entry.horse.name,
            'competition': obj.entry.competition.name,
        }


class RidingOrderSerializer(serializers.ModelSerializer):
    entry_details = serializers.SerializerMethodField()
    competition_class_name = serializers.SerializerMethodField()
    
    class Meta:
        model = RidingOrder
        fields = [
            'id', 'entry', 'entry_details', 'competition_class', 'competition_class_name',
            'order', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_entry_details(self, obj):
        return {
            'rider': obj.entry.rider.user.get_full_name(),
            'horse': obj.entry.horse.name,
        }
    
    def get_competition_class_name(self, obj):
        return f"{obj.competition_class.grade.name if obj.competition_class.grade else 'No Grade'}"


class EntrySerializer(serializers.ModelSerializer):
    rider_name = serializers.CharField(source='rider.user.get_full_name', read_only=True)
    horse_name = serializers.CharField(source='horse.name', read_only=True)
    competition_name = serializers.CharField(source='competition.name', read_only=True)
    entry_classes = EntryClassSerializer(many=True, read_only=True)
    
    class Meta:
        model = Entry
        fields = [
            'id', 'rider', 'rider_name', 'horse', 'horse_name', 'competition',
            'competition_name', 'amount', 'transaction', 'is_active', 'deleted_at',
            'entry_classes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class EntryDetailSerializer(serializers.ModelSerializer):
    rider = serializers.SerializerMethodField()
    horse = serializers.SerializerMethodField()
    competition = serializers.SerializerMethodField()
    entry_classes = EntryClassSerializer(many=True, read_only=True)
    transactions = TransactionSerializer(many=True, read_only=True)
    riding_orders = RidingOrderSerializer(many=True, read_only=True)
    
    class Meta:
        model = Entry
        fields = [
            'id', 'rider', 'horse', 'competition', 'amount', 'transaction',
            'is_active', 'deleted_at', 'entry_classes', 'transactions',
            'riding_orders', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_rider(self, obj):
        return {
            'id': obj.rider.id,
            'name': obj.rider.user.get_full_name(),
            'saef_number': obj.rider.saef_number,
        }
    
    def get_horse(self, obj):
        return {
            'id': obj.horse.id,
            'name': obj.horse.name,
            'passport_number': obj.horse.passport_number,
        }
    
    def get_competition(self, obj):
        return {
            'id': obj.competition.id,
            'name': obj.competition.name,
            'entry_close': obj.competition.entry_close,
        }

