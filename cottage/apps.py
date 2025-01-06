from django.apps import AppConfig


class CottageConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cottage'
    def ready(self):
        import cottage.signals  # So the signal handlers get registered