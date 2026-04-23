##Налаштування проєкту

1. Клонуйте репозиторій:
   ```bash
   git clone <your-repo-url>
   cd maryco-backend
   ```

2. Створіть віртуальне середовище:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

3. Встановіть залежності:
   ```bash
   pip install -r requirements.txt
   ```

4. **Створіть `.env` файл** на основі `.env.example`:
   ```bash
   cp .env.example .env
   ```

5. Заповніть `.env` реальними даними

6. **Синхронізуйте міграції (НЕ змінює БД!):**
   ```bash
   python manage.py migrate --fake-initial
   ```

7. Запустіть сервер:
   ```bash
   python manage.py runserver
   - API: http://127.0.0.1:8000/api/
   - Admin: http://127.0.0.1:8000/admin/
   - Swagger: http://127.0.0.1:8000/swagger/
   ```