/**
 * Tool Comparison Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
  // Tool comparison functionality
  initToolComparison();
  
  // Search functionality
  initSearch();
  
  // Filter functionality
  initFilters();
});

/**
 * Initialize the tool comparison functionality
 */
function initToolComparison() {
  const compareButtons = document.querySelectorAll('.btn-compare');
  const addToolButtons = document.querySelectorAll('.add-tool-btn, .add-tool-col');
  const toolPills = document.querySelectorAll('.tool-pill');
  
  // Handle compare button clicks
  compareButtons.forEach(button => {
    button.addEventListener('click', function() {
      const toolId = this.getAttribute('data-tool-id');
      
      // If already selected, deselect
      if (this.classList.contains('active')) {
        this.classList.remove('active');
        this.innerHTML = '<i class="icon-compare"></i> Compare';
        
        // Remove tool from comparison
        removeToolFromComparison(toolId);
      } else {
        // Check if maximum tools are already selected (3)
        const selectedTools = document.querySelectorAll('.btn-compare.active');
        if (selectedTools.length >= 3) {
          showNotification('You can compare up to 3 tools at a time', 'warning');
          return;
        }
        
        // Add tool to comparison
        this.classList.add('active');
        this.innerHTML = '<i class="icon-check"></i> Selected';
        
        // Add tool to comparison
        addToolToComparison(toolId);
      }
    });
  });
  
  // Handle remove tool button clicks
  toolPills.forEach(pill => {
    const removeButton = pill.querySelector('.remove-tool');
    if (removeButton) {
      removeButton.addEventListener('click', function(e) {
        e.preventDefault();
        const toolId = pill.getAttribute('data-tool-id');
        removeToolFromComparison(toolId);
        
        // Update the compare button state
        const compareButton = document.querySelector(`.btn-compare[data-tool-id="${toolId}"]`);
        if (compareButton) {
          compareButton.classList.remove('active');
          compareButton.innerHTML = '<i class="icon-compare"></i> Compare';
        }
        
        // Remove the pill
        pill.remove();
      });
    }
  });
  
  // Handle add tool button clicks
  addToolButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Simulate opening a tool selection dialog
      showToolSelectionModal();
    });
  });
  
  // Load more tools button
  const loadMoreBtn = document.querySelector('.btn-load-more');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      // Simulate loading more tools
      loadMoreTools();
    });
  }
}

/**
 * Add a tool to the comparison table
 * @param {string} toolId - The ID of the tool to add
 */
function addToolToComparison(toolId) {
  // For demo purposes, this is a simplified version
  console.log(`Adding tool ${toolId} to comparison`);
  
  // In a real implementation, this would add the tool data to the comparison table
  // and create a tool pill in the selected tools section
  
  // Example of creating a pill
  const selectedTools = document.querySelector('.selected-tools');
  if (selectedTools) {
    // Check if pill already exists
    const existingPill = selectedTools.querySelector(`[data-tool-id="${toolId}"]`);
    if (existingPill) return;
    
    // Get tool data (in real app, this would come from an API or data store)
    const toolData = getToolData(toolId);
    
    // Create new pill
    const pill = document.createElement('div');
    pill.className = 'tool-pill';
    pill.setAttribute('data-tool-id', toolId);
    pill.innerHTML = `
      <img src="${toolData.logo}" alt="${toolData.name}" class="tool-pill-logo">
      <span>${toolData.name}</span>
      <button class="remove-tool"><i class="icon-close"></i></button>
    `;
    
    // Add event listener to remove button
    pill.querySelector('.remove-tool').addEventListener('click', function() {
      removeToolFromComparison(toolId);
      
      // Update the compare button state
      const compareButton = document.querySelector(`.btn-compare[data-tool-id="${toolId}"]`);
      if (compareButton) {
        compareButton.classList.remove('active');
        compareButton.innerHTML = '<i class="icon-compare"></i> Compare';
      }
      
      pill.remove();
    });
    
    // Add pill before the add tool button
    const addToolBtn = selectedTools.querySelector('.add-tool-btn');
    selectedTools.insertBefore(pill, addToolBtn);
    
    // Update comparison table
    updateComparisonTable();
  }
}

/**
 * Remove a tool from the comparison table
 * @param {string} toolId - The ID of the tool to remove
 */
function removeToolFromComparison(toolId) {
  console.log(`Removing tool ${toolId} from comparison`);
  
  // Remove the pill
  const pill = document.querySelector(`.tool-pill[data-tool-id="${toolId}"]`);
  if (pill) {
    pill.remove();
  }
  
  // Update the compare button state
  const compareButton = document.querySelector(`.btn-compare[data-tool-id="${toolId}"]`);
  if (compareButton) {
    compareButton.classList.remove('active');
    compareButton.innerHTML = '<i class="icon-compare"></i> Compare';
  }
  
  // Update comparison table
  updateComparisonTable();
}

/**
 * Update the comparison table with the selected tools
 */
function updateComparisonTable() {
  // In a real implementation, this would update the comparison table
  // based on the selected tools
  console.log('Updating comparison table');
  
  // Simulate an API call or data processing
  setTimeout(() => {
    console.log('Comparison table updated');
  }, 500);
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (info, success, warning, error)
 */
function showNotification(message, type = 'info') {
  // Simple notification implementation
  console.log(`[${type}] ${message}`);
  
  // In a real implementation, this would show a notification UI
  const notificationContainer = document.createElement('div');
  notificationContainer.className = `notification notification-${type}`;
  notificationContainer.innerHTML = `
    <div class="notification-content">
      <i class="icon-${type === 'warning' ? 'warning' : type === 'error' ? 'error' : 'info'}"></i>
      <p>${message}</p>
    </div>
    <button class="notification-close"><i class="icon-close"></i></button>
  `;
  
  document.body.appendChild(notificationContainer);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notificationContainer.classList.add('fade-out');
    setTimeout(() => {
      notificationContainer.remove();
    }, 300);
  }, 3000);
  
  // Close button
  notificationContainer.querySelector('.notification-close').addEventListener('click', () => {
    notificationContainer.remove();
  });
}

/**
 * Show the tool selection modal
 */
function showToolSelectionModal() {
  // Simple implementation - in a real app, this would open a modal
  // with a list of available tools to add to the comparison
  console.log('Opening tool selection modal');
  
  // For demo purposes, just show a notification
  showNotification('Tool selection modal would open here', 'info');
}

/**
 * Load more tools
 */
function loadMoreTools() {
  // Simple implementation - in a real app, this would load more tools
  // from an API or data store
  console.log('Loading more tools');
  
  // For demo purposes, just show a notification
  showNotification('More tools would load here', 'info');
}

/**
 * Initialize the search functionality
 */
function initSearch() {
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase().trim();
      
      // In a real implementation, this would search the tools
      // and update the UI accordingly
      console.log(`Searching for: ${query}`);
      
      // Simple debounce implementation
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        if (query.length > 2) {
          // Simulate search results
          filterTools(query);
        } else if (query.length === 0) {
          // Reset filters
          resetFilters();
        }
      }, 300);
    });
  }
}

/**
 * Initialize the filter functionality
 */
function initFilters() {
  const filterSelects = document.querySelectorAll('.filter-select');
  filterSelects.forEach(select => {
    select.addEventListener('change', function() {
      const filterType = this.parentElement.querySelector('label').textContent.toLowerCase();
      const filterValue = this.value;
      
      // In a real implementation, this would filter the tools
      // based on the selected criteria
      console.log(`Filtering by ${filterType}: ${filterValue}`);
      
      // Apply filters
      applyFilters();
    });
  });
}

/**
 * Filter tools based on search query
 * @param {string} query - The search query
 */
function filterTools(query) {
  // In a real implementation, this would filter the tools
  // based on the search query
  console.log(`Filtering tools by query: ${query}`);
  
  // For demo purposes, just show a notification
  showNotification(`Searching for: ${query}`, 'info');
}

/**
 * Apply all current filters
 */
function applyFilters() {
  // In a real implementation, this would apply all current filters
  // to the tools list
  console.log('Applying filters');
  
  // For demo purposes, just show a notification
  showNotification('Filters applied', 'info');
}

/**
 * Reset all filters
 */
function resetFilters() {
  // In a real implementation, this would reset all filters
  console.log('Resetting filters');
  
  // Reset filter selects
  const filterSelects = document.querySelectorAll('.filter-select');
  filterSelects.forEach(select => {
    select.selectedIndex = 0;
  });
  
  // For demo purposes, just show a notification
  showNotification('Filters reset', 'info');
}

/**
 * Get tool data by ID
 * @param {string} toolId - The tool ID
 * @returns {Object} The tool data
 */
function getToolData(toolId) {
  // Mock data - in a real app, this would come from an API or data store
  const toolsData = {
    'openai-gpt4': {
      name: 'OpenAI GPT-4',
      logo: '/assets/logos/openai.svg',
      category: 'LLM Model',
      description: 'Latest multimodal large language model from OpenAI',
      performance: 95,
      costEfficiency: 65,
      integration: 85
    },
    'claude-3-opus': {
      name: 'Claude 3 Opus',
      logo: '/assets/logos/anthropic.svg',
      category: 'LLM Model',
      description: 'Anthropic\'s most advanced AI assistant',
      performance: 98,
      costEfficiency: 60,
      integration: 80
    },
    'github-copilot': {
      name: 'GitHub Copilot',
      logo: '/assets/logos/github.svg',
      category: 'Coding Assistant',
      description: 'AI pair programmer for code generation',
      performance: 85,
      costEfficiency: 90,
      integration: 95
    },
    'cursor-ai': {
      name: 'Cursor AI',
      logo: '/assets/logos/cursor.svg',
      category: 'Coding Assistant',
      description: 'AI-first code editor with built-in chat',
      performance: 95,
      costEfficiency: 95,
      integration: 90
    }
  };
  
  return toolsData[toolId] || {
    name: 'Unknown Tool',
    logo: '/assets/logos/default.svg',
    category: 'Unknown',
    description: 'Tool data not available',
    performance: 50,
    costEfficiency: 50,
    integration: 50
  };
}

// Add custom CSS for notifications
const style = document.createElement('style');
style.textContent = `
  .notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: rgba(15, 23, 42, 0.95);
    border-left: 4px solid #8a86fc;
    color: #ffffff;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 300px;
    max-width: 450px;
    animation: slide-in 0.3s ease;
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .notification-content i {
    font-size: 20px;
    color: #8a86fc;
  }
  
  .notification-content p {
    margin: 0;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .notification-close {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
  }
  
  .notification-close:hover {
    color: #ffffff;
  }
  
  .notification-warning {
    border-left-color: #f59e0b;
  }
  
  .notification-warning .notification-content i {
    color: #f59e0b;
  }
  
  .notification-error {
    border-left-color: #ef4444;
  }
  
  .notification-error .notification-content i {
    color: #ef4444;
  }
  
  .notification-success {
    border-left-color: #22c55e;
  }
  
  .notification-success .notification-content i {
    color: #22c55e;
  }
  
  .fade-out {
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s, transform 0.3s;
  }
  
  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style); 