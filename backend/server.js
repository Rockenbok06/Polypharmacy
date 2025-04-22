const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const placeholderData = {
  drugs: [
    { name: 'Aspirin', dose: '81mg', interactions: [] },
    { name: 'Metformin', dose: '500mg', interactions: [] }
  ]
};

app.get('/api/drugs', (req, res) => {
  res.json(placeholderData);
});

// Proxy interaction check
app.post('/api/check-interactions', async (req, res) => {
  const drugNames = req.body.drugs || [];

  try {
    const rxCuis = await Promise.all(drugNames.map(async name => {
      const response = await axios.get('https://rxnav.nlm.nih.gov/REST/rxcui.json', {
        params: { name }
      });
      return response.data.idGroup.rxnormId?.[0];
    }));

    const filteredCuis = rxCuis.filter(id => !!id).join(',');

    const interactionRes = await axios.get('https://rxnav.nlm.nih.gov/REST/interaction/list.json', {
      params: { rxcuis: filteredCuis }
    });

    const interactions = interactionRes.data?.fullInteractionTypeGroup || [];

    const flagged = new Set();
    interactions.forEach(group => {
      group.fullInteractionType.forEach(inter => {
        inter.interactionPair.forEach(pair => {
          pair.interactionConcept.forEach(concept => {
            flagged.add(concept.sourceConceptItem.name);
          });
        });
      });
    });

    res.json({ flagged: Array.from(flagged) });
  } catch (error) {
    console.error('Interaction check failed:', error);
    res.status(500).json({ error: 'Failed to check interactions' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
