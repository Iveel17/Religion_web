import urllib.request
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

titles = [
    "File:Dies.irae.ogg",
    "File:Beautiful adhan.ogg",
    "File:Adhan.ogg",
    "File:Small tibetan singing bowl.ogg",
    "File:The sound of a singing bowl.wav",
    "File:Bansuri sample E bass.ogg"
]

pipe_titles = "|".join(titles)
api_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(pipe_titles)}&prop=imageinfo&iiprop=url|size|mime&format=json"

req = urllib.request.Request(api_url, headers={'User-Agent': 'AwakeningMap/1.0 (test@example.com)'})
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    pages = data['query']['pages']
    for k, v in pages.items():
        title = v.get('title')
        if 'imageinfo' in v:
            info = v['imageinfo'][0]
            print(f"Title: {title}")
            print(f"  URL: {info['url']}")
            print(f"  Size: {info['size']} bytes, Mime: {info['mime']}")
