from typing import List, Optional
from ninja import Router, Query
from django.shortcuts import get_object_or_404
from apps.common.models import Province, VatCode, School, PaymentMethod
from apps.common.schemas import (
    ProvinceCreateSchema, ProvinceUpdateSchema, ProvinceSchema,
    VatCodeCreateSchema, VatCodeUpdateSchema, VatCodeSchema,
    SchoolCreateSchema, SchoolUpdateSchema, SchoolSchema,
    PaymentMethodCreateSchema, PaymentMethodUpdateSchema, PaymentMethodSchema
)
from apps.common.services import (
    ProvinceService, VatCodeService, SchoolService, PaymentMethodService
)

router = Router()


# Province Endpoints
@router.get("/provinces", response=dict, tags=["Provinces"])
def list_provinces(
    request,
    country: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """List all provinces with optional filtering"""
    success, result, error = ProvinceService.get_provinces(
        country=country,
        is_active=is_active,
        search=search,
        limit=limit,
        offset=offset
    )
    if not success:
        return 400, {"message": error}
    return result


@router.get("/provinces/{province_id}", response=ProvinceSchema, tags=["Provinces"])
def get_province(request, province_id: str):
    """Get a specific province by ID"""
    success, province, error = ProvinceService.get_province(province_id)
    if not success:
        return 404, {"message": error}
    return province


@router.post("/provinces", response=ProvinceSchema, tags=["Provinces"])
def create_province(request, payload: ProvinceCreateSchema):
    """Create a new province"""
    success, province, error = ProvinceService.create_province(payload.dict())
    if not success:
        return 400, {"message": error}
    return province


@router.patch("/provinces/{province_id}", response=ProvinceSchema, tags=["Provinces"])
def update_province(request, province_id: str, payload: ProvinceUpdateSchema):
    """Update an existing province"""
    success, province, error = ProvinceService.update_province(
        province_id, 
        payload.dict(exclude_unset=True)
    )
    if not success:
        return 404 if "not found" in error else 400, {"message": error}
    return province


@router.delete("/provinces/{province_id}", response=dict, tags=["Provinces"])
def delete_province(request, province_id: str):
    """Soft delete a province"""
    success, province, error = ProvinceService.delete_province(province_id)
    if not success:
        return 404, {"message": error}
    return {"message": "Province deactivated successfully"}


# VatCode Endpoints
@router.get("/vat-codes", response=dict, tags=["VAT Codes"])
def list_vat_codes(
    request,
    is_active: Optional[bool] = Query(None),
    is_default: Optional[bool] = Query(None),
    applicable_to_membership: Optional[bool] = Query(None),
    applicable_to_competitions: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """List all VAT codes with optional filtering"""
    success, result, error = VatCodeService.get_vat_codes(
        is_active=is_active,
        is_default=is_default,
        applicable_to_membership=applicable_to_membership,
        applicable_to_competitions=applicable_to_competitions,
        search=search,
        limit=limit,
        offset=offset
    )
    if not success:
        return 400, {"message": error}
    return result


@router.get("/vat-codes/default", response=VatCodeSchema, tags=["VAT Codes"])
def get_default_vat_code(request):
    """Get the default VAT code"""
    success, vat_code, error = VatCodeService.get_default_vat_code()
    if not success:
        return 404, {"message": error}
    return vat_code


@router.get("/vat-codes/{vat_code_id}", response=VatCodeSchema, tags=["VAT Codes"])
def get_vat_code(request, vat_code_id: str):
    """Get a specific VAT code by ID"""
    success, vat_code, error = VatCodeService.get_vat_code(vat_code_id)
    if not success:
        return 404, {"message": error}
    return vat_code


@router.post("/vat-codes", response=VatCodeSchema, tags=["VAT Codes"])
def create_vat_code(request, payload: VatCodeCreateSchema):
    """Create a new VAT code"""
    success, vat_code, error = VatCodeService.create_vat_code(payload.dict())
    if not success:
        return 400, {"message": error}
    return vat_code


@router.patch("/vat-codes/{vat_code_id}", response=VatCodeSchema, tags=["VAT Codes"])
def update_vat_code(request, vat_code_id: str, payload: VatCodeUpdateSchema):
    """Update an existing VAT code"""
    success, vat_code, error = VatCodeService.update_vat_code(
        vat_code_id,
        payload.dict(exclude_unset=True)
    )
    if not success:
        return 404 if "not found" in error else 400, {"message": error}
    return vat_code


@router.delete("/vat-codes/{vat_code_id}", response=dict, tags=["VAT Codes"])
def delete_vat_code(request, vat_code_id: str):
    """Soft delete a VAT code"""
    success, vat_code, error = VatCodeService.delete_vat_code(vat_code_id)
    if not success:
        return 404, {"message": error}
    return {"message": "VAT code deactivated successfully"}


# School Endpoints
@router.get("/schools", response=dict, tags=["Schools"])
def list_schools(
    request,
    province_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """List all schools with optional filtering"""
    success, result, error = SchoolService.get_schools(
        province_id=province_id,
        status=status,
        search=search,
        limit=limit,
        offset=offset
    )
    if not success:
        return 400, {"message": error}
    return result


@router.get("/schools/{school_id}", response=SchoolSchema, tags=["Schools"])
def get_school(request, school_id: str):
    """Get a specific school by ID"""
    success, school, error = SchoolService.get_school(school_id)
    if not success:
        return 404, {"message": error}
    return school


@router.post("/schools", response=SchoolSchema, tags=["Schools"])
def create_school(request, payload: SchoolCreateSchema):
    """Create a new school"""
    success, school, error = SchoolService.create_school(payload.dict())
    if not success:
        return 400, {"message": error}
    return school


@router.patch("/schools/{school_id}", response=SchoolSchema, tags=["Schools"])
def update_school(request, school_id: str, payload: SchoolUpdateSchema):
    """Update an existing school"""
    success, school, error = SchoolService.update_school(
        school_id,
        payload.dict(exclude_unset=True)
    )
    if not success:
        return 404 if "not found" in error else 400, {"message": error}
    return school


@router.delete("/schools/{school_id}", response=dict, tags=["Schools"])
def delete_school(request, school_id: str):
    """Soft delete a school by setting status to INACTIVE"""
    success, school, error = SchoolService.delete_school(school_id)
    if not success:
        return 404, {"message": error}
    return {"message": "School deactivated successfully"}


# PaymentMethod Endpoints
@router.get("/payment-methods", response=dict, tags=["Payment Methods"])
def list_payment_methods(
    request,
    is_active: Optional[bool] = Query(None),
    allow_for_entries: Optional[bool] = Query(None),
    allow_for_renewals: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """List all payment methods with optional filtering"""
    success, result, error = PaymentMethodService.get_payment_methods(
        is_active=is_active,
        allow_for_entries=allow_for_entries,
        allow_for_renewals=allow_for_renewals,
        search=search,
        limit=limit,
        offset=offset
    )
    if not success:
        return 400, {"message": error}
    return result


@router.get("/payment-methods/{payment_method_id}", response=PaymentMethodSchema, tags=["Payment Methods"])
def get_payment_method(request, payment_method_id: str):
    """Get a specific payment method by ID"""
    success, payment_method, error = PaymentMethodService.get_payment_method(payment_method_id)
    if not success:
        return 404, {"message": error}
    return payment_method


@router.post("/payment-methods", response=PaymentMethodSchema, tags=["Payment Methods"])
def create_payment_method(request, payload: PaymentMethodCreateSchema):
    """Create a new payment method"""
    success, payment_method, error = PaymentMethodService.create_payment_method(payload.dict())
    if not success:
        return 400, {"message": error}
    return payment_method


@router.patch("/payment-methods/{payment_method_id}", response=PaymentMethodSchema, tags=["Payment Methods"])
def update_payment_method(request, payment_method_id: str, payload: PaymentMethodUpdateSchema):
    """Update an existing payment method"""
    success, payment_method, error = PaymentMethodService.update_payment_method(
        payment_method_id,
        payload.dict(exclude_unset=True)
    )
    if not success:
        return 404 if "not found" in error else 400, {"message": error}
    return payment_method


@router.delete("/payment-methods/{payment_method_id}", response=dict, tags=["Payment Methods"])
def delete_payment_method(request, payment_method_id: str):
    """Soft delete a payment method"""
    success, payment_method, error = PaymentMethodService.delete_payment_method(payment_method_id)
    if not success:
        return 404, {"message": error}
    return {"message": "Payment method deactivated successfully"}

