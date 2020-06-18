require('dotenv').config();
const mbxStyles = require('@mapbox/mapbox-sdk/services/styles');
const stylesService = mbxStyles({ accessToken: process.env.MAPBOX_TOKEN});
geocodingClient.forwardGeocode({
    query: 'Paris, France',
    limit: 2
  })
    .send()
    .then(response => {
      const match = response.body;
    });


    