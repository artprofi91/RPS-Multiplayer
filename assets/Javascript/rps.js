// firebase reference
var database = firebase.database();

// global variables
var playerNum;
var user1choice;
var user2choice;
var updates = {};
var key = "pick2";
var status;
var wait = ("<div class='wait'>" + "Waiting for other player..." + "</div>");

// 1. send player's names to database
// 2. first player to join the game as PlayerNum 1 and  second to PlayerNum 2
// 3. if 2 players entered then starts checkForPicks function
database.ref("playerInfo").on('value', function(snapshot) {
  // snapshot.child() gets a DataSnapshot for the location at the specified relative path
  // exists() returns boolean
  // returns true if this DataSnapshot contains any data
  // it is slightly more efficient than using snapshot.val() !== null.
  var player1Name = snapshot.child("name").exists();
  var player2Name = snapshot.child("name2").exists();
  if (!player1Name){
    $("#submitName").on("click", function() {
      var name = $('#nameinput').val().trim();
      database.ref("playerInfo").set({
        name: name
      });
      playerNum = 1;
      $(".p1Wait").removeClass("hide");
      $(".results").removeClass("hide");
      $(".p1wins").removeClass("hide");
      $(".p2wins").removeClass("hide");
      $(".draws").removeClass("hide");
      // open modal character
      $("#characterModal").modal({
        backdrop: "static",
        keyboard: false});  
      $("#r1").click(function(){
        $("#r2").addClass("hide");
        $("#r3").addClass("hide");
        $("#rock1").attr("src","assets/Images/r1.png");
      });
      $("#r2").click(function(){
        $("#r1").addClass("hide");
        $("#r3").addClass("hide");
        $("#rock1").attr("src","assets/Images/r2.png");
      });
      $("#r3").click(function(){
        $("#r1").addClass("hide");
        $("#r2").addClass("hide");
        $("#rock1").attr("src","assets/Images/r3.png");
      });
      $("#p1").click(function(){
        $("#p2").addClass("hide");
        $("#p3").addClass("hide");
        $("#paper1").attr("src","assets/Images/p1.png");
      });
      $("#p2").click(function(){
        $("#p1").addClass("hide");
        $("#p3").addClass("hide");
        $("#paper1").attr("src","assets/Images/p2.png");
      });
      $("#p3").click(function(){
        $("#p1").addClass("hide");
        $("#p2").addClass("hide");
        $("#paper1").attr("src","assets/Images/p3.png");
      });
      $("#s1").click(function(){
        $("#s2").addClass("hide");
        $("#s3").addClass("hide");
        $("#scissors1").attr("src","assets/Images/s1.png");
      });
      $("#s2").click(function(){
        $("#s1").addClass("hide");
        $("#s3").addClass("hide");
        $("#scissors1").attr("src","assets/Images/s2.png");
      });
      $("#s3").click(function(){
        $("#s1").addClass("hide");
        $("#s2").addClass("hide");
        $("#scissors1").attr("src","assets/Images/s3.png");
      });
      // hide nameinput and chat can grab it value
      $("#nameinput").addClass("hide");
      $(".p1Wait").html("Waiting for other player to join...");
      return false;
    }); // end of submitName on click
  } else if (player1Name === true && !player2Name){
    $("#submitName").on("click", function() {
      var name2 = $('#nameinput').val().trim();
      var updateName = {};
      var namekey = "name2";
      updateName['/playerInfo/' + namekey] = name2;
      database.ref().update(updateName);
      playerNum = 2;
      $(".p2Wait").removeClass("hide");
      $(".results").removeClass("hide");
      $(".p1wins").removeClass("hide");
      $(".p2wins").removeClass("hide");
      $(".draws").removeClass("hide");
      // open modal character
      $("#characterModal").modal({
        backdrop: "static",
        keyboard: false});  
      $("#r1").click(function(){
        $("#r2").addClass("hide");
        $("#r3").addClass("hide");
        $("#rock2").attr("src","assets/Images/r1.png");
      });
      $("#r2").click(function(){
        $("#r1").addClass("hide");
        $("#r3").addClass("hide");
        $("#rock2").attr("src","assets/Images/r2.png");
      });
      $("#r3").click(function(){
        $("#r1").addClass("hide");
        $("#r2").addClass("hide");
        $("#rock2").attr("src","assets/Images/r3.png");
      });
      $("#p1").click(function(){
        $("#p2").addClass("hide");
        $("#p3").addClass("hide");
        $("#paper2").attr("src","assets/Images/p1.png");
      });
      $("#p2").click(function(){
        $("#p1").addClass("hide");
        $("#p3").addClass("hide");
        $("#paper2").attr("src","assets/Images/p2.png");
      });
      $("#p3").click(function(){
        $("#p1").addClass("hide");
        $("#p2").addClass("hide");
        $("#paper2").attr("src","assets/Images/p3.png");
      });
      $("#s1").click(function(){
        $("#s2").addClass("hide");
        $("#s3").addClass("hide");
        $("#scissors2").attr("src","assets/Images/s1.png");
      });
      $("#s2").click(function(){
        $("#s1").addClass("hide");
        $("#s3").addClass("hide");
        $("#scissors2").attr("src","assets/Images/s2.png");
      });
      $("#s3").click(function(){
        $("#s1").addClass("hide");
        $("#s2").addClass("hide");
        $("#scissors2").attr("src","assets/Images/s3.png");
      });
      // hide nameinput and chat can grab it value
      $("#nameinput").addClass("hide");
      return false;
    }); // end of submitName on click
  } else if (player1Name === true && player2Name === true){
    hideForm();
    setCounts();
    checkForPicks();
  }
});

// 1. check if player 1 exists
// 2. check if player 2 exists
// 3. player 1 to P1 div and player 2 to P2 div
database.ref("playerInfo").on('value', function(snapshot) {
  var checkName = snapshot.child("name").exists();
  if (checkName === true){
    $(".p1Name").html(snapshot.val().name);
  }
});

database.ref("playerInfo").on('value', function(snapshot) {
  var checkName2 = snapshot.child("name2").exists();
  if (checkName2 === true){
    $(".p2Name").html(snapshot.val().name2);
  }
});

// disconnect, alerts remaining user and resets game
database.ref("playerInfo").once('child_removed', function(snapshot) {
  showForm();
  $(".p1Name").html("Player 1");
  $(".p2Name").html("Player 2");
  $(".score").empty();
  $(".results").empty();
  $('#nameinput').val('');
  $(".p1Choice").addClass("hide");
  $(".p2Choice").addClass("hide");
  $(".p1Wait").empty();
  $(".p2Wait").empty();
  $(".messages").empty();
  // open modal error1
  $("#error1Modal").modal({
  backdrop: "static",
  keyboard: false});
  
});

// remove data on disconnect
database.ref("playerInfo").onDisconnect().remove();
database.ref("playerpicks").onDisconnect().remove();
database.ref("counts").onDisconnect().remove();
database.ref("messages").onDisconnect().remove();

// show form with enter nickname after player dicsonnected
function showForm(){
  $("#submitName").removeClass("hide");
  $("#nameinput").removeClass("hide");
  $(".nickname").removeClass("hide");
}

// hideForm after player 2 entered
function hideForm() {
  $("#submitName").addClass("hide");
  $("#nameinput").addClass("hide");
  $(".nickname").addClass("hide");
}

// set Counts to 0 in firebase
function setCounts() {
  var p1winCount = 0;
  var p2winCount = 0;
  var drawCount = 0;
  database.ref("counts").on('value', function(snapshot){
    var resetCheck = snapshot.child("drawCount").exists();
    if (!resetCheck){
      database.ref('counts').set({
        drawCount: drawCount,
        p1wins: p1winCount,
        p2wins: p2winCount
      });
    }
  })
}

// 1. player 1 make a pick or not
// 2. if player 1 pick then ask plauer 2 to pick
// 3. if both pick then compare picks
function checkForPicks(){
  database.ref("playerpicks").on('value', function(snapshot) {
    var checkPick = snapshot.child("pick").exists();
    var checkPick2 = snapshot.child("pick2").exists();
    if (playerNum == 1 && !checkPick){
      $(".p1Wait").addClass("hide");
      $(".p1Choice").removeClass("hide");
    } else if (playerNum == 2 && !checkPick){
      $(".p2Wait").html("Waiting for other player to make a selection...");
    } else if (checkPick === true && playerNum == 2 && !checkPick2){
      $(".p2Wait").addClass("hide");
      $(".p2Choice").removeClass("hide");
    } else if (checkPick === true && checkPick2 === true){
      comparePicks();
    }
  });
}

// rock to database if rock was chosen
$(".rock").on("click", function() {

  var text = ("<div class='choice'>" + "You chose: Rock" + "</div>");

  if (playerNum == 1){
    user1choice = "rock";
    database.ref('playerpicks').set({
      pick: user1choice
    });
    $(".p1Choice").addClass("hide");
    $(".p1Wait").removeClass("hide");
    $(".p1Wait").html(text);
    $(".p1Wait").append(wait);
    checkForPicks();
  } else if (playerNum == 2){
    user2choice = "rock";
    updates['/playerpicks/' + key] = user2choice;
    database.ref().update(updates);
    $(".p2Choice").addClass("hide");
    checkForPicks();
  }
});

// paper to database if paper was chosen
$(".paper").on("click", function() {

  var text = ("<div class='choice'>" + "You chose: Paper" + "</div>");

  if (playerNum == 1){
    user1choice = "paper";
    database.ref('playerpicks').set({
      pick: user1choice
    });
    $(".p1Choice").addClass("hide");
    $(".p1Wait").removeClass("hide");
    $(".p1Wait").html(text);
    $(".p1Wait").append(wait);
    checkForPicks();
  } else if (playerNum == 2){
    user2choice = "paper";
    updates['/playerpicks/' + key] = user2choice;
    database.ref().update(updates);
    $(".p2Choice").addClass("hide");
    checkForPicks();
  }
});

// scissors to database if scissors was chosen
$(".scissors").on("click", function() {

  var text = ("<div class='choice'>" + "You chose: Scissors" + "</div>");

  if (playerNum == 1){
    user1choice = "scissors";
    database.ref('playerpicks').set({
      pick: user1choice
    });
    $(".p1Choice").addClass("hide");
    $(".p1Wait").removeClass("hide");
    $(".p1Wait").html(text);
    $(".p1Wait").append(wait);
    checkForPicks();
  } else if (playerNum == 2){
    user2choice = "scissors";
    updates['/playerpicks/' + key] = user2choice;
    database.ref().update(updates);
    $(".p2Choice").addClass("hide");
    checkForPicks();
  }
});

// 1. compare picks
// 2. removed user picks from database after they were compared
function comparePicks() {
  database.ref("playerpicks").once('value').then(function(snapshot) { 
    var user1pick = snapshot.val().pick;
    var user2pick = snapshot.val().pick2;
    var p1winText = ("<div class='resultText'>" + "Player 1 wins!" + "</div>");
    var p2winText = ("<div class='resultText'>" + "Player 2 wins!" + "</div>");
    var drawText = ("<div class='resultText'>" + "It's a draw!" + "</div>");
    $('.results').html("<div class='p1pick'>" + user1pick + "</div>");
    $('.results').append("<div class='p2pick'>" + user2pick + "</div>");
    if (user1pick == user2pick) {
      $('.results').append(drawText);
      status = "draw";
      updateCounts();
    } else if (user1pick == "rock" && user2pick == "scissors" || 
      user1pick == "paper" && user2pick == "rock" || 
      user1pick == "scissors" && user2pick == "paper") {
      $('.results').append(p1winText);
      status = "p1win";
      updateCounts();
    } else if (user1pick == "rock" && user2pick == "paper" || 
      user1pick == "paper" && user2pick == "scissors" || 
      user1pick == "scissors" && user2pick == "rock") {
      $('.results').append(p2winText);
      status = "p2win";
      updateCounts();
    }
  });
}

// update counts in database on compares basis
function updateCounts() {
  database.ref("playerpicks").remove();
  database.ref("counts").once('value').then(function(snapshot) {
    var currDrawCount = snapshot.val().drawCount;
    var currP1winCount = snapshot.val().p1wins;
    var currP2winCount = snapshot.val().p2wins;
    if (status == "draw"){
      var drawUpdates = {};
      var newDrawCount = currDrawCount += 1;
      var drawKey = "drawCount";
      drawUpdates['/counts/' + drawKey] = newDrawCount;
      database.ref().update(drawUpdates);
      postCounts();

    } else if (status == "p1win"){
      var p1winUpdates = {};
      var newp1Count = currP1winCount += 1;
      var p1winKey = "p1wins";
      p1winUpdates['/counts/' + p1winKey] = newp1Count;
      database.ref().update(p1winUpdates);
      postCounts();

    } else if (status == "p2win"){
      var p2winUpdates = {};
      var newp2Count = currP2winCount += 1;
      var p2winKey = "p2wins";
      p2winUpdates['/counts/' + p2winKey] = newp2Count;
      database.ref().update(p2winUpdates);
      postCounts();
    }
  });
};

// 1. updated count to html 
// 2. reset game and player 1 can select again
function postCounts() {
  database.ref("counts").once('value').then(function(snapshot) {
    var p1WinsNum = snapshot.val().p1wins;
    var p2WinsNum = snapshot.val().p2wins;
    var drawCountNum = snapshot.val().drawCount;
    $(".p1wins").html("P1 wins: <br>" + p1WinsNum);
    $(".p2wins").html("P2 wins: <br>" + p2WinsNum);
    $(".draws").html("Draws: <br>" + drawCountNum);
    if (playerNum == 2){
      $(".p2Wait").html(wait);
      $(".p2Wait").removeClass("hide");
    }
    checkForPicks();
  });
}

// chatBox
  var messageField = $('#messageInput');
  var messageName = $('#nameinput');
  var messageList = $('.messages');

// in chat on click send button
$('.chat').on('submit', function(e) {

  // preventDefault - stops from submitting
  e.preventDefault();

  // create message object
  var message = {
    name : messageName.val(),
    text : messageField.val()
  }

  // dave message to firebase with unique key
  var newMessageKey = firebase.database().ref().child('messages').push().key;
  var messageUpdates = {};
  messageUpdates['/messages/' + newMessageKey] = message;
  database.ref().update(messageUpdates);


  // clear messageField after send to chat
  messageField.val('');
});

// pull data from firebase and run addMessage
database.ref("messages").on('child_added', function(snapshot) {
  addMessage(snapshot.val());
});

// from firebase to page
function addMessage(data) {
  var username = data.name || 'anonymous';
  var message = data.text;

  // text to chat field
  var nameElement = $('<strong>').text(username + ":");
  var messageElement = $('<li>').text(message).prepend(nameElement);

  // add message to DOM
  messageList.append(messageElement);

  // scroll the bottom of the message list
  // very usefull, find it on stackoverflow
  messageList[0].scrollTop = messageList[0].scrollHeight;
}


$(document).ready(function() {
  // open modal rules
  $('#rules').click(function() {
    $("#video").attr("src","https://www.youtube.com/embed/FmQMs4T3VhQ?rel=0;&autoplay=1");
    $("#rulesModal").modal({
      backdrop: "static",
      keyboard: false});  
  });
  // stop autoplay youtube video
  $('.Close').click(function() {
    $("#video").attr("src","");
  });

  // click on volume off and music stop and change glyphicon
  $('#stop').click(function() {
    if (music.paused){
      music.play();
      $("#stop span").removeClass("glyphicon-volume-off");
      $("#stop span").addClass("glyphicon-volume-up");
    }else{
      music.pause();
      $("#stop span").removeClass("glyphicon-volume-up");
      $("#stop span").addClass("glyphicon-volume-off");
  }


});

  


}); // end of document ready function

