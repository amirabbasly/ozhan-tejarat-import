from collections import defaultdict
from decimal import Decimal
from jalali_date import date2jalali
from .models import Performa
import pandas as pd
from django.db import transaction


def import_performa_from_excel(file_path):
    """
    Imports Performa data from an Excel file with Jalali date handling.

    :param file_path: Path to the Excel file.
    :raises ValueError: If required columns are missing or data validation fails.
    """
    # Load Excel file
    data = pd.read_excel(file_path)

    # Define required columns with their expected Persian names
    required_columns = {
        'prf_order_no': 'شماره سفارش',
        'prf_number': 'شماره پیشفاکتور',
        'prf_freight_price': 'هزینه حمل و نقل',
        'FOB': 'FOB',
        'prf_total_price': 'ارزش کل',
        'prf_currency_type': 'نوع ارز',
        'prf_seller_country': 'کشور فروشنده',
        'prf_status': 'وضعیت',
        'prf_date': 'تاریخ ثبت سفارش',
        'prf_expire_date': 'تاریخ اعتبار',
        'prfVCodeInt': 'شماره پرونده',
        'registrant': 'ثبت‌کننده',
        'remaining_total': 'باقیمانده',
    }

    # Check if all required columns are in the Excel file
    if not all(col in data.columns for col in required_columns.values()):
        raise ValueError(f"Excel file is missing required columns: {list(required_columns.values())}")

    # Reverse map Persian headers to field names
    column_mapping = {v: k for k, v in required_columns.items()}

    records = []
    with transaction.atomic():
        for index, row in data.iterrows():
            try:
                # Parse Jalali dates and handle missing values
                prf_date = row.get(required_columns['prf_date'])
                prf_expire_date = row.get(required_columns['prf_expire_date'])

                # Convert numeric fields to float before Decimal
                prf_freight_price = Decimal(float(row[required_columns['prf_freight_price']]))
                FOB = Decimal(float(row[required_columns['FOB']]))
                prf_total_price = Decimal(float(row[required_columns['prf_total_price']]))
                remaining_total = Decimal(float(row[required_columns['remaining_total']]))

                # Create Performa instance
                performa = Performa(
                    prf_order_no=row[required_columns['prf_order_no']],
                    prf_number=row[required_columns['prf_number']],
                    prf_freight_price=prf_freight_price,
                    FOB=FOB,
                    prf_total_price=prf_total_price,
                    prf_currency_type=row[required_columns['prf_currency_type']],
                    prf_seller_country=row[required_columns['prf_seller_country']],
                    prf_status=row[required_columns['prf_status']],
                    prf_date=prf_date,
                    prf_expire_date=prf_expire_date,
                    prfVCodeInt=row[required_columns['prfVCodeInt']],
                    registrant=row[required_columns['registrant']],
                    # Set remaining_total to prf_total_price when creating a new Performa
                    remaining_total=prf_total_price if pd.isnull(remaining_total) else remaining_total,
                )
                records.append(performa)
            except Exception as e:
                raise ValueError(f"Error processing row {index + 1}: {e}")

        # Bulk create all Performa objects
        Performa.objects.bulk_create(records)

def get_performa_combined_data(selected_year):
    yearly_totals = defaultdict(Decimal)       # Yearly total prices
    yearly_counts = defaultdict(int)           # Yearly performa counts
    monthly_totals = defaultdict(Decimal)      # Monthly total prices for selected year
    monthly_counts = defaultdict(int)          # Monthly performa counts for selected year

    # Fetch all perfomas with non-null dates
    perfomas = Performa.objects.exclude(prf_date__isnull=True)

    for p in perfomas:
        try:
            jalali_date = p.prf_date
            jalali_year = jalali_date.year
            jalali_month = jalali_date.month

            # Add to yearly totals and counts
            yearly_totals[jalali_year] += p.prf_total_price
            yearly_counts[jalali_year] += 1

            # Add to monthly totals and counts if it's the selected year
            if jalali_year == selected_year:
                monthly_totals[jalali_month] += p.prf_total_price
                monthly_counts[jalali_month] += 1

        except Exception as e:
            print(f"Error processing Performa {p.id}: {e}")

    # Format yearly data with total_price and count
    yearly_data = [
        {
            "year": year,
            "total_price": float(total),   # Convert Decimal to float for JSON serialization
            "count": count
        }
        for year, total in sorted(yearly_totals.items())
        for count in [yearly_counts[year]]
    ]

    # Format monthly data with total_price and count
    monthly_data = [
        {
            "month": month,
            "total_price": float(total),   # Convert Decimal to float for JSON serialization
            "count": monthly_counts.get(month, 0)
        }
        for month, total in sorted(monthly_totals.items())
    ]

    return {
        "yearly_data": yearly_data,
        "selected_year": selected_year,
        "monthly_data": monthly_data,
    }
