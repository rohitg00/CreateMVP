const cursorRulesData = [
  {
    id: "create-mvp",
    name: "Create MVP",
    category: "Web Development",
    description: "Guidelines for rapidly building minimum viable products with best practices",
    tags: ["React", "NextJS", "Tailwind CSS", "MVP", "Frontend"],
    featured: true
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Database",
    description: "Best practices for PostgreSQL database design, queries, and optimization",
    tags: ["SQL", "Database", "Postgres", "Backend"],
    featured: false
  },
  {
    id: "shadcn-radix",
    name: "shadcn radix",
    category: "UI Framework",
    description: "Guidelines for building accessible UI components with shadcn/ui and Radix",
    tags: ["UI", "Components", "Accessibility", "React"],
    featured: true
  },
  {
    id: "data-analysis",
    name: "Data Analysis",
    category: "Data Science",
    description: "Rules for effective data analysis workflows using Python libraries",
    tags: ["Python", "Pandas", "NumPy", "Jupyter", "Analytics"],
    featured: false
  },
  {
    id: "data-visualization",
    name: "Data Visualization",
    category: "Data Science",
    description: "Comprehensive guide for creating effective data visualizations with Python",
    tags: ["Python", "Matplotlib", "Seaborn", "Plotly", "D3.js", "Visualization"],
    featured: true
  },
  {
    id: "django-python",
    name: "Django Python",
    category: "Backend",
    description: "Best practices for building robust web applications with Django",
    tags: ["Python", "Django", "Backend", "Web Framework"],
    featured: false
  },
  {
    id: "fastapi-python",
    name: "FastAPI Python",
    category: "Backend",
    description: "Guidelines for building high-performance APIs with FastAPI",
    tags: ["Python", "FastAPI", "API", "Backend", "Async"],
    featured: false
  },
  {
    id: "nextjs-react",
    name: "NextJS React",
    category: "Frontend",
    description: "Best practices for building modern web applications with Next.js and React",
    tags: ["React", "NextJS", "Frontend", "SSR", "CSR"],
    featured: true
  },
  {
    id: "react-native",
    name: "React Native",
    category: "Mobile",
    description: "Guidelines for building cross-platform mobile applications with React Native",
    tags: ["React", "Mobile", "iOS", "Android", "Cross-platform"],
    featured: false
  }
];

document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.cursor-rules-grid');
  
  if (container) {
    // Create controls container
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'cursor-rules-controls';
    
    // Create filter container
    const filtersDiv = document.createElement('div');
    filtersDiv.className = 'cursor-rules-filters';
    
    // Get all unique categories
    const categories = ['All', ...Array.from(new Set(cursorRulesData.map(rule => rule.category)))].sort();
    
    // Add filter badges
    filtersDiv.innerHTML = categories.map(category => 
      `<span class="filter-badge ${category === 'All' ? 'active' : ''}" data-filter="${category}">${category}</span>`
    ).join('');
    
    // Create left controls (filter toggle and count)
    const leftControls = document.createElement('div');
    leftControls.className = 'left-controls';
    leftControls.innerHTML = `
      <button class="view-mode-button toggle-filters">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
        <span>Filters</span>
      </button>
      <button class="view-mode-button toggle-search" style="margin-left: 8px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <span>Search</span>
      </button>
      <span class="show-count" style="margin-left: 12px;"></span>
    `;
    
    // Create search container
    const searchDiv = document.createElement('div');
    searchDiv.className = 'cursor-rules-search';
    searchDiv.style.display = 'none';
    searchDiv.innerHTML = `
      <div class="search-container">
        <input type="text" class="search-input" placeholder="Search rules by name, description, or tags...">
        <button class="clear-search">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    `;
    
    // Create right controls (view toggle)
    const rightControls = document.createElement('div');
    rightControls.className = 'right-controls';
    rightControls.innerHTML = `
      <button class="view-mode-button toggle-view">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        <span>Compact View</span>
      </button>
    `;
    
    // Add controls and filters
    const tabContent = container.closest('.tab-content');
    controlsDiv.appendChild(leftControls);
    controlsDiv.appendChild(rightControls);
    
    tabContent.insertBefore(controlsDiv, container);
    tabContent.insertBefore(filtersDiv, container);
    tabContent.insertBefore(searchDiv, container);
    
    // Add CSS for search
    const style = document.createElement('style');
    style.textContent = `
      /* Cursor rules custom styling */
      .cursor-rules-search {
        margin-bottom: 16px;
        overflow: hidden;
        transition: all 0.3s ease;
      }
      
      .search-container {
        position: relative;
      }
      
      .search-input {
        width: 100%;
        padding: 10px 40px 10px 12px;
        border-radius: 6px;
        border: 1px solid rgba(71, 85, 105, 0.7);
        background-color: #0f172a;
        color: #e2e8f0;
        font-size: 14px;
        transition: all 0.2s ease;
      }
      
      .search-input:focus {
        outline: none;
        border-color: rgba(99, 102, 241, 0.8);
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
      }
      
      .clear-search {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: rgba(148, 163, 184, 0.8);
        cursor: pointer;
        padding: 5px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .clear-search:hover {
        color: #e2e8f0;
        background-color: rgba(51, 65, 85, 0.7);
      }
      
      .rule-card {
        display: block;
        background-color: #0f172a;
        border: 1px solid rgba(51, 65, 85, 0.8);
        border-radius: 8px;
        padding: 20px;
        transition: all 0.3s ease;
        text-decoration: none;
        color: inherit;
        position: relative;
        overflow: hidden;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      
      .rule-card:hover {
        transform: translateY(-5px);
        border-color: rgba(99, 102, 241, 0.7);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
      }
      
      .rule-card.featured {
        border-color: rgba(99, 102, 241, 0.7);
        background-color: rgba(79, 70, 229, 0.15);
      }
      
      .featured-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: rgba(99, 102, 241, 0.95);
        color: white;
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 12px;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
      
      .filter-badge {
        background-color: #1e293b;
        color: #e2e8f0;
        font-size: 12px;
        font-weight: 500;
        padding: 6px 12px;
        border-radius: 14px;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .filter-badge:hover {
        background-color: rgba(99, 102, 241, 0.7);
        color: white;
        transform: translateY(-1px);
      }
      
      .filter-badge.active {
        background-color: rgb(99, 102, 241);
        color: white;
        transform: translateY(-1px);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      }
      
      .view-mode-button {
        background-color: #1e293b;
        color: #e2e8f0;
        border: 1px solid rgba(51, 65, 85, 0.8);
        border-radius: 6px;
        padding: 6px 12px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s;
      }
      
      .view-mode-button:hover {
        background-color: #334155;
        border-color: rgba(99, 102, 241, 0.6);
      }
      
      .view-mode-button:active {
        transform: scale(0.97);
      }
      
      .rule-description {
        color: #cbd5e1;
        font-size: 14px;
        margin: 8px 0 12px;
        line-height: 1.5;
        flex-grow: 1;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .rule-badge {
        display: inline-block;
        background-color: #334155;
        color: #e2e8f0;
        font-size: 12px;
        padding: 4px 10px;
        border-radius: 14px;
        margin-bottom: 8px;
        font-weight: 500;
      }
      
      .rule-title {
        color: #f8fafc;
        font-size: 18px;
        font-weight: 600;
        margin: 8px 0;
        line-height: 1.3;
      }
      
      .view-rule {
        color: #818cf8;
        font-size: 14px;
        font-weight: 500;
        margin-top: auto;
        display: flex;
        align-items: center;
        transition: all 0.2s;
      }
      
      .rule-card:hover .view-rule {
        color: #a5b4fc;
      }
      
      .arrow-right {
        margin-left: 4px;
        transition: transform 0.3s;
      }
      
      .rule-card:hover .arrow-right {
        transform: translateX(4px);
      }
      
      .rule-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 14px;
      }
      
      .tag {
        background-color: #1e293b;
        color: #cbd5e1;
        font-size: 11px;
        padding: 3px 8px;
        border-radius: 12px;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(15px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .animated-card {
        animation: fadeIn 0.5s ease forwards;
      }
      
      .load-more-button {
        background-color: #4f46e5;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.25s;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      
      .load-more-button:hover {
        background-color: #4338ca;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      
      .cursor-rules-filters {
        padding: 12px 16px;
        border-radius: 8px;
        background-color: #0f172a;
        border: 1px solid rgba(51, 65, 85, 0.7);
      }
      
      .show-count {
        color: #cbd5e1;
        font-weight: 500;
        font-size: 13px;
      }
      
      /* Create card */
      .create-card {
        text-align: center;
        align-items: center;
        justify-content: center;
        background-color: rgba(79, 70, 229, 0.05);
        border: 1px dashed rgba(99, 102, 241, 0.6);
      }
      
      .create-card:hover {
        background-color: rgba(79, 70, 229, 0.1);
        border-color: rgba(99, 102, 241, 0.8);
      }
      
      .create-icon {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background-color: rgba(99, 102, 241, 0.2);
        color: #a5b4fc;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        transition: all 0.3s;
      }
      
      .create-card:hover .create-icon {
        background-color: rgba(99, 102, 241, 0.3);
        transform: scale(1.1);
      }
      
      .create-button {
        background-color: #4f46e5;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        margin-top: 12px;
      }
      
      .create-button:hover {
        background-color: #4338ca;
        transform: translateY(-2px);
      }
    `;
    document.head.appendChild(style);
    
    // Initialize variables
    let activeFilter = 'All';
    let searchQuery = '';
    let compactView = false;
    let visibleCount = 6;

    // Function to filter and render rules
    function renderRules() {
      container.innerHTML = '';
      
      // Filter rules 
      let filteredRules = cursorRulesData.filter(rule => {
        const matchesCategory = activeFilter === 'All' || rule.category === activeFilter;
        const matchesSearch = !searchQuery || 
          rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rule.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
          
        return matchesCategory && matchesSearch;
      });
      
      // Sort: featured first, then alphabetically
      filteredRules.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.name.localeCompare(b.name);
      });
      
      // Update count display
      const countDisplay = document.querySelector('.show-count');
      if (countDisplay) {
        countDisplay.textContent = `Showing ${Math.min(visibleCount, filteredRules.length)} of ${filteredRules.length} rules`;
      }
      
      // Get visible rules
      const visibleRules = filteredRules.slice(0, visibleCount);
      
      // Add rules with staggered animation
      visibleRules.forEach((rule, index) => {
        const ruleCard = document.createElement('a');
        ruleCard.href = `/cursor-rules/${rule.id}`;
        ruleCard.className = `rule-card animated-card ${rule.featured ? 'featured' : ''}`;
        ruleCard.style.animationDelay = `${index * 50}ms`;
        
        const tagsToShow = compactView ? rule.tags.slice(0, 2) : rule.tags.slice(0, 3);
        const tagsHtml = tagsToShow.map(tag => `<span class="tag">${tag}</span>`).join('');
        const extraTagsCount = rule.tags.length - tagsToShow.length;
        const extraTagsHtml = extraTagsCount > 0 
          ? `<span class="tag">+${extraTagsCount} more</span>` 
          : '';
        
        ruleCard.innerHTML = `
          <div class="rule-badge">${rule.category}</div>
          ${rule.featured ? '<div class="featured-badge">Featured</div>' : ''}
          <h4 class="rule-title">${rule.name}</h4>
          <p class="rule-description">${rule.description}</p>
          <div class="rule-tags">
            ${tagsHtml}
            ${extraTagsHtml}
          </div>
          <div class="view-rule">
            View Rule <span class="arrow-right">→</span>
          </div>
        `;
        
        container.appendChild(ruleCard);
      });
      
      // Add or update load more button
      updateLoadMoreButton(filteredRules.length > visibleCount, filteredRules.length);
    }
    
    // Function to update the load more/less button
    function updateLoadMoreButton(showMore, totalRules) {
      const existingButton = document.querySelector('.load-more-container');
      if (existingButton) {
        existingButton.remove();
      }
      
      if (showMore || visibleCount > 6) {
        const loadMoreDiv = document.createElement('div');
        loadMoreDiv.className = 'load-more-container';
        loadMoreDiv.style.textAlign = 'center';
        loadMoreDiv.style.marginTop = '24px';
        
        if (showMore) {
          const loadMoreBtn = document.createElement('button');
          loadMoreBtn.className = 'load-more-button';
          loadMoreBtn.innerHTML = `Show More Rules <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>`;
          loadMoreBtn.addEventListener('click', function() {
            visibleCount += 6;
            renderRules();
          });
          loadMoreDiv.appendChild(loadMoreBtn);
        } else if (visibleCount > 6) {
          const showLessBtn = document.createElement('button');
          showLessBtn.className = 'load-more-button';
          showLessBtn.style.background = 'transparent';
          showLessBtn.style.border = '1px solid rgba(99, 102, 241, 0.4)';
          showLessBtn.style.color = '#a5b4fc';
          showLessBtn.innerHTML = 'Show Less';
          showLessBtn.addEventListener('click', function() {
            visibleCount = 6;
            renderRules();
          });
          loadMoreDiv.appendChild(showLessBtn);
        }
        
        container.parentNode.appendChild(loadMoreDiv);
      }
    }
    
    // Toggle filters
    const toggleFiltersBtn = document.querySelector('.toggle-filters');
    toggleFiltersBtn.addEventListener('click', function() {
      const filtersDiv = document.querySelector('.cursor-rules-filters');
      filtersDiv.style.display = filtersDiv.style.display === 'none' ? 'flex' : 'none';
      
      const filterText = this.querySelector('span');
      filterText.textContent = filtersDiv.style.display === 'none' ? 'Show Filters' : 'Hide Filters';
    });
    
    // Toggle search
    const toggleSearchBtn = document.querySelector('.toggle-search');
    toggleSearchBtn.addEventListener('click', function() {
      const searchDiv = document.querySelector('.cursor-rules-search');
      searchDiv.style.display = searchDiv.style.display === 'none' ? 'block' : 'none';
      
      const searchText = this.querySelector('span');
      searchText.textContent = searchDiv.style.display === 'none' ? 'Search' : 'Hide Search';
      
      if (searchDiv.style.display === 'block') {
        searchDiv.querySelector('.search-input').focus();
      } else {
        // Clear search when hiding
        searchQuery = '';
        searchDiv.querySelector('.search-input').value = '';
        renderRules();
      }
    });
    
    // Toggle view mode
    const toggleViewBtn = document.querySelector('.toggle-view');
    toggleViewBtn.addEventListener('click', function() {
      compactView = !compactView;
      document.body.classList.toggle('compact-view', compactView);
      
      const viewText = this.querySelector('span');
      const viewIcon = this.querySelector('svg');
      
      if (compactView) {
        viewText.textContent = 'Expanded View';
        viewIcon.innerHTML = '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>';
      } else {
        viewText.textContent = 'Compact View';
        viewIcon.innerHTML = '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>';
      }
      
      renderRules();
    });
    
    // Filter badge click handler
    const filterBadges = document.querySelectorAll('.filter-badge');
    filterBadges.forEach(badge => {
      badge.addEventListener('click', function() {
        filterBadges.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        activeFilter = this.getAttribute('data-filter');
        visibleCount = 6; // Reset visible count when filter changes
        renderRules();
      });
    });
    
    // Search input handler
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', function() {
      searchQuery = this.value.trim();
      visibleCount = 6; // Reset visible count when search changes
      renderRules();
    });
    
    // Clear search button handler
    const clearSearchBtn = document.querySelector('.clear-search');
    clearSearchBtn.addEventListener('click', function() {
      searchQuery = '';
      searchInput.value = '';
      searchInput.focus();
      renderRules();
    });
    
    // Initial render
    renderRules();
  
    // Add "Create Custom Rule" card to the end
    const createCard = document.createElement('a');
    createCard.href = '/create-cursor-rule';
    createCard.className = 'rule-card create-card animated-card';
    createCard.style.animationDelay = `${Math.min(cursorRulesData.length, 6) * 50}ms`;
    
    createCard.innerHTML = `
      <div class="create-icon">+</div>
      <h4 class="rule-title">Create Custom Rule</h4>
      <p class="rule-description">Create and share your own Cursor rule with the community</p>
      <button class="create-button">Create Rule</button>
    `;
    
    container.appendChild(createCard);
  }
  
  // Remove the "View All" link at the bottom if it exists
  const viewAllLink = document.querySelector('.tab-content#cursor-rules .view-all-link');
  if (viewAllLink) {
    viewAllLink.style.display = 'none';
  }
}); 