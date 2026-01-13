"""
merge_logboek.py

Gebruik: sla de live site HTML op als `live.html` (view-source of Save Page As -> HTML)
Plaats dit script in de repo en run:

  python -m pip install beautifulsoup4 lxml
  python scripts\merge_logboek.py --local index.html --live live.html --out merged-index.html

Het script vervangt in `index.html` de sections met id's `logboek-clement` en `logboek-brands`
met de corresponderende sections uit `live.html` en schrijft `merged-index.html`.

Deze tool is veilig en werkt offline; je moet zelf de live HTML downloaden (geen credentials vereist).
"""

import argparse
from bs4 import BeautifulSoup


def load_html(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()


def write_html(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)


def replace_logboek_sections(local_html, live_html):
    local_soup = BeautifulSoup(local_html, 'lxml')
    live_soup = BeautifulSoup(live_html, 'lxml')

    ids = ['logboek-clement', 'logboek-brands']
    replaced = []

    for id_ in ids:
        local_sec = local_soup.find('section', id=id_)
        live_sec = live_soup.find('section', id=id_)
        if live_sec and local_sec:
            # Replace local section with live section
            local_sec.replace_with(live_sec)
            replaced.append(id_)
        elif live_sec and not local_sec:
            # Append live section near end of body if local missing
            body = local_soup.body
            if body:
                body.append(live_sec)
                replaced.append(id_)
        else:
            # nothing to replace
            pass

    return str(local_soup), replaced


def main():
    p = argparse.ArgumentParser(description='Merge logboek sections from live HTML into local index.html')
    p.add_argument('--local', required=True, help='Path to local index.html')
    p.add_argument('--live', required=True, help='Path to downloaded live HTML (live.html)')
    p.add_argument('--out', default='merged-index.html', help='Output merged file')
    args = p.parse_args()

    local_html = load_html(args.local)
    live_html = load_html(args.live)

    merged_html, replaced = replace_logboek_sections(local_html, live_html)

    write_html(args.out, merged_html)

    print(f"Merged written to: {args.out}")
    if replaced:
        print('Replaced sections:')
        for r in replaced:
            print(' -', r)
    else:
        print('No matching logboek sections found in live HTML. No replacements made.')


if __name__ == '__main__':
    main()
