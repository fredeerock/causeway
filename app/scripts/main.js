// jshint devel:true
// var a;
$("#causeway-text").load("../data/causeway.html", function() {
	// $('#causeway-text').html(function(index, oldHtml) {
	//     return oldHtml.replace(/\b(\w+?)\b/g, '<span class="word">$1</span>')
	// });

	// $("span").click(function () {
	// 	a = $(this).attr("class");
	// 	console.log($(this));
	// 	console.log(a);
	// 	console.log($("#causeway-text").find("10"));
	// 	var b = $("#causeway-text").find("10");
	// 	// zoomOutUp(a);
	// 	// zoomOutUp(this);
	// });
});

function example()
{
    var elements = document.getElementsByClassName(this.className);

    for(var i = elements.length - 1; i >= 0; --i)
    {
        // PERFORM STUFF ON THE ELEMENT
        elements[i].className = "myClass";

        // elements[i] no longer exists past this point, in most browsers
    }
}

function changeClass() {
	// var d = document.getElementsByClassName(it);
	this.className = this.className + " myClass";
	// this.
	var same = document.getElementsByClassName("")
	console.log(this.className);

}

window.onload = function() {

	var spans = document.getElementsByTagName('span');
		for (var i = 0; i < spans.length; i++) {
    		spans[i].addEventListener('click',example, false);
	}
};

function zoomOutUp(elem) {
	var transformOrigin = elem.style['transform-origin'];

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
