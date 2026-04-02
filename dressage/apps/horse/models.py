import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone


class Classification(models.Model):
    """Horse classification (Pony, Horse, etc.)"""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text='Unique identifier for the classification'
    )

    name = models.CharField(
        max_length=100,
        unique=True,
        help_text='Classification name (e.g., Pony, Horse)'
    )

    description = models.TextField(
        blank=True,
        help_text='Description of the classification'
    )

    is_active = models.BooleanField(
        default=True,
        db_index=True,
        help_text='Whether this classification is active'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'horse_classifications'
        verbose_name = 'Classification'
        verbose_name_plural = 'Classifications'
        ordering = ['name']

    def __str__(self):
        return self.name


class Breed(models.Model):
    """Horse breed"""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text='Unique identifier for the breed'
    )

    name = models.CharField(
        max_length=100,
        unique=True,
        help_text='Breed name (e.g., Warmblood, Thoroughbred)'
    )

    description = models.TextField(
        blank=True,
        help_text='Description of the breed'
    )

    is_active = models.BooleanField(
        default=True,
        db_index=True,
        help_text='Whether this breed is active'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'horse_breeds'
        verbose_name = 'Breed'
        verbose_name_plural = 'Breeds'
        ordering = ['name']

    def __str__(self):
        return self.name


class BreedType(models.Model):
    """Specific type within a breed"""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text='Unique identifier for the breed type'
    )

    name = models.CharField(
        max_length=100,
        help_text='Breed type name'
    )

    breed = models.ForeignKey(
        Breed,
        on_delete=models.CASCADE,
        related_name='breed_types',
        help_text='Parent breed'
    )

    is_active = models.BooleanField(
        default=True,
        db_index=True,
        help_text='Whether this breed type is active'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'horse_breed_types'
        verbose_name = 'Breed Type'
        verbose_name_plural = 'Breed Types'
        ordering = ['breed__name', 'name']
        unique_together = [('breed', 'name')]

    def __str__(self):
        return f"{self.breed.name} - {self.name}"


class HorseColor(models.Model):
    """Horse color"""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text='Unique identifier for the color'
    )

    name = models.CharField(
        max_length=100,
        unique=True,
        help_text='Color name (e.g., Bay, Black, Chestnut)'
    )

    color_code = models.CharField(
        max_length=50,
        blank=True,
        help_text='Color code or hex value (optional)'
    )

    is_active = models.BooleanField(
        default=True,
        db_index=True,
        help_text='Whether this color is active'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'horse_colors'
        verbose_name = 'Horse Color'
        verbose_name_plural = 'Horse Colors'
        ordering = ['name']

    def __str__(self):
        return self.name


class HorseStatus(models.TextChoices):
    """Horse status choices"""
    ACTIVE = 'ACTIVE', 'Active'
    PENDING = 'PENDING', 'Pending'
    BANNED = 'BANNED', 'Banned'
    RETIRED = 'RETIRED', 'Retired'
    INACTIVE = 'INACTIVE', 'Inactive'


class HorseGender(models.TextChoices):
    """Horse gender choices"""
    MARE = 'MARE', 'Mare'
    STALLION = 'STALLION', 'Stallion'
    GELDING = 'GELDING', 'Gelding'


class Horse(models.Model):
    """Main Horse model"""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text='Unique identifier for the horse'
    )

    name = models.CharField(
        max_length=200,
        help_text='Horse name'
    )

    gender = models.CharField(
        max_length=20,
        choices=HorseGender.choices,
        help_text='Horse gender'
    )

    passport_number = models.CharField(
        max_length=100,
        unique=True,
        help_text='Passport number'
    )

    microchip_number = models.CharField(
        max_length=100,
        unique=True,
        help_text='Microchip number'
    )

    date_of_birth = models.DateField(
        help_text='Date of birth'
    )

    breed = models.ForeignKey(
        Breed,
        on_delete=models.PROTECT,
        related_name='horses',
        help_text='Horse breed'
    )

    breed_type = models.ForeignKey(
        BreedType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='horses',
        help_text='Specific breed type'
    )

    color = models.ForeignKey(
        HorseColor,
        on_delete=models.PROTECT,
        related_name='horses',
        help_text='Horse color'
    )

    country = models.CharField(
        max_length=100,
        help_text='Country of origin'
    )

    sire = models.CharField(
        max_length=200,
        blank=True,
        help_text='Sire (father) name'
    )

    dam = models.CharField(
        max_length=200,
        blank=True,
        help_text='Dam (mother) name'
    )

    sire_of_dam = models.CharField(
        max_length=200,
        blank=True,
        help_text='Sire of dam (maternal grandfather)'
    )

    status = models.CharField(
        max_length=20,
        choices=HorseStatus.choices,
        default=HorseStatus.ACTIVE,
        db_index=True,
        help_text='Horse status'
    )

    is_banned = models.BooleanField(
        default=False,
        db_index=True,
        help_text='Whether the horse is banned'
    )

    banned_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Timestamp when banned'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'horses'
        verbose_name = 'Horse'
        verbose_name_plural = 'Horses'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['passport_number']),
            models.Index(fields=['microchip_number']),
            models.Index(fields=['status']),
            models.Index(fields=['is_banned']),
        ]

    def __str__(self):
        return f"{self.name} ({self.passport_number})"

    @property
    def age(self):
        """Calculate horse age"""
        from datetime import date
        today = date.today()
        return today.year - self.date_of_birth.year - (
            (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
        )


class VaccinationType(models.TextChoices):
    """Vaccination type choices"""
    FLU = 'FLU', 'Influenza (Flu)'
    AHS = 'AHS', 'African Horse Sickness'
    TETANUS = 'TETANUS', 'Tetanus'
    RABIES = 'RABIES', 'Rabies'
    OTHER = 'OTHER', 'Other'


class HorseVaccination(models.Model):
    """Horse vaccination records"""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text='Unique identifier for the vaccination'
    )

    horse = models.ForeignKey(
        Horse,
        on_delete=models.CASCADE,
        related_name='vaccinations',
        help_text='Horse receiving the vaccination'
    )

    vaccination_type = models.CharField(
        max_length=20,
        choices=VaccinationType.choices,
        help_text='Type of vaccination'
    )

    vaccination_date = models.DateField(
        help_text='Date of vaccination'
    )

    expiry_date = models.DateField(
        null=True,
        blank=True,
        help_text='Vaccination expiry date'
    )

    batch_number = models.CharField(
        max_length=100,
        blank=True,
        help_text='Vaccine batch number'
    )

    veterinarian = models.CharField(
        max_length=200,
        blank=True,
        help_text='Veterinarian who administered the vaccination'
    )

    notes = models.TextField(
        blank=True,
        help_text='Additional notes'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'horse_vaccinations'
        verbose_name = 'Horse Vaccination'
        verbose_name_plural = 'Horse Vaccinations'
        ordering = ['-vaccination_date']
        indexes = [
            models.Index(fields=['horse', '-vaccination_date']),
            models.Index(fields=['vaccination_type']),
        ]

    def __str__(self):
        return f"{self.horse.name} - {self.get_vaccination_type_display()} ({self.vaccination_date})"

    @property
    def is_expired(self):
        """Check if vaccination has expired"""
        if self.expiry_date:
            from datetime import date
            return date.today() > self.expiry_date
        return False


class HorseAccount(models.Model):
    """Horse account for financial tracking"""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text='Unique identifier for the account'
    )

    horse = models.ForeignKey(
        Horse,
        on_delete=models.CASCADE,
        related_name='accounts',
        help_text='Horse associated with this account'
    )

    # Note: Account and Year would be ForeignKeys to other apps when they exist
    # For now, using CharField placeholders
    account_ref = models.CharField(
        max_length=100,
        help_text='Reference to account (placeholder for ForeignKey)'
    )

    classification = models.ForeignKey(
        Classification,
        on_delete=models.PROTECT,
        related_name='horse_accounts',
        help_text='Horse classification for this account'
    )

    year_ref = models.CharField(
        max_length=50,
        help_text='Reference to year (placeholder for ForeignKey)'
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text='Account amount'
    )


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'horse_accounts'
        verbose_name = 'Horse Account'
        verbose_name_plural = 'Horse Accounts'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['horse', '-created_at']),
        ]

    def __str__(self):
        return f"{self.horse.name} - {self.year_ref} ({self.amount})"


class DocumentType(models.TextChoices):
    """Document type choices"""
    PASSPORT = 'PASSPORT', 'Passport'
    REGISTRATION = 'REGISTRATION', 'Registration'
    VACCINATION = 'VACCINATION', 'Vaccination'
    MEDICAL = 'MEDICAL', 'Medical'
    OTHER = 'OTHER', 'Other'


class HorseDocument(models.Model):
    """Horse document storage"""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text='Unique identifier for the document'
    )

    horse = models.ForeignKey(
        Horse,
        on_delete=models.CASCADE,
        related_name='documents',
        help_text='Horse associated with this document'
    )

    document_type = models.CharField(
        max_length=20,
        choices=DocumentType.choices,
        help_text='Type of document'
    )

    title = models.CharField(
        max_length=200,
        help_text='Document title'
    )

    file_name = models.CharField(
        max_length=255,
        help_text='Original file name'
    )

    file_url = models.URLField(
        help_text='URL to the document file'
    )

    upload_date = models.DateTimeField(
        auto_now_add=True,
        help_text='Date when the document was uploaded'
    )

    expiry_date = models.DateField(
        null=True,
        blank=True,
        help_text='Document expiry date'
    )

    notes = models.TextField(
        blank=True,
        help_text='Additional notes'
    )

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='uploaded_horse_documents',
        help_text='User who uploaded the document'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'horse_documents'
        verbose_name = 'Horse Document'
        verbose_name_plural = 'Horse Documents'
        ordering = ['-upload_date']
        indexes = [
            models.Index(fields=['horse', '-upload_date']),
            models.Index(fields=['document_type']),
        ]

    def __str__(self):
        return f"{self.horse.name} - {self.title}"

    @property
    def is_expired(self):
        """Check if document has expired"""
        if self.expiry_date:
            from datetime import date
            return date.today() > self.expiry_date
        return False

