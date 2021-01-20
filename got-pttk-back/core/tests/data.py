test_segment = {
    "id": 1234,
    "nazwa": "Testowe połączenie POST 2",
    "punktyz": 3,
    "punktydo": 5,
    "grupagorska": "Bieszczady",
    "punktypolaczenia": [
        {
            "kolejnosc": 1,
            "punkttrasy": {
                "nazwa": "Adam i Ewa"
            }
        },
        {
            "kolejnosc": 2,
            "punkttrasy": {
                "nazwa": "Babica (728 m)"
            }
        }
    ]
}

updated_segment = {
    "nazwa": "Lepsze Testowe połączenie",
    "punktyz": 4,
    "punktydo": 6,
    "grupagorska": "Bieszczady",
    "punktypolaczenia": [
        {
            "kolejnosc": 2,
            "punkttrasy": {
                "nazwa": "Adam i Ewa"
            }
        },
        {
            "kolejnosc": 1,
            "punkttrasy": {
                "nazwa": "Babica (728 m)"
            }
        }
    ]
}

nonexistent_points_test_segment = {
    "id": 1234,
    "nazwa": "Testowe połączenie POST 2",
    "punktyz": 3,
    "punktydo": 5,
    "grupagorska": "Bieszczady",
    "punktypolaczenia": [
        {
            "kolejnosc": 1,
            "punkttrasy": {
                "nazwa": "Adam i Ewa"
            }
        },
        {
            "kolejnosc": 2,
            "punkttrasy": {
                "nazwa": "Babica (728 m)"
            }
        },
        {
            "kolejnosc": 3,
            "punkttrasy": {
                "nazwa": "Nieistniejący"
            }
        }
    ]
}

test_route = {
    "datarozpoczecia": "2021-01-13",
    "datazakonczenia": None,
    "nazwa": "Testowa trasa 123",
    "polaczeniatrasy": [
        {
            "polaczenieid": 4,
            "czypowrotne": False,
            "kolejnosc": 1
        },
        {
            "polaczenieid": 3,
            "czypowrotne": True,
            "kolejnosc": 2
        }
    ]
}
test_route_empty = {
    "datarozpoczecia": None,
    "datazakonczenia": None,
    "nazwa": "Testowa trasa 234",
    "polaczeniatrasy": []
}
