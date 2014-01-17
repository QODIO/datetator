/*
 Datetator jQuery Plugin
 A plugin to make input elements, tag holders
 version 1.0, Jan 13th, 2014
 by Ingi P. Jacobsen

 The MIT License (MIT)

 Copyright (c) 2014 Faroe Media

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function($) {
	$.datetator = function (element, options) {
		var defaults = {
			prefix: 'datetator_',
			height: 'auto',
			useDimmer: false,
			labels: {
				week: 'Vk',
				dayNames: [
					'Má',
					'Tý',
					'Mi',
					'Hó',
					'Fr',
					'Le',
					'Su'
				],
				monthNames: [
					'januar',
				    'februar',
				    'mars',
				    'apríl',
				    'mai',
				    'juni',
				    'juli',
				    'august',
				    'septembur',
				    'oktobur',
				    'novembur',
				    'desembur'
				],
				previous: '«',
				today: 'í dag',
				next: '»',
				empty: 'Strika',
				previousTooltip: 'Vís undanfarna mánað',
				todayTooltip: 'Vís og vel dagin í dag',
				nextTooltip: 'Vís næsta mánað',
				emptyTooltip: 'Strika dagfesting'
			}
		};

		var plugin = this;
		var $element = $(element);
		var $holder_element = null;
		var $input_element = null;
		var $picker_element = null;
		var currentDate = null;
		if (!isNaN(new Date($element.val()).getDate())) {
			currentDate = new Date(new Date($element.val()).getFullYear(), new Date($element.val()).getMonth(), 1, 0, 0, 0);
		} else {
			currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0);
		}
		var key = {
			backspace: 8,
			enter: 13,
			escape: 27,
			left: 37,
			up: 38,
			right: 39,
			down: 40
		};
		plugin.settings = {};



		// INITIALIZE PLUGIN
		plugin.init = function () {
			plugin.settings = $.extend({}, defaults, options);

			//// ================== CREATE ELEMENTS ================== ////
			// dimmer
			if (plugin.settings.useDimmer) {
				if ($('#' + plugin.settings.prefix + 'dimmer').length === 0) {
					var dimmer_element = document.createElement('div');
					$(dimmer_element).attr('id', plugin.settings.prefix + 'dimmer');
					$(dimmer_element).hide();
					$(document.body).prepend(dimmer_element);
				}
			}
			// holder element
			$holder_element = $(document.createElement('div'));
			$holder_element.addClass('datetator_holder picker-hidden');
			$holder_element.css({
				display: $element.css('display')
			});
			$element.after($holder_element);
			
			// input element
			$input_element = $(document.createElement('input'));
			if (element.id !== undefined) {
				$input_element.attr('id', plugin.settings.prefix + element.id);
			}
			$input_element.addClass('datetator picker-hidden');
			$input_element.css({
				width: $element.css('width'),
				padding: $element.css('padding'),
				position: 'relative'
			});
			$input_element.attr('readonly', true);
			if (plugin.settings.height === 'element') {
				$input_element.css({
					height: $element.outerHeight() + 'px'
				});
			}
			$holder_element.append($input_element);
			$element.hide();

			// picker element
			$picker_element = $(document.createElement('div'));
			$picker_element.addClass(plugin.settings.prefix + 'picker');
			$holder_element.append($picker_element);

			//// ================== BIND ELEMENTS EVENTS ================== ////
			// source element
			$element.change(refreshPicker);
			$input_element.mouseup(function (e) {
				//console.log('mouseup');
				e.preventDefault();
				e.stopPropagation();
				$input_element.trigger('focus');
			});
			$input_element.focus(function (e) {
				//console.log('focus');
				if (!isNaN(new Date($element.val()).getDate())) {
					currentDate.setYear(new Date($element.val()).getFullYear());
					currentDate.setMonth(new Date($element.val()).getMonth());
				} else {
					currentDate.setYear(new Date().getFullYear());
					currentDate.setMonth(new Date().getMonth());
				}
				refreshPicker();
				//$input_element.select();
			});
			$input_element.blur(function (e) {
				//console.log('blur');
				hidePicker();
			});
			refreshPicker();
		};

		var refreshPicker = function () {
			//console.log('refreshPicker');
			$input_element.val(formatDate(new Date($element.val()), 2));

			$picker_element.empty();
			$picker_element.css('top', $input_element.outerHeight() + 3);
			$picker_element.mousedown(function (e) {
				e.preventDefault();
				e.stopPropagation();
			});

			// navigation holder
			var $nav_element = $(document.createElement('div'));
			$nav_element.addClass(plugin.settings.prefix + 'navigation');
			$picker_element.append($nav_element);
			// previous button
			var $nav_prev_element = $(document.createElement('div'));
			$nav_prev_element.addClass(plugin.settings.prefix + 'button');
			$nav_prev_element.addClass(plugin.settings.prefix + 'previous');
			$nav_prev_element.html(plugin.settings.labels.previous + ' ' + plugin.settings.labels.monthNames[new Date(new Date(currentDate).setMonth(currentDate.getMonth()-1)).getMonth()].substring(0, 3));
			$nav_prev_element.attr('title', plugin.settings.labels.previousTooltip);
			$nav_prev_element.click(function (e) {
				e.preventDefault();
				e.stopPropagation();
				previousMonth();
			});
			$nav_element.append($nav_prev_element);
			// today button
			var $nav_today_element = $(document.createElement('div'));
			$nav_today_element.addClass(plugin.settings.prefix + 'button');
			$nav_today_element.addClass(plugin.settings.prefix + 'today');
			$nav_today_element.html(plugin.settings.labels.today);
			$nav_today_element.attr('title', plugin.settings.labels.todayTooltip);
			$nav_today_element.click(function (e) {
				e.preventDefault();
				e.stopPropagation();
				today();
			});
			$nav_element.append($nav_today_element);
			// next button
			var $nav_next_element = $(document.createElement('div'));
			$nav_next_element.addClass(plugin.settings.prefix + 'button');
			$nav_next_element.addClass(plugin.settings.prefix + 'next');
			$nav_next_element.html(plugin.settings.labels.monthNames[new Date(new Date(currentDate).setMonth(currentDate.getMonth()+1)).getMonth()].substring(0, 3) + ' ' + plugin.settings.labels.next);
			$nav_next_element.attr('title', plugin.settings.labels.nextTooltip);
			$nav_next_element.click(function (e) {
				e.preventDefault();
				e.stopPropagation();
				nextMonth();
			});
			$nav_element.append($nav_next_element);

			// month holder
			var $month_element = $(document.createElement('div'));
			$month_element.addClass(plugin.settings.prefix + 'month');
			$month_element.html(plugin.settings.labels.monthNames[currentDate.getMonth()] + ' ' + currentDate.getFullYear());
			$picker_element.append($month_element);

			// calendar holder
			var $calendar_element = $(document.createElement('table'));
			$calendar_element.addClass(plugin.settings.prefix + 'calendar');
			$picker_element.append($calendar_element);
			// tr element (header)
			var $tr_element = $(document.createElement('tr'));
			$calendar_element.append($tr_element);
			// td element (week header)
			var $td_element = $(document.createElement('th'));
			$td_element.addClass(plugin.settings.prefix + 'week_header');
			$td_element.html(plugin.settings.labels.week);
			$tr_element.append($td_element);
			for (var i = 0; i < 7; i++) {
				// td element (day header)
				$td_element = $(document.createElement('th'));
				$td_element.addClass(plugin.settings.prefix + 'day_header');
				$td_element.html(plugin.settings.labels.dayNames[i]);
				$tr_element.append($td_element);
			}

			// DATES
			var firstDayOfMonth = currentDate;
			var lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate() - 1);
			var firstWeekAndYear = getWeekAndYear(firstDayOfMonth);
			var lastWeekAndYear = getWeekAndYear(lastDayOfMonth);
			var mondayFirstWeek = getDateOfISOWeek(firstWeekAndYear.week, firstWeekAndYear.year);
			var sundayLastWeek = getDateOfISOWeek(lastWeekAndYear.week, lastWeekAndYear.year, 6);
			
			var rows = Math.ceil((getDateDifferenceInDays(mondayFirstWeek, sundayLastWeek)) / 7);
			for (var row = 0; row < rows; row++) {
				// tr element
				var $tr_element = $(document.createElement('tr'));
				$calendar_element.append($tr_element);
				// td element (week)
				var $td_element = $(document.createElement('td'));
				$td_element.addClass(plugin.settings.prefix + 'week');
				$td_element.html(getWeekAndYear(new Date(firstDayOfMonth).setDate(firstDayOfMonth.getDate() + (row * 7))).week);
				$tr_element.append($td_element);
				for (var x = 0; x < 7; x++) {
					// td element (day)
					$td_element = $(document.createElement('td'));
					var date = new Date(mondayFirstWeek.getFullYear(), mondayFirstWeek.getMonth(), mondayFirstWeek.getDate() + (x+(row*7)));
					$td_element.html(date.getDate());
					$td_element.data('date', date);
					$td_element.click(function (e) {
						selectDate($(this).data('date'));
					});
					$td_element.addClass(plugin.settings.prefix + 'day');
					if (date < firstDayOfMonth || date > lastDayOfMonth) {
						$td_element.addClass(plugin.settings.prefix + 'day_other');
					}
					if (date.getDay() == 0 || date.getDay() == 6) {
						$td_element.addClass(plugin.settings.prefix + 'day_weekend');
					}
					$tr_element.append($td_element);
				}
			}
			
			// operations holder
			var $operations_element = $(document.createElement('div'));
			$operations_element.addClass(plugin.settings.prefix + 'operations');
			$picker_element.append($operations_element);
			// next button
			var $opr_delete_element = $(document.createElement('div'));
			$opr_delete_element.addClass(plugin.settings.prefix + 'button');
			$opr_delete_element.addClass(plugin.settings.prefix + 'empty');
			$opr_delete_element.html(plugin.settings.labels.empty);
			$opr_delete_element.attr('title', plugin.settings.labels.emptyTooltip);
			$opr_delete_element.click(function (e) {
				e.preventDefault();
				e.stopPropagation();
				empty();
			});
			$operations_element.append($opr_delete_element);


			if (document.activeElement === $input_element[0]) {
				showPicker();
			}
		};

		var previousMonth = function () {
			//console.log('previousMonth');
			currentDate.setMonth(currentDate.getMonth() - 1);
			refreshPicker();
		};
		
		var today = function () {
			//console.log('today');
			currentDate.setYear(new Date().getFullYear());
			currentDate.setMonth(new Date().getMonth());
			$element.val(formatDate(new Date(), 0));
			refreshPicker();
		};
		
		var nextMonth = function () {
			//console.log('nextMonth');
			currentDate.setMonth(currentDate.getMonth() + 1);
			refreshPicker();
		};
		
		var selectDate = function (date) {
			//console.log('selectDate');
			$element.val(formatDate(date, 0));
			$element.trigger('change');
			hidePicker();
		};

		var empty = function () {
			//console.log('empty');
			$element.val('');
			refreshPicker();
		};

		var showPicker = function () {
			//console.log('showPicker');
			$holder_element.removeClass('picker-hidden').addClass('picker-visible');
			if (plugin.settings.useDimmer) {
				$('#' + plugin.settings.prefix + 'dimmer').show();
			}
		};
		
		var hidePicker = function () {
			//console.log('hidePicker');
			$holder_element.removeClass('picker-visible').addClass('picker-hidden');
			if (plugin.settings.useDimmer) {
				$('#' + plugin.settings.prefix + 'dimmer').hide();
			}
		};

		var formatDate = function (date, type) {
			type = type !== undefined ? type : 1;
			date = typeof date == 'object' ? date : new Date(date);
			if (isNaN(date.getDate())) {
				return '';
			}
			var day = date.getDate();
			var month = date.getMonth() + 1;
			var year = date.getFullYear();
			switch (type) {
				case 0:
					return year + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day);
					break;
				case 1:
					return (day > 9 ? day : '0' + day) + '-' + (month > 9 ? month : '0' + month) + '-' + year;
					break;
				case 2:
					return day + '. ' + plugin.settings.labels.monthNames[month - 1] + ' ' + year;
					break;
				case 3:
					return day + '. ' + plugin.settings.labels.monthNames[month - 1].substring(0, 3) + '. ' + year;
					break;
			}
			return 'Invalid Type';
		};

		var getWeekAndYear = function(date) {
			date = new Date(date);
			date.setHours(0,0,0);
			date.setDate(date.getDate() + 4 - (date.getDay() || 7));
			var yearStart = new Date(date.getFullYear(), 0, 1);
			var weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
			return { week: weekNo, year: date.getFullYear() };
		};

		var getDateOfISOWeek = function(week, year, weekDay) {
			weekDay = weekDay ? weekDay : 0;
			var simple = new Date(year, 0, 1 + (week - 1) * 7);
			var date =  new Date(simple.setDate((simple.getDay() <= 4) ? (simple.getDate() - simple.getDay() + 1) : (simple.getDate() + 8 - simple.getDay())));
			return new Date(date.setDate(date.getDate() + weekDay));
		};

		var getDateDifferenceInDays = function (date1, date2) {
			var dayMs = 24 * 60 * 60 * 1000;
			var utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
			var utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
			return Math.floor((utc2 - utc1) / dayMs);
		};
		
		// REMOVE PLUGIN AND REVERT INPUT ELEMENT TO ORIGINAL STATE
		plugin.destroy = function () {
			$input_element.remove();
			$.removeData(element, 'datetator');
			$element.unbind('change', refreshPicker);
			$element.show();
			if ($('.datetator').length === 0) {
				$('#' + plugin.settings.prefix + 'dimmer').remove();
			}
		};
		
		// Initialize plugin
		plugin.init();
	};

	$.fn.datetator = function(options) {
		options = options !== undefined ? options : {};
		return this.each(function () {
			if (typeof(options) === 'object') {
				if (undefined === $(this).data('datetator')) {
					var plugin = new $.datetator(this, options);
					$(this).data('datetator', plugin);
				}
			} else if ($(this).data('datetator')[options]) {
				$(this).data('datetator')[options].apply(this, Array.prototype.slice.call(arguments, 1));
			} else {
				$.error('Method ' + options + ' does not exist in $.datetator');
			}
		});
	};

}(jQuery));
