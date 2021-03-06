(function($) {

	$.urlParam = function(name){
		console.log(window.location.href+" -> "+name);
		var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
		if (results == null) {
			return null;
		} else {
			return results[1] || 0;			
		}
	}

	$.getLocale = function() {
		var loc = $.urlParam();
		console.log("LOC T1: loc="+loc);
		if (loc == null) {
			loc = $($("input[name='Locale']")[0]).val();
		}
		return loc;
	}

	var request = false;
	$.fn.autoComplete = function() {
		return this.each(function() {
			var $element = $(this);
			var $container = $(this).closest('.autocomplete_holder');
			$element.initial_val = $element.val();
			$(this).attr('autocomplete','off')
				.focus(function() {
					$(this).toggleClass('focus');
					if($(this).val() == $element.initial_val)
						$(this).val('');
				})
				.keyup(function(e) {
					var $input = $(this);
					var $resultsDiv = $input.siblings('.autocomplete_results');
					url = $(this).metadata().url;        
		        	if ((e.keyCode == 9) || (e.keyCode == 13) || // tab, enter 
			           (e.keyCode == 16) || (e.keyCode == 17) || // shift, ctl 
			           (e.keyCode >= 18 && e.keyCode <= 20) || // alt, pause/break, caps lock
			           (e.keyCode == 27) || // esc 
			           (e.keyCode >= 33 && e.keyCode <= 35) || // page up, page down, end 
			           (e.keyCode >= 36 && e.keyCode <= 38) || // home, left, up 
			            (e.keyCode == 40) || // down 
			           (e.keyCode >= 36 && e.keyCode <= 40) || // home, left, up, right, down
			           (e.keyCode >= 44 && e.keyCode <= 45) || // print screen, insert 
			           (e.keyCode == 229) // Korean XP fires 2 keyup events, the key and 229 
		        	) return; 
						
					if(request) window.clearTimeout(request);
					request = window.setTimeout(function() {
						if($input.val().length) {
							var $locale = $.getLocale();
							$resultsDiv.load(
								url, 
								{q : $input.val(), l: $locale},
								function(data) {
									if(data.length)
										$resultsDiv.show();
									else
										$resultsDiv.hide();
								}
							);
						}
					},500)
				e.stopPropagation();
			})
			.blur(function() {
				$t = $(this);
				setTimeout(function() {
					$t.toggleClass('focus').siblings('.autocomplete_results').hide();
				}, 500);
			})
			
			if($container.hasClass('livedropdownfield')) {
				$container.find('.livedropdown_browse').click(function() {
					var $locale = $.getLocale();
					var $t = $(this);				
					var $resultsDiv = $(this).siblings('.autocomplete_results');
					$resultsDiv.load(
						$t.siblings('.autocomplete_input').metadata().url, 
						{q : '', l: $locale},
						function(data) {
							if(data.length) {
								$resultsDiv.show();
							}
							else {
								$resultsDiv.hide();
							}
						}
					);
					return false;					
				});			
			}			
			
		});
	};
$(function() {
	$('input.autocomplete_input').livequery(function() {
		$(this).autoComplete();
	});
	$('.livedropdownfield .autocomplete_results a').livequery("click", function() {
		$(this).closest('.livedropdownfield').find(':hidden').val(this.hash.replace('#',''));
		$(this).closest('.livedropdownfield').find('.autocomplete_input').val($(this).text()).blur();
		return false;
	});

});
})(jQuery);