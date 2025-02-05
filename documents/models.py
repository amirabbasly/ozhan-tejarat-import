from django.db import models

class ImageTemplate(models.Model):
    name = models.CharField(max_length=255)  # Name of the template
    template_image = models.ImageField(upload_to='templates/')  # Image file for the template
    exporter_position = models.CharField(max_length=255)  # Position for the exporter text (e.g., '100,50')
    consignee_position = models.CharField(max_length=255)  # Position for the consignee text
    quantity_position = models.CharField(max_length=255)  # Position for the quantity text
    description_position = models.CharField(max_length=255)  # Position for the description text

    def __str__(self):
        return self.name
