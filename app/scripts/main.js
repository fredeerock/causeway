// jshint devel:true

$(".causeway-text").load("../data/causeway.html");

function example() {
	var elements = document.getElementsByClassName(this.className);

	for(var i = elements.length - 1; i >= 0; --i) {
		elements[i].className = "clicked";
	}
}

window.onload = function() {

	var spans = document.getElementsByTagName('span');
		for (var i = 0; i < spans.length; i++) {
			spans[i].addEventListener('click', example, false);
	}
};
