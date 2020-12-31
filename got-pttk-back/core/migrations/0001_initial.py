# Generated by Django 3.1.4 on 2020-12-31 05:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Grupagorska',
            fields=[
                ('nazwa', models.CharField(db_column='Nazwa', max_length=255, primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'GrupaGorska',
            },
        ),
        migrations.CreateModel(
            name='Odznaka',
            fields=[
                ('nazwa', models.CharField(db_column='Nazwa', max_length=255, primary_key=True, serialize=False)),
                ('stopien', models.CharField(db_column='Stopien', max_length=255)),
                ('wymaganaliczbapunktow', models.IntegerField(db_column='WymaganaLiczbaPunktow')),
                ('minimalnywymaganywiek', models.IntegerField(blank=True, db_column='MinimalnyWymaganyWiek', null=True)),
                ('maksymalnywymaganywiek', models.IntegerField(blank=True, db_column='MaksymalnyWymaganyWiek', null=True)),
                ('innewymagania', models.CharField(blank=True, db_column='InneWymagania', max_length=255, null=True)),
                ('wymaganaodznaka', models.ForeignKey(blank=True, db_column='WymaganaOdznaka', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='core.odznaka')),
            ],
            options={
                'db_table': 'Odznaka',
            },
        ),
        migrations.CreateModel(
            name='Polaczenie',
            fields=[
                ('id', models.AutoField(db_column='ID', primary_key=True, serialize=False)),
                ('punktyz', models.IntegerField(blank=True, db_column='PunktyZ', null=True)),
                ('punktydo', models.IntegerField(blank=True, db_column='PunktyDo', null=True)),
                ('nazwa', models.CharField(blank=True, db_column='Nazwa', max_length=255, null=True, unique=True)),
                ('grupagorska', models.ForeignKey(db_column='GrupaGorska', on_delete=django.db.models.deletion.DO_NOTHING, to='core.grupagorska')),
            ],
            options={
                'db_table': 'Polaczenie',
            },
        ),
        migrations.CreateModel(
            name='Punkttrasy',
            fields=[
                ('nazwa', models.CharField(db_column='Nazwa', max_length=255, primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'PunktTrasy',
            },
        ),
        migrations.CreateModel(
            name='Rola',
            fields=[
                ('nazwa', models.CharField(db_column='Nazwa', max_length=255, primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'Rola',
            },
        ),
        migrations.CreateModel(
            name='Trasa',
            fields=[
                ('id', models.AutoField(db_column='ID', primary_key=True, serialize=False)),
                ('datarozpoczecia', models.DateField(blank=True, db_column='DataRozpoczecia', null=True)),
                ('datazakonczenia', models.DateField(blank=True, db_column='DataZakonczenia', null=True)),
                ('nazwa', models.CharField(db_column='Nazwa', max_length=255)),
            ],
            options={
                'db_table': 'Trasa',
            },
        ),
        migrations.CreateModel(
            name='Uzytkownik',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='auth.user')),
                ('jestniepelnosprawny', models.BooleanField(blank=True, db_column='JestNiepelnosprawny', null=True)),
                ('dataurodzenia', models.DateField(blank=True, db_column='DataUrodzenia', null=True)),
                ('numerlegitymacji', models.CharField(blank=True, db_column='NumerLegitymacji', max_length=255, null=True)),
                ('rola', models.ForeignKey(db_column='Rola', default='TURYSTA', on_delete=django.db.models.deletion.DO_NOTHING, to='core.rola')),
            ],
            options={
                'db_table': 'Uzytkownik',
            },
        ),
        migrations.CreateModel(
            name='Punktpolaczenia',
            fields=[
                ('id', models.AutoField(db_column='ID', primary_key=True, serialize=False)),
                ('kolejnosc', models.IntegerField(db_column='Kolejnosc')),
                ('polaczenieid', models.ForeignKey(db_column='PolaczenieID', on_delete=django.db.models.deletion.DO_NOTHING, to='core.polaczenie')),
                ('punkttrasy', models.ForeignKey(db_column='PunktTrasy', on_delete=django.db.models.deletion.DO_NOTHING, to='core.punkttrasy')),
            ],
            options={
                'db_table': 'PunktPolaczenia',
            },
        ),
        migrations.CreateModel(
            name='Polaczenietrasy',
            fields=[
                ('id', models.AutoField(db_column='ID', primary_key=True, serialize=False)),
                ('czypowrotne', models.IntegerField(db_column='CzyPowrotne')),
                ('kolejnosc', models.IntegerField(db_column='Kolejnosc')),
                ('polaczenieid', models.ForeignKey(db_column='PolaczenieID', on_delete=django.db.models.deletion.DO_NOTHING, to='core.polaczenie')),
                ('trasa', models.ForeignKey(db_column='Trasa', on_delete=django.db.models.deletion.DO_NOTHING, to='core.trasa')),
            ],
            options={
                'db_table': 'PolaczenieTrasy',
            },
        ),
        migrations.CreateModel(
            name='Potwierdzenieprzebyciatrasy',
            fields=[
                ('id', models.AutoField(db_column='ID', primary_key=True, serialize=False)),
                ('czyprzodownikuczestniczyl', models.IntegerField(db_column='CzyPrzodownikUczestniczyl')),
                ('przodownik', models.ForeignKey(db_column='Przodownik', on_delete=django.db.models.deletion.DO_NOTHING, to='core.uzytkownik')),
                ('trasa', models.ForeignKey(db_column='Trasa', on_delete=django.db.models.deletion.DO_NOTHING, to='core.trasa')),
            ],
            options={
                'db_table': 'PotwierdzeniePrzebyciaTrasy',
                'unique_together': {('trasa', 'przodownik')},
            },
        ),
        migrations.CreateModel(
            name='Odznakaturysty',
            fields=[
                ('id', models.AutoField(db_column='ID', primary_key=True, serialize=False)),
                ('datazdobycia', models.DateField(blank=True, db_column='DataZdobycia', null=True)),
                ('odznaka', models.ForeignKey(db_column='Odznaka', on_delete=django.db.models.deletion.DO_NOTHING, to='core.odznaka')),
                ('turysta', models.ForeignKey(db_column='Turysta', on_delete=django.db.models.deletion.DO_NOTHING, to='core.uzytkownik')),
            ],
            options={
                'db_table': 'OdznakaTurysty',
                'unique_together': {('turysta', 'odznaka')},
            },
        ),
        migrations.CreateModel(
            name='Grupagorskaprzodownika',
            fields=[
                ('id', models.AutoField(db_column='ID', primary_key=True, serialize=False)),
                ('grupagorska', models.ForeignKey(db_column='GrupaGorska', on_delete=django.db.models.deletion.DO_NOTHING, to='core.grupagorska')),
                ('przodownik', models.ForeignKey(db_column='Przodownik', on_delete=django.db.models.deletion.DO_NOTHING, to='core.uzytkownik')),
            ],
            options={
                'db_table': 'GrupaGorskaPrzodownika',
                'unique_together': {('grupagorska', 'przodownik')},
            },
        ),
    ]
