# JSON Viewer

A simple, lightweight vanilla JavaScript JSON viewer. Paste JSON and view it easily locally with no dependencies.

> Fork from [vrajinc](https://github.com/vrajinc) - simplified and optimized for local use

## Features

- **Zero Dependencies**: Pure vanilla JavaScript
- **Simple & Fast**: Lazy-loads nested nodes for large files
- **Easy to Use**: Paste JSON and view it instantly
- **Handles Large Files**: Supports up to 2MB+ JSON

## Quick Start

```html
<link rel="stylesheet" href="json_viewer/style.css">
<textarea id="json-input" placeholder="Paste JSON here..."></textarea>
<div id="json-viewer"></div>
<script src="json_viewer/app.js"></script>
```

## Usage

1. Paste JSON into the textarea
2. It renders automatically
3. Click arrows to expand/collapse nested objects and arrays

## Testing

```bash
npm test
```

## Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## License

MIT
