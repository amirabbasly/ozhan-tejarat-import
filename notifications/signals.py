# notifications/signals.py
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from accounts.models import CustomUser
from .models import Notification
from proforma.models import Performa  # Adjust the import path as necessary
from cottage.models import ExportedCottages
from decimal import Decimal

@receiver(post_save, sender=ExportedCottages)
def notify_admins_on_high_remaining_total(sender, instance, created, **kwargs):
    """
    Sends a notification to all admin users whenever an ExportCottage
    is created or updated with a remaining_total > 50.
    """
    try:
        # Convert to Decimal
        remaining_total = Decimal(instance.remaining_total)

        # Compare the decimal version here
        if remaining_total > Decimal('50'):
            # Fetch admin users (adjust as needed)
            admin_users = CustomUser.objects.filter(is_staff=True)
            for admin in admin_users:
                Notification.objects.create(
                    user=admin,
                    message=(
                        f"اظهانامه صادراتی {instance.full_serial_number} "
                        f"{remaining_total}, .باقیمانده دارد"
                    ),
                    type='warning'
                )
    except (ValueError, TypeError):
        # Handle the error if remaining_total is not a valid numeric string
        print(
            f"Error: Invalid remaining_total value '{instance.remaining_total}' "
            f"for ExportedCottages object with ID: {instance.id}"
        )
@receiver(pre_save, sender=Performa)
def track_remaining_total_change(sender, instance, **kwargs):
    """
    Store the previous value of remaining_total before saving.
    """
    if instance.pk:
        try:
            previous = Performa.objects.get(pk=instance.pk)
            instance._previous_remaining_total = previous.remaining_total
        except Performa.DoesNotExist:
            instance._previous_remaining_total = None
    else:
        instance._previous_remaining_total = None

@receiver(post_save, sender=Performa)
def notify_on_remaining_total(sender, instance, created, **kwargs):
    """
    Send notifications to admin and accountant users when remaining_total <= 0.
    """
    # If the Performa was just created, check if remaining_total <= 0
    if created:
        should_notify = instance.remaining_total <= 0
    else:
        # If not created, compare previous and current remaining_total
        previous = getattr(instance, '_previous_remaining_total', None)
        if previous is None:
            should_notify = instance.remaining_total <= 0
        else:
            # Notify only if it transitioned from >0 to <=0
            should_notify = previous > 0 and instance.remaining_total <= 0

    if should_notify:
        # Fetch users with roles 'admin' and 'accountant'
        target_users = CustomUser.objects.filter(role__in=['admin', 'accountent'])
        message = f"ثبت سفارش '{instance.prf_order_no}' {instance.remaining_total} باقیمانده دارد."
        notification_type = 'warning' if instance.remaining_total < 0 else 'info'

        # Create a notification for each target user
        notifications = [
            Notification(
                user=user,
                message=message,
                type=notification_type
            )
            for user in target_users
        ]

        Notification.objects.bulk_create(notifications)

