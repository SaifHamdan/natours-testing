/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoic2FpZmhhbWRhbiIsImEiOiJja2lrNWpkeW4wNTZtMzFwOXlzMmRiZ295In0.h_ZjmpClUw4whvm4AqjVqQ';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/saifhamdan/ckik5v9q40myx17o36yotpc0z',
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 7,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create Marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}`)
      .addTo(map);

    // Extend map to bound
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
