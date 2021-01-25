from datetime import datetime
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
        wait = WebDriverWait(driver, 15)

        def get_menu_btn():
            return driver.find_element_by_xpath("//button[@aria-label='menu']")

        def get_a(name):
            return wait.until(lambda d: driver.find_element_by_xpath(f"//a//*[contains(text(), '{name}')]/.."))

        def get_button(name):
            return wait.until(lambda d: driver.find_element_by_xpath(f"//button//*[contains(text(), '{name}')]/.."))


        driver.find_element(By.NAME, "login").send_keys("selenium_user")
        driver.find_element(By.NAME, "password").send_keys("&WqxCiLJ5!VBx4KBh&vcox8X^zvCbM!")
        driver.find_element_by_xpath("//*[@type='submit']//*[contains(text(), 'Zaloguj')]/..").click()

        # wait for data init
        sleep(10)

        get_a('Zarządzaj odcinkami').click()
        sleep(3)
        get_button('Dodaj').click()
        driver.find_element(By.NAME, "nazwa").send_keys("Testowa nazwa połączenia " + datetime.today().strftime('%Y-%m-%d-%H:%M:%S'))
        sleep(0.5)
        driver.find_element(By.NAME, "punktydo").send_keys(Keys.BACK_SPACE + "12")
        sleep(0.5)
        driver.find_element(By.NAME, "punktyz").send_keys(Keys.BACK_SPACE + "4")
        sleep(0.5)

        new_point_input = driver.find_element_by_id("newPoint")
        new_point_btn = driver.find_element_by_xpath("//button//*[contains(text(), 'Dodaj')]/..")
        # new_point_btn = get_button('Dodaj').click()

        new_point_input.send_keys("Punkt pierwszy")
        new_point_btn.click()
        sleep(0.5)
        new_point_input.clear()
        new_point_input.send_keys("Punkt drugi")
        new_point_btn.click()
        sleep(0.5)
        new_point_input.clear()
        new_point_input.send_keys("Punkt trzeci")
        new_point_btn.click()
        sleep(0.5)

        get_button('Zakończ').click()
        sleep(1)
        get_button('OK').click()

        wait.until(EC.url_contains('/manage-segments'))

        get_menu_btn().click()
        sleep(1)
        get_a('Zaplanuj trasę').click()

        driver.find_element(By.NAME, "routeName").send_keys("Testowa nazwa trasy " + datetime.today().strftime('%Y-%m-%d-%H:%M:%S'))

        target = driver.find_element_by_xpath("//div[@data-rbd-droppable-id='route']")
        search_bar = driver.find_element_by_xpath("//input[@aria-label='search']")

        seg0 = driver.find_element_by_xpath("//div[@data-rbd-draggable-id='segments0']")
        ActionChains(driver).drag_and_drop(seg0, target).perform()

        search_bar.send_keys('Testowa nazw')
        sleep(0.5)
        seg1 = driver.find_element_by_xpath("//div[@data-rbd-draggable-id='segments0']")
        ActionChains(driver).drag_and_drop(seg1, target).perform()

        search_bar.clear()
        search_bar.send_keys('Bieszczady')
        sleep(0.5)
        seg2 = driver.find_element_by_xpath("//div[@data-rbd-draggable-id='segments0']")
        ActionChains(driver).drag_and_drop(seg2, target).perform()

        get_button('Zapisz').click()
        sleep(1)
        get_button('OK').click()
        sleep(1)
        get_button('OK').click()

        wait.until(EC.url_contains('/manage-routes'))
        driver.find_element_by_xpath("//button[@aria-label='delete']").click()
        sleep(1)
        get_button('OK').click()
        sleep(1)
        get_button('OK').click()
        sleep(1)

        get_menu_btn().click()
        get_a('Zarządzaj odcinkami').click()

        wait.until(EC.url_contains('/manage-segments'))
        driver.find_element_by_xpath("//button[@aria-label='delete']").click()
        sleep(1)
        get_button('OK').click()
        sleep(1)
        get_button('OK').click()
        sleep(1)

        get_button('selenium_user').click()
        sleep(1)
        driver.find_element_by_xpath("//li[contains(text(), 'Wyloguj się')]").click()
        sleep(5)

