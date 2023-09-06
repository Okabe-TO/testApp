window.onload = () => {
	const scene = document.querySelector('a-scene');

	navigator.geolocation.getCurrentPosition(async function (position) {
		try {
			const functionUrl = `https://us-central1-test-398207.cloudfunctions.net/getPlaces?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`;
			const response = await fetch(functionUrl);
			const places = await response.json();

			places.forEach((place) => {
				const latitude = place.geometry.location.lat;
				const longitude = place.geometry.location.lng;

				const placeEntity = document.createElement('a-entity');
				placeEntity.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
				placeEntity.setAttribute('scale', '5 5 5');

				const placeText = document.createElement('a-text');
				placeText.setAttribute('value', place.name);
				placeText.setAttribute('color', 'white');
				placeText.setAttribute('stroke-color', 'black');
				placeText.setAttribute('stroke-width', '0.2');
				placeText.setAttribute('align', 'center');

				placeEntity.appendChild(placeText);

				placeEntity.addEventListener('loaded', () => {
					window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'));
				});

				scene.appendChild(placeEntity);
			});
		} catch (err) {
			console.error('Error:', err);
			alert('Error: ' + err.message);
		}
	}, (err) => {
		console.error('Geolocation error:', err);
		alert('Geolocation error: ' + err.message);
	}, {
		enableHighAccuracy: true,
		maximumAge: 0,
		timeout: 27000,
	});
};
