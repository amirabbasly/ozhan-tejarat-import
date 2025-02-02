# utils.py
from persiantools.jdatetime import JalaliDate

def jalali_to_gregorian(jalali_date_str):
    try:
        # Manually parse the Jalali date string in 'YYYY/MM/DD' format
        year, month, day = map(int, jalali_date_str.split('/'))
        # Create a JalaliDate object
        jalali_date = JalaliDate(year, month, day)
        # Convert Jalali to Gregorian and return the date part (no need to call .date() here)
        gregorian_date = jalali_date.to_gregorian()
        return gregorian_date  # Return the Gregorian date object
    except ValueError as e:
        return None  # Handle invalid date formats
