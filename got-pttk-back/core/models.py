# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Grupagorskaprzodownika(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    grupagorska = models.ForeignKey('Grupagorska', models.DO_NOTHING,
                                    db_column='GrupaGorska')  # Field name made lowercase.
    przodownik = models.ForeignKey('Uzytkownik', models.DO_NOTHING,
                                   db_column='Przodownik')  # Field name made lowercase.

    class Meta:
        db_table = 'GrupaGorskaPrzodownika'
        unique_together = ('grupagorska', 'przodownik')
        verbose_name = 'Grupa górska przodownika'
        verbose_name_plural = 'Grupy górskie przodownika'


class Grupagorska(models.Model):
    nazwa = models.CharField(db_column='Nazwa', max_length=255, primary_key=True)  # Field name made lowercase.

    class Meta:
        db_table = 'GrupaGorska'
        verbose_name = 'Grupa górska'
        verbose_name_plural = 'Grupy górskie'


class Odznaka(models.Model):
    nazwa = models.CharField(db_column='Nazwa', max_length=255, primary_key=True)  # Field name made lowercase.
    wymaganaodznaka = models.ForeignKey('self', models.DO_NOTHING, db_column='WymaganaOdznaka', blank=True,
                                        null=True)  # Field name made lowercase.
    stopien = models.CharField(db_column='Stopien', max_length=255)  # Field name made lowercase.
    wymaganaliczbapunktow = models.IntegerField(db_column='WymaganaLiczbaPunktow')  # Field name made lowercase.
    minimalnywymaganywiek = models.IntegerField(db_column='MinimalnyWymaganyWiek', blank=True,
                                                null=True)  # Field name made lowercase.
    maksymalnywymaganywiek = models.IntegerField(db_column='MaksymalnyWymaganyWiek', blank=True,
                                                 null=True)  # Field name made lowercase.
    innewymagania = models.CharField(db_column='InneWymagania', max_length=255, blank=True,
                                     null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'Odznaka'
        verbose_name = 'Odznaka'
        verbose_name_plural = 'Odznaki'


class Odznakaturysty(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    turysta = models.ForeignKey('Uzytkownik', models.DO_NOTHING, db_column='Turysta')  # Field name made lowercase.
    odznaka = models.ForeignKey(Odznaka, models.DO_NOTHING, db_column='Odznaka')  # Field name made lowercase.
    datazdobycia = models.DateField(db_column='DataZdobycia', blank=True,
                                    null=True)  # Field name made lowercase. This field type is a guess.

    class Meta:
        db_table = 'OdznakaTurysty'
        unique_together = ('turysta', 'odznaka')
        verbose_name = 'Odznaka turysty'
        verbose_name_plural = 'Odznaki turysty'


class Polaczenie(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    punktyz = models.IntegerField(db_column='PunktyZ', blank=True, null=True)  # Field name made lowercase.
    punktydo = models.IntegerField(db_column='PunktyDo', blank=True, null=True)  # Field name made lowercase.
    nazwa = models.CharField(db_column='Nazwa', unique=True, max_length=255, blank=True,
                             null=True)  # Field name made lowercase.
    grupagorska = models.ForeignKey(Grupagorska, models.DO_NOTHING,
                                    db_column='GrupaGorska')  # Field name made lowercase.
    tworca = models.ForeignKey('Uzytkownik', models.DO_NOTHING, db_column='Tworca', blank=True,
                               null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'Polaczenie'
        unique_together = ('nazwa', 'tworca')
        verbose_name = 'Połączenie'
        verbose_name_plural = 'Połączenia'

    def __str__(self):
        tworcaString = f' ({self.tworca.user.username})' if self.tworca is not None else ''
        return f'{self.nazwa}{tworcaString}'


class Polaczenietrasy(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    polaczenieid = models.ForeignKey(Polaczenie, models.DO_NOTHING,
                                     db_column='PolaczenieID')  # Field name made lowercase.
    czypowrotne = models.BooleanField(db_column='CzyPowrotne')  # Field name made lowercase.
    kolejnosc = models.IntegerField(db_column='Kolejnosc')  # Field name made lowercase.
    trasa = models.ForeignKey('Trasa', models.DO_NOTHING, db_column='Trasa', related_name='polaczeniatrasy')  # Field name made lowercase.

    class Meta:
        db_table = 'PolaczenieTrasy'
        verbose_name = 'Połączenie trasy'
        verbose_name_plural = 'Połączenia trasy'


class Potwierdzenieprzebyciatrasy(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    czyprzodownikuczestniczyl = models.IntegerField(db_column='CzyPrzodownikUczestniczyl')  # Field name made lowercase.
    trasa = models.ForeignKey('Trasa', models.DO_NOTHING, db_column='Trasa')  # Field name made lowercase.
    przodownik = models.ForeignKey('Uzytkownik', models.DO_NOTHING,
                                   db_column='Przodownik')  # Field name made lowercase.

    class Meta:
        db_table = 'PotwierdzeniePrzebyciaTrasy'
        unique_together = ('trasa', 'przodownik')
        verbose_name = 'Potwierdzenie przebycia trasy'
        verbose_name_plural = 'Potwierdzenia przebycia trasy'


class Punktpolaczenia(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    kolejnosc = models.IntegerField(db_column='Kolejnosc')  # Field name made lowercase.
    punkttrasy = models.ForeignKey('Punkttrasy', models.DO_NOTHING,
                                   db_column='PunktTrasy')  # Field name made lowercase.
    polaczenieid = models.ForeignKey(Polaczenie, models.CASCADE, db_column='PolaczenieID',
                                     related_name='punktypolaczenia')  # Field name made lowercase.

    class Meta:
        db_table = 'PunktPolaczenia'
        verbose_name = 'Punkt połączenia'
        verbose_name_plural = 'Punkty połączenia'

    def __str__(self):
        return f'{self.kolejnosc} - {self.punkttrasy.nazwa} ({self.polaczenieid.nazwa})'


class Punkttrasy(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    nazwa = models.CharField(db_column='Nazwa', max_length=255)  # Field name made lowercase.
    tworca = models.ForeignKey('Uzytkownik', models.DO_NOTHING, db_column='Tworca', blank=True,
                               null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'PunktTrasy'
        unique_together = ('nazwa', 'tworca')
        verbose_name = 'Punkt trasy'
        verbose_name_plural = 'Punkty trasy'

    def __str__(self):
        return self.nazwa


class Rola(models.Model):
    nazwa = models.CharField(db_column='Nazwa', max_length=255, primary_key=True)  # Field name made lowercase.

    class Meta:
        db_table = 'Rola'
        verbose_name = 'Rola'
        verbose_name_plural = 'Role'

    def __str__(self):
        return f'{self.nazwa}'


class Trasa(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)  # Field name made lowercase.
    datarozpoczecia = models.DateField(db_column='DataRozpoczecia', blank=True,
                                       null=True)  # Field name made lowercase. This field type is a guess.
    datazakonczenia = models.DateField(db_column='DataZakonczenia', blank=True,
                                       null=True)  # Field name made lowercase. This field type is a guess.
    nazwa = models.CharField(db_column='Nazwa', max_length=255)  # Field name made lowercase.
    turysta = models.ForeignKey('Uzytkownik', models.DO_NOTHING, db_column='Turysta')  # Field name made lowercase.
    odznakaturysty = models.ForeignKey('Odznakaturysty', models.DO_NOTHING, db_column='OdznakaTurysty', blank=True,
                                       null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'Trasa'
        verbose_name = 'Trasy'
        verbose_name_plural = 'Trasy'

    def __str__(self):
        return f'{self.nazwa} ({self.turysta.user.username})'


class Uzytkownik(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    jestniepelnosprawny = models.BooleanField(db_column='JestNiepelnosprawny', blank=True,
                                              null=True)  # Field name made lowercase.
    dataurodzenia = models.DateField(db_column='DataUrodzenia', blank=True,
                                     null=True)  # Field name made lowercase. This field type is a guess.
    numerlegitymacji = models.CharField(db_column='NumerLegitymacji', max_length=255, blank=True,
                                        null=True)  # Field name made lowercase.
    rola = models.ForeignKey(Rola, models.DO_NOTHING, db_column='Rola', default='TURYSTA')  # Field name made lowercase.

    class Meta:
        db_table = 'Uzytkownik'
        verbose_name = 'Użytkownik'
        verbose_name_plural = 'Użytkownicy'

    def __str__(self):
        return self.user.username


# https://simpleisbetterthancomplex.com/tutorial/2016/07/22/how-to-extend-django-user-model.html#onetoone
@receiver(post_save, sender=User)
def create_user_uzytkownik(sender, instance, created, **kwargs):
    if created:
        Uzytkownik.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_uzytkownik(sender, instance, **kwargs):
    instance.uzytkownik.save()
