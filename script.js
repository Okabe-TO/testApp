window.onload = () => {
	const scene = document.querySelector('a-scene');

	// 最初に現在のユーザーの位置を取得
	return navigator.geolocation.getCurrentPosition(function (position) {
		const functionUrl = `https://us-central1-test-398207.cloudfunctions.net/getPlaces?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`;

		fetch(functionUrl)
			.then(response => response.json())
			.then((places) => {
				places.forEach((place) => {
					const latitude = place.geometry.location.lat;
					const longitude = place.geometry.location.lng;

					// 場所の名前を追加
					const placeText = document.createElement('a-link');
					placeText.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
					placeText.setAttribute('scale', '5 5 5');

					// Add text with white color and black stroke
					const textElement = document.createElement('a-text');
					textElement.setAttribute('value', place.name);
					textElement.setAttribute('color', 'white');
					textElement.setAttribute('stroke-color', 'black');
					textElement.setAttribute('stroke-width', '0.2');
					textElement.setAttribute('scale', '5 5 5');
					placeText.appendChild(textElement);

					placeText.addEventListener('loaded', () => {
						window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
					});

					scene.appendChild(placeText);
				});
			})
			.catch((err) => {
				console.error('Error in retrieving places', err);
				alert('Error in retrieving places: ' + err.message);
			});
	},
		(err) => {
			console.error('Error in retrieving position', err);
			alert('Error in retrieving position: ' + err.message);
		},
		{
			enableHighAccuracy: true,
			maximumAge: 0,
			timeout: 27000,
		});
};
