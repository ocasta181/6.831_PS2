
//This script extracts parameters from the URL
//from jquery-howto.blogspot.com

$.extend({
    getUrlVars : function() {
        var vars = [], hash;
        var hashes = window.location.href.slice(
                window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
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
        whoseTurn = "black";
    }
    setTurnDisplay(whoseTurn);
}


/**
 *  Sets the text and style of the turn display based on whoseTurn.
 */
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


/**
 *  Declares the canvas context (ctx) and the square size global scope for future use. 
 */
var initializeBoard = function() {
    square_size = 400 / board.boardSize;
    var c = document.getElementById("checker_board");
    ctx=c.getContext("2d");
    ctx.fillStyle="grey";
    drawBoard(board);
};

/**
 * Draws the board onto the canvas 
 */
var drawBoard = function() {
    //color every other square grey
    for(var row = 0; row < board.boardSize; row++){
        for (var col = 0; col < board.boardSize; col++){
            var x = col * square_size;
            var y = row * square_size;
            var unique_id = col+"_"+row;
            if((parseInt(row)+parseInt(col)) % 2 != 0){
                ctx.fillRect(x, y, square_size, square_size);               
            };
            
            $("#canvas_wrap").append("<div id='location"+unique_id+"'></div>");
            $("#location"+unique_id).css({"top": y+"px", "left": x+"px", "width": square_size+"px", "height": square_size+"px"});
        };
    };

};





/**
 *  Adds each peice to the board
 */

var addPeice = function(checker){
    var color = checker.color;
    var x = checker.col*square_size;
    var y = checker.row*square_size;
    var unique_id = checker.col+"_"+checker.row;
    $("#location"+unique_id).append("<img src='graphics/"+color+"-piece.png'>");  
};

var removePeice = function(col, row){
    var unique_id = col+"_"+row;
    $("#location"+unique_id).empty();
};

var movePeice = function(details){
    removePeice(details.fromCol, details.fromRow);
    addPeice(details.checker);
}


/*

var refreshPeices = function(){
    var checkers = board.getAllCheckers();
    for (var i = 0; i < checkers.length; i++){
        var checker = checkers[i];
        var x = checker.col*square_size;
        var y = checker.row*square_size;

        // draws images on their proper squares and scales them appropriately
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
        };
    };
};
    */

/**
 *  Declares the last move coordinates (from and to) in the global scope
 *  Takes a rules.result object. 
 */
var markLastMove = function(result){

    // returns the x or y coordinate of the center of a given square
    var toCenterDim = function(pos){
        return (pos*square_size)+(square_size/2);
    };

    start_x = toCenterDim(result.from_col);
    start_y = toCenterDim(result.from_row);
    end_x = toCenterDim(result.to_col);
    end_y = toCenterDim(result.to_row);
};


/**
 *  Draws a yellow arrow from the center of the square moved from to the center of
 *  the square moved too. Takes the coordinates of the last move from the global scope.
 *
 */
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


    /**
     * clears and redraws the board and peices
     */
    var refreshBoard = function(){
        ctx.clearRect(0,0,400,400);
        drawBoard();
        refreshPeices();
    };

    // This is used by the listiner functions
    var activeChecker;

    /**
     *  If the user mousedowns on a checker, set the activeChecker to that checker
     */
    $("#checker_board div").mousedown(function(e){
        $(window).mousemove(function(){
            var row = Math.floor(e.offsetY/square_size);
            var col = Math.floor(e.offsetX/square_size);
            activeChecker=board.getCheckerAt(row, col);
            
            $(window).unbind("mousemove");
        });
    });

    /**
     * If the mouse releases on 
     */
    $("#checker_board div").mouseup(function(e) {
        $(window).unbind("mousemove");
        if (activeChecker){
            var row = Math.floor(e.offsetY/square_size);
            var col = Math.floor(e.offsetX/square_size);
            
                var result = rules.makeMove(activeChecker, directionOf(whoseTurn), directionOf(activeChecker.color), row, col);
                if(result){
                    markLastMove(result);
                    toggleTurn();
                    lastMoveIndicator();
                }
                
        }; 
        activeChecker = 0;
    });




 	

    board.addEventListener('add',function (e) {
        addPeice(e.details.checker);
        //console.log(e);
	},true);

	board.addEventListener('move',function (e) {
        movePeice(e.details);

	},true);

    board.addEventListener('remove', function(e) {
        removePeice(e.details.checker.col, e.details.checker.row);
    }, true);

    board.addEventListener('promote',function (e) {
	},true);

    
    $("#btnNewGame").click(function(evt) {
        setTurnDisplay(whoseTurn);
        $("img").css("visibility","visible");
        $("img").css({"width": square_size, "height": square_size});
    });

    $("#btnAutoMove").click(function(evt) {
      var playerColor = whoseTurn;
      var playerDirection = directionOf(playerColor);
      var result = rules.makeRandomMove(playerColor, playerDirection);
      if (result) {
        markLastMove(result);
        toggleTurn();
      }
        lastMoveIndicator();
    });

    board.prepareNewGame();
    $("img").css("visibility","hidden");

});