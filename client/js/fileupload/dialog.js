/**
	 * Opens a dialog which hides behind the html code showing the image and tag data.
	 * The dialog contains to input fields the user must use to supply tag information such
	 * as a title and a link.
	 * Defines event handler for submit event which makes the actual tagging request to the server.
	 */
	
tagging.dialog = function() {




	var openDialog2 = function(ev) {
		
		isDialogShowing = true
		
		var offsetX = ev.offsetX
		var offsetY = ev.offsetY

		$('#mask').fadeTo(0, 0.8)

		var dialog = $('#dialog')

		$('#tag-form').submit(function() {
			console.log('sendTag: this is just a test')
			console.log("ev", offsetX, offsetY, ev)
			//console.log(values)
			return true;
		})


		// $('tag-title').keydown(function(ev) {
		// 	if(ev.keycode == 13) {
		// 		this.form.submit()
		// 		return false
		// 	}
		// })


		dialog
		.css('top',  ev.pageY - dialog.height()/2)
		.css('left', ev.pageX  - dialog.width()/2)
		.fadeIn(0)
	}


	var postTag = function() {
		var values = $('#tag-form').serializeArray();
		
		var data = { 
			link: values[0].value,
			title: values[1].value,
			x: offsetX,
			y: offsetY

		}
		
		$.ajax({
			type: "POST",
			dataType:'json',
			url: "/images/" + filename + "/tag",
			data: data 
		})
		.fail(function(fn, msg) {
			console.log('fail()', msg)
			console.log(fn)
		})
		.done(function(msg) {
			console.log('postTag returned', msg)
			//window.location.reload()
		});
	}


	/**
	 * Closes the dialog by hiding it behind the image html code
	 * Should be called whenever we are in tag mode and the user clicks outside of the image.
	 */
	var closeDialog = function() {
		//console.log('closeDialog')
		isDialogShowing = false
		$('#dialog').hide()
		$('#mask').hide()
	}

	return {
		openDialog2:openDialog2,
		postTag: postTag
	}
}