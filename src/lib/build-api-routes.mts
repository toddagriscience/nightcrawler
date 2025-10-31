// Copyright Todd LLC, All rights reserved.
import fs from 'fs';

const apiUrl = 'http://' + process.env.BACKEND_HOST + '/api-routes';

fetch(apiUrl)
  .then((res) => {
    return res.json();
  })
  .then((json) => {
    fs.writeFileSync('src/apiRoutes.json', JSON.stringify(json, null, 2));
  })
  .catch((err) => {
    console.log('Error saving file: ' + err);
  });
