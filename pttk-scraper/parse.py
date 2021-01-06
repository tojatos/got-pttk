import yaml


def save_data(filename, data):
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(data)


def load_data(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        return f.read()


def save_yaml(filename, data):
    save_data(filename, yaml.dump(data, allow_unicode=True))


def load_yaml(filename):
    return yaml.safe_load(load_data(filename))


points = load_data('points.txt').split('\n')
points = [p.replace(' z:', '') for p in points]
groups = load_data('groups.txt').split('\n')
connections = load_yaml('connections.yaml')


def save_groups():
    groups_final = [{
        'model': 'core.grupagorska',
        'pk': g,
        'fields': {},
    } for g in groups]
    save_yaml('groups.yaml', groups_final)


def save_conns():
    conns_final = []
    for i, conn in enumerate(connections):
        try:
            conns_final.append({
                'model': 'core.polaczenie',
                'pk': i + 1,
                'fields': {
                    'punktyz': int(conn['pointsFrom']),
                    'punktydo': int(conn['pointsTo']),
                    'nazwa': f"{conn['from'].replace(' z:', '')} - {conn['to'].replace(' z:', '')}",
                    'grupagorska': conn['mount_group'],
                }})
        except:
            continue
    save_yaml('conns.yaml', conns_final)


def save_points():
    points_final = [{
        'model': 'core.punkttrasy',
        'pk': i + 1,
        'fields': {
            'nazwa': p,
            'tworca': None
        },
    } for i, p in enumerate(points)]
    save_yaml('points.yaml', points_final)

def save_conn_points():
    key = 1
    conns_points_final = []
    for i, conn in enumerate(connections):
        try:
            int(conn['pointsFrom']) # continue if invalid
            int(conn['pointsTo']) # continue if invalid
            c1 = {
                'model': 'core.punktpolaczenia',
                'pk': key,
                'fields': {
                    'kolejnosc': 1,
                    'punkttrasy': points.index(conn['from'].replace(' z:', '')) + 1,
                    'polaczenieid': i + 1,
                }}
            c2 = {
                'model': 'core.punktpolaczenia',
                'pk': key + 1,
                'fields': {
                    'kolejnosc': 2,
                    'punkttrasy': points.index(conn['to'].replace(' z:', '')) + 1,
                    'polaczenieid': i + 1,
                }}
            conns_points_final.append(c1)
            conns_points_final.append(c2)
            key += 2
        except:
            continue
    save_yaml('conn_points.yaml', conns_points_final)

# save_groups()
# save_conns()
# save_points()
save_conn_points()

