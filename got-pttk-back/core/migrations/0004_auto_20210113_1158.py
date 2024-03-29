# Generated by Django 3.1.4 on 2021-01-13 10:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20210113_1000'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='grupagorska',
            options={'verbose_name': 'Grupa górska', 'verbose_name_plural': 'Grupy górskie'},
        ),
        migrations.AlterModelOptions(
            name='grupagorskaprzodownika',
            options={'verbose_name': 'Grupa górska przodownika', 'verbose_name_plural': 'Grupy górskie przodownika'},
        ),
        migrations.AlterModelOptions(
            name='odznaka',
            options={'verbose_name': 'Odznaka', 'verbose_name_plural': 'Odznaki'},
        ),
        migrations.AlterModelOptions(
            name='odznakaturysty',
            options={'verbose_name': 'Odznaka turysty', 'verbose_name_plural': 'Odznaki turysty'},
        ),
        migrations.AlterModelOptions(
            name='polaczenie',
            options={'verbose_name': 'Połączenie', 'verbose_name_plural': 'Połączenia'},
        ),
        migrations.AlterModelOptions(
            name='polaczenietrasy',
            options={'verbose_name': 'Połączenie trasy', 'verbose_name_plural': 'Połączenia trasy'},
        ),
        migrations.AlterModelOptions(
            name='potwierdzenieprzebyciatrasy',
            options={'verbose_name': 'Potwierdzenie przebycia trasy', 'verbose_name_plural': 'Potwierdzenia przebycia trasy'},
        ),
        migrations.AlterModelOptions(
            name='punktpolaczenia',
            options={'verbose_name': 'Punkt połączenia', 'verbose_name_plural': 'Punkty połączenia'},
        ),
        migrations.AlterModelOptions(
            name='punkttrasy',
            options={'verbose_name': 'Punkt trasy', 'verbose_name_plural': 'Punkty trasy'},
        ),
        migrations.AlterModelOptions(
            name='rola',
            options={'verbose_name': 'Rola', 'verbose_name_plural': 'Role'},
        ),
        migrations.AlterModelOptions(
            name='trasa',
            options={'verbose_name': 'Trasy', 'verbose_name_plural': 'Trasy'},
        ),
        migrations.AlterModelOptions(
            name='uzytkownik',
            options={'verbose_name': 'Użytkownik', 'verbose_name_plural': 'Użytkownicy'},
        ),
        migrations.AlterField(
            model_name='polaczenietrasy',
            name='czypowrotne',
            field=models.BooleanField(db_column='CzyPowrotne'),
        ),
        migrations.AlterField(
            model_name='polaczenietrasy',
            name='polaczenieid',
            field=models.ForeignKey(db_column='PolaczenieID', on_delete=django.db.models.deletion.DO_NOTHING, to='core.polaczenie'),
        ),
        migrations.AlterField(
            model_name='polaczenietrasy',
            name='trasa',
            field=models.ForeignKey(db_column='Trasa', on_delete=django.db.models.deletion.DO_NOTHING, related_name='polaczeniatrasy', to='core.trasa'),
        ),
        migrations.AlterField(
            model_name='punktpolaczenia',
            name='polaczenieid',
            field=models.ForeignKey(db_column='PolaczenieID', on_delete=django.db.models.deletion.DO_NOTHING, related_name='punktypolaczenia', to='core.polaczenie'),
        ),
    ]
