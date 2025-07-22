# automation.py

import logging
from decimal import Decimal

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import (
    StaleElementReferenceException,
    TimeoutException,
    WebDriverException
)
from selenium.webdriver.common.action_chains import ActionChains

# ---------- Tunables ----------
LOGIN_TIMEOUT      = 180
PAGE_TIMEOUT       = 30
NO_RESULT_TIMEOUT  = 15
TARGET_MENU        = "کاربر"
TARGET_SUBLINK     = "دور اظهاری واردات"
TABLE_LOC          = (By.CSS_SELECTOR, "table.dataTable")
# --------------------------------

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
# you can configure handlers/formatters as needed in your Django settings

class EPLAutomator:
    def __init__(self):
        logger.info("Launching Chrome")
        chrome_opts = Options()
        chrome_opts.add_argument("--start-maximized")
        self.driver = webdriver.Chrome(options=chrome_opts)
        self.wait = WebDriverWait(self.driver, LOGIN_TIMEOUT)
        self.search_input = None
        self.adv_button = None

    def login(self, url="https://epl.irica.ir"):
        logger.info("Navigating to EPL login page")
        self.driver.get(url)

        logger.debug("Waiting for main sidebar")
        self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.sidebar.app-aside")))
        logger.info("Logged in / main sidebar detected")

        # open the “کاربر → دور اظهاری واردات” flow
        logger.debug("Clicking main menu '%s'", TARGET_MENU)
        self.wait.until(EC.element_to_be_clickable((
            By.XPATH, f"//span[normalize-space(text())='{TARGET_MENU}']"
        ))).click()

        logger.debug("Clicking sublink '%s'", TARGET_SUBLINK)
        self.wait.until(EC.element_to_be_clickable((
            By.XPATH, f"//a[normalize-space(text())='{TARGET_SUBLINK}']"
        ))).click()

        logger.debug("Waiting for advanced search form to appear")
        self.wait.until(EC.presence_of_element_located((
            By.XPATH,
            "//form[contains(@wicketpath,'kartabl_serachForm') and contains(@class,'container-fluid')]"
        )))

        # cache the search input + button
        self.search_input = self.driver.find_element(By.NAME, "searchInput")
        self.adv_button   = self.driver.find_element(By.NAME, "advSearchButton")

    def _scrape_stage(self, timeout=NO_RESULT_TIMEOUT):
        def _get_active_text(d):
            spans = d.find_elements(By.CSS_SELECTOR, "span[wicketpath*='stepNameactive']")
            for span in spans:
                txt = span.text.strip()
                if txt:
                    return txt
            return None

        return WebDriverWait(self.driver, timeout).until(_get_active_text)

    def _open_show_ezhar_tab(self):
        wait = self.wait
        logger.debug("Locating wizard container")
        wizard = wait.until(EC.visibility_of_element_located((
            By.XPATH,
            "//div[contains(@class,'portlet box blue')][.//div[contains(@class,'tab-row')]]"
        )))

        logger.debug("Looking for 'نمایش اظهارنامه' link")
        link = wizard.find_element(By.XPATH,
            ".//div[contains(@class,'tab-row')]"
            "//span[normalize-space(text())='نمایش اظهارنامه']/ancestor::a"
        )

        logger.debug("Clicking 'نمایش اظهارنامه' link via JS")
        self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", link)
        self.driver.execute_script("arguments[0].click();", link)

        logger.debug("Waiting for overlay to disappear")
        wait.until(EC.invisibility_of_element_located((By.CSS_SELECTOR, "div.blockUI.blockOverlay")))

        logger.debug("Waiting for jamKol span to appear")
        wait.until(EC.visibility_of_element_located((
            By.XPATH,
            "//div[contains(@class,'tab-pane') and contains(@class,'active')]"
            "//span[contains(@wicketpath,'_jamKol')]"
        )))

    def _scrape_jam_kol(self):
        logger.debug("Scraping jamKol")
        span = self.wait.until(EC.visibility_of_element_located((
            By.XPATH,
            "//div[contains(@class,'tab-pane') and contains(@class,'active')]"
            "//span[contains(@wicketpath,'_jamKol')]"
        )))
        return span.text.strip()

    def scrape_one(self, cottage_number):
        """
        Search for a single cottage_number, return either:
          - {"stage": ..., "jam_kol": ...}
          - "NOT_FOUND"
          - "ERROR: wizard timeout"
        """
        logger.info("Processing cottage number %s", cottage_number)
        try:
            # clear & search
            self.search_input.clear()
            self.search_input.send_keys(cottage_number)
            self.adv_button.click()

            # wait for table
            logger.debug("Waiting for results table")
            table = WebDriverWait(self.driver, PAGE_TIMEOUT).until(
                EC.presence_of_element_located(TABLE_LOC)
            )
        except TimeoutException:
            logger.warning("No results table for %s → NOT_FOUND", cottage_number)
            return "NOT_FOUND"
        except WebDriverException as e:
            logger.error("WebDriver error on %s: %s", cottage_number, e)
            return f"ERROR: {e}"

        # look for edit icon
        try:
            edit_icon = table.find_element(By.CSS_SELECTOR, "a.glyphicon-edit")
        except Exception:
            logger.warning("No edit icon for %s → NOT_FOUND", cottage_number)
            return "NOT_FOUND"

        # click edit icon (retry if stale)
        for attempt in range(1, 4):
            try:
                logger.debug("Clicking edit icon (attempt %d)", attempt)
                WebDriverWait(self.driver, PAGE_TIMEOUT).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, "a.glyphicon-edit"))
                ).click()
                break
            except StaleElementReferenceException:
                logger.debug("Stale edit icon, retrying...")
        else:
            logger.error("Failed to click edit icon for %s", cottage_number)
            return "ERROR: cannot click edit"

        # now scrape the wizard
        try:
            stage   = self._scrape_stage()
            self._open_show_ezhar_tab()
            jam_kol = self._scrape_jam_kol()
            logger.info("Got data for %s: stage=%s jam_kol=%s", cottage_number, stage, jam_kol)
            result = {"stage": stage, "jam_kol": jam_kol}
        except TimeoutException:
            logger.error("Wizard timeout for %s", cottage_number)
            result = "ERROR: wizard timeout"

        # close the wizard overlay & wait for the tab pane to vanish
        ActionChains(self.driver).send_keys(Keys.ESCAPE).perform()
        try:
            WebDriverWait(self.driver, PAGE_TIMEOUT).until(
                EC.invisibility_of_element_located((By.CSS_SELECTOR, "div.tab-panel"))
            )
        except TimeoutException:
            logger.debug("Tab-panel still visible after ESCAPE")

        return result

    def close(self):
        logger.info("Shutting down WebDriver")
        self.driver.quit()
