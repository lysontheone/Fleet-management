import struct
import zlib
from pathlib import Path


def write_png(path, width, height, color):
    def png_chunk(chunk_type, data):
        chunk = chunk_type + data
        return struct.pack('>I', len(data)) + chunk + struct.pack('>I', zlib.crc32(chunk) & 0xffffffff)

    raw = bytearray()
    for y in range(height):
        raw.extend(b'\x00')
        raw.extend(bytes(color * width))
    compressed = zlib.compress(bytes(raw), 9)
    png = b'\x89PNG\r\n\x1a\n'
    png += png_chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))
    png += png_chunk(b'IDAT', compressed)
    png += png_chunk(b'IEND', b'')
    path.write_bytes(png)


assets = Path('assets')
assets.mkdir(exist_ok=True)
write_png(assets / 'icon.png', 1024, 1024, [15, 23, 42, 255])
write_png(assets / 'splash.png', 1242, 2436, [15, 23, 42, 255])
print('created placeholder assets')
