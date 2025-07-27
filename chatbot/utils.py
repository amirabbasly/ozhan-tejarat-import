import re
from django.db.models import Q
from customs.models import HSCode
from cottage.models import Cottage
from proforma.models import Performa

def extract_search_text(user_input: str) -> str:
    """
    1) Take text inside parentheses if present
    2) Else take text between 'تعرفه' and 'چیست|چنده|چیه'
    3) Otherwise return the full input
    """
    m = re.search(r'\((.*?)\)', user_input)
    if m:
        return m.group(1).strip()

    m = re.search(r'تعرفه\s+(.+?)\s+(?:چیست|چنده|چیه)', user_input)
    if m:
        return m.group(1).strip()

    return user_input

def extract_numbers(user_input: str) -> list[str]:
    """Find all standalone numbers for Cottage lookup."""
    return re.findall(r'\b\d+\b', user_input)

def retrieve_hscode_snippets(search_text: str) -> list[str]:
    snippets = ["=== HSCode Data ==="]
    qs = HSCode.objects.filter(
        Q(code__icontains=search_text) |
        Q(goods_name_fa__icontains=search_text)
    )
    if not qs.exists():
        snippets.append("هیچ HSCode مطابقت ندارد.")
        return snippets

    for hs in qs:
        tags       = ", ".join(t.tag for t in hs.tags.all())
        comms      = ", ".join(c.title for c in hs.commercials.all())
        season     = hs.season.code if hs.season else "بدون فصل"
        heading    = hs.heading.code if hs.heading else "None"
        snippets.append(
            f"کد تعرفه: {hs.code}\n"
            f"نام (فا): {hs.goods_name_fa}\n"
            f"نام (انگ): {hs.goods_name_en}\n"
            f" سود بازرگانی: {hs.profit}, حقوق گمرکی: {hs.customs_duty_rate}\n"
            f"واحد: {hs.SUQ}, فصل: {season}, سرفصل: {heading}\n"
            f"برچسب‌ها: {tags}\n"
            f"مجوزها: {comms}"
        )
    return snippets

def retrieve_cottage_snippets(numbers: list[str]) -> list[str]:
    snippets = ["=== Cottage Data ==="]
    qs = Cottage.objects.none()
    for num in numbers:
        qs = qs.union(Cottage.objects.filter(cottage_number__icontains=num))

    if not qs.exists():
        snippets.append("هیچ کوتاژ مطابقت ندارد.")
        return snippets

    for c in qs:
        snippets.append(
            f" شماره کوتاژ: {c.cottage_number}\n"
            f"تاریخ: {c.cottage_date}, وضعیت: {c.cottage_status}\n"
            f"مقدار: {c.quantity}, ارزش: {c.total_value}\n"
            f"نرخ ارز: {c.currency_price}, ساتا: {c.refrence_number}\n"
            f"پروفرما: {c.proforma}, رفع تعهد: {c.rafee_taahod}\n"
            f"ارزش گمرکی: {c.customs_value}, ارزش افزوده: {c.added_value}\n"

        )
    return snippets

def retrieve_performa_snippets(numbers: list[str]) -> list[str]:
    snippets = ["=== Registered Order Data ==="]
    qs = Performa.objects.none()
    for num in numbers:
        qs = qs.union(
            Performa.objects.filter(
                Q(prf_order_no__icontains=num) |
                Q(prfVCodeInt__icontains=num)
            )
        )
    if not qs.exists():
        snippets.append("هیچ ثبت سفارشی مطابقت ندارد.")
        return snippets

    for prf in qs:
        # Header for this performa
        snippets.append(
            f"شماره ثبت سفارش: {prf.prf_order_no}\n"
            f"تاریخ: {prf.prf_date}, وضعیت: {prf.prf_status}\n"
            f"مبلغ کل ارزی: {prf.prf_total_price},شماره پرونده : {prf.prfVCodeInt} "
            f"باقیمانده: {prf.remaining_total}, "
            f"کرایه حمل: {prf.prf_freight_price}"
        )

        # Now list its cottages
        cottages = prf.cottages.all()  # uses related_name='cottages'
        if cottages:
            snippets.append("  --- Cottages under this order ---")
            for c in cottages:
                snippets.append(
                    f"  • شماره کوتاژ: {c.cottage_number}, "
                    f"ارزش کل: {c.total_value}"
                )
        else:
            snippets.append("  هیچ کوتاژی به این ثبت سفارش مرتبط نیست.")

    return snippets


def build_database_context(*snippet_lists: list[str]) -> str:
    """Merge multiple snippet lists into a single text block."""
    merged = []
    for lst in snippet_lists:
        merged.extend(lst)
    return "\n\n".join(merged)
