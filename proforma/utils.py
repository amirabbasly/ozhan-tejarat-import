from collections import defaultdict
from decimal import Decimal
from jalali_date import date2jalali
from .models import Performa

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
