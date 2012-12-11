var inTagMode = false;

console.log('loading')
$(window).load(function() {
	console.log('jquery works')
	
	$('#image').maphilight()
	

	$('#image').mouseover(function(e) {
		console.log('mouse over image')
		$('area').each(function() {
			$(this).mouseover();
		})
	})
	$('#image').mouseout(function(e) {
		$('area').each(function() {
			$(this).mouseout();
		})
	})
	.click(function(e) { e.preventDefault(); });

	$('#image').click(function(ev) {
		console.log(ev)
		console.log('clicked on image')
		if(inTagMode) {
			openDialog(ev)
		}
	}) 


	
		
});





var openDialog = function(ev) {
	console.log('open dialog')
	var link = prompt("Please provide the link of that item");
	if (link != null && link != "") {
		console.log('got link ' + link)


		console.log($('#image-link'))

		var filename = $('#image-link')[0].pathname
		filename = filename.slice(1, filename.length)

		sendTagRequest(link, filename, ev)

	}
} 


var sendTagRequest = function(link, filename, ev) {
	$.ajax({
		type: "POST",
		url: "/images/" + filename + "/tag",
		data: { 
			title: 'still need dialog',
			link: link,
			x: ev.offsetX,
			y: ev.offsetY

		}
	}).done(function(msg) {
		$('#image-container').html(msg)
	});
}


var toggleTagMode = function() {
	inTagMode = !inTagMode
	console.log('I am now in tag mode ' + inTagMode)

	if(inTagMode) $('#image')[0].style.cursor='crosshair'
	else $('#image')[0].style.cursor='auto'
	
}