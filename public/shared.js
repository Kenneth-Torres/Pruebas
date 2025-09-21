// Enhanced shared JavaScript functionality for DevVault

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Feather icons
  if (typeof feather !== 'undefined') {
    feather.replace();
  }

  // Initialize page-specific functionality
  if (document.querySelector('.card-item')) {
    initializeFilters();
    initializeSearch();
    initializeCardInteractions();
  }
});

// Advanced search functionality with highlighting
function initializeSearch() {
  const searchInput = document.querySelector('input[type="text"]');
  if (!searchInput) return;

  let searchTimeout;
  
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    
    // Debounce search for better performance
    searchTimeout = setTimeout(() => {
      const searchTerm = e.target.value.toLowerCase();
      performAdvancedSearch(searchTerm);
    }, 150);
  });

  // Add search suggestions
  createSearchSuggestions(searchInput);
}

function performAdvancedSearch(searchTerm) {
  const cardItems = document.querySelectorAll('.card-item');
  const resourceCount = document.getElementById('resource-count');
  const noResults = document.getElementById('no-results');
  let visibleCount = 0;

  cardItems.forEach((card) => {
    const title = card.dataset.title || '';
    const description = card.dataset.description || '';
    const category = card.dataset.category || '';
    
    const matchesSearch = searchTerm === '' || 
                         title.includes(searchTerm) ||
                         description.includes(searchTerm) ||
                         category.toLowerCase().includes(searchTerm);

    if (matchesSearch) {
      card.style.display = 'block';
      visibleCount++;
      
      // Highlight matching text
      if (searchTerm) {
        highlightSearchTerm(card, searchTerm);
      } else {
        removeHighlights(card);
      }
    } else {
      card.style.display = 'none';
    }
  });

  // Update counter with animation
  if (resourceCount) {
    animateCounter(resourceCount, visibleCount);
  }

  // Show/hide no results message
  if (noResults) {
    noResults.classList.toggle('hidden', visibleCount > 0);
  }
}

function highlightSearchTerm(card, term) {
  const titleElement = card.querySelector('h3');
  const descriptionElement = card.querySelector('p:last-of-type');
  
  if (titleElement) {
    const originalTitle = titleElement.textContent;
    const highlightedTitle = originalTitle.replace(
      new RegExp(`(${term})`, 'gi'),
      '<mark class="bg-yellow-300 text-gray-900 px-1 rounded">$1</mark>'
    );
    titleElement.innerHTML = highlightedTitle;
  }
}

function removeHighlights(card) {
  const marks = card.querySelectorAll('mark');
  marks.forEach(mark => {
    mark.outerHTML = mark.textContent;
  });
}

function createSearchSuggestions(searchInput) {
  const suggestions = ['React', 'Vue', 'Angular', 'Node.js', 'Python', 'Flutter', 'Jest', 'TypeScript'];
  
  searchInput.addEventListener('focus', () => {
    if (!searchInput.value) {
      showSearchSuggestions(searchInput, suggestions);
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      hideSearchSuggestions();
    }
  });
}

function showSearchSuggestions(input, suggestions) {
  const container = input.parentElement;
  container.classList.add('search-container');
  
  let suggestionsDiv = document.getElementById('search-suggestions');
  if (!suggestionsDiv) {
    suggestionsDiv = document.createElement('div');
    suggestionsDiv.id = 'search-suggestions';
    suggestionsDiv.className = 'absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto';
    
    suggestions.forEach(suggestion => {
      const item = document.createElement('div');
      item.className = 'px-4 py-2 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors';
      item.textContent = suggestion;
      item.addEventListener('click', () => {
        input.value = suggestion;
        input.dispatchEvent(new Event('input'));
        hideSearchSuggestions();
      });
      suggestionsDiv.appendChild(item);
    });
    
    container.appendChild(suggestionsDiv);
  }
  
  suggestionsDiv.style.display = 'block';
}

function hideSearchSuggestions() {
  const suggestions = document.getElementById('search-suggestions');
  if (suggestions) {
    suggestions.style.display = 'none';
  }
}

// Enhanced filter functionality
function initializeFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const clearFiltersBtn = document.getElementById('clear-filters');
  
  let currentFilter = 'Todos';

  // Enhanced filter button interactions
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Remove active state from all buttons
      filterButtons.forEach(btn => {
        btn.classList.remove('text-white', 'bg-gradient-to-br', 'from-purple-600', 'to-blue-500', 'shadow-lg', 'shadow-purple-500/25', 'scale-105');
        btn.classList.add('text-gray-300', 'bg-slate-800/50', 'border', 'border-slate-700/50');
      });

      // Add active state with animation
      button.classList.add('text-white', 'bg-gradient-to-br', 'from-purple-600', 'to-blue-500', 'shadow-lg', 'shadow-purple-500/25', 'scale-105');
      button.classList.remove('text-gray-300', 'bg-slate-800/50', 'border', 'border-slate-700/50');
      
      // Add ripple effect
      createRippleEffect(button);
      
      currentFilter = button.dataset.filter || 'Todos';
      filterCardsByCategory(currentFilter);
    });
  });

  // Clear filters functionality
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      const searchInput = document.querySelector('input[type="text"]');
      if (searchInput) searchInput.value = '';
      
      currentFilter = 'Todos';
      resetFilterButtons(filterButtons);
      filterCardsByCategory(currentFilter);
      
      // Hide clear button with animation
      clearFiltersBtn.style.transform = 'scale(0)';
      setTimeout(() => {
        clearFiltersBtn.classList.add('hidden');
        clearFiltersBtn.style.transform = 'scale(1)';
      }, 200);
    });
  }

  // Set initial state
  if (filterButtons.length > 0) {
    const firstButton = filterButtons[0];
    firstButton.classList.add('text-white', 'bg-gradient-to-br', 'from-purple-600', 'to-blue-500', 'shadow-lg', 'shadow-purple-500/25');
    firstButton.classList.remove('text-gray-300', 'bg-slate-800/50', 'border', 'border-slate-700/50');
  }
}

function filterCardsByCategory(category) {
  const cardItems = document.querySelectorAll('.card-item');
  const resourceCount = document.getElementById('resource-count');
  const clearFiltersBtn = document.getElementById('clear-filters');
  let visibleCount = 0;

  cardItems.forEach((card, index) => {
    const cardCategory = card.dataset.category || '';
    const matchesFilter = category === 'Todos' || cardCategory === category;

    if (matchesFilter) {
      card.style.display = 'block';
      // Stagger animation
      setTimeout(() => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.opacity = '1';
      }, index * 50);
      visibleCount++;
    } else {
      card.style.transform = 'translateY(-10px) scale(0.95)';
      card.style.opacity = '0.5';
      setTimeout(() => {
        card.style.display = 'none';
      }, 200);
    }
  });

  if (resourceCount) {
    animateCounter(resourceCount, visibleCount);
  }

  // Show/hide clear filters button
  if (clearFiltersBtn) {
    const shouldShow = category !== 'Todos';
    clearFiltersBtn.classList.toggle('hidden', !shouldShow);
  }
}

// Enhanced card interactions
function initializeCardInteractions() {
  const cards = document.querySelectorAll('.card-item');
  
  cards.forEach(card => {
    // Add favorite functionality
    addFavoriteButton(card);
    
    // Enhanced hover effects
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px) rotateY(2deg) scale(1.02)';
      card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
      
      // Add glow effect
      const glowDiv = document.createElement('div');
      glowDiv.className = 'absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl -z-10';
      card.style.position = 'relative';
      card.appendChild(glowDiv);
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) rotateY(0) scale(1)';
      card.style.boxShadow = '';
      
      // Remove glow effect
      const glow = card.querySelector('div:last-child');
      if (glow && glow.classList.contains('blur-xl')) {
        glow.remove();
      }
    });

    // Add click animation
    card.addEventListener('click', (e) => {
      if (!e.target.closest('a') && !e.target.closest('button')) {
        createClickAnimation(card);
      }
    });
  });
}

function addFavoriteButton(card) {
  const favoriteBtn = document.createElement('button');
  favoriteBtn.className = 'absolute top-4 left-4 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-200 group';
  favoriteBtn.innerHTML = '<i data-feather="heart" class="w-4 h-4 text-white group-hover:text-red-400"></i>';
  
  let isFavorite = false;
  
  favoriteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isFavorite = !isFavorite;
    
    if (isFavorite) {
      favoriteBtn.innerHTML = '<i data-feather="heart" class="w-4 h-4 text-red-400 fill-current"></i>';
      favoriteBtn.classList.add('bg-red-500/30');
      createHeartAnimation(favoriteBtn);
    } else {
      favoriteBtn.innerHTML = '<i data-feather="heart" class="w-4 h-4 text-white"></i>';
      favoriteBtn.classList.remove('bg-red-500/30');
    }
    
    // Reinitialize feather icons for the new icon
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  });
  
  card.appendChild(favoriteBtn);
  
  // Initialize feather icons for the new button
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
}

// Animation utilities
function createRippleEffect(button) {
  const ripple = document.createElement('div');
  ripple.className = 'absolute inset-0 bg-white/20 rounded-lg animate-ping';
  button.style.position = 'relative';
  button.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

function createClickAnimation(card) {
  card.style.transform = 'scale(0.98)';
  setTimeout(() => {
    card.style.transform = '';
  }, 150);
}

function createHeartAnimation(button) {
  const hearts = ['💖', '💕', '💗'];
  
  hearts.forEach((heart, index) => {
    setTimeout(() => {
      const heartElement = document.createElement('div');
      heartElement.textContent = heart;
      heartElement.className = 'absolute text-red-400 animate-bounce pointer-events-none';
      heartElement.style.left = Math.random() * 20 - 10 + 'px';
      heartElement.style.top = Math.random() * 20 - 10 + 'px';
      
      button.appendChild(heartElement);
      
      setTimeout(() => {
        heartElement.remove();
      }, 1000);
    }, index * 100);
  });
}

function animateCounter(element, targetValue) {
  const startValue = parseInt(element.textContent) || 0;
  const duration = 400;
  const steps = 20;
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

function resetFilterButtons(buttons) {
  buttons.forEach((btn, index) => {
    if (index === 0) {
      btn.classList.add('text-white', 'bg-gradient-to-br', 'from-purple-600', 'to-blue-500', 'shadow-lg', 'shadow-purple-500/25');
      btn.classList.remove('text-gray-300', 'bg-slate-800/50', 'border', 'border-slate-700/50');
    } else {
      btn.classList.remove('text-white', 'bg-gradient-to-br', 'from-purple-600', 'to-blue-500', 'shadow-lg', 'shadow-purple-500/25', 'scale-105');
      btn.classList.add('text-gray-300', 'bg-slate-800/50', 'border', 'border-slate-700/50');
    }
  });
}

// Performance optimization: Lazy loading for images
function initializeLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}