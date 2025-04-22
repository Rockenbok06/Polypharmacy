const apiUrl = 'REPLACE_WITH_YOUR_BACKEND_URL/api/drugs';
fetch(apiUrl)
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('drug-list');
    data.drugs.forEach(drug => {
      const li = document.createElement('li');
      li.textContent = `${drug.name} - ${drug.dose}`;
      list.appendChild(li);
    });
  })
  .catch(err => console.error(err));
