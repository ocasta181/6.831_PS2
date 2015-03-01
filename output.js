
//This script extracts parameters from the URL
//from jquery-howto.blogspot.com

$.extend({
    getUrlVars : function() {
        var vars = [], hash;
        var hashes = window.location.href.slice(
                window.location.href.indexOf('?') + 1).split('&');
        for ( var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar : function(name) {
        return $.getUrlVars()[name];
    }
});

var DEFAULT_BOARD_SIZE = 8;

//data model
var board;
var rules;
var whoseTurn = "black";	

var directionOf = function(color) {
  if (color == "black") {
    return -1;
  }
  return 1;
}

// Fill in this function to toggle the display for whose turn
// The color parameter should be either "black" or "red"
var toggleTurn = function(color) {
    if (whoseTurn == "black"){
        whoseTurn = "red";
    }else{
        console.log("got here!")
        whoseTurn = "black";
    }

    setTurnDisplay(whoseTurn);
    //ctx.rotate(180);

}

var setTurnDisplay = function(color){

    $("#turn_display").text(function(){
        return color.charAt(0).toUpperCase() + color.slice(1) + " Turn";
    });
    if(color == "black"){
        var textColor = "white"; 
    } else {
        var textColor = "black";
    };
    $("#turn_display").css({"background-color": color, "color": textColor});
}

var initializeBoard = function(board) {
            //Initialize the board
    square_size = 400 / board.boardSize;    // declared in global scope
    var c = document.getElementById("checker_board");
    ctx=c.getContext("2d");
    ctx.fillStyle="grey";

    for(var row = 0; row < board.boardSize; row++){
        for (var col = 0; col < board.boardSize; col++){
            if((parseInt(row)+parseInt(col)) % 2 != 0){
                ctx.fillRect(col * square_size, row * square_size, square_size, square_size);               
            };
        };
    };
    red_checker = new Image();
    black_checker = new Image();
    red_king = new Image();
    black_king = new Image();
    red_checker.src = 'graphics/red-piece.png';
    black_checker.src = 'graphics/black-piece.png';
    red_king.src = 'graphics/red-king.png';
    black_king.src = 'graphics/black-king.png';



};

var refreshPeices = function(board){
    var checkers = board.getAllCheckers();

    for (var i = 0; i < checkers.length; i++){
        var checker = checkers[i];
        var x = checker.col*square_size;
        var y = checker.row*square_size;
        if(checker.isKing){
            if(checker.color == "red"){
                ctx.drawImage(red_king, x, y, square_size, square_size);
            } else {
                ctx.drawImage(black_king, x, y, square_size, square_size);
            };
        } else {
            if(checker.color == "red"){
                ctx.drawImage(red_checker, x, y, square_size, square_size);
            } else {
                ctx.drawImage(black_checker, x, y, square_size, square_size);
            };
        }
    };
    console.log("did a board refresh");
};



var markLastMove = function(result){

    var toCenterDim = function(pos){
        return (pos*square_size)+(square_size/2);
    };

    start_x = toCenterDim(result.from_col);
    start_y = toCenterDim(result.from_row);
    end_x = toCenterDim(result.to_col);
    end_y = toCenterDim(result.to_row);
};

var lastMoveIndicator = function(){

    ctx.strokeStyle = "yellow";
    ctx.lineWidth = square_size*.1;
    ctx.beginPath();
    ctx.moveTo(start_x, start_y);
    ctx.lineTo(end_x,end_y);
    ctx.stroke();

    var moveScalar_x = start_x - end_x;
    var moveScalar_y = start_y - end_y;
    var moveDirection_x = moveScalar_x?moveScalar_x<0?-1:1:0;
    var moveDirection_y = moveScalar_y?moveScalar_y<0?-1:1:0;

    if(start_x == end_x){
        ctx.beginPath();
        ctx.moveTo(end_x+(square_size*.3),end_y+(square_size*moveDirection_y*.3));
        ctx.lineTo(end_x,end_y);
        ctx.lineTo(end_x-(square_size*.3),end_y+(square_size*moveDirection_y*.3));
        ctx.stroke();
        
    } else {
        ctx.beginPath();
        ctx.moveTo(end_x,end_y+(square_size*moveDirection_y*.3));
        ctx.lineTo(end_x,end_y);
        ctx.lineTo(end_x+(square_size*moveDirection_x*.3),end_y);
        ctx.stroke();

    }
    console.log("indicated last move");
}



// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.
$(document).ready(function() {

    if ($.getUrlVar('size') && $.getUrlVar('size') >= 6) {
        board = new Board($.getUrlVar('size'));
    } else {
        board = new Board(DEFAULT_BOARD_SIZE);
    }

    rules = new Rules(board);

    initializeBoard(board);
    


    var refreshBoard = function(){
        ctx.clearRect(0,0,400,400);
        initializeBoard(board);
        refreshPeices(board);
        //lastMoveIndicator();
    };
 	

    board.addEventListener('add',function (e) {
        refreshBoard();
	},true);

	board.addEventListener('move',function (e) {
        refreshBoard();

	},true);

    board.addEventListener('remove', function(e) {
        refreshBoard();
    }, true);

    board.addEventListener('promote',function (e) {
	},true);

    //ctx.

    
    $("#btnNewGame").click(function(evt) {

        board.prepareNewGame();
        //refreshBoard();
        setTurnDisplay(whoseTurn);
    });

    $("#btnAutoMove").click(function(evt) {
      var playerColor = whoseTurn;
      var playerDirection = directionOf(playerColor);
      var result = rules.makeRandomMove(playerColor, playerDirection);
      if (result != null) {
        console.log("hit auto move")
        markLastMove(result);
        toggleTurn();
      }
        lastMoveIndicator();
    });

    board.prepareNewGame();

});