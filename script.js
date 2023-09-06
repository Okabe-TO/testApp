async function loadPlacesFromFirebase() {
	try {
		const response = await fetch('https://us-central1-test-398207.cloudfunctions.net/getPlaces');
		const data = await response.json();

		if (data.length > 0) {
			const placesContainer = document.getElementById('places-container');
			placesContainer.innerHTML = ''; // Clear previous places

			data.forEach((place) => {
				const placeElement = document.createElement('div');
				placeElement.className = 'place';
				placeElement.innerHTML = `
          <h2>${place.name}</h2>
          <p>Latitude: ${place.geometry.location.lat}</p>
          <p>Longitude: ${place.geometry.location.lng}</p>
        `;

				placesContainer.appendChild(placeElement);
			});
		} else {
			alert('No places found.');
		}
	} catch (error) {
		console.error('Error fetching places:', error);
		alert('Error fetching places: ' + error.message);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const loadPlacesButton = document.getElementById('load-places-button');
	loadPlacesButton.addEventListener('click', loadPlacesFromFirebase);
});
