FROM python:3.14.6-alpine3.24

WORKDIR /app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["fastapi", "run", "--port=8000"]

EXPOSE 8000