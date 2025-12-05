// Lista de exercícios com imagens
const exercises = [
  {
    id: 'supino-reto',
    name: 'Supino reto com barra',
    level: 'intermediario',
    equipment: 'barra, banco',
    image:"https://www.mundoboaforma.com.br/wp-content/uploads/2020/08/supino-reto.jpg",
    description: 'Exercício composto clássico. Mantenha pés firmes, coluna neutra e desça controlado.'
  },
  {
    id: 'supino-inclinado',
    name: 'Supino inclinado (halteres ou barra)',
    level: 'intermediario',
    equipment: 'halteres/barra, banco inclinado',
    image: 'https://www.mundoboaforma.com.br/wp-content/uploads/2020/08/supino-inclinado.jpg',
    description: 'Foca a parte superior do peitoral. Use amplitude moderada e controle o movimento.'
  },
  {
    id: 'crucifixo',
    name: 'Crucifixo com halteres',
    level: 'iniciante',
    equipment: 'halteres, banco',
    image: 'https://www.mundoboaforma.com.br/wp-content/uploads/2020/08/crucifixo-halteres.jpg',
    description: 'Isolador para estirar o peitoral. Cotovelos levemente flexionados e retorno controlado.'
  },
  {
    id: 'flexao',
    name: 'Flexão de braços (push-up)',
    level: 'iniciante',
    equipment: 'peso corporal',
    image:"eu.jpg",
    description: 'Versátil e eficiente. Mantenha corpo alinhado e descida controlada.'
  },
  {
    id: 'mergulho',
    name: 'Mergulho em paralelas (dips)',
    level: 'avancado',
    equipment: 'paralelas',
    image: 'https://www.mundoboaforma.com.br/wp-content/uploads/2020/08/mergulho-paralelas.jpg',
    description: 'Excelente para peitoral e tríceps. Incline o tronco à frente para dar ênfase ao peitoral.'
  },
  {
    id: 'crossover',
    name: 'Crossover (cabos)',
    level: 'intermediario',
    equipment: 'máquina de cabos',
    image: 'https://www.mundoboaforma.com.br/wp-content/uploads/2020/08/crossover.jpg',
    description: 'Permite tensão constante. Concentre-se na contração medial do peitoral.'
  }
];

// DOM refs
const cardsEl = document.getElementById('cards');
const searchEl = document.getElementById('search');
const filterEl = document.getElementById('filter');
const resetBtn = document.getElementById('reset');

// Favoritos
const FAVORITES_KEY = 'fav_peito_v1';
let favorites = new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'));
function saveFavorites(){
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
}

// Criar card
function createCard(ex){
  const div = document.createElement('article');
  div.className = 'card';
  if(favorites.has(ex.id)) div.classList.add('favorited');
  div.innerHTML = `
    <img src="${ex.image}" alt="${ex.name}">
    <h3>${ex.name}</h3>
    <div class="meta">
      <span class="badge">${ex.level}</span>
      <span class="badge">${ex.equipment}</span>
      <button class="btn favorite" data-id="${ex.id}">
        ${favorites.has(ex.id) ? '★' : '☆'}
      </button>
    </div>
    <p>${ex.description}</p>
    <div class="actions">
      <button class="btn btn-primary" data-action="details" data-id="${ex.id}">Ver técnica</button>
      <button class="btn" data-action="prog" data-id="${ex.id}">Progresso</button>
    </div>
  `;
  return div;
}

// Renderizar lista
function render(list){
  cardsEl.innerHTML = '';
  if(list.length === 0){
    cardsEl.innerHTML = '<p>Nenhum exercício encontrado.</p>';
    return;
  }
  list.forEach(ex => cardsEl.appendChild(createCard(ex)));
}

// Filtros
function applyFilters(){
  const q = searchEl.value.trim().toLowerCase();
  const level = filterEl.value;
  const filtered = exercises.filter(ex => {
    const matchesQ = [ex.name, ex.description, ex.equipment].join(' ').toLowerCase().includes(q);
    const matchesLevel = (level === 'all') || (ex.level === level);
    return matchesQ && matchesLevel;
  });
  render(filtered);
}

// Eventos
cardsEl.addEventListener('click', e => {
  if(e.target.classList.contains('favorite')){
    const fid = e.target.dataset.id;
    if(favorites.has(fid)){
      favorites.delete(fid);
      e.target.textContent = '☆';
      e.target.closest('.card').classList.remove('favorited');
    } else {
      favorites.add(fid);
      e.target.textContent = '★';
      e.target.closest('.card').classList.add('favorited');
    }
    saveFavorites();
  }
  if(e.target.dataset.action === 'details'){
    const ex = exercises.find(x => x.id === e.target.dataset.id);
    if(ex) alert(`${ex.name}\n\n${ex.description}`);
  }
  if(e.target.dataset.action === 'prog'){
    const reps = prompt('Quantas repetições você faz hoje?', '8');
    if(reps) alert(`Meta: tente aumentar 1–2 reps na próxima sessão.`);
  }
});

searchEl.addEventListener('input', applyFilters);
filterEl.addEventListener('change', applyFilters);
resetBtn.addEventListener('click', () => { searchEl.value=''; filterEl.value='all'; applyFilters(); });

// Inicial
applyFilters();
