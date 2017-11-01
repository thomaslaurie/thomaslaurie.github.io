'use strict';

$(document).ready(function() {
	/******************* Nav Menus *******************/
	$('#med-dd-button').click(function() {
		$('#med-dd-content').toggleClass('open');
		$('#med-dd-button').toggleClass('open');
	});

	$('#med-dd-content .med-project').click(function() {
		$('#med-dd-content').toggleClass('open');
		$('#med-dd-button').toggleClass('open');
	});

	$('#thin-dd-button').click(function() {
		$('#thin-dd-content').toggleClass('open');
		$('#thin-dd-button').toggleClass('open');
	});

	$('#thin-dd-content a').click(function() {
		$('#thin-dd-content').toggleClass('open');
		$('#thin-dd-button').toggleClass('open');
	});

	/******************* Mobile Image Slider *******************/
	function prepare(element) {
		/* remove buttons for single image */
		if (element.find('.sliderTray img').length == 1) {
			/* duplucate to fill left margin */
			element.find('.sliderTray img:nth-of-type(1)').clone().appendTo(element.find('.sliderTray'));
			element.find('button').css('display', 'none');
		}

		/* double content for two images */
		if (element.find('.sliderTray img').length == 2) {
			/* duplicate list for smooth animation */
			element.find('.sliderTray img:nth-of-type(1)').clone().appendTo(element.find('.sliderTray'));
			element.find('.sliderTray img:nth-of-type(2)').clone().appendTo(element.find('.sliderTray'));
		}

		/* puts last element at the beginning to start on first image */
		element.find('.sliderTray img:last-child').prependTo(element.find('.sliderTray'));
	}

	function setDimensions(element) {
		// Get Largest Image Height (after they're placed in flow)
		var imgArray = [];
		for(var i = 1; i < element.find('.sliderTray img').length; i++) {
			imgArray.push(element.find('.sliderTray img:nth-of-type(' + i + ')').height());
		}
		var largestHeight = Math.max.apply(Math, imgArray);

		var slideWidth = element.find('.sliderTray img').width();
		var slideHeight = largestHeight;
		var count = element.find('.sliderTray img').length;
		var allWidth = count * slideWidth;
		
		/* set slider dimensions based on image dimensions (single source) */
		element.css({width: slideWidth, height: slideHeight});

		/* tray width is sum of its images, left margin extends 1 image width past it's left border*/
		element.find('.sliderTray').css({width: allWidth, height: slideHeight, marginLeft: -slideWidth}); /* added slideHeight here too (to fix android bug), don't know if needed */
	}

	function animate(element) {
		/* animate(properties, duration, easing, complete) */
		element.find('button.prev').click(function() {
			var slideWidth = element.find('.sliderTray img').width(); /* check slideWidth because window dimensions could have changed */

			element.find('.sliderTray').animate({left: +slideWidth}, 200, function() { /* slide right 1 image width */
				element.find('.sliderTray img:last-child').prependTo(element.find('.sliderTray')); /* moves last child to start */
				element.find('.sliderTray').css('left', ''); /* revert slide */
			});

			$(this).addClass('open').delay(200).queue(function() { /* must be same as longest transition speed in css */
				$(this).removeClass('open').dequeue();
			});
		});

		element.find('button.next').click(function() {
			var slideWidth = element.find('.sliderTray img').width(); /* check slideWidth because window dimensions could have changed */

			element.find('.sliderTray').animate({left: -slideWidth}, 200, function() { /* slide left 1 image width */
				element.find('.sliderTray img:first-child').appendTo(element.find('.sliderTray')); /* move first child to end */
				element.find('.sliderTray').css('left', ''); /* revert slide */
			});

			$(this).addClass('open').delay(200).queue(function() { /* must be same as longest transition speed in css */
				$(this).removeClass('open').dequeue();
			});
		});
	}

	// Work
	$('#text-box .slider').each(function() {
			/* setup */
			prepare($(this));
			setDimensions($(this));

			/* animate */
			animate($(this));
	});
		
	$(window).resize(function() {
		/* adjust dimensions on window resize */
		$('#text-box .slider').each(function() {
			setDimensions($(this));
		});
	});


	/******************* Expanding Image *******************/
	$('#img-box section img, .sliderTray img').click(function() {
		// retrieve path and altText
		var path = $(this).attr('src');
		var altText = $(this).attr('alt');

		// add -large suffix to img path
		path = path.replace('.jpg', '-large.jpg');
		path = path.replace('.gif', '-large.gif');

		// open expand div
		$('#expand').toggleClass('open');
		if ($(this).hasClass('scroll-img')) {
			$('#expand').addClass('scroll-img');
		}
		// replace src and alt text
		$('#expand img').attr({'src': path, 'alt': altText});
	
		// check if -large img exists, if not - change it back
		$('#expand img').on('error', function() {
			path = path.replace('-large.jpg', '.jpg');
			path = path.replace('-large.gif', '.gif');
			$('#expand img').attr({'src': path, 'alt': altText});
		});

	});

	$('#expand').click(function() {
		$('#expand').toggleClass('open'); /* Close when background is clicked */

		$('#expand').removeClass('scroll-img');
	});

	/* Stops children elements from activating the click function *//* Ignore this for now, content-fit in css makes the dimensions of the image smaller than its click area, cant close unless clicking specifically on the gutters
	$('#expand').children().click(function() { 
		event.stopPropagation();
	});*/

	/******************* Scroll Sync *******************/
	/* Requirements:
	Each section must be bigger than their parent scroll window
	Each div must have same number of sections */

	var programScroll = false;
	
	function scrollSync(a, b) {
		a.on("scroll", function() {
			if (programScroll === false) {
				// For loop variables
				var i;
				var j;
				
				// Section Arrays
				var asArray = [];
				var bsArray = [];
				for(i = 0; i < a.find("section").length; i++) {
					var i1 = i + 1;
					asArray.push($(a.find("section:nth-of-type(" + i1 + ")")));
				}
				for(i = 0; i < b.find("section").length; i++) {
					var i1 = i + 1;
					bsArray.push($(b.find("section:nth-of-type(" + i1 + ")")));
				}
				
				// Section Height Arrays
				var ashArray = [];
				var bshArray = [];
				for (i = 0; i < asArray.length; i++) {
					var th = 0;
					for (j = i; j >= 0; j--) {
						th += asArray[j].outerHeight();	
					}
					ashArray[i] = th;
				}
				for (i = 0; i < bsArray.length; i++) {
					var th = 0;
					for (j = i; j >= 0; j--) {
						th += bsArray[j].outerHeight();	
					}
					bshArray[i] = th;
				}
				
				// Window Height
				var ah = a.outerHeight();
				var bh = b.outerHeight();
				// Window Position
				var ap = a.scrollTop();
				var bp = b.scrollTop();
				// Section Height
				var ash;
				var bsh;
				// Section Position
				var asp;
				var bsp;
				
				// For All Sections
				for(i = 0; i < asArray.length; i++) {
					// Define Top & Bottom
					var aTop = ashArray[i] - asArray[i].outerHeight();
					var aBottom = ashArray[i];
					var bTop = bshArray[i] - bsArray[i].outerHeight();
					var bBottom = bshArray[i];
					
					// Determine which section top of window is in
					if(aTop <= ap && ap < aBottom) {
						// Find Section Height
						var i1 = i + 1;
						ash = a.find("section:nth-of-type(" + i1 + ")").outerHeight();
						bsh = b.find("section:nth-of-type(" + i1 + ")").outerHeight();
						// Find Section Position
						asp = a.scrollTop() - aTop;
						bsp = b.scrollTop() - bTop;
						
						// Determine if section boundary is in view
						// If Section Position >= Section Height - Window Height
						// >= is neccesar (opposed to >) for some reason (mid, nav link to jeti rentals text gets stuck at top of page otherwise)
						if (asp > ash - ah) { /* fix >= vs > here */
							// bBottom - Window Height
							var offset = bBottom - bh;
							// Progress from aBottom - Window Height to aBottom
							var progress = (asp - (ash - ah)) / ah;
							
							// Offset + (Ratio * b Window Height)
							b.scrollTop(offset + (progress * bh));

						} else {
							// Section Scroll Position = Ratio * Section Position
							var scroll = (bsh / ash) * asp;	
							// Progress = Top Position / (Section Height - Window Height)

							var progress
							if(ash - ah <= 0) { // prevents dividing by 0 for sections the same height as window
								progress = 0;
							} else {
								progress = asp / (ash - ah);
							}
							// Adjust = ((Height Ratio / Window Ratio) * Window Height) - 1 Window height
							var adjust = (bsh/ash) * (ah/bh) * bh - bh;

							// Total = bTop + Section Scroll Position + (Progress * Adjust)
							b.scrollTop(bTop + scroll + progress * adjust);
							console.log(progress);
						}
					}
				}

				programScroll = true;
			} else {
				programScroll = false;
			}
		});
	}
	
	// Work
	scrollSync($("#img-box"), $("#text-box"));
	scrollSync($("#text-box"), $("#img-box"));
});