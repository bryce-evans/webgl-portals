
server_port=8000

# Kill existing processes on port
lsof -Fp -i:${server_port} | sed 's/^p//' | xargs kill -9

http-server . -p 8000