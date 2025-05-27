from django.db import models
from django.core.exceptions import ValidationError
from django_jalali.db import models as jmodels
from accounts.models import Costumer




class Representation(models.Model):
    representi  = models.ManyToManyField(Costumer,blank=True,related_name='representations_as_principal'   )    
    representor  = models.ManyToManyField(Costumer,blank=True,related_name='representations_as_attorney'   )    
    applicant = models.ForeignKey(Costumer,to_field='id', on_delete=models.SET_NULL, null=True, blank=True, related_name='applicants')
    start_date = models.CharField(max_length=55)  # Start date in Jalali
    end_date = models.CharField(max_length=55, blank=True, null=True)  # End date in Jalali
    another_deligation = models.BooleanField(default=False)  # Delegation to another
    representor_dismissal = models.BooleanField(default=False)  # Dismissal of attorney
    representation_summary = models.CharField(max_length=255)  # Summary of representation
    doc_number = models.CharField(unique=True)  # Document identifier
    verification_code = models.CharField()  # Verification code
    file = models.FileField( null=True, blank=True)  # File upload with validation
    class Meta:
        ordering = ["-id"] 
    def __str__(self):
        return f"Representation by {self.representor} for {self.representi}"

class Check(models.Model):
    issuer = models.CharField(max_length=255)
    check_code = models.BigIntegerField(unique=True)
    date = models.CharField(max_length=255)
    value = models.BigIntegerField()
    issued_for = models.CharField(max_length=255)
    bank = models.CharField(max_length=255)
    is_paid = models.BooleanField(default=False)
    document = models.FileField(null=True, blank=True)
    class Meta:
        ordering = ["-id"] 
    def __str__(self):
        return f"Check by {self.issuer} for {self.issued_for}"