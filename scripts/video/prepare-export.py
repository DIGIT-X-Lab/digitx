"""Extract the approved logo artwork and use the site's licensed Inter font."""
import argparse
import base64
import json
import os
from pathlib import Path
from fontTools.ttLib import TTFont

parser = argparse.ArgumentParser()
parser.add_argument('deck', type=Path)
args = parser.parse_args()
work = Path(os.environ.get('DIGITX_EXPORT_DIR', '/tmp/digitx-video-export'))
work.mkdir(parents=True, exist_ok=True)
source = args.deck.read_text()
start = source.index('const originalTrace = ') + len('const originalTrace = ')
end = source.index(';', start)
traces = json.loads(source[start:end])
(work / 'logo-traces.json').write_text(json.dumps(traces))
start = source.index('>', source.index('id="deck-data"')) + 1
end = source.index('</script>', start)
deck = json.loads(source[start:end])
artwork = next(slide for slide in deck['slides'] if slide['layout'] == 'digitx-closing')['body']['brandImage']
(work / 'original-brandImage.png').write_bytes(base64.b64decode(artwork.split(',', 1)[1]))
fonts = work / 'fonts'
fonts.mkdir(exist_ok=True)
repo = Path(__file__).resolve().parents[2]
font = TTFont(repo / 'public/fonts/inter-latin-wght-normal.woff2')
font.flavor = None
font.save(fonts / 'Inter.ttf')
(work / 'fonts.conf').write_text(f'<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><dir>{fonts}</dir><cachedir>{work}/fontcache</cachedir></fontconfig>')
print(f'Prepared {len(traces)} original trace paths, logo artwork and licensed Inter in {work}')
