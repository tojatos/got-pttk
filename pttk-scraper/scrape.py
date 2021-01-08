import nltk
import yaml
import requests
from bs4 import BeautifulSoup
import itertools

flatten = itertools.chain.from_iterable

base_url = 'http://www.ktg.hg.pl/komisja-tg/got/'
main_html = 'got.html'
pttk_url = base_url + main_html

good_similiarity_percentage = 0.69  # similiar enough looking at the data


def save_data(filename, data):
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(data)


def save_yaml(filename, data):
    save_data(filename, yaml.dump(data, allow_unicode=True))


def get_groups_with_url():
    r = requests.get(pttk_url)
    soup = BeautifulSoup(r.content, 'html.parser')
    groups = soup.find_all(lambda tag: tag.name == 'strong' and tag.find_parent('a'))
    groups_with_url = [(x.text, base_url + x.find_parent('a').attrs['href']) for x in groups]
    return groups_with_url


def get_connections(tag):
    conn_info_tags = tag.find_next('table').find_all(lambda tag: tag.name == 'tr' and tag.find('td', class_='got1'))
    conn_groups = [(x.find('td', class_='got1').text.strip(), x.find_all('td')[-1].text) for x in conn_info_tags]
    return conn_groups


def get_points(url):
    req = requests.get(url)
    soup = BeautifulSoup(req.content, 'html.parser')
    point_tags = soup.find_all(lambda tag: (tag.name == 'strong' or tag.name == 'b') and tag.find_parent('td'))
    points = {x.text.strip(): get_connections(x) for x in point_tags}
    return points


def get_similiarity(s1: str, s2: str):
    max_len = max(len(s1), len(s2))
    similiarity_percentage = (max_len - nltk.edit_distance(s1, s2)) / max_len
    return similiarity_percentage


groups_with_url = get_groups_with_url()
groups_with_points = {group: get_points(url) for group, url in groups_with_url}
points = set(flatten(groups_with_points.values()))
groups = groups_with_points.keys()

def save_connections():
    connections = []

    for g, v in groups_with_points.items():
        print(f'Parsing {g} ...')
        for point, conn_list in v.items():
            for conn in conn_list:
                name, pts = conn

                if '/' not in pts:
                    continue  # skip one sided for simplicity

                closest_match = max(points, key=lambda x: get_similiarity(x, name))

                sim = get_similiarity(closest_match, name)
                if sim < good_similiarity_percentage:
                    continue

                pts_s = pts.split('/')
                connections.append({
                    'pointsFrom': pts_s[0],
                    'pointsTo': pts_s[1],
                    'from': point,
                    'to': closest_match,
                    'mount_group': g,
                })
                # print(name)
                # print(sim)
                # print('Closest match: ' + closest_match)
    save_yaml('connections.yaml.old', connections)

# save_data('points.txt', '\n'.join(points))
# save_data('groups.txt', '\n'.join(groups))

