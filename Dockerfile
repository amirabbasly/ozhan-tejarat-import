# ── backend/Dockerfile ───────────────────────────────────────────────
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app

# system deps just for psycopg - remove after build to keep slim
RUN apt-get update && \
    apt-get install -y build-essential libpq-dev && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy entire Django project
COPY . .

# collect static for Nginx
RUN python manage.py collectstatic --no-input

CMD ["gunicorn", "core.wsgi:application", "-b", "0.0.0.0:8000", "-w", "4", "--timeout", "120"]
