const drugList = document.getElementById('drug-list');
const form = document.getElementById('drug-form');
const nameInput = document.getElementById('drug-name');
const doseInput = document.getElementById('drug-dose');
const suggestions = document.createElement('ul');
suggestions.id = 'autocomplete-list';
nameInput.parentNode.appendChild(suggestions);

let currentDrugs = [];

nameInput.addEventListener('input', () => {
  const query = nameInput.value.trim();
  suggestions.innerHTML = '';
  if (query.length < 3) return;

  fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      const groups = data.drugGroup?.conceptGroup || [];
      const concepts = groups.flatMap(g => g.conceptProperties || []);
      concepts.slice(0, 5).forEach(drug => {
        const li = document.createElement('li');
        li.textContent = drug.name;
        li.addEventListener('click', () => {
          nameInput.value = drug.name;
          suggestions.innerHTML = '';
        });
        suggestions.appendChild(li);
      });
    })
    .catch(err => console.error('Autocomplete error:', err));
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const dose = doseInput.value.trim();
  if (name && dose) {
    currentDrugs.push({ name, dose });
    checkInteractions();
    nameInput.value = '';
    doseInput.value = '';
    suggestions.innerHTML = '';
  }
});

function renderDrugs(flaggedList = []) {
  drugList.innerHTML = '';
  currentDrugs.forEach(drug => {
    const li = document.createElement('li');
    li.textContent = `${drug.name} - ${drug.dose}`;
    if (flaggedList.includes(drug.name)) {
      li.classList.add('flagged');
    }
    drugList.appendChild(li);
  });
}

function checkInteractions() {
  const names = currentDrugs.map(d => d.name);
  fetch('https://polypharmacy.onrender.com/api/check-interactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ drugs: names })
  })
    .then(res => res.json())
    .then(data => {
      const flagged = data.flagged || [];
      renderDrugs(flagged);
    })
    .catch(err => console.error('Interaction error:', err));
}
