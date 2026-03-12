from rest_framework import serializers
from .models import Subscription


class SubscriptionSerializer(serializers.ModelSerializer):
    year_title = serializers.CharField(source='year.title', read_only=True)
    membership_names = serializers.SerializerMethodField()
    
    class Meta:
        model = Subscription
        fields = [
            'id', 'name', 'description', 'memberships', 'membership_names', 'fee',
            'year', 'year_title', 'is_official', 'is_recreational', 'is_admin',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_membership_names(self, obj):
        return [m.name for m in obj.memberships.all()]

