import re
import requests
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from customs.models import HSCode
from cottage.models import Cottage
from .utils import (
    extract_search_text, extract_numbers,
    retrieve_hscode_snippets, retrieve_cottage_snippets,
    build_database_context,retrieve_performa_snippets, 
)
from django.db import transaction
import urllib3
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions    import IsAuthenticated

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

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)



class ChatbotAPIView(APIView):
    MAX_PROMPT_CHARS = 12_000
    GEMINI_URL = (
        "https://generativelanguage.googleapis.com/v1beta/"
        "models/gemini-2.0-flash:generateContent"
    )

    def post(self, request, *args, **kwargs):
        user_input = request.data.get("message", "").strip()
        if not user_input:
            return Response(
                {"error": "Message is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Build the DB context…
        search_text = extract_search_text(user_input)
        numbers     = extract_numbers(user_input)
        hs_snips      = retrieve_hscode_snippets(search_text)
        cottage_snips = retrieve_cottage_snippets(numbers)
        performa_snips = retrieve_performa_snippets(numbers)   # ← new
        # 3) Build DB context
        database_ctx = build_database_context(
            hs_snips,
            cottage_snips,
            performa_snips         # ← include it here
        )

        # Build payload…
        system_inst = {
            "role": "system",
            "parts": [{"text": database_ctx[: self.MAX_PROMPT_CHARS]}]
        }
        current = {
            "role": "user",
            "parts": [{"text": user_input[: self.MAX_PROMPT_CHARS]}]
        }
        payload = {
            "systemInstruction": system_inst,
            "contents": [current],
        }

        # Call Gemini with two‑stage exception handling
        try:
            resp = requests.post(
                f"{self.GEMINI_URL}?key={API_KEY}",  # ← your API key
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10,
                verify=False
            )
            # This will raise HTTPError for 4xx/5xx
            resp.raise_for_status()

        except requests.exceptions.HTTPError as http_exc:
            # We got an HTTP response with an error status
            err_resp = http_exc.response  # guaranteed to exist
            try:
                body = err_resp.json()
            except ValueError:
                body = err_resp.text or str(http_exc)
            return Response(
                {"error": f"Gemini HTTP error: {body}"},
                status=err_resp.status_code
            )

        except requests.exceptions.RequestException as net_exc:
            # Network‑level error: no response object available
            return Response(
                {"error": f"Gemini network error: {str(net_exc)}"},
                status=status.HTTP_502_BAD_GATEWAY
            )

        # If we’re here, resp is a successful 2xx and valid JSON is expected
        try:
            data = resp.json()
        except ValueError:
            return Response(
                {"error": "Invalid JSON received from Gemini."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        candidates = data.get("candidates", [])
        if not candidates:
            return Response(
                {"error": "هیچ کاندیدایی از Gemini برنگشت."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        parts     = candidates[0].get("content", {}).get("parts", [])
        bot_reply = parts[0].get("text", "").strip() if parts else ""

        if not bot_reply:
            return Response(
                {"error": "پاسخ دریافتی خالی است."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({"reply": bot_reply}, status=status.HTTP_200_OK)
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
