var buttonStart = document.getElementById("buttonStart");
var buttonHit = document.getElementById("buttonHit");
var buttonStand = document.getElementById("buttonStand");
var inputText = document.getElementById("inputBet");
var pMessage = document.getElementById("pMessage");
var divPlayerCount = document.getElementById("divPlayerCount");
var divDealerCount = document.getElementById("divDealerCount");
var pBet = document.getElementById("pBet");

buttonStart.addEventListener("click", start);
buttonHit.addEventListener("click", hit);
buttonStand.addEventListener("click", stand);

var deck = [];
var playerHand = [];
var dealerHand = [];
var cash = 100;
var playerScore = 0;
var dealerScore = 0;

// runs when start button is clicked
// make sure betting value is a number, creates deck and deals the initial cards
function start()	{

	if(isNaN(inputText.value) || inputText.value === "")	{
		pMessage.innerHTML = "No bet set.";
	}
	else if(parseInt(inputText.value) < 0 || parseInt(inputText.value) > cash)	{
		pMessage.innerHTML = "Bet must be greater than 0 and not more than you own."

	}
	else {
		pMessage.innerHTML = "";
		inputText.readOnly = true;

			// reset deck if its a new game
			deck = [];

			// create deck
			var suit = ["Spades", "Diamonds", "Hearts", "Clubs"];
			var value = ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"];

			for(var i = 0; i < suit.length; i++)	{
				for(var j = 0; j < value.length; j++)	{
					var card = {Suit: suit[i], Value: value[j]};
					deck.push(card);
				}
			}

		// shuffle the deck using the fisher-yates algorithm
		shuffle(deck);

		buttonStart.disabled  = true;
		buttonHit.disabled = false;
		buttonStand.disabled = false;

		// gives two cards to the player and one to the dealer
		assignCardTo("player");
		assignCardTo("player");
		assignCardTo("dealer");

		// calculate score and display it
		playerScore = getCount(playerHand);
		dealerScore = getCount(dealerHand);

		divPlayerCount.textContent = "Player Score: " + playerScore;
		divDealerCount.textContent = "Dealer Score: " + dealerScore;

	}
}


// Fisher-Yates shuffle
function shuffle(deck) {
  var currentIndex = deck.length,  randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [deck[currentIndex], deck[randomIndex]] = [
      deck[randomIndex], deck[currentIndex]];
  }

}

// assign a card to either the player or dealer
function assignCardTo(target)	{
	if(target === "player")
		playerHand.push(deck.pop());
	else if(target === "dealer")
		dealerHand.push(deck.pop());
}

// on "hit" button click, give a new card to the player's hand and update score
function hit()	{
	assignCardTo("player");
	playerScore = getCount(playerHand);
	divPlayerCount.textContent = "Player Score: " + playerScore;

	// if player busts (gets more than 21)
	if(playerScore > 21)
		resetGame();

		// player wins right away
	else if(playerScore === 21)	{
		checkWinner(playerScore, dealerScore);
	}


	console.log(playerHand);
}

// on "stand" button click, pressed when player doesn't want anymore cards
// dealer draws cards until they reach a score of 17
function stand()	{
	assignCardTo("dealer");
	dealerScore = getCount(dealerHand);
	divDealerCount.textContent = "Dealer Score: " + dealerScore;

	if(dealerScore < 17)	{
		stand();
	}

	// dealer can't draw a new card after a score of 17, so check to see if player
	// wins and reset game
	else {
		resetGame();
	}

}

// check to see who wins, resets game stats
function resetGame()	{
	checkWinner(playerScore, dealerScore);
	buttonStart.disabled  = false;
	buttonHit.disabled = true;
	buttonStand.disabled = true;
	inputText.readOnly = false;

	deck = [];
	playerHand = [];
	dealerHand = [];
	playerScore = 0;
	dealerScore = 0;
}

// compares player score and dealer score, outputs winner
// and updates cash to bet with
function checkWinner(playerScore, dealerScore)	{

	console.log("Player hand:");
	console.log(playerHand);

	console.log("Dealer hand:");
	console.log(dealerHand);

	if(playerScore > 21)	{
		pMessage.textContent = "BUST! Player loses."
		cash -= parseInt(inputText.value);
		pBet.textContent = "Enter your bet here. Cash: $" + cash;
	}
	else if(playerScore > 21 && dealerScore > 21)	{
		pMessage.textContent = "Player loses."
		cash -= parseInt(inputText.value);
		pBet.textContent = "Enter your bet here. Cash: $" + cash;
	}
	else if(dealerScore > 21 && playerScore < 21)	{
		pMessage.textContent = "BUST! Player wins."
		cash += parseInt(inputText.value);
		pBet.textContent = "Enter your bet here. Cash: $" + cash;
	}
	else if(playerScore > dealerScore)	{
		pMessage.textContent = "Player wins!";
		cash += parseInt(inputText.value);
		pBet.textContent = "Enter your bet here. Cash: $" + cash;
	}
	else if(playerScore === 21 && dealerScore === 21 || playerScore === dealerScore)
		pMessage.textContent = "PUSH! No one wins...";
	else if(dealerScore > playerScore)	{
		pMessage.textContent = "Dealer wins!";
		cash -= parseInt(inputText.value);
		pBet.textContent = "Enter your bet here. Cash: $" + cash;
	}
}

// go through either hand's deck to calculate the total value
// Jack, Queen, King all give 10 points
// Ace gives either 1 or 11 depending on which benefits the player the most
function getCount(hand)	{
	var score = 0;

	for(var i = 0; i < hand.length; i++)	{

		if(hand[i].Value == "Jack" || hand[i].Value == "Queen" || hand[i].Value == "King")
			score += 10;
		else if(hand[i].Value == "Ace")
			(score + 11 <= 21) ? score += 11 : score += 1;
		else
			score += parseInt(hand[i].Value);

	}

	return score;
}
