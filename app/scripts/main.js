// jshint devel:true
var a;
$("#causeway-text").load("../data/causeway.html", function() {
	// $('#causeway-text').html(function(index, oldHtml) {
	//     return oldHtml.replace(/\b(\w+?)\b/g, '<span class="word">$1</span>')
	// });

	$("span").click(function () {
		// console.log($(this).attr("id"));
		console.log($(this));
		a = $(this).attr("class");
		console.log(a);
		// console.log($("#causeway-text").find("10"));
		var b = $("#causeway-text").find("10");
		zoomOutUp(this	);
	});
});

	function zoomOutUp(elem) {
        var transformOrigin = elem.style['transform-origin'];
        var fillMode = elem.style['animation-fill-mode'];

        var keyframes = [

            {
            transform: 'none',
            opacity: '1',
            transformOrigin: 'center bottom',
            offset: 0
            },

            {
            transform: 'scale3d(.475, .475, .475) translate3d(0, 60px, 0)',
            opacity: '1',
            transformOrigin: 'center bottom',
            offset: 0.4
            },

            {
            transform: 'scale3d(.475, .475, .475) translate3d(0, 60px, 0)',
            opacity: '1',
            transformOrigin: 'center bottom',
            offset: 0.4
            },


            {
            transform: 'scale3d(.475, .475, .475) translate3d(0, 60px, 0)',
            opacity: '1',
            transformOrigin: 'center bottom',
            offset: 0.4
            },

            {
			transform: 'scale3d(.1, .1, .1) translate3d(0, -2000px, 0)',
			opacity: '0',
			transformOrigin: 'center bottom',
			offset: 1
            }

          ];

        var timing = {
          duration: 3000,
          fill: 'forwards',
          iterations: 1,
          easing: 'cubic-bezier(0.550, 0.055, 0.675, 0.190)'

        };

        return elem.animate(keyframes, timing);
      }
