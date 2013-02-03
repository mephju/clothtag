 /**
  * This javascript is loaded by our /image view and is responsible for
  * the tagging feature on the client side. That is it sends tag requests containing
  * coordinates and tag data to the server.
  */

 var tagging = function() {} //global module

 tagging = (function() {

	var inTagMode = false			//we need to keep track of if tag mode is on or off
	var isDialogShowing = false		//keep track of the view state. is dialog showing or not
	var filename = null;			//the filename of the image this view is showing


	

	console.log('loading')
	$(window).load(function() {
		//site and images are done loading when this function is called
		console.log('jquery works')

		!function extractFilename() {
			filename = $('#image-link')[0].pathname
			filename = filename.slice(1, filename.length)
		}()
		
		setup()		
	});




	/**
	 * Setup UI by registering for certain events.
	 * mouseover: whenever the image is hovered, we want to show all the tags
	 * mouteout: whenever the cursor is not hovering above the image, we don't want to show any tags
	 * click: whenever the image is clicked and we are actually in tag mode, the user has the intention
	 * to set a tag on that image. So we let him.
	 * 
	 */
	var setup = function() {
		$('.tag-info')
		.mouseover(function(e) {
			$('.' + $(this).context.id).mouseover()
		})
		.mouseout(function(e) {
			$('.' + $(this).context.id).mouseout()
		})





		$('#image')
		.maphilight()
		.mouseover(function(e) {
			$('area').each(function() {
				$(this).mouseover();
			})

		})
		.mouseout(function(e) {
			$('area').each(function() {
				$(this).mouseout();
			})
		})
		.click(function(ev) { ev.preventDefault(); })
		.click(function(ev) {
			console.log(ev)
			if(inTagMode) {
				openDialog2(ev)
			}
			ev.stopPropagation()
		})




		
		$('html').click(function(e) {
			//
			//console.log('html click event tagMode:isDialogShowing ' + inTagMode + ':' + isDialogShowing)
			//console.log(e)
			if(isDialogShowing) closeDialog()
			else if(inTagMode) toggleTagMode()
		})

		$('.btn').click(function(e) { 
			e.stopPropagation() 
		})
		$('#dialog').click(function(e) { e.stopPropagation() })

		$('#dialog').click(function(e) { e.stopPropagation() })


	}


	/**
	 * Opens a dialog which hides behind the html code showing the image and tag data.
	 * The dialog contains to input fields the user must use to supply tag information such
	 * as a title and a link.
	 * Defines event handler for submit event which makes the actual tagging request to the server.
	 */
	var openDialog2 = function(ev) {
		//
		//console.log('event looks like this ', ev)
		isDialogShowing = true
		
		var offsetX = ev.offsetX
		var offsetY = ev.offsetY

		$('#mask').fadeTo(0, 0.8)

		var dialog = $('#dialog')

		$('#tag-form').submit(function() {
			console.log('sendTag: this is just a test')
			console.log("ev", offsetX, offsetY, ev)
			
			

			var values = $('#tag-form').serializeArray();
			//console.log(values)

			$.ajax({
				type: "POST",
				dataType:'json',
				url: "/images/" + filename + "/tag",
				data: { 
					link: values[0].value,
					title: values[1].value,
					x: offsetX,
					y: offsetY

				}
			})
			.fail(function(fn, msg) {
				console.log('fail()', msg)
				console.log(fn)
			})
			.done(function(msg) {
				console.log('postTag returned', msg)
				//window.location.reload()
			});

			return true;
		})


		$('tag-title').keydown(function(ev) {
			if(ev.keycode == 13) {
				this.form.submit()
				return false
			}
		})


		dialog
		.css('top',  ev.pageY - dialog.height()/2)
		.css('left', ev.pageX  - dialog.width()/2)
		.fadeIn(0)



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

	

	/**
	 * We can either be in normal mode or in tag mode.
	 * In tag mode the cursor must change into a crosshair if hovering above of the image.
	 * This function takes care of that behavior.
	 */
	toggleTagMode = function() {
		inTagMode = !inTagMode
		console.log('toggleTagMode ' + inTagMode)
		if(inTagMode) $('#image')[0].style.cursor='crosshair'
		else {
			$('#image')[0].style.cursor='auto'
		}
	}

	return { 
		toggleTagMode: toggleTagMode,
	}
})()


	