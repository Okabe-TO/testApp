window.onload = () => {
	const scene = document.querySelector('a-scene');

	navigator.geolocation.getCurrentPosition(async function (position) {
		try {
			const functionUrl = `https://us-central1-test-398207.cloudfunctions.net/getPlaces?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`;
			const response = await fetch(functionUrl);
			const places = await response.json();

			alert(position.coords.latitude + " : " + position.coords.longitude);
			alert(JSON.stringify(places));  // データの確認

			places.forEach((place) => {
				const latitude = place.geometry.location.lat;
				const longitude = place.geometry.location.lng;

				const placeEntity = document.createElement('a-entity');  // a-entityを使用
				placeEntity.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
				placeEntity.setAttribute('scale', '5 5 5');  // サイズを調整

				const placeText = document.createElement('a-text');  // a-textを使用
				placeText.setAttribute('value', place.name);
				placeText.setAttribute('color', 'white');  // 文字色を白に
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
