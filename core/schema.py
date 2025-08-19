# mysite/schema.py

from drf_spectacular.openapi import AutoSchema

class ModelAutoSchema(AutoSchema):
    def get_tags(self):
        """
        Inspect the view to find its model (from queryset or serializer)
        and use the model’s class name as the tag.
        """
        model = None

        # 1) ViewSets / GenericViews using `.queryset`
        if getattr(self.view, 'queryset', None) is not None:
            model = getattr(self.view, 'queryset').model

        # 2) APIViews / custom views using `.get_serializer()`
        elif hasattr(self.view, 'get_serializer'):
            try:
                serializer = self.view.get_serializer()
                model = getattr(serializer.Meta, 'model', None)
            except Exception:
                model = None

        # 3) Fallback to module name
        if model:
            name = model._meta.object_name  # e.g. "Cottage" or "Order"
        else:
            # fallback to the Django app label
            name = self.view.__class__.__module__.split('.')[0]

        return [name]
