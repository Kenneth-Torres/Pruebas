// Shared JavaScript functionality for all pages

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Feather icons
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
});

// Filter functionality for resource pages
window.initializeFilters = () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.querySelector('input[type="text"]');
  const cardItems = document.querySelectorAll('.card-item');
  const resourceCount = document.getElementById('resource-count');
  const noResults = document.getElementById('no-results');
  const clearFiltersBtn = document.getElementById('clear-filters');
  
  let currentFilter = 'Todos';
  let currentSearchTerm = '';

  // Función para filtrar cards
  function filterCards() {
    let visibleCount = 0;

    cardItems.forEach((card) => {
      const cardElement = card;
      const category = cardElement.dataset.category || '';
      const title = cardElement.dataset.title || '';
      const description = cardElement.dataset.description || '';
      
      const matchesFilter = currentFilter === 'Todos' || category === currentFilter;
      const matchesSearch = currentSearchTerm === '' || 
                          title.includes(currentSearchTerm.toLowerCase()) ||
                          description.includes(currentSearchTerm.toLowerCase());

      if (matchesFilter && matchesSearch) {
        cardElement.style.display = 'block';
        visibleCount++;
      } else {
        cardElement.style.display = 'none';
      }
    });

    // Actualizar contador
    if (resourceCount) {
      resourceCount.textContent = visibleCount.toString();
    }

    // Mostrar/ocultar mensaje de "no resultados"
    if (noResults) {
      noResults.classList.toggle('hidden', visibleCount > 0);
    }

    // Mostrar/ocultar botón de limpiar filtros
    if (clearFiltersBtn) {
      clearFiltersBtn.classList.toggle('hidden', currentFilter === 'Todos' && currentSearchTerm === '');
    }
  }

  // Manejar clics en filtros
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Remover clase activa de todos los botones
      filterButtons.forEach(btn => {
        btn.classList.remove('text-white', 'bg-gradient-to-br', 'from-purple-600', 'to-blue-500', 'shadow-lg', 'shadow-purple-500/25');
        btn.classList.add('text-gray-300', 'bg-slate-800/50', 'border', 'border-slate-700/50');
        btn.classList.add('hover:bg-gradient-to-br', 'hover:from-purple-600/20', 'hover:to-blue-500/20', 'hover:text-white', 'hover:border-purple-500/30');
      });

      // Agregar clase activa al botón clickeado
      button.classList.add('text-white', 'bg-gradient-to-br', 'from-purple-600', 'to-blue-500', 'shadow-lg', 'shadow-purple-500/25');
      button.classList.remove('text-gray-300', 'bg-slate-800/50', 'border', 'border-slate-700/50');
      button.classList.remove('hover:bg-gradient-to-br', 'hover:from-purple-600/20', 'hover:to-blue-500/20', 'hover:text-white', 'hover:border-purple-500/30');
      
      // Actualizar filtro actual
      currentFilter = button.dataset.filter || 'Todos';
      filterCards();
    });
  });

  // Manejar búsqueda
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchTerm = e.target.value;
      filterCards();
    });
  }

  // Manejar limpiar filtros
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      currentFilter = 'Todos';
      currentSearchTerm = '';
      
      if (searchInput) {
        searchInput.value = '';
      }

      // Resetear botones de filtro
      filterButtons.forEach((btn, index) => {
        if (index === 0) { // Primer botón (Todos)
          btn.classList.add('text-white', 'bg-gradient-to-br', 'from-purple-600', 'to-blue-500', 'shadow-lg', 'shadow-purple-500/25');
          btn.classList.remove('text-gray-300', 'bg-slate-800/50', 'border', 'border-slate-700/50');
        } else {
          btn.classList.remove('text-white', 'bg-gradient-to-br', 'from-purple-600', 'to-blue-500', 'shadow-lg', 'shadow-purple-500/25');
          btn.classList.add('text-gray-300', 'bg-slate-800/50', 'border', 'border-slate-700/50');
        }
      });

      filterCards();
    });
  }

  // Set initial active state for "Todos" button
  if (filterButtons.length > 0) {
    const firstButton = filterButtons[0];
    firstButton.classList.add('text-white', 'bg-gradient-to-br', 'from-purple-600', 'to-blue-500', 'shadow-lg', 'shadow-purple-500/25');
    firstButton.classList.remove('text-gray-300', 'bg-slate-800/50', 'border', 'border-slate-700/50');
  }

  // Inicializar filtros
  filterCards();
};