const express = require('express');
const cors = require('cors');
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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
