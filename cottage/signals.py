from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Cottage
from proforma.models import Performa

@receiver(post_delete, sender=Cottage)
def update_performa_after_cottage_delete(sender, instance, using, **kwargs):
    """
    Whenever a Cottage is deleted (even in bulk),
    re-save the related Performa to recalc totals.
    """
    proforma = instance.proforma
    if proforma:
        proforma.save()  # triggers the recalculation in Performa.save()
