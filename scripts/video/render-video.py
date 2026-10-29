"""Native SVG rasterisation at fixed timestamps, encoded directly to H.264."""
import argparse
import functools
import json
import os
from pathlib import Path
import subprocess
import time
import xml.etree.ElementTree as ET

WORK = Path(os.environ.get('DIGITX_EXPORT_DIR', '/tmp/digitx-video-export'))
os.environ['FONTCONFIG_FILE'] = str(WORK / 'fonts.conf')
import gi
gi.require_version('Rsvg', '2.0')
from gi.repository import Rsvg, Gio, GLib
import cairo
from svgpathtools import parse_path

ET.register_namespace('', 'http://www.w3.org/2000/svg')
ET.register_namespace('xlink', 'http://www.w3.org/1999/xlink')

@functools.lru_cache(maxsize=4096)
def path_length(d):
    return parse_path(d).length(error=1e-5)

def prepare(svg):
    root = ET.fromstring(svg)
    def walk(node, dash=None, offset=None):
        dash = node.get('stroke-dasharray', dash)
        offset = node.get('stroke-dashoffset', offset)
        if node.get('pathLength') == '1':
            length = path_length(node.get('d'))
            if dash and dash != 'none':
                node.set('stroke-dasharray', ' '.join(str(float(v) * length) for v in dash.replace(',', ' ').split()))
                node.set('stroke-dashoffset', str(float(offset or 0) * length))
            node.attrib.pop('pathLength')
        for child in list(node):
            if child.get('opacity') == '0' or child.get('display') == 'none':
                node.remove(child)
            else:
                walk(child, dash, offset)
    walk(root)
    return ET.tostring(root)

def raster(svg, width, height):
    surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, width, height)
    context = cairo.Context(surface)
    stream = Gio.MemoryInputStream.new_from_bytes(GLib.Bytes.new(svg))
    handle = Rsvg.Handle.new_from_stream_sync(stream, Gio.File.new_for_path('/digitx-export.svg'), Rsvg.HandleFlags.FLAGS_NONE, None)
    viewport = Rsvg.Rectangle()
    viewport.x = viewport.y = 0
    viewport.width, viewport.height = width, height
    handle.render_document(context, viewport)
    surface.flush()
    return surface

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--start', type=int, default=0)
    parser.add_argument('--end', type=int, default=3840)
    parser.add_argument('--width', type=int, default=3840)
    parser.add_argument('--height', type=int, default=2160)
    parser.add_argument('--output', required=True)
    parser.add_argument('--still', type=float)
    args = parser.parse_args()
    generator = str(Path(__file__).with_name('story-frames.mjs'))
    if args.still is not None:
        svg = subprocess.check_output(['node', generator, '--still', str(args.still)])
        raster(prepare(svg), args.width, args.height).write_to_png(args.output)
        print(args.output, flush=True)
        return
    source = subprocess.Popen(['node', generator, str(args.start), str(args.end)], stdout=subprocess.PIPE, text=True)
    command = ['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pixel_format', 'bgra', '-video_size', f'{args.width}x{args.height}', '-framerate', '60', '-i', '-', '-an', '-vf', 'scale=in_range=pc:out_range=tv:out_color_matrix=bt709', '-c:v', 'libx264', '-threads', '2', '-preset', 'fast', '-crf', '16', '-pix_fmt', 'yuv420p', '-color_range', 'tv', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-movflags', '+faststart', args.output]
    encoder = subprocess.Popen(command, stdin=subprocess.PIPE)
    previous, surface = None, None
    begun = time.monotonic()
    try:
        for line in source.stdout:
            record = json.loads(line)
            svg = prepare(record['svg'])
            if svg != previous:
                surface = raster(svg, args.width, args.height)
                previous = svg
            encoder.stdin.write(surface.get_data())
            if (record['i'] - args.start + 1) % 120 == 0:
                print(f"{Path(args.output).name}: {record['i'] + 1 - args.start}/{args.end - args.start} frames, {time.monotonic() - begun:.1f}s", flush=True)
    finally:
        encoder.stdin.close()
    if source.wait() or encoder.wait():
        raise RuntimeError('Frame generator or encoder failed')
    print(f"Complete {args.output} ({time.monotonic() - begun:.1f}s)", flush=True)

if __name__ == '__main__':
    main()
