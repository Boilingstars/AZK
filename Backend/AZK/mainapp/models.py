from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
# from kafka import KafkaProducer
import json

class Developers(models.Model):
    name = models.CharField(
        max_length=255,
        verbose_name='Название застройщика'
    )
    rate = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        verbose_name='Рейтинг застройщика'
    )
    reviews = models.IntegerField(
        default=0,
        verbose_name='Количество отзывов'
    )
    description = models.TextField(
        max_length=512,
        verbose_name='Описание'
    )
    projects_in_progress = models.IntegerField(
        default=0,
        verbose_name='Количество проектов в работе'
    )
    projects_completed = models.IntegerField(
        default=0,
        verbose_name='Количество завершенных проектов'
    )
    year = models.PositiveIntegerField(
        verbose_name='Год основания'
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Застройщик'
        verbose_name_plural = 'Застройщики'


class Neighborhoods(models.Model):
    name = models.CharField(
        max_length=255,
        verbose_name='Название жилого комплекса'
    )
    rate = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        verbose_name='Рейтинг'
    )
    reviews = models.IntegerField(
        default=0,
        verbose_name='Количество отзывов'
    )
    description = models.TextField(
        max_length=512,
        verbose_name='Описание'
    )
    number_of_apartments = models.IntegerField(
        default=0,
        verbose_name='Количество квартир'
    )
    developer = models.ForeignKey(
        Developers,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Застройщик'
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Жилой комплекс'
        verbose_name_plural = 'Жилые комплексы'


class Sales(models.Model):
    name = models.CharField(
        max_length=255,
        verbose_name='Название скидки'
    )
    description = models.TextField(
        max_length=512,
        verbose_name='Описание'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата обновления'
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Скидка'
        verbose_name_plural = 'Скидки'


class Apartments(models.Model):
    OFFER_CHOICES = [
        ('equity', 'Долевое участие'),
        ('free', 'Свободная продажа'),
        ('assignment', 'Переуступка'),
    ]
    FINISHING_CHOICES = [
        ('none', 'Без отделки'),
        ('rough', 'Черновая'),
        ('fine', 'Чистовая'),
        ('designer', 'Дизайнерская'),
    ]
    YES_NO_CHOICES = [
        ('yes', 'Да'),
        ('no', 'Нет'),
    ]
    total_price = models.PositiveIntegerField(
        verbose_name='Текущая общая цена'
    )
    price_per_sqm = models.PositiveIntegerField(
        verbose_name='Цена за квадратный метр'
    )
    offer_model = models.CharField(
        null=True,
        max_length=64,
        choices=FINISHING_CHOICES,
        verbose_name='Тип сделки'
    )
    price_difference_percent = models.DecimalField(
        null=True,
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(-100), MaxValueValidator(100)],
        verbose_name='Отклонение от рыночной цены (%)'
    )
    rooms = models.PositiveSmallIntegerField(
        verbose_name='Количество комнат',
        help_text='Для студии укажите 0'
    )
    total_area = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        verbose_name='Площадь (кв.м)'
    )
    living_area = models.DecimalField(
        null=True,
        max_digits=6,
        decimal_places=2,
        verbose_name='Площадь (кв.м)'
    )
    kitchen_area = models.DecimalField(
        null=True,
        max_digits=6,
        decimal_places=2,
        verbose_name='Площадь (кв.м)'
    )
    mortgage = models.CharField(
        null=True,
        max_length=64,
        choices=YES_NO_CHOICES,
        verbose_name='Ипотека'
    )
    floor = models.PositiveSmallIntegerField(
        verbose_name='Этаж'
    )
    total_floors = models.PositiveSmallIntegerField(
        verbose_name='Всего этажей в доме'
    )
    finishing = models.CharField(
        max_length=20,
        choices=FINISHING_CHOICES,
        verbose_name='Тип отделки'
    )
    address = models.TextField(
        verbose_name='Адрес'
    )
    neighborhood = models.ForeignKey(
        Neighborhoods,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='ЖК'
    )
    developer = models.ForeignKey(
        Developers,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Застройщик'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата обновления'
    )
    is_house_done = models.CharField(
        null=True,
        max_length=64,
        choices=YES_NO_CHOICES,
        verbose_name='Сдан ли дом?'
    )
    sales = models.ManyToManyField(
        Sales,
        blank=True,
        verbose_name='Застройщик'
    )

    def __str__(self):
        return f"Квартира {self.rooms}-к, {self.total_area} кв.м, {self.floor}/{self.total_floors} этаж"

    class Meta:
        verbose_name = 'Квартира'
        verbose_name_plural = 'Квартиры'
        ordering = ['-created_at']

    # def save(self, *args, **kwargs):
    #     if self.pk:
    #         old_instance = Apartments.objects.get(pk=self.pk)
    #
    #         if (old_instance.price_per_sqm != self.price_per_sqm or
    #             old_instance.total_price != self.total_price):
    #
    #             producer = KafkaProducer(
    #                 bootstrap_servers="kafka-broker:9092",
    #                 value_serializer=lambda v: json.dumps(v).encode('utf-8')
    #             )
    #
    #             data = {
    #                 'apartment_id': self.id,
    #                 'old_price_per_sqm': old_instance.price_per_sqm,
    #                 'new_price_per_sqm': self.price_per_sqm,
    #                 'old_total_price': old_instance.total_price,
    #                 'new_total_price': self.total_price,
    #                 'address': self.address,
    #                 'rooms': self.rooms
    #             }
    #
    #             try:
    #                 producer.send("apartment_price_updates", value=data)
    #                 producer.flush()
    #             except Exception as e:
    #                 print(f"Failed to send to Kafka: {e}")
    #
    #     super().save(*args, **kwargs)

