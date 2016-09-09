window.onload = function(){
	var button = document.getElementById("vorschauButton");
	//button.onclick = vorschauHandler;
//	erzeugeBild();
}

function aktualisiereTweets(tweets) {
	var tweetAuswahl = document.getElementById("tweets");

	// Alle Tweets in das Tweets-Menü einfügen
	for (var i = 0; i < tweets.length; i++) {
		tweet = tweets[i];

		// Option erstellen
		var option = document.createElement("option");
		option.text = tweet.text;

		// Alle Anführungszeichen aus dem Tweet entfernen, damit unsere Option
		// nicht zerstört wird
		option.value = tweet.text.replace("\"", "'");

		// Option zum select-Element hinzufügen
		tweetAuswahl.options.add(option);
  }
	// Obersten Tweet auswählen
	tweetAuswahl.selectedIndex = 0;
}