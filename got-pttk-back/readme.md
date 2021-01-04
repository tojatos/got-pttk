## How to run:
### Prepare environment
#### Linux
```bash
./setup_env.sh
source .venv/bin/activate
```
#### Windows
```powershell
python -m venv .venv
.venv/Scripts/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata data.yaml
```

### Run
```bash
python manage.py runserver
```

Auto generate the models:
https://docs.djangoproject.com/en/3.1/howto/legacy-databases/#auto-generate-the-models
