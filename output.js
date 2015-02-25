
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
	// Your code here
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
        

        //Initialize the board
        var square_size = Math.floor((400 - (board.boardSize * 2)) / board.boardSize);
        var red_peice = "<img src='graphics/red-piece.png' style='width:"+square_size+"px; height:"+square_size+"px'>";
        var black_peice = "<img src='graphics/black-piece.png' style='width:"+square_size+"px; height:"+square_size+"px'>";
        

        for (row in board.square){
            $("#checker_board").append("<tr id='row_" + row + "'></tr>");
            for (col in board.square){

                // the id of this board space
                var square = "square_" + row + "_" + col;

                // add board spaces
                $("#row_" + row).append("<td id='"+ square + "'></td>");

                // alternate checkerboard square colors
                if((parseInt(col)+parseInt(row))%2 == 0){
                    $("#" + square).css("background-color", "white");

                } else {
                    $("#" + square).css("background-color", "grey");
                }

                // size the board
                $("#" + square).css("width", square_size + "px");
                $("#" + square).css("height", square_size + "px");
                $("#" + square).css("padding", "0px 0px");
                $("#" + square).css("border-spacing", "0px 0px");

                // add peices to the board
                if(parseInt(row) == 0 && parseInt(col)%2 == 1){
                    $("#" + square).append(red_peice)

                }else if(parseInt(row) == 1 && parseInt(col)%2 == 0){
                    $("#" + square).append(red_peice)

                } else if(parseInt(row) == board.boardSize-2 && parseInt(col)%2 == 1){
                    $("#" + square).append(black_peice)

                } else if(parseInt(row) == board.boardSize-1 && parseInt(col)%2 == 0){
                    $("#" + square).append(black_peice)

                }



            }; 
        };
     	

        board.addEventListener('add',function (e) {
    		// Your code here
    	},true);

    	board.addEventListener('move',function (e) {
    		// Your code here
    	},true);

        board.addEventListener('remove', function(e) {
        	// Your code here
        }, true);

        board.addEventListener('promote',function (e) {
    		// Your code here
    	},true);

        
        $("#btnNewGame").click(function(evt) {
            board.prepareNewGame();
        });

        $("#btnAutoMove").click(function(evt) {
          var playerColor = whoseTurn;
          var playerDirection = directionOf(playerColor);
          var result = rules.makeRandomMove(playerColor, playerDirection);
          if (result != null) {
            toggleTurn();
          }
        });

        board.prepareNewGame();

    });