FROM python:3
WORKDIR /got-pttk-back

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . ./
RUN python manage.py migrate
RUN python manage.py loaddata data.yaml
