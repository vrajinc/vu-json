FROM python:3.12-slim

WORKDIR /app

# Copy only necessary files
COPY json_viewer/ ./json_viewer/

# Expose port
EXPOSE 4422

# Start HTTP server with unbuffered output and proper signal handling
CMD ["python3", "-u", "-m", "http.server", "--directory", "./json_viewer", "4422"]
