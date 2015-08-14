// jshint devel:true

// $("#causeway-text").load("../data/causeway.html", function() {
// });



	$("span").click(function () {
		// $(this).animate({left: '250px'});
		// $(this).animate({fontSize: '3em'}, "slow");

		// $(this).animate({scale3d:'.475, .475, .475', translate3d: '0, 60px, 0'});
		// $(this).animate({scale3d:'.1, .1, .1', translate3d: '0, -2000px, 0', speed: "slow"});

		zoomOutUp(this, 1);
				// $(this).css("background-color","yellow");

	});

	function zoomOutUp(elem, iterations) {
        var transformOrigin = elem.style['transform-origin'];

        var keyframes = [

            {
              transform: 'none',
              opacity: '1',
              transformOrigin: 'center bottom',
              // offset: 0
            },

            {
              transform: 'scale3d(.475, .475, .475) translate3d(0, 60px, 0)',
              opacity: '1',
              transformOrigin: 'center bottom',
              // offset: 0.5
            },

            {
              transform: 'scale3d(.1, .1, .1) translate3d(0, -2000px, 0)',
              opacity: '0',
              transformOrigin: 'center bottom',
              // offset: 1
            }

          ];

        var timing = {
          duration: 3000,
          iterations: iterations,
          easing: 'cubic-bezier(0.550, 0.055, 0.675, 0.190)'

        };

        return elem.animate(keyframes, timing);
      }

// window.onload = zoomOutUp(document.getElementsByTagName("span"), Infinity);

