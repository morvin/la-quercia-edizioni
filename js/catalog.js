// Catalog JavaScript - La Quercia Edizioni

import { products, categories, subcategories, publishers, getProductById, isNewProduct } from './data.js';
import { createProductCard, createCategoryCard, icons, debounce } from './main.js';

// ============================================
// CATALOG STATE
// ============================================

let currentFilters = {
  category: null,
  subcategory: null,
  publisher: null,
  priceMin: null,
  priceMax: null,
  search: ''
};

let currentSort = 'newest';

// ============================================
// URL PARAMETER HANDLING
// ============================================

function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    category: params.get('category'),
    subcategory: params.get('subcategory'),
    id: params.get('id'),
    search: params.get('search')
  };
}

// ============================================
// FILTER PRODUCTS
// ============================================

function filterProducts() {
  let filtered = [...products];

  if (currentFilters.category) {
    filtered = filtered.filter(p => p.category === currentFilters.category);
  }

  if (currentFilters.subcategory) {
    filtered = filtered.filter(p => p.subcategory === currentFilters.subcategory);
  }

  if (currentFilters.publisher) {
    filtered = filtered.filter(p => p.publisher === currentFilters.publisher);
  }

  if (currentFilters.priceMin !== null) {
    filtered = filtered.filter(p => p.priceValue >= currentFilters.priceMin);
  }

  if (currentFilters.priceMax !== null) {
    filtered = filtered.filter(p => p.priceValue <= currentFilters.priceMax);
  }

  if (currentFilters.search) {
    const searchLower = currentFilters.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(searchLower) ||
      p.author.toLowerCase().includes(searchLower)
    );
  }

  // Sort
  switch (currentSort) {
    case 'newest':
      filtered.sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB - dateA;
      });
      break;
    case 'price-asc':
      filtered.sort((a, b) => a.priceValue - b.priceValue);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.priceValue - a.priceValue);
      break;
    case 'title':
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  return filtered;
}

function parseDate(dateStr) {
  const [day, month, year] = dateStr.split('/');
  return new Date(year, month - 1, day);
}

// ============================================
// RENDER CATALOG
// ============================================

function renderProducts(productsToRender) {
  const container = document.querySelector('#products-grid');
  const countEl = document.querySelector('#products-count');
  const emptyEl = document.querySelector('#products-empty');

  if (!container) return;

  // Update count
  if (countEl) {
    countEl.textContent = `${productsToRender.length} prodotti`;
  }

  // Render products or empty state
  if (productsToRender.length === 0) {
    container.innerHTML = '';
    container.style.display = 'none';
    if (emptyEl) {
      emptyEl.style.display = 'block';
    }
  } else {
    if (emptyEl) {
      emptyEl.style.display = 'none';
    }
    container.style.display = '';
    container.innerHTML = productsToRender.map(createProductCard).join('');
  }
}

function renderFilters() {
  // Render category filters
  const categoryContainer = document.querySelector('#filter-categories');
  if (categoryContainer) {
    categoryContainer.innerHTML = categories.map(cat => `
      <label class="filter-option">
        <input type="checkbox" name="category" value="${cat.name}"
          ${currentFilters.category === cat.name ? 'checked' : ''}>
        <span>${cat.name}</span>
        <span class="filter-count">(${cat.count})</span>
      </label>
    `).join('');
  }

  // Render subcategory filters
  const subcategoryContainer = document.querySelector('#filter-subcategories');
  if (subcategoryContainer) {
    const availableSubcats = [...new Set(
      currentFilters.category
        ? products.filter(p => p.category === currentFilters.category).map(p => p.subcategory)
        : products.map(p => p.subcategory)
    )];

    subcategoryContainer.innerHTML = availableSubcats.map(sub => `
      <label class="filter-option">
        <input type="checkbox" name="subcategory" value="${sub}"
          ${currentFilters.subcategory === sub ? 'checked' : ''}>
        <span>${sub}</span>
        <span class="filter-count">(${products.filter(p => p.subcategory === sub).length})</span>
      </label>
    `).join('');
  }

  // Render publisher filters
  const publisherContainer = document.querySelector('#filter-publishers');
  if (publisherContainer) {
    publisherContainer.innerHTML = publishers.map(pub => `
      <label class="filter-option">
        <input type="checkbox" name="publisher" value="${pub}"
          ${currentFilters.publisher === pub ? 'checked' : ''}>
        <span>${pub}</span>
        <span class="filter-count">(${products.filter(p => p.publisher === pub).length})</span>
      </label>
    `).join('');
  }
}

function updateFilterCounts() {
  const filtered = filterProducts();

  // Update category counts
  document.querySelectorAll('#filter-categories .filter-option').forEach(option => {
    const checkbox = option.querySelector('input');
    const countEl = option.querySelector('.filter-count');
    if (checkbox && countEl) {
      const category = checkbox.value;
      const tempFilters = { ...currentFilters, category };
      const count = products.filter(p =>
        (!tempFilters.category || p.category === tempFilters.category) &&
        (!tempFilters.subcategory || p.subcategory === tempFilters.subcategory)
      ).length;
      countEl.textContent = `(${count})`;
    }
  });
}

// ============================================
// FILTER EVENT HANDLERS
// ============================================

function initFilters() {
  // Category filters
  const categoryContainer = document.querySelector('#filter-categories');
  if (categoryContainer) {
    categoryContainer.addEventListener('change', (e) => {
      if (e.target.name === 'category') {
        // Single select for simplicity
        document.querySelectorAll('#filter-categories input').forEach(input => {
          if (input !== e.target) input.checked = false;
        });
        currentFilters.category = e.target.checked ? e.target.value : null;
        renderFilters();
        applyFilters();
      }
    });
  }

  // Subcategory filters
  const subcategoryContainer = document.querySelector('#filter-subcategories');
  if (subcategoryContainer) {
    subcategoryContainer.addEventListener('change', (e) => {
      if (e.target.name === 'subcategory') {
        document.querySelectorAll('#filter-subcategories input').forEach(input => {
          if (input !== e.target) input.checked = false;
        });
        currentFilters.subcategory = e.target.checked ? e.target.value : null;
        applyFilters();
      }
    });
  }

  // Publisher filters
  const publisherContainer = document.querySelector('#filter-publishers');
  if (publisherContainer) {
    publisherContainer.addEventListener('change', (e) => {
      if (e.target.name === 'publisher') {
        document.querySelectorAll('#filter-publishers input').forEach(input => {
          if (input !== e.target) input.checked = false;
        });
        currentFilters.publisher = e.target.checked ? e.target.value : null;
        applyFilters();
      }
    });
  }

  // Clear filters
  const clearBtn = document.querySelector('#clear-filters');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      currentFilters = {
        category: null,
        subcategory: null,
        publisher: null,
        priceMin: null,
        priceMax: null,
        search: ''
      };
      currentSort = 'newest';

      // Reset form
      document.querySelectorAll('.filter-option input').forEach(input => {
        input.checked = false;
      });
      const sortSelect = document.querySelector('#sort-select');
      if (sortSelect) sortSelect.value = 'newest';

      renderFilters();
      applyFilters();
    });
  }

  // Sort
  const sortSelect = document.querySelector('#sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applyFilters();
    });
  }

  // Search
  const searchInput = document.querySelector('#search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      currentFilters.search = e.target.value;
      applyFilters();
    }, 300));
  }
}

function applyFilters() {
  const filtered = filterProducts();
  renderProducts(filtered);
}

// ============================================
// PRODUCT DETAIL PAGE
// ============================================

function renderProductDetail(productId) {
  const product = getProductById(productId);
  if (!product) {
    window.location.href = 'catalogo.html';
    return;
  }

  // Update page title
  document.title = `${product.title} - La Quercia Edizioni`;

  // Render product info
  const container = document.querySelector('.product-detail');
  if (!container) return;

  const isNew = isNewProduct(product.date);

  container.innerHTML = `
    <div class="container">
      <nav class="page-breadcrumb" style="margin-bottom: var(--space-8);">
        <a href="index.html">Home</a>
        <span>/</span>
        <a href="catalogo.html">Catalogo</a>
        <span>/</span>
        <a href="catalogo.html?category=${encodeURIComponent(product.category)}">${product.category}</a>
        <span>/</span>
        <span>${product.title}</span>
      </nav>

      <div class="product-grid">
        <div class="product-gallery">
          <div class="product-image">
            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
        </div>

        <div class="product-info">
          ${isNew ? '<span class="product-badge">Nuovo Arrivo</span>' : ''}
          <h1 class="product-title">${product.title}</h1>
          <p class="product-author">di ${product.author}</p>
          <p class="product-price">${product.price}</p>

          <div class="product-description">
            <h3>Descrizione</h3>
            <p>
              Un'esperienza di intrattenimento enigmistico di alta qualità. Questo volume fa parte della collezione
              "${product.category}" dedicata agli amanti della ricerca di parole e dei crucipuzzle.
              ${product.subcategory ? `Appartiene alla tematica "${product.subcategory}".` : ''}
            </p>
            <p style="margin-top: var(--space-4);">
              <em>Nota: La descrizione dettagliata sarà presto disponibile. Per informazioni complete sul prodotto,
              fare riferimento alla pagina Amazon.</em>
            </p>
          </div>

          <div class="product-meta">
            <div class="product-meta-item">
              <span class="product-meta-label">Editore</span>
              <span class="product-meta-value">${product.publisher}</span>
            </div>
            <div class="product-meta-item">
              <span class="product-meta-label">Categoria</span>
              <span class="product-meta-value">${product.category}</span>
            </div>
            <div class="product-meta-item">
              <span class="product-meta-label">Data Pubblicazione</span>
              <span class="product-meta-value">${product.date}</span>
            </div>
            <div class="product-meta-item">
              <span class="product-meta-label">ASIN</span>
              <span class="product-meta-value">${product.asin}</span>
            </div>
          </div>

          <div class="product-actions">
            <a href="https://www.amazon.it/dp/${product.asin}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              Acquista su Amazon
            </a>
            <a href="catalogo.html" class="btn btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Torna al Catalogo
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Set page title
  document.title = `${product.title} - La Quercia Edizioni`;
}

// ============================================
// RELATED PRODUCTS
// ============================================

function getRelatedProducts(product, count = 4) {
  return products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, count);
}

function renderRelatedProducts(product) {
  const container = document.querySelector('#related-products');
  if (!container) return;

  const related = getRelatedProducts(product);
  if (related.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.innerHTML = `
    <div class="container">
      <h2 class="section-title" style="margin-bottom: var(--space-8);">Potrebbe interessarti anche</h2>
      <div class="products-grid stagger-children">
        ${related.map(createProductCard).join('')}
      </div>
    </div>
  `;
}

// ============================================
// HOMEPAGE PRODUCTS
// ============================================

function renderHomepageProducts() {
  const container = document.querySelector('#homepage-products');
  if (!container) return;

  // Get 6 most recent products
  const recent = [...products]
    .sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateB - dateA;
    })
    .slice(0, 6);

  container.innerHTML = recent.map(createProductCard).join('');
}

function parseDate(dateStr) {
  const [day, month, year] = dateStr.split('/');
  return new Date(year, month - 1, day);
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = getUrlParams();

  // Check if this is a product detail page
  if (urlParams.id) {
    renderProductDetail(urlParams.id);
    renderRelatedProducts(getProductById(urlParams.id));
  }
  // Check if this is the catalog page
  else if (window.location.pathname.includes('catalogo')) {
    // Apply category filter from URL if present
    if (urlParams.category) {
      currentFilters.category = decodeURIComponent(urlParams.category);
    }
    if (urlParams.search) {
      currentFilters.search = decodeURIComponent(urlParams.search);
      const searchInput = document.querySelector('#search-input');
      if (searchInput) {
        searchInput.value = currentFilters.search;
      }
    }

    renderFilters();
    applyFilters();
    initFilters();
  }
  // Homepage
  else {
    renderHomepageProducts();
  }
});

// Export for use
export {
  filterProducts,
  renderProducts,
  getRelatedProducts
};
