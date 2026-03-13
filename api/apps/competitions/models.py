from django.db import models
from django.conf import settings
from django.utils.text import slugify


class Grade(models.Model):
    """Grade model for competition classes."""

    class Level(models.IntegerChoices):
        STANDARD = 1, 'Standard'
        OPEN = 2, 'Open'

    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    level = models.IntegerField(choices=Level.choices, default=Level.STANDARD)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'grades'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class ClassType(models.Model):
    """Class type model."""
    
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'class_types'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class ClassRule(models.Model):
    """Class rule model."""
    
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'class_rules'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Competition(models.Model):
    """Competition model based on ERD specifications."""
    
    COMPETITION_TYPE_CHOICES = [
        ('dressage', 'Dressage'),
        ('show_jumping', 'Show Jumping'),
        ('eventing', 'Eventing'),
        ('combined', 'Combined'),
    ]
    
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    competition_type = models.CharField(max_length=50, choices=COMPETITION_TYPE_CHOICES)
    entry_close = models.DateTimeField()
    
    show_holding_body = models.ForeignKey(
        'clubs.ShowHoldingBody',
        on_delete=models.CASCADE,
        related_name='competitions'
    )
    
    course_designer = models.CharField(max_length=255, blank=True)
    late_entry_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Information fields
    terms_and_conditions = models.TextField(blank=True)
    entry_message = models.TextField(blank=True)
    close_message = models.TextField(blank=True)
    ground_message = models.TextField(blank=True)
    programme = models.TextField(blank=True)
    venue = models.TextField(blank=True)
    enquiries = models.TextField(blank=True)
    catering = models.TextField(blank=True)
    vet_inspections = models.TextField(blank=True)
    
    # Banking details
    account_type = models.CharField(max_length=50, blank=True)
    account_name = models.CharField(max_length=255, blank=True)
    branch_code = models.CharField(max_length=20, blank=True)
    account_number = models.CharField(max_length=50, blank=True)
    bank_name = models.CharField(max_length=255, blank=True)
    payment_reference_prefix = models.CharField(max_length=50, blank=True)
    
    is_active = models.BooleanField(default=True)
    is_test = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'competitions'
        ordering = ['-entry_close']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class CompetitionDate(models.Model):
    """Competition date model based on ERD specifications."""
    
    competition = models.ForeignKey(
        Competition,
        on_delete=models.CASCADE,
        related_name='dates'
    )
    start_date = models.DateField()
    start_time = models.TimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'competition_dates'
        ordering = ['start_date', 'start_time']
    
    def __str__(self):
        return f"{self.competition.name} - {self.start_date}"


class CompetitionClass(models.Model):
    """Competition class model based on ERD specifications."""

    CATEGORY_CHOICES = [
        ('preliminary', 'Preliminary'),
        ('novice', 'Novice'),
        ('elementary', 'Elementary'),
        ('medium', 'Medium'),
        ('advanced', 'Advanced'),
        ('prix_st_georges', 'Prix St Georges'),
        ('intermediate', 'Intermediate'),
        ('grand_prix', 'Grand Prix'),
    ]

    competition = models.ForeignKey(
        Competition,
        on_delete=models.CASCADE,
        related_name='classes'
    )
    grade = models.ForeignKey(
        Grade,
        on_delete=models.SET_NULL,
        null=True,
        related_name='competition_classes'
    )
    class_type = models.ForeignKey(
        ClassType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='competition_classes'
    )
    class_rule = models.ForeignKey(
        ClassRule,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='competition_classes'
    )

    fee = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, blank=True)
    approximate_start_time = models.TimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'competition_classes'
        ordering = ['competition', 'approximate_start_time']

    def __str__(self):
        return f"{self.competition.name} - {self.grade.name if self.grade else 'No Grade'}"


class CompetitionExtra(models.Model):
    """Competition extra model based on ERD specifications."""

    competition = models.ForeignKey(
        Competition,
        on_delete=models.CASCADE,
        related_name='extras'
    )
    name = models.CharField(max_length=255)
    quantity = models.IntegerField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_stable = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'competition_extras'
        ordering = ['competition', 'name']

    def __str__(self):
        return f"{self.competition.name} - {self.name}"


class CompetitionFee(models.Model):
    """Competition fee model based on ERD specifications."""

    competition = models.ForeignKey(
        Competition,
        on_delete=models.CASCADE,
        related_name='fees'
    )
    fee = models.DecimalField(max_digits=10, decimal_places=2)
    is_included_in_entry_fee = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'competition_fees'
        ordering = ['competition']

    def __str__(self):
        return f"{self.competition.name} - R{self.fee}"


class CompetitionDocument(models.Model):
    """Competition document model based on ERD specifications."""

    DOCUMENT_TYPE_CHOICES = [
        ('schedule', 'Schedule'),
        ('rules', 'Rules'),
        ('timetable', 'Timetable'),
        ('map', 'Map'),
        ('other', 'Other'),
    ]

    competition = models.ForeignKey(
        Competition,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPE_CHOICES)
    filename = models.CharField(max_length=255)
    attachment = models.FileField(upload_to='competition_documents/')
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'competition_documents'
        ordering = ['competition', 'document_type']

    def __str__(self):
        return f"{self.competition.name} - {self.filename}"

