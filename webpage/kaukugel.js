/* kaukugel.js */
/*
 * Inhalt einer JSON-Datei über JSONP
 * alle 3 Sekunden abrufen.
 *
 */
var letzteBerichtsZeit = 0;

window.onload = init;

function init() {
	var interval = setInterval(datenHandler, 3000);
	datenHandler();
}

function datenHandler() {
	console.log("here");
	var url = "http://gumball.wickedlysmart.com" +
				"?callback=aktualisiereZahlen" +
				//"&letzteBerichtsZeit=" + letzteBerichtsZeit +
				"&random=" + (new Date()).getTime();
	var neuesSkript = document.createElement("script");
	neuesSkript.setAttribute("src", url);
	neuesSkript.setAttribute("id", "jsonp");
	var altesSkript = document.getElementById("jsonp");
	var head = document.getElementsByTagName("head")[0];
	if (altesSkript == null) {
		head.appendChild(neuesSkript);
	}
	else {
		head.replaceChild(neuesSkript, altesSkript);
	}
}

function aktualisiereZahlen(verkauft) {
	var zahlenDiv = document.getElementById("verkauft");
	for (var i = 0; i < verkauft.length; i++) {
		var zahl = verkauft[i];
		var div = document.createElement("div");
		div.setAttribute("class", "verkaufsZahl");
		div.innerHTML = zahl.name + " has sold " + zahl.verkauft + " data.";
		//zahlenDiv.appendChild(div);
		if (zahlenDiv.childElementCount == 0) {
			zahlenDiv.appendChild(div);
		}
		else {
			zahlenDiv.insertBefore(div, zahlenDiv.firstChild);
		}
	}

	if (verkauft.length > 0) {
		letzteBerichtsZeit = sales[verkauft.length-1].time;
	}
}