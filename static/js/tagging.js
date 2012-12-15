 var tagging = function() {}

 tagging = (function() {

	var inTagMode = false
	var isDialogShowing = false
	var savedEvent = null;
	
	var filename = null;


	

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
		$('#image').maphilight()
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
		.click(function(e) { e.preventDefault(); })
		.click(function(ev) {
			console.log(ev)
			if(inTagMode) {
				openDialog2(ev)
			}
			ev.stopPropagation()
		}) 

		//
		$('html').click(function(e) {
			console.log('html click event tagMode:isDialogShowing ' + inTagMode + ':' + isDialogShowing)
			console.log(e)
			if(isDialogShowing) closeDialog()
			else if(inTagMode) toggleTagMode()
		})

		$('.btn').click(function(e) { e.stopPropagation() })
		$('#dialog').click(function(e) { e.stopPropagation() })
	}



	/**
	 * for now we just show a simple prompt box 
	 * @param  {[type]} ev [description]
	 * @return {[type]}    [description]
	 */
	// var openDialog = function(ev) {

	// 	isDialogShowing = true
	// 	savedEvent = ev

	// 	console.log('open dialog')
	// 	var link = prompt("Please provide the link of that item");
	// 	if (link != null && link != "") {
	// 		console.log('got link ' + link)


	// 		console.log($('#image-link'))

	// 		sendTagRequest(link, filename, ev)

	// 	}
	// } 



	var openDialog2 = function(ev) {
		isDialogShowing = true
		savedEvent = ev

		$('#mask').fadeTo(0, 0.8)

		$('#dialog')
		.css('top',  ev.pageY)
		.css('left', ev.pageX)
		.fadeIn(0)

	}


	var closeDialog = function() {
		console.log('closeDialog')
		isDialogShowing = false
		$('#dialog').hide()
		$('#mask').hide()
	}

	var sendTag = function() {
		console.log('sendTag: this is just a test')

		
		var values = $('#tag-form').serializeArray();
		console.log(values)

		$.ajax({
			type: "POST",
			url: "/images/" + filename + "/tag",
			data: { 
				link: values[0].value,
				title: values[1].value,
				x: savedEvent.offsetX,
				y: savedEvent.offsetY

			}
		}).done(function(msg) {
			window.location.reload()
		});

		
		
	}



	var sendTagRequest = function(link, filename, ev) {

		//$('#form').submit()

	
	}


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
		sendTag: sendTag
	}
})()


	