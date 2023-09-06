// ページが読み込まれたら実行される関数
window.onload = () => {
	// a-scene要素を取得
	const scene = document.querySelector('a-scene');

	// 現在の位置情報を取得
	navigator.geolocation.getCurrentPosition(async function (position) {
		try {
			// Firebase Cloud FunctionのURLを生成。緯度と経度をクエリパラメータとして付与。
			const functionUrl = `https://us-central1-test-398207.cloudfunctions.net/getPlaces?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`;

			// Firebase Cloud Functionにリクエストを送信
			const response = await fetch(functionUrl);

			// レスポンスをJSON形式で解析
			const places = await response.json();

			// 確認のために緯度と経度をアラート表示
			alert(position.coords.latitude + " : " + position.coords.longitude);

			// 確認のために取得した場所情報をアラート表示
			alert(JSON.stringify(places));

			// 取得した各場所に対して処理を行う
			places.forEach((place) => {
				// 緯度と経度を取得
				const latitude = place.geometry.location.lat;
				const longitude = place.geometry.location.lng;

				// a-entity要素を生成
				const placeEntity = document.createElement('a-entity');

				// GPS座標を設定
				placeEntity.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);

				// サイズを設定
				placeEntity.setAttribute('scale', '5 5 5');

				// a-text要素を生成して場所の名前を設定
				const placeText = document.createElement('a-text');
				placeText.setAttribute('value', place.name);
				placeText.setAttribute('color', 'white');
				placeText.setAttribute('align', 'center');

				// a-text要素をa-entity要素の子要素として追加
				placeEntity.appendChild(placeText);

				// 要素が読み込まれたらカスタムイベントを発火
				placeEntity.addEventListener('loaded', () => {
					window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'));
				});

				// a-entity要素をa-scene要素の子要素として追加
				scene.appendChild(placeEntity);
			});
		} catch (err) {
			// エラーが発生した場合はコンソールとアラートで表示
			console.error('Error:', err);
			alert('Error: ' + err.message);
		}
	}, (err) => {
		// 位置情報の取得に失敗した場合はコンソールとアラートで表示
		console.error('Geolocation error:', err);
		alert('Geolocation error: ' + err.message);
	}, {
		// 位置情報取得のオプション
		enableHighAccuracy: true,
		maximumAge: 0,
		timeout: 27000,
	});
};
