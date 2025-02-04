import re
import requests
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Import your models
from customs.models import HSCode
from cottage.models import Cottage

API_KEY = "AIzaSyBXmy7WymgH6np_beLSTR4MPASp23DBapw"
GEMINI_API_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
    f"?key={API_KEY}"
)

class ChatbotAPIView(APIView):
    """
    A Chatbot API that retrieves information from both the HSCode and Cottage models.
    The chatbot always responds in Persian.
    """

    def post(self, request, *args, **kwargs):
        user_input = request.data.get("message", "")
        if not user_input:
            return Response({"error": "Message is required."}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Extract any numeric codes (like "01012910" or "35411581") from the user's input
        numbers = re.findall(r'\b\d+\b', user_input)  # list of strings, e.g. ["01012910", "35411581"]

        # Prepare containers for the data snippets
        data_snippets = []

        # -----------------------------
        # 2. HSCode Retrieval
        # -----------------------------
        # We'll collect all HSCode objects that match any numeric code found
        hscode_queryset = HSCode.objects.none()

        for number in numbers:
            # Combine with the existing queryset using OR logic (i.e., union).
            # We do __icontains so "01012910" can match "0101.29.10" if you store it that way,
            # as long as the digits appear in sequence. If your DB doesn't store dots, a direct match is fine too.
            hscode_queryset = hscode_queryset.union(
                HSCode.objects.filter(code__icontains=number)
            )

        # If no numbers were found, or we want to fallback to general search, uncomment:
        # hscode_queryset = HSCode.objects.filter(
        #     Q(code__icontains=user_input) |
        #     Q(goods_name_fa__icontains=user_input) |
        #     Q(goods_name_en__icontains=user_input) |
        #     Q(profit__icontains=user_input) |
        #     Q(customs_duty_rate__icontains=user_input) |
        #     Q(import_duty_rate__icontains=user_input)
        # )

        data_snippets.append("=== HSCode Data ===")
        if hscode_queryset.exists():
            for hs in hscode_queryset:
                tag_list = [t.tag for t in hs.tags.all()]
                commercial_list = [c.title for c in hs.commercials.all()]

                data_snippets.append(
                    f"کد: {hs.code}\n"
                    f"نام کالا (فارسی): {hs.goods_name_fa}\n"
                    f"نام کالا (انگلیسی): {hs.goods_name_en}\n"
                    f"سود: {hs.profit}\n"
                    f"نرخ حقوق گمرکی: {hs.customs_duty_rate}\n"
                    f"حقوق ورودی: {hs.import_duty_rate}\n"
                    f"اولویت (Priority): {hs.priority}\n"
                    f"واحد (SUQ): {hs.SUQ}\n"
                    f"فصل (Season): {hs.season.code if hs.season else 'بدون فصل'}\n"
                    f"Heading: {hs.heading.code if hs.heading else 'None'}\n"
                    f"برچسب‌ها (Tags): {', '.join(tag_list)}\n"
                    f"کامرشال (Commercials): {', '.join(commercial_list)}"
                )
        else:
            data_snippets.append("هیچ HSCode مطابقت ندارد.")

        # -----------------------------
        # 3. Cottage Retrieval
        # -----------------------------
        # We'll do something similar for cottages,
        # assuming the user might ask for a cottage by a numeric ID in the same input.
        cottage_queryset = Cottage.objects.none()

        for number in numbers:
            cottage_queryset = cottage_queryset.union(
                Cottage.objects.filter(cottage_number__icontains=number)
            )

        data_snippets.append("\n=== Cottage Data ===")
        if cottage_queryset.exists():
            for cottage in cottage_queryset:
                data_snippets.append(
                    f"شماره کوتاژ (Cottage Number): {cottage.cottage_number}\n"
                    f"تاریخ کوتاژ (Cottage Date): {cottage.cottage_date}\n"
                    f"وضعیت کوتاژ (Status): {cottage.cottage_status}\n"
                    f"مقدار (Quantity): {cottage.quantity}\n"
                    f"ارزش کل (Total Value): {cottage.total_value}\n"
                    f"واحد ارزی (Currency Price): {cottage.currency_price}\n"
                    f"شماره ساتا: {cottage.refrence_number}\n"
                    f"پروفورما: {cottage.proforma}\n"
                    f"وضعیت رفع تعهد (rafee_taahod): {cottage.rafee_taahod}\n"
                    f"مدارک دریافت شده (docs_recieved): {cottage.docs_recieved}\n"
                    f"rewatch: {cottage.rewatch}\n"
                    f"سند (documents): {cottage.documents}"
                )
        else:
            data_snippets.append("هیچ کوتاژ مطابقت ندارد.")

        # -----------------------------
        # 4. Build the Prompt
        # -----------------------------
        database_context = "\n\n".join(data_snippets)

        # Note the final instruction to "respond in Persian"
        prompt_text = f"""
        شما یک ربات گفتگو هستید که به اطلاعات زیر دسترسی دارید:

        {database_context}

        پرسش کاربر: {user_input}

        لطفا تنها بر اساس اطلاعات فوق پاسخ دهید و پاسخ خود را به زبان فارسی بنویسید.
        """

        # 5. Prepare the JSON for Gemini
        data = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt_text
                        }
                    ]
                }
            ]
        }

        # For debugging, you may print the final prompt:
        # print(prompt_text)

        # 6. Make the POST request to Gemini
        try:
            response = requests.post(
                GEMINI_API_URL,
                json=data,
                headers={"Content-Type": "application/json"},
                verify=False  # For dev only; consider removing or configuring certs in production
            )

            if response.status_code == 200:
                try:
                    response_data = response.json()
                    # Debug
                    print("Gemini API Response:", response_data)

                    candidates = response_data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts:
                            bot_reply = parts[0].get("text", "").strip()
                            if bot_reply:
                                return Response({"reply": bot_reply}, status=status.HTTP_200_OK)
                            else:
                                return Response(
                                    {"error": "پاسخ دریافت شده خالی است."},
                                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                                )
                        else:
                            return Response(
                                {"error": "هیچ بخشی در پاسخ Gemini یافت نشد."},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR
                            )
                    else:
                        return Response(
                            {"error": "هیچ کاندیدایی از Gemini برنگشت."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR
                        )
                except requests.exceptions.JSONDecodeError:
                    return Response(
                        {"error": "خطا در تجزیه JSON پاسخ Gemini."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            else:
                return Response(
                    {"error": f"پاسخ ناموفق از Gemini، کد وضعیت: {response.status_code}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except requests.exceptions.RequestException as e:
            return Response(
                {"error": f"خطا در برقراری ارتباط با Gemini: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
