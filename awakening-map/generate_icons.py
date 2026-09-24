import os
import struct
import zlib

os.makedirs(r"C:\Users\hyun6\.gemini\antigravity\scratch\awakening-map\assets", exist_ok=True)
assets_dir = r"C:\Users\hyun6\.gemini\antigravity\scratch\awakening-map\assets"

def make_png(size, filename):
    width = size
    height = size
    
    # Generate RGB image data
    # Dark navy background (#0f172a), golden circle border, inner compass motif
    raw_data = bytearray()
    center = width / 2.0
    radius = width * 0.44
    border_thick = width * 0.04
    
    for y in range(height):
        raw_data.append(0) # filter byte 0 (None)
        for x in range(width):
            dx = x - center
            dy = y - center
            dist = (dx*dx + dy*dy) ** 0.5
            
            # Gold circle border
            if abs(dist - radius) <= border_thick / 2.0:
                # Gold #fbbf24
                raw_data.extend([251, 191, 36])
            elif dist < radius:
                # Gradient navy inner (#1e293b to #0f172a)
                t = dist / radius
                r = int(30 * (1 - t) + 15 * t)
                g = int(41 * (1 - t) + 23 * t)
                b = int(59 * (1 - t) + 42 * t)
                
                # Center compass star lines
                if abs(dx) < width * 0.02 and abs(dy) < width * 0.3:
                    # Vertical gold needle
                    raw_data.extend([245, 158, 11])
                elif abs(dy) < width * 0.02 and abs(dx) < width * 0.3:
                    # Horizontal gold needle
                    raw_data.extend([245, 158, 11])
                elif dist < width * 0.08:
                    # Center golden star
                    raw_data.extend([251, 191, 36])
                else:
                    raw_data.extend([r, g, b])
            else:
                # Outer dark background (#0f172a)
                raw_data.extend([15, 23, 42])

    def chunk(chunk_type, data):
        c = chunk_type + data
        crc = zlib.crc32(c) & 0xffffffff
        return struct.pack(">I", len(data)) + c + struct.pack(">I", crc)

    header = b"\x89PNG\r\n\x1a\n"
    ihdr = chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)) # 8-bit RGB
    idat = chunk(b"IDAT", zlib.compress(raw_data, 9))
    iend = chunk(b"IEND", b"")

    filepath = os.path.join(assets_dir, filename)
    with open(filepath, "wb") as f:
        f.write(header + ihdr + idat + iend)
    print(f"Generated PNG: {filepath} ({os.path.getsize(filepath)} bytes)")

make_png(192, "icon-192.png")
make_png(512, "icon-512.png")
