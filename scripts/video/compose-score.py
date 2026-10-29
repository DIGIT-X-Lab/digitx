"""Original instrumental score for the 64-second DIGITX film. No samples."""
from pathlib import Path
import os
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io.wavfile import write

SR = 48000
DURATION = 64
rng = np.random.default_rng(241024)
mix = np.zeros((SR * DURATION, 2), dtype=np.float64)
send = np.zeros_like(mix)
freq = lambda note: 440 * 2 ** ((note - 69) / 12)

def add(sound, start, gain=1, pan=0, wet=.3):
    offset = int(start * SR)
    if offset < 0:
        sound = sound[-offset:]
        offset = 0
    count = min(len(sound), len(mix) - offset)
    if count <= 0:
        return
    stereo = sound[:count, None] * np.array([np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)])[None, :] * gain
    mix[offset:offset + count] += stereo
    send[offset:offset + count] += stereo * wet

def soft_pad(notes, start, duration, strength=.12):
    t = np.arange(int((duration + 3) * SR)) / SR
    envelope = np.minimum(t / 1.5, 1) ** 2 * np.minimum(np.maximum(duration + 3 - t, 0) / 3, 1) ** 2
    for j, note in enumerate(notes):
        f = freq(note)
        phase = rng.uniform(0, np.pi * 2)
        tone = (np.sin(2 * np.pi * f * 1.0007 * t + phase)
                + .7 * np.sin(2 * np.pi * f * .9993 * t + phase + .5)
                + .17 * np.sin(2 * np.pi * f * 2 * t + .22 * np.sin(t * .8))) / 1.87
        tone *= envelope * (.92 + .08 * np.sin(2 * np.pi * .13 * t + j))
        add(tone, start, strength / len(notes), (j / max(1, len(notes) - 1) - .5) * 1.3, .65)

def keys(note, start, strength=.12, pan=0, length=3):
    t = np.arange(int(length * SR)) / SR
    f = freq(note)
    # Soft electric-piano partials with a rounded attack, rather than hard clicks.
    mod = .55 * np.exp(-t * 3.5) * np.sin(2 * np.pi * f * 2 * t)
    tone = (np.sin(2 * np.pi * f * t + mod)
            + .18 * np.sin(2 * np.pi * f * 2.004 * t) * np.exp(-t * 2)
            + .045 * np.sin(2 * np.pi * f * 4.01 * t) * np.exp(-t * 6))
    tone *= (1 - np.exp(-t * 180)) * np.exp(-t * 1.7) * np.minimum((length - t) / .15, 1)
    add(tone, start, strength, pan, .65)

def kick(start, strength=.15):
    t = np.arange(int(.55 * SR)) / SR
    phase = 2 * np.pi * (44 * t + 49 / 35 * (1 - np.exp(-t * 35)))
    sound = np.sin(phase) * np.exp(-t * 12) * (1 - np.exp(-t * 700))
    add(sound, start, strength, 0, .05)

def hat(start, strength=.012, pan=.25, length=.12):
    t = np.arange(int(length * SR)) / SR
    noise = rng.normal(0, 1, len(t))
    noise = sosfilt(butter(2, [5500, 11000], btype='bandpass', fs=SR, output='sos'), noise)
    sound = noise * np.exp(-t * 45) * (1 - np.exp(-t * 1200))
    add(sound, start, strength, pan, .14)

chords = [
    (0, 5.5, [50, 57, 60, 64, 69]),
    (5.5, 6.5, [46, 53, 57, 60, 65]),
    (12, 4, [41, 53, 57, 60, 64]),
    (16, 4, [48, 55, 59, 62, 67]),
    (20, 5, [50, 57, 60, 64, 69]),
    (25, 7, [46, 53, 57, 60, 65]),
    (32, 5.5, [41, 53, 57, 60, 64]),
    (37.5, 5, [48, 55, 59, 62, 67]),
    (42.5, 5.5, [50, 57, 60, 64, 69]),
    (48, 6, [46, 53, 57, 60, 65]),
    (54, 7, [50, 57, 59, 64, 66]),
]
for at, length, notes in chords:
    soft_pad(notes, at, length, .14 if at >= 32 else .12)
    if at >= 5:
        t = np.arange(int((length + .5) * SR)) / SR
        bass = np.sin(2 * np.pi * freq(notes[0] - 12) * t)
        bass *= (1 - np.exp(-t * 8)) * np.minimum(np.maximum(length + .5 - t, 0) / .7, 1)
        add(bass, at, .055, 0, .08)

# A compact melodic motif returns with variations, leaving space for the prose.
for at, notes in [(1.2, [69, 64, 65, 62]), (6.1, [65, 60, 62, 57]),
                  (25.5, [65, 69, 72, 69]), (32.4, [69, 67, 64, 72]),
                  (38.1, [67, 74, 71, 69]), (43.2, [69, 76, 72, 74])]:
    for i, n in enumerate(notes):
        keys(n, at + [0, .9375, 1.875, 3.125][i], .09, [-.35, .2, -.1, .4][i])

beat = 60 / 96
for i, at in enumerate(np.arange(5.5, 52.1, beat)):
    level = .7 if 12 <= at < 25 else 1
    if i % 4 in (0, 2):
        kick(at, .12 * level)
    if i % 8 == 7:
        kick(at + .75 * beat, .045 * level)
    hat(at + beat * .5 + .009, .015 * level, (-1 if i % 2 else 1) * .3)
    if i % 4 == 1:
        hat(at, .009 * level, -.25, .18)
    # A quiet, evolving broken chord, with a sparse middle section.
    chord = next(notes for start, length, notes in chords if start <= at < start + length)
    if (12 <= at < 25 and i % 4 == 0) or (at >= 25 and i % 2 == 0):
        keys(chord[1 + (i // 2) % 4] + 12, at + .3125, .035 * level, .5 * np.sin(i), 2.4)

# The logo has its own restrained three-note signature and a long soft tail.
for at, note, level in [(54.15, 62, .11), (54.775, 69, .095), (55.4, 76, .075), (57.5, 66, .075)]:
    keys(note, at, level, -.2 if note == 62 else .25, 5)

# Stereo early reflections and diffuse, low-passed tails; all generated locally.
for delay, level, swap in [(.234375, .22, True), (.46875, .15, False), (.703125, .08, True)]:
    n = int(delay * SR)
    mix[n:] += send[:-n, ::-1 if swap else 1] * level
blur = sosfilt(butter(2, 3700, fs=SR, output='sos'), send, axis=0)
for delay in np.linspace(.09, 2.8, 27):
    delay += rng.uniform(-.015, .015)
    n = int(delay * SR)
    mix[n:] += blur[:-n, ::-1 if int(delay * 100) % 2 else 1] * .085 * np.exp(-delay * 1.3)

mix = sosfilt(butter(2, 28, btype='highpass', fs=SR, output='sos'), mix, axis=0)
t = np.arange(len(mix)) / SR
fade = np.minimum(t / 2, 1) * np.clip((64 - t) / 3.5, 0, 1) ** 1.4
mix *= fade[:, None]
mix /= max(1, np.max(np.abs(mix)) / .75)
out = Path(os.environ.get('DIGITX_EXPORT_DIR', '/tmp/digitx-video-export')) / 'original-score.wav'
out.parent.mkdir(parents=True, exist_ok=True)
write(out, SR, (mix * 32767).astype(np.int16))
print(f'Original stereo score: {out}, {DURATION}s, {SR}Hz; peak {np.max(np.abs(mix)):.3f}')
