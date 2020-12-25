CREATE TABLE PunktTrasy (
  Nazwa varchar(255) NOT NULL,
  PRIMARY KEY (Nazwa));
CREATE TABLE Polaczenie (
  ID          INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  PunktyZ     integer(10),
  PunktyDo    integer(10),
  Nazwa       varchar(255) UNIQUE,
  GrupaGorska varchar(255) NOT NULL,
  FOREIGN KEY(GrupaGorska) REFERENCES GrupaGorska(Nazwa));
CREATE TABLE Odznaka (
  Nazwa                  varchar(255) NOT NULL,
  WymaganaOdznaka        varchar(255),
  Stopien                varchar(255) NOT NULL,
  WymaganaLiczbaPunktow  integer(10) NOT NULL,
  MinimalnyWymaganyWiek  integer(10),
  MaksymalnyWymaganyWiek integer(10),
  InneWymagania          varchar(255),
  PRIMARY KEY (Nazwa),
  FOREIGN KEY(WymaganaOdznaka) REFERENCES Odznaka(Nazwa));
CREATE TABLE Trasa (
  ID              INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  DataRozpoczecia timestamp,
  DataZakonczenia timestamp,
  Nazwa           varchar(255) NOT NULL,
  JestPlanowana   integer(1) NOT NULL,
  JestOdbywana    integer(1) NOT NULL);
CREATE TABLE Uzytkownik (
  Login               varchar(255) NOT NULL,
  JestNiepelnosprawny integer(1),
  DataUrodzenia       timestamp,
  Imie                varchar(255) NOT NULL,
  Nazwisko            varchar(255) NOT NULL,
  NumerLegitymacji    varchar(255),
  Rola                varchar(255) NOT NULL,
  PRIMARY KEY (Login),
  FOREIGN KEY(Rola) REFERENCES Rola(Nazwa));
CREATE TABLE GrupaGorska (
  Nazwa varchar(255) NOT NULL,
  PRIMARY KEY (Nazwa));
CREATE TABLE PolaczenieTrasy (
  ID           INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  PolaczenieID integer(10) NOT NULL,
  CzyPowrotne  integer(1) NOT NULL,
  Kolejnosc    integer(10) NOT NULL,
  Trasa        integer(10) NOT NULL,
  FOREIGN KEY(PolaczenieID) REFERENCES Polaczenie(ID),
  FOREIGN KEY(Trasa) REFERENCES Trasa(ID));
CREATE TABLE PotwierdzeniePrzebyciaTrasy (
  CzyPrzodownikUczestniczyl integer(1) NOT NULL,
  Trasa                     integer(10) NOT NULL,
  Przodownik                varchar(255) NOT NULL,
  PRIMARY KEY (Trasa,
  Przodownik),
  FOREIGN KEY(Trasa) REFERENCES Trasa(ID),
  FOREIGN KEY(Przodownik) REFERENCES Uzytkownik(Login));
CREATE TABLE PunktPolaczenia (
  ID           INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  Kolejnosc    integer(10) NOT NULL,
  PunktTrasy   varchar(255) NOT NULL,
  PolaczenieID integer(10) NOT NULL,
  FOREIGN KEY(PunktTrasy) REFERENCES PunktTrasy(Nazwa),
  FOREIGN KEY(PolaczenieID) REFERENCES Polaczenie(ID));
CREATE TABLE GropaGorskaPrzodownika (
  GrupaGorska varchar(255) NOT NULL,
  Przodownik  varchar(255) NOT NULL,
  PRIMARY KEY (GrupaGorska,
  Przodownik),
  FOREIGN KEY(GrupaGorska) REFERENCES GrupaGorska(Nazwa),
  FOREIGN KEY(Przodownik) REFERENCES Uzytkownik(Login));
CREATE TABLE OdznakaTurysty (
  Turysta      varchar(255) NOT NULL,
  Odznaka      varchar(255) NOT NULL,
  DataZdobycia timestamp,
  PRIMARY KEY (Turysta,
  Odznaka),
  FOREIGN KEY(Turysta) REFERENCES Uzytkownik(Login),
  FOREIGN KEY(Odznaka) REFERENCES Odznaka(Nazwa));
CREATE TABLE Rola (
  Nazwa varchar(255) NOT NULL,
  PRIMARY KEY (Nazwa));
