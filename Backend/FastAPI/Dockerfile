# Базовый образ Python
FROM python:3.10-slim

# Обновим pip
RUN pip install --upgrade pip

# Создадим рабочую директорию
WORKDIR /app

# Копируем зависимости
COPY requirements.txt .

# Установка зависимостей
RUN pip install --no-cache-dir -r requirements.txt

# Копируем код проекта
COPY . .

# Открываем порт (по умолчанию 8000)
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
