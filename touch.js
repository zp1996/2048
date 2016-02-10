var Touch = function (keynum, callback) {
	var startX,
		startY,
		disX,
		disY,
		hasTouched = 'ontouchstart' in window,
		touchstart = hasTouched ? 'touchstart' : 'mousedown',
		touchmove = hasTouched ? 'touchmove' : '',
		touchend = hasTouched ? 'touchend' : 'mouseup',
		slideW = document.body.clientWidth,
		slideH = document.body.clientHeight;
	function Start (e) {
		var point = hasTouched ? e.touches[0] : e;
		startX = point.pageX;
		startY = point.pageY;
		document.addEventListener(touchmove, Move, false);
		document.addEventListener(touchend, End, false);
	}
	function Move (e) {
		e.preventDefault();
		if (hasTouched) {
			if (e.touches.length > 1) return;
		}
		var point = hasTouched ? e.touches[0] : e;
		disX = point.pageX - startX;
		disY = point.pageY - startY;
	}
	function End (e) {
		e.preventDefault();
		var	x = Math.abs(disX),
			y = Math.abs(disY);
		if (x < slideW / 5 && y < slideH / 20) return;
		if (x > y) {
			keynum = disX > 0 ? 39 : 37;
		} else {
			keynum = disY > 0 ? 40 : 38;
		}
		document.removeEventListener(touchmove, Move, false);
		document.removeEventListener(touchend, End, false);
		callback(keynum);
	}
	document.addEventListener(touchstart, Start, false);
}