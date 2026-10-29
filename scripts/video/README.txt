DIGITX mission film export

This export reads the approved native SVG story without changing the website.
3840 x 2160, 60 frames/second, 64 seconds, H.264 CRF 16, Rec.709.
The 1480 x 800 artwork keeps its proportions within the 16:9 frame.

Timeline
0-48 s: approved story timeline
48-53 s: reading hold, with Kepler orb and border still moving
53-54 s: transition
54-59.45 s: original CHILI logo trace, fill, gloss, settle and contact reveal
59.45-62.5 s: contact hold
62.5-64 s: fade

Dependencies
Node; ffmpeg; Python with PyGObject/Rsvg, pycairo, numpy, scipy,
fonttools, brotli and svgpathtools. The site supplies licensed Inter.
No source-deck font binaries are used.

Preparation (from repository root)
python scripts/video/prepare-export.py ~/Downloads/CHILI-9-0-LS-Oct-22.html

By default temporary files live in /tmp/digitx-video-export.
Set DIGITX_EXPORT_DIR to use another directory.

Silent picture render
python scripts/video/render-video.py --output /tmp/digitx-video-export/film.mp4

Optional parallel rendering
Use --start and --end with frame indices, then ffmpeg's concat demuxer
with -c copy. Each segment uses the same fixed 60 fps clock and encoding.
The complete film has 3840 frames. No browser capture or interpolated frames.

Native still review
python scripts/video/render-video.py --still 48 --output /tmp/digitx-video-export/check.png

Music
python scripts/video/compose-score.py
Original synthesised stereo instrumental. No external recording or samples.
The delivered version raises the original score by 6.72 dB to approximately
-21 LUFS, preserving its dynamics and leaving room for spoken presentation.
Mux with AAC 320 kb/s, 48 kHz; copy the video stream without recompression.

Provenance
The people, reports and measurements are fictional teaching examples.
The Kepler dialogue is an authored research concept, not an executed run.
The original logo artwork and motion are reused from the PI's CHILI deck.
Thinking Orbs uses the existing MIT-licensed geometry vendored by the site.
