from time import sleep

from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Start the driver
if __name__ == '__main__':
    with webdriver.Firefox() as driver:
        driver.maximize_window()
        # Open URL
        driver.get("localhost:3000")

        # Setup wait for later
        wait = WebDriverWait(driver, 10)

        driver.find_element(By.NAME, "login").send_keys("selenium_user")
        driver.find_element(By.NAME, "password").send_keys("&WqxCiLJ5!VBx4KBh&vcox8X^zvCbM!")
        driver.find_element_by_xpath("//*[@type='submit']//*[contains(text(), 'Zaloguj')]/..").click()

        zarzadzaj_odcinkami_btn = wait.until(lambda d: driver.find_element_by_xpath("//a//*[contains(text(), 'Zarządzaj odcinkami')]/.."))
        zarzadzaj_odcinkami_btn.click()

        dodaj_btn = wait.until(lambda d: driver.find_element_by_xpath("//button//*[contains(text(), 'Dodaj')]/.."))
        dodaj_btn.click()

        driver.find_element(By.NAME, "nazwa").send_keys("Testowa nazwa połączenia")
        driver.find_element(By.NAME, "punktydo").send_keys(Keys.BACK_SPACE + "12")
        driver.find_element(By.NAME, "punktyz").send_keys(Keys.BACK_SPACE + "4")

        new_point_input = driver.find_element_by_id("newPoint")
        new_point_btn = driver.find_element_by_xpath("//button//*[contains(text(), 'Dodaj')]/..")

        new_point_input.send_keys("Punkt pierwszy")
        new_point_btn.click()
        new_point_input.clear()
        new_point_input.send_keys("Punkt drugi")
        new_point_btn.click()
        new_point_input.clear()
        new_point_input.send_keys("Punkt trzeci")
        new_point_btn.click()

        #TODO
        # ActionChains(driver).drag_and_drop()


        # zaplanuj_trase_btn = wait.until(lambda d: driver.find_element_by_xpath("//a//*[contains(text(), 'Zaplanuj trasę')]/.."))
        # zaplanuj_trase_btn.click()

        # el = wait.until(lambda d: driver.find_element_by_xpath("//*[@type='submit']"))
        # driver.find_element_by_xpath("//*[@type='submit']").click()
        while True:
            sleep(1000)
