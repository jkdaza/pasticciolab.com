/**
 * Interactivity for Osteria Bell'Italia web pages
 * Author: Dario Faniglione
 * Osteria Bell'Italia 2015 - All rights reserved
 * 
 * Thanks for looking at the source.
 * This site has been built upon the 'Semistatic GAE' framework, by Dario Faniglione.
 * Although the framework has been released as open source (https://github.com/jkdaza/semistatic-gae), this theme is copyrighted.
 * 
 */


$('body').children().not('#loader').hide();
$('document').ready(function() {
	
	var query = Modernizr.mq('(min-width: 768px)');
	if (query) {
		$('#trullilandia').add('.lista-prodotti').imagesLoaded( function() {
			$('#loader').remove(); 
			$('body').children().fadeIn();
		});
		
		$.stellar({
			horizontalScrolling: false,
	        verticalOffset: 0,
	        horizontalOffset: 0,
	        responsive: true,
	        // Customise how elements are shown and hidden
	        hideElement: function($elem) { $elem.addClass('invisible'); },
	        showElement: function($elem) { $elem.removeClass('invisible'); }
		});
	} else {
		$('#loader').remove(); 
		$('body').children().fadeIn();
	}
	//vars
	//var graySections = ['#menu','#storia'];
	//Links
	var nav = $('#home .section-head.fixed-top');
	var $links = $('a.page-scroll');
	var links = {};
	var harvestLinks = function() {
		$links.each(function() {
			var $this = $(this);
			var href = $this.attr('href');
			var o = $(href).offset();
			links[href] = o ? o.top: 0;
		});
	};
	harvestLinks();
	setInterval(harvestLinks,1500);
	
	$links.on('click',function(e) {
		e.preventDefault();
		var $this = $(this);
		var href = $this.attr('href');
		var scrollTop = links[href];
		if (href == '#home') {
			nav.hide();
		} else {
			nav.show();
		}
		$('html, body').animate({
		        scrollTop: scrollTop
		}, 1000, function() {
			$this.trigger('change');
		});
	}).on('change',function() {
		var $this = $(this); 
		var href = $this.attr('href');
		/*if (graySections.indexOf(href) > -1) {
			nav.addClass('gray').closest('.fixed-top').addClass('gray');
		} else {
			nav.removeClass('gray').closest('.fixed-top').removeClass('gray');
		}*/
		
	});
	var homeSection = $('#home');
	$(window).scroll(function() {
		var st = $(this).scrollTop();
		if (st > 100) {
			nav.fadeIn();
			if (st%10 == 0) {
				for (var i in links) {
					var o = links[i];
					if (st >= o-50) {
						$('a.page-scroll',nav).not('a[href="'+i+'"]').removeClass('active');
						$('a[href="'+i+'"]',nav).addClass('active').trigger('change');
					}
				}
			}
		} else {
			nav.hide();
			nav.removeClass('gray').closest('.fixed-top').removeClass('gray');
		}
	});
	
	//Text Hide
	$('.read-btn').each(function() {
		var $t = $(this);
		var textCont = $t.closest('.text-container');
		var textMore = textCont.find('.text-more').hide();
		$t.find('a').each(function() {
			var $rLink = $(this);
			$rLink.on('click',function(e) {
				e.preventDefault();
				if ($rLink.hasClass('read-more')) {
					textMore.slideDown();
					$rLink.hide();
				} else if ($rLink.hasClass('read-less')) {
					textMore.slideUp();
					textCont.find('a.read-more').show();
				}
				$('html, body').animate({
			        scrollTop: textCont.offset().top-200
				}, 500)
			});
		});
	});
	
	//Menu Pics
	var $menu_pics = $('.menu-square img', '#menu-gallery');
	var lapse = 1000;
	var delaySwap = function() {
		$menu_pics.each(function(i,e) {
			var delay = i*lapse;
			var $img = $(e);
			if ($img.hasClass('hidden')) {
				$img.hide().removeClass('hidden').delay(delay).fadeIn(lapse/2,function() {
					$img.removeClass('hidden');
				})
			} else {
				$img.delay(delay).fadeOut(lapse/2,function() {
					$img.addClass('hidden');
				})
			}
		});
	};
	setInterval(
		delaySwap,
		$menu_pics.length*(lapse+2)
	);
	
	
	//Contact Form Ajax
	var contacForm = $('form#contact-form');
	var contacFormSubmit = $('#contact-form-submit');
	contacForm.submit(function(e) {
		e.preventDefault();
		var form = $(this);
		var data = {};
		var validated = 0;
		
		var fields = $('.form-control',form);
		fields.each(function() {
			var field = $(this);
			var val = field.val();
			if (!field.hasClass('required') || val.length > 0) {
				validated += 1;
			}
			data[field.attr('name')] = field.val();
		});
		if (validated != fields.length) {
			//Error Message
			alert('Tutti i campi sono obbligatori!')
			return false;
		}
		$.ajax({
			url : '/send-message',
			data: data,
			type: 'POST',
			dataType: 'json',
			success: function(d) {
				if (d['error']) {
					alert(d['error']);
				} else if (d['message']) {
					contacForm.before('<div class="alert alert-success" role="alert">'+d['message']+'</div>');
					contacForm.hide();
					contacFormSubmit.hide();
				}
			}
		});
	});
	contacFormSubmit.on('click',function(e) {
		e.preventDefault();
		contacForm.trigger('submit');
	});
	var maps = $('#dove-siamo .maps');
	maps.on('click', function () {
		maps.find('iframe').css('pointer-events','auto');
	});
	maps.on('mouseleave', function() {
		maps.find('iframe').css('pointer-events','none'); 
	});
	
});