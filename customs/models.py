# customs/models.py

from django.db import models

class Tag(models.Model):
    tag = models.CharField(max_length=255)
    def __str__(self):
        return f"{self.tag}"


class HSCode(models.Model):
    code = models.CharField(max_length=20, unique=True)
    goods_name_fa = models.TextField(max_length=1000)
    goods_name_en = models.TextField(max_length=1000)
    profit = models.IntegerField()
    customs_duty_rate = models.IntegerField(
        null=True, blank=True
    )
    priority = models.IntegerField(null=True, blank=True)
    SUQ_OPTIONS = [
        ('1000kwh','1000Kwh'),
        ('1000u','1000U'),
        ('2U','2U'),
        ('c','C'),
        ('Carat','Carat'),
        ('Kg','Kg'),
        ('L','L'),
        ('m','M'), 
        ('m2','M2'),
        ('m3','M3'),
        ('mm','Mm'),
        ('U','U'),
    ]
    SUQ = models.CharField(max_length=20, choices=SUQ_OPTIONS, default='u')
    tags = models.ManyToManyField(Tag)
    class Meta:
        ordering = ["-id"] 
    def __str__(self):
        return f"{self.code} - {self.goods_name_en[:50]}"

