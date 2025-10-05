// DevVault Enhanced JavaScript - Complete Feature Set
// Performance optimized with debouncing and lazy loading

class DevVaultApp {
  constructor() {
    this.searchTimeout = null;
    this.favorites = new Set(JSON.parse(localStorage.getItem('devvault_favorites') || '[]'));
    this.recentSearches = JSON.parse(localStorage.getItem('devvault_searches') || '[]');
    this.viewMode = localStorage.getItem('devvault_view_mode') || 'grid';
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeFeatherIcons();
      this.initializeComponents();
      this.setupPerformanceOptimizations();
    });
  }

  initializeFeatherIcons() {
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }

  initializeComponents() {
    if (document.querySelector('.card-item')) {
      this.initializeSearch();
      this.initializeFilters();
      this.initializeCards();
      this.initializeViewModes();
      this.initializeSorting();
      this.animatePageEntrance();
    }
  }

  // Enhanced Search with Real-time Suggestions
  initializeSearch() {
    const searchInput = document.querySelector('input[type="text"]');
    const clearButton = document.getElementById('clear-search');
    
    if (!searchInput) return;

    // Enhanced search with debouncing
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      
      clearTimeout(this.searchTimeout);
      this.showSearchLoading(true);
      
      this.searchTimeout = setTimeout(() => {
        this.performAdvancedSearch(term);
        this.showSearchLoading(false);
        if (term) this.saveSearchTerm(term);
      }, 200);

      // Show/hide clear button
      if (clearButton) {
        clearButton.classList.toggle('hidden', !term);
      }
    });

    // Clear search functionality
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
      });
    }

    // Initialize search suggestions
    this.setupSearchSuggestions(searchInput);
  }

  performAdvancedSearch(searchTerm) {
    const cards = document.querySelectorAll('.card-item');
    const resourceCount = document.getElementById('resource-count');
    const noResults = document.getElementById('no-results');
    let visibleCount = 0;

    cards.forEach((card, index) => {
      const title = card.dataset.title || '';
      const description = card.dataset.description || '';
      const category = card.dataset.category || '';
      
      const matches = !searchTerm || 
        title.includes(searchTerm) ||
        description.includes(searchTerm) ||
        category.toLowerCase().includes(searchTerm);

      if (matches) {
        this.showCard(card, index);
        visibleCount++;
        
        if (searchTerm) {
          this.highlightSearchTerm(card, searchTerm);
        } else {
          this.removeHighlights(card);
        }
      } else {
        this.hideCard(card);
      }
    });

    this.updateResourceCount(resourceCount, visibleCount);
    this.toggleNoResults(noResults, visibleCount === 0);
    this.updateActiveFiltersCount();
  }

  // Interactive Filter System
  initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const clearFiltersBtn = document.getElementById('clear-filters');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.setActiveFilter(button, filterButtons);
        this.applyFilters();
        this.createRippleEffect(button);
      });
    });

    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        this.resetAllFilters(filterButtons);
      });
    }

    // Set initial state
    if (filterButtons.length > 0) {
      this.setActiveFilter(filterButtons[0], filterButtons);
    }
  }

  setActiveFilter(activeButton, allButtons) {
    allButtons.forEach(btn => {
      btn.classList.remove('active', 'text-white', 'bg-gradient-to-br', 'from-purple-600', 'to-blue-500', 'shadow-lg', 'shadow-purple-500/25', 'scale-105');
      btn.classList.add('text-gray-300', 'bg-slate-800/50', 'border', 'border-slate-700/50');
    });

    activeButton.classList.add('active', 'text-white', 'bg-gradient-to-br', 'from-purple-600', 'to-blue-500', 'shadow-lg', 'shadow-purple-500/25', 'scale-105');
    activeButton.classList.remove('text-gray-300', 'bg-slate-800/50', 'border', 'border-slate-700/50');
  }

  applyFilters() {
    const activeButton = document.querySelector('.filter-btn.active');
    const category = activeButton ? activeButton.dataset.filter : 'Todos';
    const searchTerm = document.querySelector('input[type="text"]')?.value.toLowerCase() || '';
    
    this.filterByCategory(category, searchTerm);
  }

  filterByCategory(category, searchTerm = '') {
    const cards = document.querySelectorAll('.card-item');
    const resourceCount = document.getElementById('resource-count');
    const clearFiltersBtn = document.getElementById('clear-filters');
    let visibleCount = 0;

    cards.forEach((card, index) => {
      const cardCategory = card.dataset.category || '';
      const title = card.dataset.title || '';
      const description = card.dataset.description || '';
      
      const matchesFilter = category === 'Todos' || cardCategory === category;
      const matchesSearch = !searchTerm || 
        title.includes(searchTerm) ||
        description.includes(searchTerm);

      if (matchesFilter && matchesSearch) {
        this.showCard(card, index);
        visibleCount++;
      } else {
        this.hideCard(card);
      }
    });

    this.updateResourceCount(resourceCount, visibleCount);
    
    if (clearFiltersBtn) {
      clearFiltersBtn.classList.toggle('hidden', category === 'Todos' && !searchTerm);
    }
  }

  // Enhanced Card Interactions
  initializeCards() {
    const cards = document.querySelectorAll('.card-item');
    
    cards.forEach((card, index) => {
      this.setupCardInteractions(card);
      this.addFavoriteButton(card);
      this.addCardPreview(card);
    });
  }

  setupCardInteractions(card) {
    let hoverTimeout;

    card.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
      this.enhanceCardHover(card, true);
    });

    card.addEventListener('mouseleave', () => {
      hoverTimeout = setTimeout(() => {
        this.enhanceCardHover(card, false);
      }, 100);
    });

    card.addEventListener('click', (e) => {
      if (!e.target.closest('a') && !e.target.closest('button')) {
        this.createClickAnimation(card);
      }
    });
  }

  addFavoriteButton(card) {
    const cardInner = card.querySelector('.card-item > div') || card.firstElementChild;
    if (!cardInner) return;

    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'absolute top-4 left-4 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-200 group favorite-btn';
    
    const cardTitle = card.dataset.title;
    const isFavorite = this.favorites.has(cardTitle);
    
    favoriteBtn.innerHTML = `<i data-feather="heart" class="w-4 h-4 ${isFavorite ? 'text-red-400 fill-current' : 'text-white'}"></i>`;
    
    favoriteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleFavorite(cardTitle, favoriteBtn);
    });

    cardInner.appendChild(favoriteBtn);
    
    // Re-initialize feather icons
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }

  toggleFavorite(cardTitle, button) {
    const isFavorite = this.favorites.has(cardTitle);
    
    if (isFavorite) {
      this.favorites.delete(cardTitle);
      button.innerHTML = '<i data-feather="heart" class="w-4 h-4 text-white"></i>';
      button.classList.remove('bg-red-500/30');
    } else {
      this.favorites.add(cardTitle);
      button.innerHTML = '<i data-feather="heart" class="w-4 h-4 text-red-400 fill-current"></i>';
      button.classList.add('bg-red-500/30');
      this.createHeartAnimation(button);
    }
    
    localStorage.setItem('devvault_favorites', JSON.stringify([...this.favorites]));
    
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }

  // View Modes and Sorting
  initializeViewModes() {
    const viewToggles = document.querySelectorAll('.view-toggle');
    
    viewToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const viewMode = toggle.dataset.view;
        this.switchViewMode(viewMode, viewToggles);
      });
    });

    // Apply saved view mode
    this.applyViewMode(this.viewMode);
  }

  switchViewMode(mode, toggles) {
    this.viewMode = mode;
    localStorage.setItem('devvault_view_mode', mode);
    
    toggles.forEach(t => {
      t.classList.toggle('bg-slate-600', t.dataset.view === mode);
      t.classList.toggle('text-white', t.dataset.view === mode);
      t.classList.toggle('text-gray-400', t.dataset.view !== mode);
    });

    this.applyViewMode(mode);
  }

  applyViewMode(mode) {
    const container = document.getElementById('cards-container');
    if (!container) return;

    if (mode === 'list') {
      container.className = 'space-y-4';
      container.querySelectorAll('.card-item > div').forEach(card => {
        card.classList.add('flex', 'flex-row', 'max-w-none', 'h-32');
      });
    } else {
      container.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
      container.querySelectorAll('.card-item > div').forEach(card => {
        card.classList.remove('flex', 'flex-row', 'max-w-none', 'h-32');
      });
    }
  }

  initializeSorting() {
    const sortSelect = document.getElementById('sort-select');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', (e) => {
      this.sortCards(e.target.value);
    });
  }

  sortCards(sortBy) {
    const container = document.getElementById('cards-container');
    if (!container) return;

    const cards = Array.from(container.querySelectorAll('.card-item'));
    
    cards.sort((a, b) => {
      switch(sortBy) {
        case 'name':
          return a.dataset.title.localeCompare(b.dataset.title);
        case 'category':
          return a.dataset.category.localeCompare(b.dataset.category);
        case 'popular':
          return this.favorites.has(b.dataset.title) - this.favorites.has(a.dataset.title);
        default:
          return 0;
      }
    });

    cards.forEach((card, index) => {
      container.appendChild(card);
      card.style.animationDelay = `${index * 50}ms`;
    });
  }

  // Performance Optimizations
  setupPerformanceOptimizations() {
    this.initializeLazyLoading();
    this.setupIntersectionObserver();
    this.preloadCriticalResources();
  }

  initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.card-item').forEach(card => {
        cardObserver.observe(card);
      });
    }
  }

  // Utility Functions
  animatePageEntrance() {
    const cards = document.querySelectorAll('.card-item');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      }, index * 100);
    });
  }

  showCard(card, index) {
    card.style.display = 'block';
    setTimeout(() => {
      card.style.transform = 'translateY(0) scale(1)';
      card.style.opacity = '1';
    }, index * 30);
  }

  hideCard(card) {
    card.style.transform = 'translateY(-10px) scale(0.95)';
    card.style.opacity = '0.3';
    setTimeout(() => {
      card.style.display = 'none';
    }, 200);
  }

  highlightSearchTerm(card, term) {
    const titleElement = card.querySelector('h3');
    if (titleElement) {
      const originalTitle = titleElement.textContent;
      const regex = new RegExp(`(${term})`, 'gi');
      titleElement.innerHTML = originalTitle.replace(regex, '<mark class="bg-yellow-300 text-gray-900 px-1 rounded">$1</mark>');
    }
  }

  removeHighlights(card) {
    const marks = card.querySelectorAll('mark');
    marks.forEach(mark => {
      mark.outerHTML = mark.textContent;
    });
  }

  updateResourceCount(element, count) {
    if (element) {
      this.animateCounter(element, count);
    }
  }

  animateCounter(element, targetValue) {
    const startValue = parseInt(element.textContent) || 0;
    const duration = 300;
    const steps = 15;
    const stepValue = (targetValue - startValue) / steps;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const currentValue = Math.round(startValue + (stepValue * currentStep));
      element.textContent = currentValue;
      
      if (currentStep >= steps) {
        clearInterval(timer);
        element.textContent = targetValue;
      }
    }, duration / steps);
  }

  updateActiveFiltersCount() {
    const activeFiltersCount = document.getElementById('active-filters');
    if (!activeFiltersCount) return;

    const activeButton = document.querySelector('.filter-btn.active');
    const searchInput = document.querySelector('input[type="text"]');
    
    let count = 0;
    if (activeButton && activeButton.dataset.filter !== 'Todos') count++;
    if (searchInput && searchInput.value) count++;
    
    activeFiltersCount.textContent = count;
  }

  // Animation Effects
  enhanceCardHover(card, isHovering) {
    if (isHovering) {
      card.style.transform = 'translateY(-8px) rotateY(2deg) scale(1.02)';
      card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
    } else {
      card.style.transform = 'translateY(0) rotateY(0) scale(1)';
      card.style.boxShadow = '';
    }
  }

  createRippleEffect(button) {
    const ripple = document.createElement('div');
    ripple.className = 'absolute inset-0 bg-white/20 rounded-lg animate-ping';
    button.style.position = 'relative';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }

  createClickAnimation(card) {
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
      card.style.transform = '';
    }, 150);
  }

  createHeartAnimation(button) {
    const hearts = ['💖', '💕', '💗'];
    
    hearts.forEach((heart, index) => {
      setTimeout(() => {
        const heartElement = document.createElement('div');
        heartElement.textContent = heart;
        heartElement.className = 'absolute text-red-400 animate-bounce pointer-events-none';
        heartElement.style.left = Math.random() * 20 - 10 + 'px';
        heartElement.style.top = Math.random() * 20 - 10 + 'px';
        
        button.appendChild(heartElement);
        
        setTimeout(() => heartElement.remove(), 1000);
      }, index * 100);
    });
  }

  showSearchLoading(show) {
    const loadingIndicator = document.getElementById('search-loading');
    if (loadingIndicator) {
      loadingIndicator.style.opacity = show ? '1' : '0';
    }
  }

  toggleNoResults(element, show) {
    if (element) {
      element.classList.toggle('hidden', !show);
    }
  }

  saveSearchTerm(term) {
    if (term.length > 2) {
      this.recentSearches = [term, ...this.recentSearches.filter(s => s !== term)].slice(0, 5);
      localStorage.setItem('devvault_searches', JSON.stringify(this.recentSearches));
    }
  }

  setupSearchSuggestions(input) {
    // Implementation for search suggestions would go here
    // This is a placeholder for the enhanced search functionality
  }

  resetAllFilters(filterButtons) {
    const searchInput = document.querySelector('input[type="text"]');
    if (searchInput) {
      searchInput.value = '';
    }
    
    this.setActiveFilter(filterButtons[0], filterButtons);
    this.applyFilters();
    
    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) {
      clearBtn.style.transform = 'scale(0)';
      setTimeout(() => {
        clearBtn.classList.add('hidden');
        clearBtn.style.transform = 'scale(1)';
      }, 200);
    }
  }

  preloadCriticalResources() {
    // Preload next page resources
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const url = link.href;
        if (!document.querySelector(`link[rel="prefetch"][href="${url}"]`)) {
          const prefetchLink = document.createElement('link');
          prefetchLink.rel = 'prefetch';
          prefetchLink.href = url;
          document.head.appendChild(prefetchLink);
        }
      });
    });
  }
}

// Initialize the DevVault App
const devVaultApp = new DevVaultApp();