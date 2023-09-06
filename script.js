window.onload = () => {
	const scene = document.querySelector('a-scene');

	navigator.geolocation.getCurrentPosition(async function (position) {
		try {
			const functionUrl = `https://us-central1-test-398207.cloudfunctions.net/getPlaces?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`;
			const response = await fetch(functionUrl);
			const places = await response.json();

			alert(position.coords.latitude + " : " + position.coords.longitude);
			alert(places);

			places.forEach((place) => {
				const latitude = place.geometry.location.lat;
				const longitude = place.geometry.location.lng;

				const placeText = document.createElement('a-link');
				placeText.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
				placeText.setAttribute('title', place.name);
				placeText.setAttribute('scale', '15 15 15');

				placeText.addEventListener('loaded', () => {
					window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'));
				});

				scene.appendChild(placeText);
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
