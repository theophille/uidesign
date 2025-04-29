const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(express.json(), cors());

app.get('/dev-project', (req, res) => {
  const filePath = path.join(__dirname, 'projects/dev-project.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file', err);
      return res.status(500).send('Could not open the project because of an internal server error.');
    }

    res.send(JSON.parse(data));
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});