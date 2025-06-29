import time
import pandas as pd
import re
import os
from bs4 import BeautifulSoup
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from fake_useragent import UserAgent
import random

def is_valid_listing(url):
    return "sale/flat" in url or "kvartira" in url

# Настройки браузера
def get_driver():
    options = uc.ChromeOptions()
    ua = UserAgent()
    options.add_argument(f"user-agent={ua.random}")
    options.page_load_strategy = "eager"
    options.add_argument("--headless")
    options.add_argument("--disable-blink-features=AutomationControlled")
    return uc.Chrome(options=options)
    
def wait_get_text(driver, xpaths, timeout=10):
    for xpath in xpaths:
        try:
            element = WebDriverWait(driver, timeout).until(EC.presence_of_element_located((By.XPATH, xpath)))
            return element.text.strip()
        except Exception as e:
            continue  # ← важно! продолжаем искать дальше
    return None  # если ни один не подошёл

# Получение ссылок на объявления с лендинга
def get_listing_links(driver, base_url, pages, max_ads_per_page):
    all_links = set()

    for page in range(1, pages + 1):
        url = base_url + f"&p={page}"
        print(f"[→] Обработка страницы {page}: {url}")
        driver.get(url)
        time.sleep(4)

        cards = driver.find_elements(By.XPATH, "//a[contains(@href, '/sale/flat/')]")
        for card in cards:
            href = card.get_attribute("href")
            if href and "/export/pdf/" not in href:
                link = href.split("?")[0]
                all_links.add(link)
                if len(all_links) >= pages * max_ads_per_page:
                    return list(all_links)

    return list(all_links)


# Парсинг одного объявления
def parse_ad(driver, url):
    driver.get(url)

    data = {"Ссылка": url}

    data["Цена"] = wait_get_text(driver,['/html/body/div[2]/div/div/div[2]/div[3]/div/div[1]/div[1]/div[3]/div/div[2]/span','/html/body/div[2]/div/div/div[2]/div[3]/div/div[1]/div[1]/div[2]/div/div[2]/span','/html/body/div[2]/div/div/div[2]/div[3]/div/div[1]/div[1]/div[2]/div/div[1]/span'])
    data["Цена за кв.м"] = wait_get_text(driver, ['/html/body/div[2]/div/div/div[2]/div[3]/div/div[1]/div[3]/div/div/div[1]/span[2]'])
    data["Условия сделки"] = wait_get_text(driver, ['/html/body/div[2]/div/div/div[2]/div[3]/div/div[1]/div[3]/div/div/div[2]/span[2]'])
    data["Ипотека"] = wait_get_text(driver, ['/html/body/div[2]/div/div/div[2]/div[3]/div/div[1]/div[3]/div/div/div[3]/span[2]'])
    
    element = wait_get_text(driver, ['/html/body/div[2]/div/div/div[2]/div[2]/section/div/div/div[1]/div/h1'])
    room = re.search(r'(\d+)-комн', element)
    if room:
        data["Количество комнат"] = room.group(1)
    else:
        data["Количество комнат"] = "0"
  

    data["Комплекс"] = wait_get_text(driver, ['/html/body/div[2]/div/div/div[2]/div[2]/section/div/div/div[1]/div/div/a'])

    data["Застройщик"] = wait_get_text(driver, ['/html/body/div[2]/div/div/div[2]/div[3]/div/div[3]/div[1]/div[2]/div/a/span[2]/h3','/html/body/div[2]/div/div/div[2]/div[2]/div[10]/div[1]/ul/li[2]/a','/html/body/div[2]/div/div/div[2]/div[3]/div/div[3]/div/div/div[1]/div/div[2]/div[1]/div/div/a/span'])

    data["Общая площадь"] = wait_get_text(driver, ['/html/body/div[2]/div/div/div[2]/div[2]/div[4]/div[1]/div[2]/span[2]','/html/body/div[2]/div/div/div[2]/div[2]/div[5]/div[1]/div[2]/span[2]','/html/body/div[2]/div/div/div[2]/div[2]/div[3]/div[1]/div[2]/span[2]'])
    data["Жилая площадь"] = wait_get_text(driver, ['/html/body/div[2]/div/div/div[2]/div[2]/div[4]/div[2]/div[2]/span[2]','/html/body/div[2]/div/div/div[2]/div[2]/div[5]/div[2]/div[2]/span[2]','/html/body/div[2]/div/div/div[2]/div[2]/div[3]/div[2]/div[2]/span[2]'])
    data["Площадь кухни"] = wait_get_text(driver, ['/html/body/div[2]/div/div/div[2]/div[2]/div[4]/div[3]/div[2]/span[2]','/html/body/div[2]/div/div/div[2]/div[2]/div[5]/div[3]/div[2]/span[2]','/html/body/div[2]/div/div/div[2]/div[2]/div[3]/div[3]/div[2]/span[2]'])
    data["Этаж"] = wait_get_text(driver, ['/html/body/div[2]/div/div/div[2]/div[2]/div[4]/div[4]/div[2]/span[2]','/html/body/div[2]/div/div/div[2]/div[2]/div[5]/div[4]/div[2]/span[2]','/html/body/div[2]/div/div/div[2]/div[2]/div[3]/div[4]/div[2]/span[2]'])
    data["Год сдачи"] = wait_get_text(driver, ['/html/body/div[2]/div/div/div[2]/div[2]/div[4]/div[5]/div[2]/span[2]','/html/body/div[2]/div/div/div[2]/div[2]/div[5]/div[5]/div[2]/span[2]','/html/body/div[2]/div/div/div[2]/div[2]/div[3]/div[5]/div[2]/span[2]'])
    data["Дом"] = wait_get_text(driver, ['/html/body/div[2]/div/div/div[2]/div[2]/div[4]/div[6]/div[2]/span[2]','/html/body/div[2]/div/div/div[2]/div[2]/div[5]/div[6]/div[2]/span[2]','/html/body/div[2]/div/div/div[2]/div[2]/div[3]/div[6]/div[2]/span[2]'])
    data["Отделка"] = wait_get_text(driver, ['/html/body/div[2]/div/div/div[2]/div[2]/div[4]/div[7]/div[2]/span[2]','/html/body/div[2]/div/div/div[2]/div[2]/div[5]/div[7]/div[2]/span[2]','/html/body/div[2]/div/div/div[2]/div[2]/div[3]/div[7]/div[2]/span[2]'])

    def get_address_parts(driver):
        parts = []
        for i in range(1, 7):  # a[1] до a[6]
            xpath = f"/html/body/div[2]/div/div/div[2]/div[2]/section/div/div/div[2]/address/div/div/a[{i}]"
            try:
                el = driver.find_element(By.XPATH, xpath)
                text = el.text.strip()
                if text:
                    parts.append(text)
            except NoSuchElementException:
                continue
        return ", ".join(parts)

    data["Полный адрес"] = get_address_parts(driver)
    
    print("[✓] Собраны данные:", data)
    return data


# Основной запуск
def run_parser(base_urls, ads_per_site,pages):
    driver = get_driver()
    results = []

    try:
        for site_name, base_url in base_urls.items():
            print(f"\n▶ Начинаем парсинг: {site_name}")
            links = get_listing_links(driver, base_url, pages, ads_per_site)
            total = len(links)
            print(f"🔗 Найдено {total} ссылок")

            for i, url in enumerate(links, 1):
                print(f"\n📄 [{i}/{total}] Обработка: {url}")
                try:
                    data = parse_ad(driver, url)
                    results.append(data)

                    print(f"✅ Успешно. Собрано {len(results)} объявлений")

                    # Сохраняем каждые 5 записей
                    if len(results) % 5 == 0:
                        filename = f"новостройки({len(results)}).xlsx"
                        df = pd.DataFrame(results)
                        df.to_excel(filename, index=False)
                        print(f"💾 Промежуточно сохранено: {filename}")

                except Exception as e:
                    print(f"[❌] Ошибка при парсинге: {e}")

    finally:
        # Финальное сохранение
        filename = f"новостройки({len(results)}).xlsx"
        df = pd.DataFrame(results)
        df.to_excel(filename, index=False)
        print(f"\n🏁 Завершено. Итоговый файл: {filename}")
        driver.quit()

# URL-лендинги новостроек
base_urls = {"ЦИАН":"https://krasnodar.cian.ru/cat.php?deal_type=sale&engine_version=2&object_type%5B0%5D=2&offer_type=flat&region=4820"}

if __name__ == "__main__":
    run_parser(base_urls, ads_per_site=30, pages= 10)