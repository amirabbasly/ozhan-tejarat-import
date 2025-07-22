import re
import requests
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from customs.models import HSCode
from cottage.models import Cottage

API_KEY = "AIzaSyBXmy7WymgH6np_beLSTR4MPASp23DBapw"
GEMINI_API_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
    f"?key={API_KEY}"
)
class TranslateToEnglishView(APIView):
    """
    Translate Farsi text to English in a foreign trade context using Gemini.
    Expects JSON: { "text": "متن فارسی" }
    Returns JSON: { "translation": "English translation" }
    """

    def post(self, request, *args, **kwargs):
        # 1. Validate request data
        farsi_text = request.data.get("text", "").strip()
        if not farsi_text:
            return Response(
                {"error": "No text provided."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Build the Gemini prompt in Farsi
        prompt_text = f"""
        لطفا متن زیر را در زمینه تجارت خارجی از فارسی به انگلیسی ترجمه کن:
        {farsi_text}

        فقط یک پاسخ بازگردان، بدون توضیحات اضافه.
        """

        # 3. Prepare the request data in the same structure as your working chatbot view
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

        # 4. Call Gemini API
        try:
            response = requests.post(
                GEMINI_API_URL,
                json=data,
                headers={"Content-Type": "application/json"},
                verify=False  # For dev only; configure properly in production
            )
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": f"Connection error: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 5. Parse the Gemini response
        if response.status_code == 200:
            try:
                response_data = response.json()
                # Typically: {"candidates": [{"content": {"parts": [{"text": "..."}]}}]}
                candidates = response_data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        translated_text = parts[0].get("text", "").strip()
                        return Response({"translation": translated_text}, status=status.HTTP_200_OK)
                # If we got here, we didn't find any valid text in the response
                return Response({"translation": ""}, status=status.HTTP_200_OK)

            except ValueError:
                return Response(
                    {"error": "Invalid JSON returned by Gemini."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(
                {"error": f"Gemini error {response.status_code}: {response.text}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
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

        # -------------------------------------------------------
        # 1. Extract the text we need to search (search_text)
        # -------------------------------------------------------
        # Priority:
        #   1) If there is text inside parentheses "( ... )", use it.
        #   2) Otherwise, look for text between "تعرفه" and "چیست" or "چنده".
        #   3) Otherwise, fallback to the entire user_input.
        # -------------------------------------------------------
        match_parens = re.search(r'\((.*?)\)', user_input)
        if match_parens:
            # Found something inside parentheses
            search_text = match_parens.group(1).strip()
        else:
            # Check after the word 'تعرفه' and before 'چیست' or 'چنده'
            match_after_tarife = re.search(r'تعرفه\s+(.+?)\s+(?:چیست|چنده|چیه|)', user_input)
            if match_after_tarife:
                # Extract whatever is between "تعرفه" and "چیست/چنده"
                search_text = match_after_tarife.group(1).strip()
            else:
                # Fallback to the entire user_input
                search_text = user_input

        # -------------------------------------------------------
        # 2. Optionally, extract any numeric codes (e.g. "01012910")
        # -------------------------------------------------------
        numbers = re.findall(r'\b\d+\b', user_input)

        data_snippets = []

        # -------------------------------------------------------
        # 3. HSCode Retrieval
        # -------------------------------------------------------
        # We'll combine code__icontains and Persian name__icontains,
        # using the extracted search_text for the actual search.
        hscode_queryset = HSCode.objects.filter(
            Q(code__icontains=search_text) |
            Q(goods_name_fa__icontains=search_text)
        )

        # If you also want to try matching numeric codes separately, you can do:
        # for number in numbers:
        #     hscode_queryset = hscode_queryset.union(
        #         HSCode.objects.filter(code__icontains=number)
        #     )

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
                    f"اولویت (گروه کالایی): {hs.priority}\n"
                    f"واحد شمارش: {hs.SUQ}\n"
                    f"فصل: {hs.season.code if hs.season else 'بدون فصل'}\n"
                    f"سرفصل: {hs.heading.code if hs.heading else 'None'}\n"
                    f"برچسب‌ها: {', '.join(tag_list)}\n"
                    f"مجوز ها: {', '.join(commercial_list)}"
                )
        else:
            data_snippets.append("هیچ HSCode مطابقت ندارد.")

        # -------------------------------------------------------
        # 4. Cottage Retrieval (optional)
        # -------------------------------------------------------
        cottage_queryset = Cottage.objects.none()
        for number in numbers:
            cottage_queryset = cottage_queryset.union(
                Cottage.objects.filter(cottage_number__icontains=number)
            )

        data_snippets.append("\n=== Cottage Data ===")
        if cottage_queryset.exists():
            for cottage in cottage_queryset:
                data_snippets.append(
                    f"شماره کوتاژ: {cottage.cottage_number}\n"
                    f"تاریخ کوتاژ: {cottage.cottage_date}\n"
                    f"وضعیت کوتاژ: {cottage.cottage_status}\n"
                    f"مقدار: {cottage.quantity}\n"
                    f"ارزش کل: {cottage.total_value}\n"
                    f"نرخ ارز: {cottage.currency_price}\n"
                    f"شماره ساتا: {cottage.refrence_number}\n"
                    f"شماره ثبت سفارش: {cottage.proforma}\n"
                    f"وضعیت رفع تعهد: {cottage.rafee_taahod}\n"
                    f"مدارک دریافت شده: {cottage.docs_recieved}\n"
                    f"بازبینی: {cottage.rewatch}"
                )
        else:
            data_snippets.append("هیچ کوتاژ مطابقت ندارد.")

        # -------------------------------------------------------
        # 5. Build the Prompt for Gemini
        # -------------------------------------------------------
        database_context = "\n\n".join(data_snippets)
        prompt_text = f"""
        شما یک ربات گفتگو هستید که به اطلاعات زیر دسترسی دارید:

        {database_context}
        
        پرسش کاربر: {user_input}

    شما هوش مصنوعی اوژن هستید و توسط برنامه‌نویسان شرکت اوژن تجارت کیان توسعه یافته‌اید. شما به اطلاعات زیر دسترسی دارید :
        """

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

        # -------------------------------------------------------
        # 6. Send request to Gemini
        # -------------------------------------------------------
        try:
            response = requests.post(
                GEMINI_API_URL,
                json=data,
                headers={"Content-Type": "application/json"},
                verify=False  # For development only; remove or set properly in production
            )

            if response.status_code == 200:
                try:
                    response_data = response.json()
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
def translate_farsi_to_english(farsi_text: str) -> str:
    """
    Translate Farsi text to English in a foreign trade context,
    using the same 'contents' -> 'parts' JSON structure that
    works with your Gemini endpoint.
    """
    # Prompt instructing Gemini to translate from Farsi to English.
    prompt_text = f"""
                        "You are a translator. "
                        "Translate the following text from Farsi to English in international import/export and customs context. "
                        "Output ONLY the translated word or phrase in international import/export and customs context. "
                        "No explanations. No commentary.\n\n
    {farsi_text}
    """

    # Follow your working ChatbotAPIView structure:
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

    try:
        response = requests.post(
            GEMINI_API_URL,
            json=data,
            headers={"Content-Type": "application/json"},
            verify=False  # same as in your working code; remove or handle securely in prod
        )

        # Check for success
        if response.status_code == 200:
            response_data = response.json()
            # The structure you expect: response_data["candidates"][0]["content"]["parts"][0]["text"]
            candidates = response_data.get("candidates", [])
            if not candidates:
                return ""  # or raise an exception, your choice

            content_data = candidates[0].get("content", {})
            parts = content_data.get("parts", [])
            if not parts:
                return ""

            translated_text = parts[0].get("text", "").strip()
            return translated_text
        else:
            # Handle non-200 status codes
            raise Exception(
                f"Gemini returned status {response.status_code}: {response.text}"
            )

    except requests.exceptions.RequestException as e:
        # Handle network or request errors
        raise Exception(f"Error connecting to Gemini: {e}")

class ChatbotNormalAPIView(APIView):
    """
    Simply forwards the user's message to هوش مصنوعی اوژن and returns its JSON response.
    """

    def post(self, request, *args, **kwargs):
        user_message = request.data.get("message", "").strip()
        if not user_message:
            return Response(
                {"error": "Message is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # build the full prompt
        prompt_text = f"""
شما هوش مصنوعی اوژن هستید و توسط برنامه‌نویسان شرکت اوژن تجارت کیان توسعه یافته‌اید.

پرسش کاربر: {user_message}

"""

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt_text}
                    ]
                }
            ]
        }

        try:
            resp = requests.post(
                GEMINI_API_URL,
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            resp.raise_for_status()
        except requests.RequestException as e:
            return Response(
                {"error": f"Failed to reach هوش مصنوعی اوژن: {e}"},
                status=status.HTTP_502_BAD_GATEWAY
            )

        return Response(resp.json(), status=status.HTTP_200_OK)
