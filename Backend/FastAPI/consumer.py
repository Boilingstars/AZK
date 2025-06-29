from kafka import KafkaConsumer
import json
from your_notification_service import send_push_notification

consumer = KafkaConsumer(
    "apartment_price_updates",
    bootstrap_servers="kafka-broker:9092",
    auto_offset_reset='earliest',
    value_deserializer=lambda x: json.loads(x.decode('utf-8'))
)

for message in consumer:
    data = message.value
    # Формируем текст уведомления
    notification_text = (
        f"Цена изменена для квартиры {data['rooms']}-к, {data['address']}. "
        f"Новая цена: {data['new_total_price']} руб. ({data['new_price_per_sqm']} руб./м²)"
    )
    
    # Отправляем уведомление (реализация зависит от вашего сервиса уведомлений)
    send_push_notification(
        title="Обновление цены квартиры",
        message=notification_text,
        data=data
    )