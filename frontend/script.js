const drugList = document.getElementById('drug-list');
const form = document.getElementById('drug-form');
const nameInput = document.getElementById('drug-name');
const doseInput = document.getElementById('drug-dose');
const suggestions = document.createElement('ul');
suggestions.id = 'autocomplete-list';
nameInput.parentNode.appendChild(suggestions);

// Initial drug data (optional fetch from backend if needed)
const initialDrugs = [
  { name: 'Aspirin', dose: '81mg' },
  { name: 'Metformin', dose: '500mg' }
];
initialDrugs.forEach(addDrugToList);

// Fake interaction check
function hasInteraction(drugName) {
  const flagged = ['Aspirin', 'Warfarin'];
  return flagged.includes(drugName);
}

// Autocomplete with RxNorm
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

// Handle adding new drug
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const dose = doseInput.value.trim();
  if (name && dose) {
    addDrugToList({ name, dose });
    nameInput.value = '';
    doseInput.value = '';
    suggestions.innerHTML = '';
  }
});

function addDrugToList(drug) {
  const li = document.createElement('li');
  li.textContent = `${drug.name} - ${drug.dose}`;
  if (hasInteraction(drug.name)) {
    li.classList.add('flagged');
  }
  drugList.appendChild(li);
}
