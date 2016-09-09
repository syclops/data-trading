window.onload = function(){
	var button = document.getElementById("vorschauButton");
	button.onclick = vorschauHandler;
	erzeugeBild();
}

function aktualisiereTweets(tweets) {
	var tweetAuswahl = document.getElementById("tweets");

	// Alle Tweets in das Tweets-Men� einf�gen
	for (var i = 0; i < tweets.length; i++) {
		tweet = tweets[i];

		// Option erstellen
		var option = document.createElement("option");
		option.text = tweet.text;

		// Alle Anf�hrungszeichen aus dem Tweet entfernen, damit unsere Option
		// nicht zerst�rt wird
		option.value = tweet.text.replace("\"", "'");

		// Option zum select-Element hinzuf�gen
		tweetAuswahl.options.add(option);
  }
	// Obersten Tweet ausw�hlen
	tweetAuswahl.selectedIndex = 0;
}