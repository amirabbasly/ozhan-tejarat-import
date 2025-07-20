# automation.py
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

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
# --------------------------------


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
        logging.info("Searching cottage %s", num)
        search_input.clear()
        search_input.send_keys(str(num))
        adv_button.click()

        # 1️⃣  wait for the table OR conclude that no result showed up
        wait = WebDriverWait(driver, NO_RESULT_TIMEOUT)
        try:
            table = wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, "//table[contains(@class,'dataTable')]")
                )
            )
        except TimeoutException:
            logging.warning("No table appeared for %s – skipping.", num)
            continue

        # 2️⃣  find any row that contains a “ویرایش” button
        rows = table.find_elements(
            By.XPATH, ".//tbody/tr[.//a[contains(@class,'glyphicon-edit')]]"
        )
        if not rows:
            logging.info("Empty result for %s – skipping.", num)
            continue

        # 3️⃣  click the first edit glyph
        rows[0].find_element(By.CSS_SELECTOR, "a.glyphicon-edit").click()

        # 4️⃣  scrape the current «مرحله»
        try:
            stage_name = _scrape_stage(driver)
            results[num] = stage_name
            logging.info("Cottage %s is at stage: %s", num, stage_name)
        except TimeoutException:
            logging.error("Edit panel never loaded for %s", num)

        # 5️⃣  optionally close the panel or navigate back, so we can search again
        driver.back()                     # adapts to your navigation pattern
        wait.until(EC.visibility_of(search_input))  # re‑sync

    # you now have a dictionary of cottage → stage
    return results