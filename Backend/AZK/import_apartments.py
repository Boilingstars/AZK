import os
import django
import pandas as pd
from django.core.exceptions import ObjectDoesNotExist

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AZK.settings')
django.setup()

from mainapp.models import Apartments, Neighborhoods, Developers


def convert_area(area_str):
    if pd.isna(area_str) or area_str == '':
        return None
    cleaned = str(area_str).replace(' м²', '').replace(',', '.')
    try:
        return float(cleaned)
    except ValueError:
        return None


def import_apartments_from_excel(file_path):
    df = pd.read_excel(file_path)

    for _, row in df.iterrows():
        try:
            # Обработка цены
            total_price = int(row['Цена'].replace(' ', '').replace('₽', ''))
            price_per_sqm = int(row['Цена за кв.м'].replace(' ', '').replace('₽/м²', ''))

            # Обработка типа сделки
            offer_model_map = {
                'долевое участие (214-ФЗ)': 'equity',
                'свободная продажа': 'free',
                'переуступка': 'assignment'
            }
            offer_model = offer_model_map.get(row['Условия сделки'], None)

            # Обработка ипотеки
            mortgage_map = {
                'возможна': 'yes',
                'не возможна': 'no'
            }
            mortgage = mortgage_map.get(row['Ипотека'], None)

            # Обработка отделки
            finishing_map = {
                'Без отделки': 'none',
                'Предчистовая': 'rough',
                'Чистовая': 'fine',
                'С отделкой': 'fine',
                'Дизайнерская': 'designer'
            }
            finishing = finishing_map.get(row['Отделка'], 'none')

            # Обработка статуса сдачи дома
            is_house_done_map = {
                'Сдан': 'yes',
                'Не сдан': 'no',
                '': None
            }
            is_house_done = is_house_done_map.get(row['Дом'], None)

            # Обработка этажей
            floor_data = row['Этаж'].split(' из ')
            floor = int(floor_data[0])
            total_floors = int(floor_data[1])

            # Получение ЖК (если существует)
            neighborhood = None
            if pd.notna(row['Комплекс']):
                try:
                    neighborhood = Neighborhoods.objects.get(name=row['Комплекс'])
                except Neighborhoods.DoesNotExist:
                    print(f"ЖК '{row['Комплекс']}' не найден в базе. Поле neighborhood будет пустым.")

            # Получение застройщика (если существует)
            developer = None
            if pd.notna(row['Застройщик']):
                try:
                    developer = Developers.objects.get(name=row['Застройщик'])
                except Developers.DoesNotExist:
                    print(f"Застройщик '{row['Застройщик']}' не найден в базе. Поле developer будет пустым.")

            # Создание записи
            apartment = Apartments(
                total_price=total_price,
                price_per_sqm=price_per_sqm,
                offer_model=offer_model,
                rooms=row['Количество комнат'],
                total_area=convert_area(row['Общая площадь']),
                living_area=convert_area(row['Жилая площадь']),
                kitchen_area=convert_area(row['Площадь кухни']),
                mortgage=mortgage,
                floor=floor,
                total_floors=total_floors,
                finishing=finishing,
                address=row['Полный адрес'],
                neighborhood=neighborhood,
                developer=developer,
                is_house_done=is_house_done
            )
            apartment.save()

            print(f"Добавлена квартира: {apartment}")

        except Exception as e:
            print(f"Ошибка при обработке строки {_}: {str(e)}")


if __name__ == '__main__':
    import_apartments_from_excel('новостройки_исправленные.xlsx')