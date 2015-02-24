
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


     	// Your code here

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