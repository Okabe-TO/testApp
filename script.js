window.onload = () => {
	const scene = document.querySelector('a-scene');

	// 最初に現在のユーザーの位置を取得
	return navigator.geolocation.getCurrentPosition(function (position) {
		const functionUrl = `https://us-central1-test-398207.cloudfunctions.net/getPlaces?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`;

		fetch(functionUrl)
			.then(response => response.json())
			.then((places) => {
				places.forEach((place) => {
					const latitude = place.location.lat;
					const longitude = place.location.lng;
					const placeId = place.place_id;  // Google Place ID

					// 場所の名前を追加
					const placeText = document.createElement('a-link');
					placeText.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
					placeText.setAttribute('title', place.name);
					placeText.setAttribute('scale', '20 20 20');  // 文字を大きくする

					// Google MapsのURLを生成
					const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${placeId}`;

					// タップしたときのイベントを追加
					placeText.addEventListener('click', () => {
						window.location.href = googleMapsUrl;  // Google Mapsにリダイレクト
					});

					placeText.addEventListener('loaded', () => {
						window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'));
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
