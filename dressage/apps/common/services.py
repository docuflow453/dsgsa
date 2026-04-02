from typing import Optional
from django.db.models import Q
from django.core.exceptions import ValidationError
from apps.common.models import Province, VatCode, School, PaymentMethod


class ProvinceService:
    """Service layer for Province operations"""

    @staticmethod
    def create_province(data: dict) -> tuple[bool, Optional[Province], Optional[str]]:
        """Create a new province"""
        try:
            province = Province.objects.create(**data)
            return True, province, None
        except ValidationError as e:
            return False, None, str(e)
        except Exception as e:
            return False, None, f"Failed to create province: {str(e)}"

    @staticmethod
    def update_province(province_id: str, data: dict) -> tuple[bool, Optional[Province], Optional[str]]:
        """Update an existing province"""
        try:
            province = Province.objects.get(id=province_id)
            for key, value in data.items():
                if value is not None:
                    setattr(province, key, value)
            province.save()
            return True, province, None
        except Province.DoesNotExist:
            return False, None, "Province not found"
        except ValidationError as e:
            return False, None, str(e)
        except Exception as e:
            return False, None, f"Failed to update province: {str(e)}"

    @staticmethod
    def delete_province(province_id: str) -> tuple[bool, Optional[Province], Optional[str]]:
        """Soft delete a province by setting is_active to False"""
        try:
            province = Province.objects.get(id=province_id)
            province.is_active = False
            province.save()
            return True, province, None
        except Province.DoesNotExist:
            return False, None, "Province not found"
        except Exception as e:
            return False, None, f"Failed to delete province: {str(e)}"

    @staticmethod
    def get_province(province_id: str) -> tuple[bool, Optional[Province], Optional[str]]:
        """Get a single province by ID"""
        try:
            province = Province.objects.get(id=province_id)
            return True, province, None
        except Province.DoesNotExist:
            return False, None, "Province not found"
        except Exception as e:
            return False, None, f"Failed to get province: {str(e)}"

    @staticmethod
    def get_provinces(country: Optional[str] = None, is_active: Optional[bool] = None,
                     search: Optional[str] = None, limit: int = 100, offset: int = 0):
        """Get provinces with optional filtering"""
        try:
            queryset = Province.objects.all()

            if country:
                queryset = queryset.filter(country=country)

            if is_active is not None:
                queryset = queryset.filter(is_active=is_active)

            if search:
                queryset = queryset.filter(
                    Q(name__icontains=search)
                )

            count = queryset.count()
            results = list(queryset[offset:offset + limit])
            return True, {"count": count, "results": results}, None
        except Exception as e:
            return False, None, f"Failed to get provinces: {str(e)}"


class VatCodeService:
    """Service layer for VatCode operations"""

    @staticmethod
    def create_vat_code(data: dict) -> tuple[bool, Optional[VatCode], Optional[str]]:
        """Create a new VAT code"""
        try:
            vat_code = VatCode.objects.create(**data)
            return True, vat_code, None
        except ValidationError as e:
            return False, None, str(e)
        except Exception as e:
            return False, None, f"Failed to create VAT code: {str(e)}"

    @staticmethod
    def update_vat_code(vat_code_id: str, data: dict) -> tuple[bool, Optional[VatCode], Optional[str]]:
        """Update an existing VAT code"""
        try:
            vat_code = VatCode.objects.get(id=vat_code_id)
            for key, value in data.items():
                if value is not None:
                    setattr(vat_code, key, value)
            vat_code.save()
            return True, vat_code, None
        except VatCode.DoesNotExist:
            return False, None, "VAT code not found"
        except ValidationError as e:
            return False, None, str(e)
        except Exception as e:
            return False, None, f"Failed to update VAT code: {str(e)}"

    @staticmethod
    def delete_vat_code(vat_code_id: str) -> tuple[bool, Optional[VatCode], Optional[str]]:
        """Soft delete a VAT code by setting is_active to False"""
        try:
            vat_code = VatCode.objects.get(id=vat_code_id)
            vat_code.is_active = False
            vat_code.save()
            return True, vat_code, None
        except VatCode.DoesNotExist:
            return False, None, "VAT code not found"
        except Exception as e:
            return False, None, f"Failed to delete VAT code: {str(e)}"

    @staticmethod
    def get_vat_code(vat_code_id: str) -> tuple[bool, Optional[VatCode], Optional[str]]:
        """Get a single VAT code by ID"""
        try:
            vat_code = VatCode.objects.get(id=vat_code_id)
            return True, vat_code, None
        except VatCode.DoesNotExist:
            return False, None, "VAT code not found"
        except Exception as e:
            return False, None, f"Failed to get VAT code: {str(e)}"

    @staticmethod
    def get_vat_codes(is_active: Optional[bool] = None, is_default: Optional[bool] = None,
                     applicable_to_membership: Optional[bool] = None, applicable_to_competitions: Optional[bool] = None,
                     search: Optional[str] = None, limit: int = 100, offset: int = 0):
        """Get VAT codes with optional filtering"""
        try:
            queryset = VatCode.objects.all()

            if is_active is not None:
                queryset = queryset.filter(is_active=is_active)

            if is_default is not None:
                queryset = queryset.filter(is_default=is_default)

            if applicable_to_membership is not None:
                queryset = queryset.filter(is_applicable_to_membership=applicable_to_membership)

            if applicable_to_competitions is not None:
                queryset = queryset.filter(is_applicable_to_competitions=applicable_to_competitions)

            if search:
                queryset = queryset.filter(
                    Q(name__icontains=search) | Q(code__icontains=search)
                )

            count = queryset.count()
            results = list(queryset[offset:offset + limit])
            return True, {"count": count, "results": results}, None
        except Exception as e:
            return False, None, f"Failed to get VAT codes: {str(e)}"

    @staticmethod
    def get_default_vat_code() -> tuple[bool, Optional[VatCode], Optional[str]]:
        """Get the default VAT code"""
        try:
            vat_code = VatCode.objects.filter(is_default=True, is_active=True).first()
            if not vat_code:
                return False, None, "No default VAT code found"
            return True, vat_code, None
        except Exception as e:
            return False, None, f"Failed to get default VAT code: {str(e)}"


class SchoolService:
    """Service layer for School operations"""

    @staticmethod
    def create_school(data: dict) -> tuple[bool, Optional[School], Optional[str]]:
        """Create a new school"""
        try:
            # Handle province_id conversion
            province_id = data.pop('province_id', None)
            if province_id:
                data['province_id'] = province_id

            school = School.objects.create(**data)
            return True, school, None
        except ValidationError as e:
            return False, None, str(e)
        except Exception as e:
            return False, None, f"Failed to create school: {str(e)}"

    @staticmethod
    def update_school(school_id: str, data: dict) -> tuple[bool, Optional[School], Optional[str]]:
        """Update an existing school"""
        try:
            school = School.objects.get(id=school_id)

            # Handle province_id conversion
            province_id = data.pop('province_id', None)
            if province_id is not None:
                school.province_id = province_id

            for key, value in data.items():
                if value is not None:
                    setattr(school, key, value)
            school.save()
            return True, school, None
        except School.DoesNotExist:
            return False, None, "School not found"
        except ValidationError as e:
            return False, None, str(e)
        except Exception as e:
            return False, None, f"Failed to update school: {str(e)}"

    @staticmethod
    def delete_school(school_id: str) -> tuple[bool, Optional[School], Optional[str]]:
        """Soft delete a school by setting status to INACTIVE"""
        try:
            school = School.objects.get(id=school_id)
            school.status = 'INACTIVE'
            school.save()
            return True, school, None
        except School.DoesNotExist:
            return False, None, "School not found"
        except Exception as e:
            return False, None, f"Failed to delete school: {str(e)}"

    @staticmethod
    def get_school(school_id: str) -> tuple[bool, Optional[School], Optional[str]]:
        """Get a single school by ID"""
        try:
            school = School.objects.get(id=school_id)
            return True, school, None
        except School.DoesNotExist:
            return False, None, "School not found"
        except Exception as e:
            return False, None, f"Failed to get school: {str(e)}"

    @staticmethod
    def get_schools(province_id: Optional[str] = None, status: Optional[str] = None,
                   search: Optional[str] = None, limit: int = 100, offset: int = 0):
        """Get schools with optional filtering"""
        try:
            queryset = School.objects.select_related('province').all()

            if province_id:
                queryset = queryset.filter(province_id=province_id)

            if status:
                queryset = queryset.filter(status=status)

            if search:
                queryset = queryset.filter(
                    Q(name__icontains=search) |
                    Q(city__icontains=search) |
                    Q(contact_person__icontains=search) |
                    Q(email__icontains=search)
                )

            count = queryset.count()
            results = list(queryset[offset:offset + limit])
            return True, {"count": count, "results": results}, None
        except Exception as e:
            return False, None, f"Failed to get schools: {str(e)}"


class PaymentMethodService:
    """Service layer for PaymentMethod operations"""

    @staticmethod
    def create_payment_method(data: dict) -> tuple[bool, Optional[PaymentMethod], Optional[str]]:
        """Create a new payment method"""
        try:
            payment_method = PaymentMethod.objects.create(**data)
            return True, payment_method, None
        except ValidationError as e:
            return False, None, str(e)
        except Exception as e:
            return False, None, f"Failed to create payment method: {str(e)}"

    @staticmethod
    def update_payment_method(payment_method_id: str, data: dict) -> tuple[bool, Optional[PaymentMethod], Optional[str]]:
        """Update an existing payment method"""
        try:
            payment_method = PaymentMethod.objects.get(id=payment_method_id)
            for key, value in data.items():
                if value is not None:
                    setattr(payment_method, key, value)
            payment_method.save()
            return True, payment_method, None
        except PaymentMethod.DoesNotExist:
            return False, None, "Payment method not found"
        except ValidationError as e:
            return False, None, str(e)
        except Exception as e:
            return False, None, f"Failed to update payment method: {str(e)}"

    @staticmethod
    def delete_payment_method(payment_method_id: str) -> tuple[bool, Optional[PaymentMethod], Optional[str]]:
        """Soft delete a payment method by setting is_active to False"""
        try:
            payment_method = PaymentMethod.objects.get(id=payment_method_id)
            payment_method.is_active = False
            payment_method.save()
            return True, payment_method, None
        except PaymentMethod.DoesNotExist:
            return False, None, "Payment method not found"
        except Exception as e:
            return False, None, f"Failed to delete payment method: {str(e)}"

    @staticmethod
    def get_payment_method(payment_method_id: str) -> tuple[bool, Optional[PaymentMethod], Optional[str]]:
        """Get a single payment method by ID"""
        try:
            payment_method = PaymentMethod.objects.get(id=payment_method_id)
            return True, payment_method, None
        except PaymentMethod.DoesNotExist:
            return False, None, "Payment method not found"
        except Exception as e:
            return False, None, f"Failed to get payment method: {str(e)}"

    @staticmethod
    def get_payment_methods(is_active: Optional[bool] = None, allow_for_entries: Optional[bool] = None,
                           allow_for_renewals: Optional[bool] = None, search: Optional[str] = None,
                           limit: int = 100, offset: int = 0):
        """Get payment methods with optional filtering"""
        try:
            queryset = PaymentMethod.objects.all()

            if is_active is not None:
                queryset = queryset.filter(is_active=is_active)

            if allow_for_entries is not None:
                queryset = queryset.filter(allow_for_entries=allow_for_entries)

            if allow_for_renewals is not None:
                queryset = queryset.filter(allow_for_renewals=allow_for_renewals)

            if search:
                queryset = queryset.filter(
                    Q(name__icontains=search) | Q(code__icontains=search)
                )

            count = queryset.count()
            results = list(queryset[offset:offset + limit])
            return True, {"count": count, "results": results}, None
        except Exception as e:
            return False, None, f"Failed to get payment methods: {str(e)}"


