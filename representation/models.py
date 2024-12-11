from django.db import models
from django.core.exceptions import ValidationError
from django_jalali.db import models as jmodels




class Representation(models.Model):
    representi = models.CharField(max_length=255)  # Client/Principal
    representor = models.CharField(max_length=255)  # Attorney
    applicant = models.CharField(max_length=255)  # Requestor
    start_date = models.CharField(max_length=55)  # Start date in Jalali
    end_date = models.CharField(max_length=55)  # End date in Jalali
    another_deligation = models.BooleanField(default=False)  # Delegation to another
    representor_dismissal = models.BooleanField(default=False)  # Dismissal of attorney
    representation_summary = models.CharField(max_length=255)  # Summary of representation
    doc_number = models.BigIntegerField()  # Document identifier
    verification_code = models.BigIntegerField()  # Verification code
    file = models.FileField( null=True, blank=True)  # File upload with validation

    def __str__(self):
        return f"Representation by {self.representor} for {self.representi}"
