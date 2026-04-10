.PHONY: help install test test-debug test-ui clean build serve

help:
	@echo "JSON Viewer - Makefile Commands"
	@echo "==============================="
	@echo ""
	@echo "Available targets:"
	@echo "  install      - Install dependencies"
	@echo "  test         - Run Playwright tests"
	@echo "  test-debug   - Run tests in debug mode"
	@echo "  test-ui      - Run tests in UI mode"
	@echo "  clean        - Remove node_modules and test results"
	@echo "  serve        - Start a simple HTTP server on port 8000"
	@echo "  build        - Prepare the package for distribution"
	@echo "  help         - Show this help message"
	@echo ""

install:
	npm install
	npx playwright install chromium

test:
	npm test

test-debug:
	npm run test:debug

test-ui:
	npm run test:ui

clean:
	rm -rf node_modules test-results package-lock.json

build:
	@echo "Building package..."
	@mkdir -p dist
	@cp json_viewer/app.js dist/
	@cp json_viewer/style.css dist/
	@cp json_viewer/index.html dist/
	@echo "Package built in dist/ directory"

serve:
	@echo "Starting HTTP server on http://localhost:8000"
	@echo "Open http://localhost:8000/json_viewer/index.html in your browser"
	python3 -m http.server --directory ./json_viewer 4422
