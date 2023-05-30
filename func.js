//יובל צדיק 208996231 
//דור בן שטרית 208631887

$(document).ready(function() {
  var playerName;
  var numPairs;
  var cards = [];
  var flippedCards = [];
  var matchedCards = [];
  var timer;
  var seconds = 0;
  var flag = 0;
  var leaderboard = [];
  var difficulty = 2; // seconds
  var mistakes = 0; 

  function startGame() {
    flag = 0;
    mistakes = 0; 
    playerName = prompt("Enter your name:");
    do {
      if(flag==1){
        alert("Invalid input. Please enter a number between 1 and 30.");
      }
      numPairs = parseInt(prompt("Enter the number of pairs (max 30):"));
      flag = 1;
    } while(isNaN(numPairs) || numPairs < 1 || numPairs > 30)

    $("#player-name").text("Player: " + playerName);

    for (var i = 1; i <= numPairs; i++) {
      cards.push(i);
      cards.push(i);
    }

    shuffleCards(cards);

    for (var i = 0; i < numPairs * 2; i++) {
      var card = $("<div></div>").addClass("card");
      card.attr("data-value", cards[i]);
      card.click(cardClick);
      $("#game-board").append(card);
    }

    timer = setInterval(updateTimer, 1000);
  }

  function shuffleCards(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  function cardClick() {
    var card = $(this);

    if (flippedCards.length < 2 && !card.hasClass("matched") && !card.hasClass("flipped")) {
      card.text(card.attr("data-value"));
      card.addClass("flipped");
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        if (flippedCards[0].attr("data-value") === flippedCards[1].attr("data-value")) {
          flippedCards[0].addClass("matched");
          flippedCards[1].addClass("matched");
          matchedCards.push(flippedCards[0]);
          matchedCards.push(flippedCards[1]);
          flippedCards = [];

          if (matchedCards.length === numPairs * 2) {
            clearInterval(timer);
            var newScore = { name: playerName, time: seconds, pairs: numPairs, mistakes: mistakes };
            leaderboard.push(newScore);

          
          leaderboard.sort(function(a, b) { return a.time - b.time || a.mistakes - b.mistakes; });
            displayLeaderboard();
           
            var betterOrEqualScores = leaderboard.filter(entry => entry.pairs === numPairs && (entry.time < newScore.time || (entry.time === newScore.time && entry.mistakes <= newScore.mistakes)));
            var position = betterOrEqualScores.length;
            $("#result").text("Congratulations! You completed the game in " + seconds + " seconds.");
            $("#result").prepend("You took the " + position + " st in your category.<br>"); 

            var bestTime = leaderboard.find(entry => entry.pairs === numPairs).time;
            if (bestTime < seconds) {
                var timeDifference = seconds - bestTime;
                $("#result").append("<br>You are " + timeDifference + " seconds away from the top score in this category.");
            }

            $("#play-again").show();
          }
        } else {
          mistakes++;
          setTimeout(function() {
            flippedCards[0].text("");
            flippedCards[0].removeClass("flipped");
            flippedCards[1].text("");
            flippedCards[1].removeClass("flipped");
            flippedCards = [];
          }, difficulty * 1000);
        }
      }
    }
  }

  function updateTimer() {
    seconds++;
    $("#timer").text("Time: " + seconds + "s");
  }

  function displayLeaderboard() {
    var leaderboardDiv = $("#leaderboard");
    leaderboardDiv.empty();
    leaderboardDiv.append("<h2>Leaderboard</h2>");

    var groups = {};
    for (var i = 0; i < leaderboard.length; i++) {
        var pairs = leaderboard[i].pairs;
        if (!groups[pairs]) {
            groups[pairs] = [];
        }
        groups[pairs].push(leaderboard[i]);
    }

    for (var pairs in groups) {
        groups[pairs].sort(function(a, b) { return a.time - b.time || a.mistakes - b.mistakes; });
    }

    var table = $("<table></table>").addClass("table table-striped");

    var headers = $("<tr></tr>");
    headers.append("<th>Name</th>");
    headers.append("<th>Time (s)</th>");
    headers.append("<th>Pairs</th>");
    headers.append("<th>Mistakes</th>"); 
    table.append(headers);

    for (var pairs in groups) {
        for (var i = 0; i < groups[pairs].length; i++) {
            var row = $("<tr></tr>");
            row.append("<td>" + groups[pairs][i].name + "</td>");
            row.append("<td>" + groups[pairs][i].time + "</td>");
            row.append("<td>" + groups[pairs][i].pairs + "</td>");
            row.append("<td>" + groups[pairs][i].mistakes + "</td>"); 
            table.append(row);
        }

        if (Object.keys(groups).length > 1 && pairs != Object.keys(groups).pop()) {
            var separator = $("<tr></tr>");
            separator.append("<td colspan='4' style='background-color: #f5f5f5;'></td>");
            table.append(separator);
        }
    }

    leaderboardDiv.append(table);
  }

  $("#play-again").click(function() {
    $("#game-board").empty();
    $("#result").text("");
    $("#play-again").hide();
    cards = [];
    flippedCards = [];
    matchedCards = [];
    seconds = 0;
    mistakes = 0; 
    startGame();
  });

  startGame();
});
