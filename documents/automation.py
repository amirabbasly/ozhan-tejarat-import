from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import time

def register_order_on_ntsw(order_data):
    """
    Automates order registration on ntsw.ir.

    Steps:
      1) User logs in manually.
      2) Select 'بازرگان' role & handle confirmation modal.
      3) Navigate to externalTradeFileManagement & click 'جزئیات' for the matching invoice.
      4) Click 'ویرایش پرونده' & handle popup ('بستن').
      5) Fill date pickers for 'تاریخ صدور پیش فاکتور' & 'تاریخ اعتبار پیش فاکتور' in Persian digits.
      6) Click 'بعدی'.

    :param order_data: dict with:
      "proforma_invoice_number" (str)
      "proforma_invoice_date" (str, e.g. "2025-03-14" or "2025/3/14")
      "proforma_invoice_exp_date" (str, same format above)
    :return: dict with status & message
    """

    ###########################################################################
    # 1) Helper for ASCII-to-Persian digit conversion
    ###########################################################################
    ascii_to_persian = {
        '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴',
        '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹'
    }

    def to_persian_digits(num_str):
        """Converts '2025' -> '۲۰۲۵' or '14' -> '۱۴' by mapping ASCII to Persian digits."""
        return ''.join(ascii_to_persian.get(ch, ch) for ch in num_str)

    ###########################################################################
    # 2) Month name map for numeric months -> Persian month names
    ###########################################################################
    month_name_map = {
        1: "ژانویه", 2: "فوریه", 3: "مارس", 4: "آوریل",
        5: "مه", 6: "ژوئن", 7: "ژوئیه", 8: "اوت",
        9: "سپتامبر", 10: "اکتبر", 11: "نوامبر", 12: "دسامبر"
    }

    ###########################################################################
    # 3) parse_date: from "YYYY-MM-DD" or "YYYY/MM/DD" -> (persianYear, persianMonth, persianDay)
    ###########################################################################
    def parse_date(date_str):
        # Convert '-' to '/' so either 2025-03-14 or 2025/03/14 works
        date_str = date_str.replace('-', '/')
        year_ascii, month_ascii, day_ascii = date_str.split('/')

        year_num = int(year_ascii)
        month_num = int(month_ascii)
        day_num = int(day_ascii)

        # Convert year & day to Persian digits
        year_persian = to_persian_digits(str(year_num))
        day_persian = to_persian_digits(str(day_num))

        # Convert month_num to Persian month name
        month_persian = month_name_map[month_num]

        return year_persian, month_persian, day_persian

    ###########################################################################
    # 4) select_date function: picks date in react-multi-date-picker with debugging
    ###########################################################################
    def select_date(input_index, date_str):
        print(f"[DEBUG] Selecting date for input {input_index} with date string '{date_str}'")
        py, pm, pd = parse_date(date_str)
        print(f"[DEBUG] Parsed date: Year: {py}, Month: {pm}, Day: {pd}")
        try:
            # 1) Click the input to open the date picker
            input_field = WebDriverWait(driver, 20).until(
                EC.element_to_be_clickable((By.XPATH, f"(//input[contains(@class, 'rmdp-input')])[{input_index}]"))
            )
            driver.execute_script("arguments[0].scrollIntoView(true);", input_field)
            print("[DEBUG] Found input field. Clicking to open date picker.")
            ActionChains(driver).move_to_element(input_field).click().perform()
            time.sleep(1)  # Allow time for the date picker to open

            # 2) Wait for the date picker to be visible
            date_picker = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.CLASS_NAME, "rmdp-calendar"))
            )
            print("[DEBUG] Date picker is now visible.")

            # 3) Click the year switch element to move to year selection view
            year_switch = WebDriverWait(date_picker, 10).until(
                EC.element_to_be_clickable(
                    (By.XPATH, ".//span[@tabindex='0' and string-length(normalize-space(text()))=4]")
                )
            )
            print("[DEBUG] Found year switch element. Clicking to switch to year selection.")
            year_switch.click()
            time.sleep(0.5)

            # 4) Select the desired year
            print(f"[DEBUG] Attempting to select year: {py}")
            year_el = WebDriverWait(date_picker, 10).until(
                EC.element_to_be_clickable(
                    (By.XPATH, f".//div[contains(@class, 'rmdp-ym')]//span[normalize-space(text())='{py}']")
                )
            )
            print("[DEBUG] Year element found. Clicking on year.")
            year_el.click()
            time.sleep(0.5)

            # 5) Click the month switch element to display the full month list
            print("[DEBUG] Clicking the month switch element so we can select the correct month.")
            month_switch = WebDriverWait(date_picker, 10).until(
                EC.element_to_be_clickable(
                    (By.XPATH, ".//span[@tabindex='0' and contains(@style,'cursor: pointer') and string-length(normalize-space(text()))<6]")
                )
            )
            month_switch.click()
            time.sleep(0.5)

            # 6) Select the desired month
            print(f"[DEBUG] Attempting to select month: {pm}")
            month_el = WebDriverWait(date_picker, 10).until(
                EC.element_to_be_clickable(
                    (By.XPATH, f".//div[contains(@class, 'rmdp-month-picker')]//span[text()='{pm}']")
                )
            )
            print("[DEBUG] Month element found. Clicking on month.")
            month_el.click()
            time.sleep(0.5)

            # 7) Finally, select the day
            print(f"[DEBUG] Attempting to select day: {pd}")
            day_el = WebDriverWait(date_picker, 10).until(
                EC.element_to_be_clickable(
                    (By.XPATH, f".//div[contains(@class,'rmdp-day-picker')]//span[text()='{pd}']")
                )
            )
            print("[DEBUG] Day element found. Clicking on day.")
            day_el.click()
            time.sleep(1)

            print("[DEBUG] Date selection complete.")
        except Exception as e:
            print(f"[ERROR] Error during date selection: {e}")
            raise e

    ###########################################################################
    # Create the driver within this scope
    ###########################################################################
    chrome_options = Options()
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--ignore-certificate-errors")

    driver = webdriver.Chrome(options=chrome_options)

    try:
        # 1) Open site & wait for manual login
        driver.get("https://ntsw.ir")
        print("Browser opened. Please log in manually.")

        WebDriverWait(driver, 300).until(
            EC.presence_of_element_located((By.ID, "tokenInfo"))
        )
        print("Manual login detected.")

        # 2) Select 'بازرگان' role & confirm
        WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.ID, "select2-roleSelector-container"))
        ).click()
        WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.XPATH, "//li[contains(text(), 'بازرگان')]"))
        ).click()
        print("Role 'بازرگان' selected.")

        WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.ID, "btnAccept"))
        ).click()
        WebDriverWait(driver, 20).until(
            EC.invisibility_of_element_located((By.CLASS_NAME, "modal-content"))
        )

        # 3) Navigate to externalTradeFileManagement
        driver.get("https://www.ntsw.ir/Users/AC/Commercial/externalTradeFileManagement")
        WebDriverWait(driver, 30).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "tbody.ant-table-tbody > tr"))
        )

        # 4) Find invoice row & click 'جزئیات'
        invoice_number = order_data["proforma_invoice_number"].strip().lower()
        matched = False
        max_attempts = 3
        attempt = 0

        while attempt < max_attempts and not matched:
            rows = WebDriverWait(driver, 30).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, "tbody.ant-table-tbody > tr"))
            )
            print(f"[DEBUG] Attempt {attempt + 1}: Checking {len(rows)} rows for invoice '{invoice_number}'")
            for row in rows:
                cells = row.find_elements(By.TAG_NAME, "td")
                if len(cells) >= 3:
                    cell_value = cells[2].text.strip().lower()
                    print(f"[DEBUG] Found invoice in row: '{cell_value}'")
                    if cell_value == invoice_number:
                        details_btn = WebDriverWait(row, 10).until(
                            EC.element_to_be_clickable((By.XPATH, ".//button[contains(text(),'جزئیات')]"))
                        )
                        driver.execute_script("arguments[0].click();", details_btn)
                        matched = True
                        print("[DEBUG] Invoice found and details button clicked.")
                        break
            if not matched:
                attempt += 1
                print(f"[DEBUG] Invoice not found on attempt {attempt}. Retrying after a brief pause...")
                time.sleep(2)

        if not matched:
            raise Exception(f"Invoice '{invoice_number}' not found after {max_attempts} attempts.")

        # Click 'ویرایش پرونده'
        edit_button = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'ویرایش پرونده')]"))
        )
        driver.execute_script("arguments[0].click();", edit_button)

        # Close the 'بستن' popup
        close_button = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'بستن')]"))
        )
        driver.execute_script("arguments[0].click();", close_button)

        # 5) Fill date pickers
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "section.admin-layout"))
        )

        select_date(1, order_data["proforma_invoice_date"])    # تاریخ صدور پیش فاکتور
        select_date(2, order_data["proforma_invoice_exp_date"]) # تاریخ اعتبار پیش فاکتور

        # 6) Click 'بعدی'
        next_button = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'بعدی')]"))
        )
        driver.execute_script("arguments[0].scrollIntoView(true);", next_button)
        next_button.click()

        return {"status": "success", "message": "Dates selected and proceeded to next step."}

    except Exception as e:
        print("Error occurred:", e)
        return {"status": "error", "message": str(e)}

    finally:
        # Uncomment the following line to close the browser automatically after execution
        # driver.quit()
        pass
