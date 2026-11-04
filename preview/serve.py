#!/usr/bin/env python3
"""Serve the checked-in Sonneto build without Node or a Higgsfield account."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--port", type=int, default=8766)
args = parser.parse_args()
root = Path(__file__).resolve().parent / "dist"
if not (root / "index.html").is_file():
    parser.error("Missing dist/index.html. Run npm ci && npm run build in preview/.")
server = ThreadingHTTPServer(("127.0.0.1", args.port), partial(SimpleHTTPRequestHandler, directory=str(root)))
print(f"Sonneto preview: http://127.0.0.1:{args.port}/ (Ctrl+C to stop)", flush=True)
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
