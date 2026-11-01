// CRUD functions (Array of Objects + LocalStorage + Filter)


const STORAGE_KEY = 'construction_projects_data';

// Default initial data if localStorage is empty
const defaultData = [
  { id: 1, customer: "Ali Khan", project: "5 Marla Grey Structure", status: "In Progress" },
  { id: 2, customer: "Usman Tariq", project: "10 Marla Full House", status: "Completed" },
  { id: 3, customer: "Zahid Ahmed", project: "1 Kanal Renovation", status: "Pending" }
];

// Read from LocalStorage or initialize
let projects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData;

function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

// Elements
const form = document.getElementById('crud-form');
const itemIdInput = document.getElementById('item-id');
const custNameInput = document.getElementById('cust-name');
const projTitleInput = document.getElementById('proj-title');
const projStatusInput = document.getElementById('proj-status');
const formBtn = document.getElementById('form-submit-btn');
const tableBody = document.getElementById('crud-table-body');
const searchInput = document.getElementById('search-input');

// Render Table Rows using Array Methods (map & filter)
function renderProjects(itemsToDisplay) {
  if (!tableBody) return;
  
  if (itemsToDisplay.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" class="p-3 text-center text-gray-500">No projects found.</td></tr>`;
    return;
  }

  tableBody.innerHTML = itemsToDisplay.map((item) => `
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 p-2 font-medium">${item.customer}</td>
      <td class="border border-gray-300 p-2">${item.project}</td>
      <td class="border border-gray-300 p-2">
        <span class="px-2 py-0.5 text-xs rounded ${
          item.status === 'Completed' ? 'bg-green-100 text-green-800' :
          item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
        }">${item.status}</span>
      </td>
      <td class="border border-gray-300 p-2 text-center space-x-2">
        <button onclick="editProject(${item.id})" class="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded">Edit</button>
        <button onclick="deleteProject(${item.id})" class="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded">Delete</button>
      </td>
    </tr>
  `).join('');
}

// CREATE & UPDATE (Form Submit)
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = itemIdInput.value;
    const customer = custNameInput.value.trim();
    const project = projTitleInput.value.trim();
    const status = projStatusInput.value;

    if (id) {
      // UPDATE: Array map method
      projects = projects.map(item => item.id == id ? { ...item, customer, project, status } : item);
      formBtn.textContent = 'Add Project';
      formBtn.className = 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded text-sm transition';
      itemIdInput.value = '';
    } else {
      // CREATE: Array push method
      const newItem = {
        id: Date.now(),
        customer,
        project,
        status
      };
      projects.push(newItem);
    }

    saveToLocalStorage();
    renderProjects(projects);
    form.reset();
  });
}

// DELETE: Array filter method (Global scope for inline onclick)
window.deleteProject = function(id) {
  projects = projects.filter(item => item.id !== id);
  saveToLocalStorage();
  renderProjects(projects);
};

// EDIT: Populate Form
window.editProject = function(id) {
  const item = projects.find(p => p.id === id);
  if (item) {
    itemIdInput.value = item.id;
    custNameInput.value = item.customer;
    projTitleInput.value = item.project;
    projStatusInput.value = item.status;
    formBtn.textContent = 'Update Project';
    formBtn.className = 'bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 rounded text-sm transition';
  }
};

// SEARCH FILTER: Array filter & includes methods
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    const filtered = projects.filter(item => 
      item.customer.toLowerCase().includes(term) ||
      item.project.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term)
    );
    renderProjects(filtered);
  });
}


// TASK 2: AXIOS GET PUBLIC API REQUEST


const apiContainer = document.getElementById('api-data-container');
const fetchBtn = document.getElementById('fetch-api-btn');

async function fetchGithubPublicUsers() {
  if (!apiContainer) return;
  apiContainer.innerHTML = `<p class="text-sm text-gray-500 col-span-full">Loading data via Axios...</p>`;

  try {
    // Free Public API (GitHub Users)
    const response = await axios.get('https://api.github.com/users?per_page=6');
    const users = response.data;

    apiContainer.innerHTML = users.map(user => `
      <article class="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded hover:shadow-sm transition">
        <img src="${user.avatar_url}" alt="${user.login}" class="w-12 h-12 rounded-full border border-gray-300">
        <div class="overflow-hidden">
          <h4 class="font-bold text-sm text-gray-800 truncate">${user.login}</h4>
          <a href="${user.html_url}" target="_blank" class="text-xs text-blue-600 hover:underline">View GitHub Profile</a>
        </div>
      </article>
    `).join('');
  } catch (error) {
    apiContainer.innerHTML = `<p class="text-sm text-red-600 col-span-full">Failed to load API data: ${error.message}</p>`;
  }
}

if (fetchBtn) {
  fetchBtn.addEventListener('click', fetchGithubPublicUsers);
}

// Initial Calls on Page Load
renderProjects(projects);
fetchGithubPublicUsers();

// Mobile Hamburger Menu Toggle
const menuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('hidden');
  });
}