from rest_framework import serializers
from .models import ImageTemplate, Seller, Buyer, Invoice, InvoiceItem, ProformaInvoice, ProformaInvoiceItem
from accounts.serializers import CostumerSerializer
import uuid
from decimal import Decimal, InvalidOperation

class ImageTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageTemplate
        fields = ['id', 'name', 'template_image']  # Add 'template_image' if you want to show it

class GoodSerializer(serializers.Serializer):
    index = serializers.IntegerField(required=False)  # or True if you need it
    description = serializers.CharField(required=True)
    hscode = serializers.CharField(required=True)
    quantity = serializers.CharField(required=True)
    number_of_invoices = serializers.CharField(required=True)

class OverlayTextSerializer(serializers.Serializer):
    template_id = serializers.IntegerField()
    invoice_id = serializers.IntegerField()
    # Remove 'exporter', 'consignee', 'means_of_transport', and 'goods' from required fields
    exporter = serializers.CharField(required=False)  # No longer required
    consignee = serializers.CharField(required=False)  # No longer required
    means_of_transport = serializers.CharField(required=False)  # No longer required
    goods = GoodSerializer(many=True, required=False)  # No longer required
class OriginSerializer(serializers.Serializer):
    template_id = serializers.IntegerField()
    # Remove 'exporter', 'consignee', 'means_of_transport', and 'goods' from required fields
    exporter = serializers.CharField(required=False)  # No longer required
    consignee = serializers.CharField(required=False)  # No longer required
    means_of_transport = serializers.CharField(required=False)  # No longer required
    goods = GoodSerializer(many=True, required=False)  # No longer required
class SafeDecimalField(serializers.DecimalField):
    def to_representation(self, value):
        try:
            return super().to_representation(value)
        except (InvalidOperation, ValueError):
            # Return a safe default value (or you could return None)
            return "0.00"

class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = [
            'id',
            'seller_name',
            'seller_address',
            'seller_country',
            'seller_bank_name',
            'seller_account_name',
            'seller_iban',
            'seller_swift',
            'seller_seal',
            'seller_logo',
        ]


class BuyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Buyer
        fields = [
            'id',
            'buyer_name',
            'buyer_card_number',
            'buyer_address',
            'buyer_tel'
        ]


class InvoiceItemSerializer(serializers.ModelSerializer):
    """
    Represents a single line item in an Invoice.
    """
    line_total = SafeDecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    
    class Meta:
        model = InvoiceItem
        fields = [
            'id',
            'description',
            'quantity',
            'unit_price',
            'line_total',
            'pack',
            'unit',
            'nw_kg',
            'gw_kg',
            'origin',
            'commodity_code'
        ]

class ProformaInvoiceItemSerializer(serializers.ModelSerializer):
    """
    Represents a single line item in an Invoice.
    """
    line_total = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = ProformaInvoiceItem
        fields = [
            'id',
            'original_description',
            'translated_description',
            'quantity',
            'unit_price',
            'line_total',
            'unit',
            'nw_kg',
            'gw_kg',
            'origin',
            'commodity_code'
        ]



class InvoiceSerializer(serializers.ModelSerializer):
    """
    Invoice serializer supporting nested creation of InvoiceItems.
    """
    # Let the client send items in nested format
    items = InvoiceItemSerializer(many=True, write_only=False, required=False)

    # Read-only fields
    total_amount = serializers.DecimalField(max_digits=20, decimal_places=2, read_only=True)
    total_nw = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total_gw = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total_qty = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    sub_total = serializers.DecimalField(max_digits=20, decimal_places=2, read_only=True)
    
    invoice_date = serializers.DateField(read_only=False)
    
    # If you want to generate `invoice_id` automatically, you can make it read-only,
    # otherwise let clients supply it. Or you can handle generation in the model's `save()`.
    invoice_id = serializers.CharField(required=False)

    class Meta:
        model = Invoice
        fields = [
            'id',
            'seller',
            'buyer',
            'invoice_id',       # Unique invoice ID
            'invoice_number',
            'freight_charges',
            'invoice_currency',
            'invoice_date',
            'means_of_transport',
            'country_of_origin',
            'port_of_loading',
            'total_amount',
            'sub_total',
            'total_pack',
            'customer_tel',
            'items',
            'terms_of_delivery',
            'relevant_location',
            'total_gw',
            'total_nw',
            'total_qty'
        ]

    def create(self, validated_data):
        # Pull out nested items
        items_data = validated_data.pop('items', [])

        # Optionally auto-generate `invoice_id` if not provided
        if not validated_data.get('invoice_id'):
            validated_data['invoice_id'] = 'INV-' + str(uuid.uuid4())[:8].upper()

        # Create the Invoice
        invoice = Invoice.objects.create(**validated_data)

        # Create the InvoiceItems
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item_data)

        # Calculate total amount = sum of line_total + freight_charges (if that’s your logic)
        total_lines = sum(item.line_total for item in invoice.items.all())
        freight = invoice.freight_charges or 0
        invoice.total_amount = total_lines + freight
        invoice.sub_total = total_lines
        invoice.total_gw = sum(item.gw_kg for item in invoice.items.all())
        invoice.total_pack = sum(item.pack for item in invoice.items.all())
        invoice.total_nw = sum(item.nw_kg for item in invoice.items.all())
        invoice.total_qty = sum(item.quantity for item in invoice.items.all())
        invoice.save()

        return invoice

    def update(self, instance, validated_data):
        """
        Optional: If you want to handle updates to items or recalc total, 
        override update as well.
        """
        items_data = validated_data.pop('items', None)

        # Update direct fields on the invoice
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # If items are included, handle them (this is simplistic – you might want
        # a more robust approach to update items by ID, delete removed items, etc.)
        if items_data is not None:
            # Clear existing items or selectively update 
            instance.items.all().delete()
            for item_data in items_data:
                InvoiceItem.objects.create(invoice=instance, **item_data)

        # Recompute total
        total_lines = sum(item.line_total for item in instance.items.all())
        total_gw = sum(item.gw_kg for item in instance.items.all())
        total_nw = sum(item.nw_kg for item in instance.items.all())
        freight = instance.freight_charges or 0
        instance.total_amount = total_lines + freight
        instance.sub_total = total_lines       
        instance.total_gw = sum(item.gw_kg for item in instance.items.all())
        instance.total_pack = sum(item.pack for item in instance.items.all())
        instance.total_nw = sum(item.nw_kg for item in instance.items.all())
        instance.total_qty = sum(item.quantity for item in instance.items.all())
        instance.save()

        return instance

class ProformaInvoiceSerializer(serializers.ModelSerializer):
    """
    Invoice serializer supporting nested creation of InvoiceItems.
    """
    # Let the client send items in nested format
    items = ProformaInvoiceItemSerializer(many=True, write_only=False, required=False)

    # Read-only fields
    total_amount = serializers.DecimalField(max_digits=20, decimal_places=2, read_only=True)
    total_nw = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total_gw = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total_qty = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    sub_total = serializers.DecimalField(max_digits=20, decimal_places=2, read_only=True)

    proforma_invoice_date = serializers.DateField(read_only=False)
    
    # If you want to generate `invoice_id` automatically, you can make it read-only,
    # otherwise let clients supply it. Or you can handle generation in the model's `save()`.
    proforma_invoice_id = serializers.CharField(required=False)

    class Meta:
        model = ProformaInvoice
        fields = [
            'id',
            'seller',
            'buyer',
            'proforma_invoice_id',       # Unique invoice ID
            'proforma_invoice_number',
            'proforma_freight_charges',
            'proforma_invoice_currency',
            'proforma_invoice_date',
            'proforma_invoice_exp_date',
            'means_of_transport',
            'country_of_origin',
            'port_of_loading',
            'total_amount',
            'partial_shipment',
            'sub_total',
            'items',
            'terms_of_delivery',
            'terms_of_payment',
            'standard',
            'relevant_location',
            'total_gw',
            'total_nw',
            'total_qty'
        ]

    def create(self, validated_data):
        # Pull out nested items
        items_data = validated_data.pop('items', [])

        # Optionally auto-generate `invoice_id` if not provided
        if not validated_data.get('proforma_invoice_id'):
            validated_data['proforma_invoice_id'] = 'PRF-' + str(uuid.uuid4())[:8].upper()

        # Create the Invoice
        invoice = ProformaInvoice.objects.create(**validated_data)

        # Create the InvoiceItems
        for item_data in items_data:
            ProformaInvoiceItem.objects.create(proforma_invoice=invoice, **item_data)

        # Calculate total amount = sum of line_total + freight_charges (if that’s your logic)
        total_lines = sum(item.line_total for item in invoice.items.all())
        freight = invoice.proforma_freight_charges or 0
        invoice.total_amount = total_lines + freight
        invoice.sub_total = total_lines
        invoice.total_gw = sum(item.gw_kg for item in invoice.items.all())
        invoice.total_nw = sum(item.nw_kg for item in invoice.items.all())
        invoice.total_qty = sum(item.quantity for item in invoice.items.all())
        invoice.save()

        return invoice

    def update(self, instance, validated_data):
        """
        Optional: If you want to handle updates to items or recalc total, 
        override update as well.
        """
        items_data = validated_data.pop('items', None)

        # Update direct fields on the invoice
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # If items are included, handle them (this is simplistic – you might want
        # a more robust approach to update items by ID, delete removed items, etc.)
        if items_data is not None:
            # Clear existing items or selectively update 
            instance.items.all().delete()
            for item_data in items_data:
                ProformaInvoiceItem.objects.create(proforma_invoice=instance, **item_data)

        # Recompute total
        total_lines = sum(item.line_total for item in instance.items.all())
        total_gw = sum(item.gw_kg for item in instance.items.all())
        total_nw = sum(item.nw_kg for item in instance.items.all())
        freight = instance.proforma_freight_charges or 0
        instance.total_amount = total_lines + freight
        instance.sub_total = total_lines       
        instance.total_gw = sum(item.gw_kg for item in instance.items.all())
        instance.total_nw = sum(item.nw_kg for item in instance.items.all())
        instance.total_qty = sum(item.quantity for item in instance.items.all())
        instance.save()

        return instance