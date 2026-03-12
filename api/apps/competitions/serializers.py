from rest_framework import serializers
from .models import (
    Competition, CompetitionDate, CompetitionClass, CompetitionExtra,
    CompetitionFee, CompetitionDocument, Grade, ClassType, ClassRule
)


class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = ['id', 'name', 'code', 'description', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ClassTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassType
        fields = ['id', 'name', 'code', 'description', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ClassRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassRule
        fields = ['id', 'name', 'code', 'description', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class CompetitionDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetitionDate
        fields = ['id', 'competition', 'start_date', 'start_time', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class CompetitionClassSerializer(serializers.ModelSerializer):
    grade_name = serializers.CharField(source='grade.name', read_only=True)
    class_type_name = serializers.CharField(source='class_type.name', read_only=True)
    
    class Meta:
        model = CompetitionClass
        fields = [
            'id', 'competition', 'grade', 'grade_name', 'class_type', 'class_type_name',
            'class_rule', 'fee', 'category', 'approximate_start_time', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CompetitionExtraSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetitionExtra
        fields = [
            'id', 'competition', 'name', 'quantity', 'price', 'is_stable',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CompetitionFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetitionFee
        fields = [
            'id', 'competition', 'fee', 'is_included_in_entry_fee',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CompetitionDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetitionDocument
        fields = [
            'id', 'competition', 'document_type', 'filename', 'attachment',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CompetitionSerializer(serializers.ModelSerializer):
    show_holding_body_name = serializers.CharField(source='show_holding_body.name', read_only=True)
    dates = CompetitionDateSerializer(many=True, read_only=True)
    classes = CompetitionClassSerializer(many=True, read_only=True)
    
    class Meta:
        model = Competition
        fields = [
            'id', 'name', 'slug', 'competition_type', 'entry_close',
            'show_holding_body', 'show_holding_body_name', 'course_designer',
            'late_entry_fee', 'terms_and_conditions', 'entry_message',
            'close_message', 'ground_message', 'programme', 'venue',
            'enquiries', 'catering', 'vet_inspections', 'account_type',
            'account_name', 'branch_code', 'account_number', 'bank_name',
            'payment_reference_prefix', 'is_active', 'is_test',
            'dates', 'classes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class CompetitionDetailSerializer(serializers.ModelSerializer):
    show_holding_body = serializers.SerializerMethodField()
    dates = CompetitionDateSerializer(many=True, read_only=True)
    classes = CompetitionClassSerializer(many=True, read_only=True)
    extras = CompetitionExtraSerializer(many=True, read_only=True)
    fees = CompetitionFeeSerializer(many=True, read_only=True)
    documents = CompetitionDocumentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Competition
        fields = '__all__'
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    def get_show_holding_body(self, obj):
        return {
            'id': obj.show_holding_body.id,
            'name': obj.show_holding_body.name,
            'saef_number': obj.show_holding_body.saef_number,
        }

