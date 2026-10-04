import urllib.request
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

audio_dir = r"C:\Users\hyun6\.gemini\antigravity\scratch\awakening-map\audio"
os.makedirs(audio_dir, exist_ok=True)

files_to_download = {
    "christianity_gregorian_chant.ogg": "https://upload.wikimedia.org/wikipedia/commons/f/f2/Dies.irae.ogg",
    "islam_nasheed_adhan.ogg": "https://upload.wikimedia.org/wikipedia/commons/b/b0/Beautiful_adhan.ogg",
    "buddhism_singing_bowl.ogg": "https://upload.wikimedia.org/wikipedia/commons/1/17/Small_tibetan_singing_bowl.ogg"
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'}

for fname, url in files_to_download.items():
    dest = os.path.join(audio_dir, fname)
    print(f"Downloading {fname} from {url}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(dest, 'wb') as out_f:
            out_f.write(resp.read())
        print(f"  -> Saved {dest}, Size: {os.path.getsize(dest)} bytes")
    except Exception as e:
        print(f"  -> Error downloading {fname}: {e}")

print("Download script finished.")
