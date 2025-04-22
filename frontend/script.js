const apiUrl = 'https://polypharmacy.onrender.com/api/drugs';
const drugList = document.getElementById('drug-list');
const form = document.getElementById('drug-form');
const nameInput = document.getElementById('drug-name');
const doseInput = document.getElementById('drug-dose');

// Initial drug data from backend
fetch(apiUrl)
  .then(res => res.json())
  .then(data => {
    data.drugs.forEach(addDrugToList);
  })
  .catch(err => console.error(err));

// Fake interaction check
function hasInteraction(drugName) {
  const flagged = ['Aspirin', 'Warfarin']; // Example interaction list
  return flagged.includes(drugName);
}

// Add new drug from form
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const dose = doseInput.value.trim();
  if (name && dose) {
    addDrugToList({ name, dose });
    nameInput.value = '';
    doseInput.value = '';
  }
});

// Add drug to list in the DOM
function addDrugToList(drug) {
  const li = document.createElement('li');
  li.textContent = `${drug.name} - ${drug.dose}`;
  if (hasInteraction(drug.name)) {
    li.classList.add('flagged');
  }
  drugList.appendChild(li);
}
