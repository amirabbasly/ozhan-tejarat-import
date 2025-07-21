# automation.py
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import StaleElementReferenceException, TimeoutException
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import ElementClickInterceptedException

import logging


# ---------- Tunables ----------
LOGIN_TIMEOUT   = 180   # seconds to give the user to log in
PAGE_TIMEOUT    = 30    # seconds to wait for each navigation
TARGET_MENU     = "کاربر"
TARGET_SUBLINK  = "دور اظهاری واردات"
SEARCH_FORM_TIMEOUT = 30   # wait for search form
RESULT_PAUSE        = 2    # seconds to pause between cottage searches
STEP_TIMEOUT       = 40      # max time to wait for edit panel
NO_RESULT_TIMEOUT  = 15      # give the page a little time to say “no rows”
TABLE_LOC = (By.CSS_SELECTOR, "table.dataTable")

# --------------------------------



def _safe_click_edit(row, wait, driver, row_id_xpath):
    # wait for the overlay to go away
    wait.until(EC.invisibility_of_element_located((By.CSS_SELECTOR, "div.blockUI.blockOverlay")))

    for attempt in range(3):
        try:
            icon = row.find_element(By.CSS_SELECTOR, "a.glyphicon-edit")
            wait.until(EC.element_to_be_clickable(icon))
            # bring into view
            driver.execute_script("arguments[0].scrollIntoView({block:'center'});", icon)
            # click via JS to avoid interception
            driver.execute_script("arguments[0].click();", icon)
            return True
        except ElementClickInterceptedException as e:
            logging.warning("Click intercepted on attempt %d: %s", attempt + 1, e)
        except (StaleElementReferenceException, TimeoutException) as e:
            logging.warning("Stale/timeout on attempt %d: %s", attempt + 1, e)
        # if stale, re‑find the row
        row = wait.until(EC.presence_of_element_located((By.XPATH, row_id_xpath)))

    logging.error("Could not click edit icon after 3 attempts")
    return False
def _scrape_stage(driver: webdriver.Remote, timeout: int = 10) -> str:
    """
    Waits until *any* span with wicketpath*='stepNameactive' has **non‑empty**
    text and returns that text.
    """
    def _get_active_text(_driver):
        for span in _driver.find_elements(By.CSS_SELECTOR,
                                          "span[wicketpath*='stepNameactive']"):
            txt = span.text.strip()
            if txt:                 # <-- only accept non‑empty ones
                return txt
        return None                 # keep waiting

    wait = WebDriverWait(driver, timeout)
    return wait.until(_get_active_text)    # raises TimeoutException if none


def start_epl_automation(cottage_numbers):
    """
    Launch EPL, wait for manual login, then navigate to 'دور اظهاری واردات'.
    """
    chrome_opts = Options()
    chrome_opts.add_argument("--start-maximized")
    # Uncomment the next two lines on headless servers
    # chrome_opts.add_argument("--headless=new")
    # chrome_opts.add_argument("--disable-gpu")

    driver = webdriver.Chrome(options=chrome_opts)
    wait   = WebDriverWait(driver, LOGIN_TIMEOUT)

    logging.info("Opening EPL …")
    driver.get("https://epl.irica.ir")

    # 1️⃣  Wait until the dashboard sidebar is visible → user is logged in
    try:
        wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div.sidebar.app-aside"))
        )
    except Exception:
        driver.quit()
        raise RuntimeError("Login timeout—sidebar never appeared.")

    logging.info("Login detected.")

    # 2️⃣  Click the 'کاربر' category to expand its submenu
    try:
        user_menu = wait.until(
            EC.element_to_be_clickable(
                (By.XPATH, f"//span[normalize-space(text())='{TARGET_MENU}']")
            )
        )
        user_menu.click()
        logging.info("Clicked 'کاربر' menu.")
    except Exception:
        driver.quit()
        raise RuntimeError("Could not open 'کاربر' menu.")

    # 3️⃣  Click the 'دور اظهاری واردات' sub‑link
    try:
        sub_link = wait.until(
            EC.element_to_be_clickable(
                (By.XPATH, f"//a[normalize-space(text())='{TARGET_SUBLINK}']")
            )
        )
        sub_link.click()
        logging.info("Clicked 'دور اظهاری واردات'.")
    except Exception:
        driver.quit()
        raise RuntimeError("Could not click sub‑link 'دور اظهاری واردات'.")

      # 4️⃣  Wait until the search form on the “دور اظهاری واردات” page appears
    try:
        wait.until(
            EC.presence_of_element_located(
                (
                    By.XPATH,
                    "//form[contains(@wicketpath,'kartabl_serachForm') and contains(@class,'container-fluid')]",
                )
            )
        )
        logging.info("Search form is visible.")
    except Exception:
        driver.quit()
        raise RuntimeError("Search form did not appear in time.")

    # Locate the text box and the advanced‑search (“جستجو بر اساس فیلدهای اظهار”) button
    search_input = driver.find_element(By.NAME, "searchInput")
    adv_button   = driver.find_element(By.NAME, "advSearchButton")

    results = {}                      #  <-- collect {cottage_number: stage}


    for num in cottage_numbers:
        logging.info("▶ searching %s", num)

        # 1️⃣ search
        search_input = wait.until(EC.element_to_be_clickable((By.NAME, "searchInput")))
        search_input.clear()
        search_input.send_keys(num)
        driver.find_element(By.NAME, "advSearchButton").click()

        # 2️⃣ wait for *new* table
        try:
            table = wait.until(EC.presence_of_element_located(TABLE_LOC))
        except TimeoutException:
            results[num] = "NOT_FOUND"
            continue

        # 3️⃣ locate the FIRST edit icon **RIGHT NOW** (don’t keep the row)
        try:
            edit_icon = table.find_element(By.CSS_SELECTOR, "a.glyphicon-edit")
        except Exception:
            results[num] = "NOT_FOUND"
            continue

                # 4️⃣ click it, letting Selenium retry once if the icon is rebuilt
        for _ in range(2):
            try:
                wait.until(EC.element_to_be_clickable(edit_icon)).click()
                break                         # success – leave the loop
            except StaleElementReferenceException:
                edit_icon = wait.until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "a.glyphicon-edit"))
                )

        # 5️⃣ scrape مرحله  ⇦ now we’re OUTSIDE the for‑loop
        try:
            stage = _scrape_stage(driver, timeout=15)   # 'درب خروج', 'صندوق', …
            results[num] = stage
        except TimeoutException:
            results[num] = "ERROR: wizard timeout"

 
    # you now have a dictionary of cottage → stage
    return results