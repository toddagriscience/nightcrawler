// Copyright (c) Todd Agriscience, Inc. All rights reserved.

/** A short script for fetching API routes from the backend. These API routes are accessible via importing src/apiRoutes.json. If you're strictly a frontend developer, you can largely disregard this script. */
import fs from 'fs';

try {
  if (process.env.BACKEND_HOST == undefined) {
    console.log(
      "BACKEND_HOST was undefined - not fetching API routes\nIgnore me if you're a frontend developer."
    );
  } else {
    const apiUrl = process.env.BACKEND_HOST + '/api-routes';

    fetch(apiUrl)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        fs.writeFileSync('src/apiRoutes.json', JSON.stringify(json));
      })
      .catch((err) => {
        console.log('Error saving file: ' + err);
      });
  }
} catch (error) {
  console.log(error);
}
