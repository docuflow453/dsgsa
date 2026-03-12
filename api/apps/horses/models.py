from django.db import models


class HorseBreed(models.Model):
    """Horse breed model."""
    
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'horse_breeds'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class BreedType(models.Model):
    """Breed type classification."""
    
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'breed_types'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class HorseColour(models.Model):
    """Horse colour model."""
    
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'horse_colours'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class StudFarm(models.Model):
    """Stud farm model."""
    
    name = models.CharField(max_length=255)
    registration_number = models.CharField(max_length=100, blank=True)
    contact_person = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    website = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'stud_farms'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Horse(models.Model):
    """Horse model based on ERD specifications."""
    
    GENDER_CHOICES = [
        ('stallion', 'Stallion'),
        ('mare', 'Mare'),
        ('gelding', 'Gelding'),
    ]
    
    name = models.CharField(max_length=255)
    passport_number = models.CharField(max_length=100, blank=True)
    passport_expiry = models.DateField(null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    nationality = models.CharField(max_length=100, default='South Africa')
    
    breed = models.ForeignKey(
        HorseBreed,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='horses'
    )
    breed_type = models.ForeignKey(
        BreedType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='horses'
    )
    colour = models.ForeignKey(
        HorseColour,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='horses'
    )
    
    sire = models.CharField(max_length=255, blank=True)
    dam = models.CharField(max_length=255, blank=True)
    sire_of_dam = models.CharField(max_length=255, blank=True)
    
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    microchip_number = models.CharField(max_length=100, blank=True)
    qr_link = models.URLField(blank=True)
    fei_link = models.URLField(blank=True)
    
    is_test = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'horses'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class VaccinationType(models.Model):
    """Vaccination type model."""

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vaccination_types'
        ordering = ['name']

    def __str__(self):
        return self.name


class HorseVaccination(models.Model):
    """Horse vaccination record based on ERD specifications."""

    horse = models.ForeignKey(
        Horse,
        on_delete=models.CASCADE,
        related_name='vaccinations'
    )
    vaccination_type = models.ForeignKey(
        VaccinationType,
        on_delete=models.CASCADE,
        related_name='vaccinations'
    )
    date = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'horse_vaccinations'
        ordering = ['-date']

    def __str__(self):
        return f"{self.horse.name} - {self.vaccination_type.name} ({self.date})"

