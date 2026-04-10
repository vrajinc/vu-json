/**
 * Vanilla JSON Viewer
 * ES2015 Standard - Pure Functions, No Dependencies
 * 
 * Features used:
 * - const/let declarations
 * - Arrow functions
 * - Template literals
 * - Default parameters
 * - Object destructuring in assignments
 * 
 * No ES2016+ features (spread operator, async/await, etc.)
 * Compatible with all modern browsers supporting ES2015
 */

/**
 * Determines the type of a value
 * @param {*} value 
 * @returns {string}
 */
const getType = (value) => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
};

/**
 * Creates a toggle element for expandable nodes
 * @returns {HTMLElement}
 */
const createToggle = () => {
  const span = document.createElement('span');
  span.className = 'json-toggle';
  return span;
};

/**
 * Renders a primitive value (string, number, boolean, null)
 * @param {*} value 
 * @param {string} type 
 * @returns {HTMLElement}
 */
const renderPrimitive = (value, type) => {
  const span = document.createElement('span');
  span.className = `json-${type}`;
  if (type === 'string') {
    span.textContent = `"${value}"`;
  } else {
    span.textContent = String(value);
  }
  return span;
};

/**
 * Creates a DOM element for a JSON node
 * Lazy-loads children for performance on large objects
 * 
 * @param {string|null} key - The key for this node
 * @param {*} value - The value for this node
 * @param {boolean} isLast - Whether to append a comma
 * @returns {HTMLElement}
 */
const createNode = (key, value, isLast = true) => {
  const container = document.createElement('div');
  container.className = 'json-node';

  if (key !== null) {
    const keySpan = document.createElement('span');
    keySpan.className = 'json-key';
    keySpan.textContent = `"${key}": `;
    container.appendChild(keySpan);
  }

  const type = getType(value);

  if (type === 'object' || type === 'array') {
    const isArray = type === 'array';
    const opener = isArray ? '[' : '{';
    const closer = isArray ? ']' : '}';
    
    const toggle = createToggle();
    container.insertBefore(toggle, container.firstChild);

    const bracketOpen = document.createElement('span');
    bracketOpen.textContent = opener;
    container.appendChild(bracketOpen);

    const summary = document.createElement('span');
    summary.className = 'json-summary';
    const length = isArray ? value.length : Object.keys(value).length;
    summary.textContent = ` ${isArray ? `Array(${length})` : 'Object'}`;
    container.appendChild(summary);

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'json-collapsed-content';
    
    let childrenRendered = false;

    const expand = () => {
      if (!childrenRendered) {
        const keys = isArray ? value : Object.keys(value);
        const total = isArray ? value.length : keys.length;
        
        keys.forEach((v, i) => {
          const childKey = isArray ? null : v;
          const childValue = isArray ? v : value[v];
          const isLastChild = i === total - 1;
          contentWrapper.appendChild(createNode(childKey, childValue, isLastChild));
        });
        childrenRendered = true;
      }
      toggle.classList.add('expanded');
      contentWrapper.classList.add('show');
      summary.style.display = 'none';
    };

    const collapse = () => {
      toggle.classList.remove('expanded');
      contentWrapper.classList.remove('show');
      summary.style.display = 'inline';
    };

    const handleToggle = (e) => {
      e.stopPropagation();
      if (toggle.classList.contains('expanded')) {
        collapse();
      } else {
        expand();
      }
    };

    toggle.onclick = handleToggle;
    summary.onclick = handleToggle;

    container.appendChild(contentWrapper);

    const bracketClose = document.createElement('span');
    bracketClose.textContent = closer + (isLast ? '' : ',');
    container.appendChild(bracketClose);
  } else {
    container.appendChild(renderPrimitive(value, type));
    if (!isLast) {
      container.appendChild(document.createTextNode(','));
    }
  }

  return container;
};

/**
 * Initializes the viewer with a JSON string
 * @param {string} jsonString 
 * @param {HTMLElement} target 
 */
const initViewer = (jsonString, target) => {
  target.innerHTML = '';
  try {
    if (!jsonString.trim()) {
      target.innerHTML = '<div class="placeholder">Rendered JSON will appear here</div>';
      return;
    }
    const data = JSON.parse(jsonString);
    const rootNode = createNode(null, data, true);
    target.appendChild(rootNode);
  } catch (e) {
    const errorDiv = document.createElement('div');
    errorDiv.style.color = 'red';
    errorDiv.style.padding = '10px';
    errorDiv.textContent = `Invalid JSON: ${e.message}`;
    target.appendChild(errorDiv);
  }
};

// Expose on window for testing
window.initViewer = initViewer;
window.createNode = createNode;
window.getType = getType;

// Initialize event handlers
document.addEventListener('DOMContentLoaded', () => {
  const jsonInput = document.getElementById('json-input');
  const jsonViewer = document.getElementById('json-viewer');

  if (!jsonInput || !jsonViewer) return;

  jsonInput.onpaste = (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('Text');
    
    const LARGE_THRESHOLD = 2 * 1024 * 1024;

    if (pastedData.length > LARGE_THRESHOLD) {
      e.preventDefault();
      jsonInput.value = `[Large JSON detected (${(pastedData.length / 1024 / 1024).toFixed(2)} MB). Data captured and rendering...]`;
      initViewer(pastedData, jsonViewer);
    } else {
      setTimeout(() => {
        initViewer(jsonInput.value, jsonViewer);
      }, 0);
    }
  };

  jsonInput.oninput = () => {
    initViewer(jsonInput.value, jsonViewer);
  };
});
