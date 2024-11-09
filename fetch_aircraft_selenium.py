from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Set up Chrome options and service
chrome_options = Options()
chrome_options.add_argument("--ignore-certificate-errors")  # Ignore SSL errors
chrome_options.add_argument("--ignore-ssl-errors")  # Additional SSL ignore setting
chrome_options.add_argument("--disable-blink-features=AutomationControlled")  # Bypass automation controls
chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36")  # Set user agent

service = Service('chromedriver.exe')
driver = webdriver.Chrome(service=service, options=chrome_options)

try:
    # Open the ADS-B Exchange website
    driver.get("https://globe.adsbexchange.com/")
    WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.TAG_NAME, 'body')))

    # Wait and locate an aircraft icon on the map (modify the selector if needed)
    aircraft_icon = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, ".leaflet-marker-icon"))
    )
    aircraft_icon.click()
    time.sleep(5)  # Wait for the aircraft details to load in the sidebar

    # Extract altitude and speed after selecting the aircraft
    altitude_element = driver.find_element(By.XPATH, '/html/body/div[1]/div[3]/div[2]/div[12]/div[1]/div[1]/span')
    speed_element = driver.find_element(By.XPATH, '/html/body/div[1]/div[3]/div[2]/div[16]/div[1]/div[1]/span')
    
    altitude = altitude_element.text
    speed = speed_element.text

    print(f"Altitude: {altitude}")
    print(f"Speed: {speed}")

except Exception as e:
    print(f"An error occurred: {e}")

finally:
    driver.quit()
