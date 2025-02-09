from django.db import models

class ImageTemplate(models.Model):
    name = models.CharField(max_length=255)
    template_image = models.ImageField(upload_to='templates/')

    # Existing fields:
    exporter_position = models.CharField(max_length=255)
    consignee_position = models.CharField(max_length=255)
    means_of_transport_position = models.CharField(max_length=255)

    description_position = models.CharField(max_length=255)
    hscode_position = models.CharField(max_length=255)
    quantity_position = models.CharField(max_length=255)
    number_of_invoices_position = models.CharField(max_length=255)
    goods_line_height = models.IntegerField()

    # NEW field: anchor point for where the first Good line should start
    goods_start_position = models.CharField(
        max_length=255,
        default="100,300",  # set whatever default x,y you want
        help_text="X,Y coordinate for the initial line of goods"
    )
    font_size = models.IntegerField(default=20)

    def __str__(self):
        return self.name
