import requests
import certifi

API_KEY = "AIzaSyBXmy7WymgH6np_beLSTR4MPASp23DBapw"
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={API_KEY}"

headers = {"Content-Type": "application/json"}
data = {
    "contents": [
        {"parts": [{"text": "شماره تعرفه اسب در گمرک چیست"}]}
    ]
}

try:
    # Make the POST request with SSL verification
    response = requests.post(url, headers=headers, json=data, verify=False)
    
    # Check the response status code
    if response.status_code == 200:
        try:
            # Attempt to parse JSON response
            response_data = response.json()
            print("Response:", response_data)
        except requests.exceptions.JSONDecodeError:
            print("Failed to decode JSON. Raw Response:", response.text)
    else:
        print(f"Request failed with status code {response.status_code}. Raw Response: {response.text}")

except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
