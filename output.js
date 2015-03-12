
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
var gameOn = false;

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

    var c = document.getElementById("indicator");
    i_ctx=c.getContext("2d");
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
            
            // adds a div for each square and sets the location for each div
            $("#canvas_wrap").append("<div id='location"+unique_id+"'></div>");
            $("#location"+unique_id).css({"top": y+"px", "left": x+"px", 
                        "width": square_size+"px", "height": square_size+"px"});
        };
    };

};





/**
 *  Adds a Piece to the board
 */
var addPiece = function(checker){
    var color = checker.color;
    var x = checker.col*square_size;
    var y = checker.row*square_size;
    var unique_id = checker.col+"_"+checker.row;
    var type;
    checker.isKing ? type = "king" : type = "piece";
    $("#location"+unique_id).append("<img src='graphics/"+color+"-"+type+".png'>");
    $("img").css({"width": square_size, "height": square_size});
};

/**
 *  Removes a Piece from the board
 */
var removePiece = function(col, row){
    var unique_id = col+"_"+row;
    $("#location"+unique_id).empty();
};

/**
 *  Moves a piece from one square to another on the board
 */
var movePiece = function(details){
    removePiece(details.fromCol, details.fromRow);
    addPiece(details.checker);
}


/**
 *  Returns the last move coordinates
 *  Takes a rules.result object. 
 */
var markLastMove = function(result){

    // returns the x or y coordinate of the center of a given square
    var toCenterDim = function(pos){
        return (pos*square_size)+(square_size/2);
    };
    

    return {"start_x": toCenterDim(result.from_col), "start_y": toCenterDim(result.from_row), 
            "end_x": toCenterDim(result.to_col), "end_y": toCenterDim(result.to_row)};
};


/**
 *  Draws a yellow arrow from the center of the square moved from to the center of
 *  the square moved too. Takes the coordinates of the last passed in.
 *
 */
var lastMoveIndicator = function(last){

    i_ctx.clearRect(0,0,400,400);

    i_ctx.strokeStyle = "yellow";
    i_ctx.lineWidth = square_size*.1;
    i_ctx.beginPath();
    i_ctx.moveTo(last.start_x, last.start_y);
    i_ctx.lineTo(last.end_x,last.end_y);
    i_ctx.stroke();

    var moveScalar_x = last.start_x - last.end_x;
    var moveScalar_y = last.start_y - last.end_y;
    var moveDirection_x = moveScalar_x?moveScalar_x<0?-1:1:0;
    var moveDirection_y = moveScalar_y?moveScalar_y<0?-1:1:0;

    if(last.start_x == last.end_x){
        i_ctx.beginPath();
        i_ctx.moveTo(last.end_x+(square_size*.3),last.end_y+(square_size*moveDirection_y*.3));
        i_ctx.lineTo(last.end_x,last.end_y);
        i_ctx.lineTo(last.end_x-(square_size*.3),last.end_y+(square_size*moveDirection_y*.3));
        i_ctx.stroke();
    } else {
        i_ctx.beginPath();
        i_ctx.moveTo(last.end_x,last.end_y+(square_size*moveDirection_y*.3));
        i_ctx.lineTo(last.end_x,last.end_y);
        i_ctx.lineTo(last.end_x+(square_size*moveDirection_x*.3),last.end_y);
        i_ctx.stroke();
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


    // This is used by the listiner functions
    var activeChecker;

    /**
     *  If the user mousedowns on a checker, set the activeChecker to that checker
     */
    $("#indicator").mousedown(function(e){
        $(window).mousemove(function(){
            console.log("horray!");
            var row = Math.floor(e.offsetY/square_size);
            var col = Math.floor(e.offsetX/square_size);
            activeChecker=board.getCheckerAt(row, col);
            
            $(window).unbind("mousemove");
        });
    });

    /**
     * If the mouse releases on 
     */
    $("#indicator").mouseup(function(e) {
        $(window).unbind("mousemove");
        if (activeChecker){
            var row = Math.floor(e.offsetY/square_size);
            var col = Math.floor(e.offsetX/square_size);
            
                var result = rules.makeMove(activeChecker, directionOf(whoseTurn), directionOf(activeChecker.color), row, col);
                if(result){
                    var lastMove = markLastMove(result);
                    toggleTurn();
                    lastMoveIndicator(lastMove);
                }
                
        }; 
        activeChecker = 0;
    });

    board.addEventListener('add',function (e) {
        addPiece(e.details.checker);
	},true);

	board.addEventListener('move',function (e) {
        movePiece(e.details);

	},true);

    board.addEventListener('remove',function (e) {
        removePiece(e.details.checker.col, e.details.checker.row);
    }, true);

    board.addEventListener('promote',function (e) {
        movePiece(e.details);
	},true);

    
    $("#btnNewGame").click(function(evt) {
        gameOn = true;
        board.prepareNewGame();
        setTurnDisplay(whoseTurn);
        $("img").css("visibility", "visible");
        i_ctx.clearRect(0,0,400,400);
    });

    $("#btnAutoMove").click(function(evt) {
        if(gameOn){
            var playerColor = whoseTurn;
            var playerDirection = directionOf(playerColor);
            var result = rules.makeRandomMove(playerColor, playerDirection);
            if (result) {
                var lastMove = markLastMove(result);
                toggleTurn();
                lastMoveIndicator(lastMove);
            };
        };
    });

    board.prepareNewGame();
    $("img").css("visibility","hidden");

});