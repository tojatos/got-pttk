#!/bin/bash -e
cd "$(dirname "$0")"

[[ -f .venv.lock ]] && exit 0

python3 -m venv .venv &&
  source .venv/bin/activate &&
  pip install --upgrade pip &&
  pip install -r requirements.txt &&
  python manage.py migrate &&
  python manage.py loaddata data.yaml &&
  deactivate

touch .venv.lock
