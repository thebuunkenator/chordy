from wsgiref.simple_server import make_server
PORT = 3000


def app(environ, start_response):
    start_response('200 OK', [('Content-Type', 'text/html')])
    yield b"Hello, World!"


server = make_server('', PORT, app)
print("Server running at port", PORT)
server.serve_forever()

# Python HTTP Server
# 1. Save this code in index.py
# 2. In the terminal, execute `python index.py` (without quotes)