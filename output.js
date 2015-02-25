
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

    var initializeBoard = function(board) {
                //Initialize the board
        var square_size = 400 / board.boardSize;
        var c = document.getElementById("checker_board");
        var ctx=c.getContext("2d");
        ctx.fillStyle="grey";

        for(var row = 0; row < board.boardSize; row++){
            for (var col = 0; col < board.boardSize; col++){
                if((parseInt(row)+parseInt(col)) % 2 != 0){
                    ctx.fillRect(col * square_size, row * square_size, square_size, square_size);               
                };
            };
        };
    };

    var refreshPeices = function(board){
        console.log("this was called");
        var square_size = 400 / board.boardSize;
        var checkers = board.getAllCheckers();
        red_checker = new Image();
        black_checker = new Image();
        red_checker.src = 'graphics/red-piece.png';
        black_checker.src = 'graphics/black-piece.png'
        var c = document.getElementById("checker_board");
        var ctx=c.getContext("2d");
        for (var i = 0; i < checkers.length; i++){
            var checker = checkers[i];
            var x = checker.col*square_size;
            var y = checker.row*square_size;
            if(checker.color == "red"){
                ctx.drawImage(red_checker, x, y, square_size, square_size);
            } else {
                ctx.drawImage(black_checker, x, y, square_size, square_size);
            };
        };
    };



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
            refreshPeices(board);
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