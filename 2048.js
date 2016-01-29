function Game (wrapper) {
	this.wrapper = wrapper;
	this.pieces = Array(16);
	this.deleagte = document.createDocumentFragment();
}
Game.prototype = {
	constructor: constructor,
	keynum: 0,
	init: function () {
		for (var i = 0, length = this.pieces.length; i < length; i++) {
			var piece = this.createPiece();
			piece.setAttribute("index", i);
			this.pieces[i] = piece;
			this.deleagte.appendChild(piece);
		}
		this.wrapper.appendChild(this.deleagte);
		this.randomPiece();
	},
	createPiece: function (value) {
		var piece = document.createElement("div");
		value = value || 0;
		this.setPieceVal(piece, value);
		return piece;
	},
	setPieceVal: function (piece, value) {
		value = value > 0 ? value : "";
		piece.className = "piece" + value; 
		piece.setAttribute("value", Number(value));
		piece.innerText = value;
	},
	randomPiece: function () {
		var zeroPieces = [];
		for (var i = 0, length = this.pieces.length; i < length; i++) {
			if (this.pieces[i].getAttribute("value") === "0") {
				zeroPieces.push(this.pieces[i]);
			}
		}
		var rand = Math.floor(Math.random() * zeroPieces.length),
			reset = zeroPieces[rand],
			value = Math.random() < 0.75 ? 2 : 4;
		this.setPieceVal(reset, value);	
	},
	move: function (direction) {
		var j;
		switch (direction) {
			// 向左
			case 37: 
				for (var i = 1, length = this.pieces.length; i < length; i++) {
					j = i;
					while (j % 4 !== 0) {
						this.merge(this.pieces[j - 1], this.pieces[j]);
						j -= 1;
					}
				}
				break;
			// 向上
			case 38:
				for (var i = 4, length = this.pieces.length; i < length; i++) {
					j = i;
					while (j >= 4) {
						this.merge(this.pieces[j - 4], this.pieces[j]);
						j -= 4;
					}
				}
				break;
			//　向右
			case 39:
				for (var i = 14; i >= 0; i--) {
					j = i;
					while (j % 4 !== 3) {
						this.merge(this.pieces[j + 1], this.pieces[j]);
						j += 1;
					}
				}
				break;
			// 向下
			case 40: 
				for (var i = this.pieces.length - 5; i >= 0; i--) {
					j = i;
					while (j <= 11) {
						this.merge(this.pieces[j + 4], this.pieces[j]);
						j += 4;
					}
				}
				break;	
		}
		this.randomPiece();
	},
	merge: function (prevPiece, currPiece) {
		var prevVal = prevPiece.getAttribute("value"),
			currVal = currPiece.getAttribute("value");
		if (currVal !== "0") {
			if (prevVal === "0") {
				this.setPieceVal(prevPiece, currVal);
				this.setPieceVal(currPiece, 0);
			} else if (prevVal === currVal) {
				this.setPieceVal(prevPiece, +prevVal * 2);
				this.setPieceVal(currPiece, 0);
			}
		}
	},
	equals: function (pieceA, pieceB) {
		return pieceA.getAttribute("value") === pieceB.getAttribute("value");
	},
	over: function () {
		for (var i = 0, length = this.pieces.length; i < length; i++) {
			if (this.pieces[i].getAttribute("value") === "0") {
				return false;
			}
			if (i % 4 !== 3) {
				if (this.equals(this.pieces[i], this.pieces[i + 1])) {
					return false;
				}
			}
			if (i < 12) {
				if (this.equals(this.pieces[i], this.pieces[i + 4])) {
					return false;
				}
			}
		}
		return true;
	},
	win: function () {
		for (var i = 0, length = this.pieces.length; i < length; i++) {
			if (this.pieces[i].getAttribute("value") === "2048") {
				return true;
			}
		}
	},
	changeStyle: function (keynum) {
		var keys = [37, 38, 39, 40];
		if (this.over()) {
			if (this.win()) alert("你已经胜利了");
			else alert("你已经输了");
		} else {
			if (keys.indexOf(keynum) > - 1) {
				this.move(keynum);					
			}
		}
	},
	gameStart: function (style) {
		var game = this;
		if (style === 'pc') {
			// 键盘事件
			document.onkeydown = function (event) {
				event = event || window.event;
				game.keynum = event.keyCode || event.which;
				game.changeStyle(game.keynum);
			}
		} else if (style === 'phone') {
			Touch(game.keynum, game.changeStyle.bind(this));
		}
	}
};
window.onload = function () {
	var wrapper = document.querySelector("#wrapper"),
		game = new Game(wrapper),
		navigatorInfo = navigator.appVersion,
		playStyle = navigatorInfo.match(/(Android)|(iPhone)/gi),
		playStyle = playStyle ? 'phone' : 'pc';
	game.init();
	game.gameStart(playStyle);
};
