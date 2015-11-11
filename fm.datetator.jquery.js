/*
 Datetator jQuery Plugin
 Datetator is a jQuery-based replacement for input boxes, making them date pickers.
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
	/**
	 * Datetator
	 * @param element
	 * @param options
	 */
	$.datetator = function (element, options) {
		//// ================== SETTINGS ================== ////
		var defaults = {
			prefix: 'datetator_',
			height: 'auto',
			useDimmer: false,
			class: '',
			labels: {
				week: 'Wk',
				dayNames: [
					'Mo',
					'Tu',
					'We',
					'Th',
					'Fr',
					'Sa',
					'Su'
				],
				monthNames: [
					'January',
				    'February',
				    'March',
				    'April',
				    'May',
				    'June',
				    'July',
				    'August',
				    'September',
				    'October',
				    'November',
				    'December'
				],
				previousMonth: '«',
				nextMonth: '»',
				previousYear: '«',
				nextYear: '»',
				empty: 'Remove',
				today: 'Today',
				previousMonthTooltip: 'Show previous month',
				nextMonthTooltip: 'Show next month',
				previousYearTooltip: 'Show previous year',
				nextYearTooltip: 'Show next year',
				emptyTooltip: 'Remove date',
				todayTooltip: 'Show and choose today\'s date'
			}
		};

		//// ================== PREPARE VARIABLES ================== ////
		var plugin = this;
		var $element = $(element);
		var $holder_element = null;
		var $input_element = null;
		var $picker_element = null;
		var reloadDate = function () {
			if (!isNaN(new Date($element.val()).getDate())) {
				return new Date(new Date($element.val()).getFullYear(), new Date($element.val()).getMonth(), 1, 0, 0, 0);
			} else {
				return new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0);
			}
		};
		var currentDate = reloadDate();
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



		//// ================== "INITIALIZE PLUGIN" METHOD ================== ////
		plugin.init = function () {
			plugin.settings = $.extend({}, defaults, options);

			//// CREATE ELEMENTS
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
			$input_element.addClass('datetator picker-hidden ' + plugin.settings.class);
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

			//// BIND ELEMENTS EVENTS
			// source element
			$element.change(function () {
				currentDate = reloadDate();
				refreshPicker();
			});
			$input_element.mouseup(function (e) {
				e.preventDefault();
				e.stopPropagation();
				$input_element.trigger('focus');
			});
			$input_element.focus(function () {
				currentDate = reloadDate();
				refreshPicker();
				//$input_element.select();
			});
			$input_element.blur(function () {
				hidePicker();
			});
			refreshPicker();
		};

		
		//// ================== "REFRESH PICKER" METHOD ================== ////
		plugin.refresh = function () {
			refreshPicker();
		};
		var refreshPicker = function () {
			$input_element.val(formatDate(new Date($element.val()), 2));

			$picker_element.empty();
			$picker_element.css('top', $input_element.outerHeight() + 3);
			$picker_element.mousedown(function (e) {
				e.preventDefault();
				e.stopPropagation();
			});

			// NAVIGATION HOLDER
			var $nav_element = $(document.createElement('div'));
			$nav_element.addClass(plugin.settings.prefix + 'navigation');
			$picker_element.append($nav_element);
			
			// LINE 1
			// previous month button
			var $nav_prev_month_element = $(document.createElement('div'));
			$nav_prev_month_element.addClass(plugin.settings.prefix + 'button');
			$nav_prev_month_element.addClass(plugin.settings.prefix + 'previous_month');
			$nav_prev_month_element.html(plugin.settings.labels.previousMonth.replace('{month}', plugin.settings.labels.monthNames[new Date(new Date(currentDate).setMonth(currentDate.getMonth() - 1)).getMonth()].substring(0, 3)));
			$nav_prev_month_element.attr('title', plugin.settings.labels.previousMonthTooltip);
			$nav_prev_month_element.click(function (e) {
				e.preventDefault();
				e.stopPropagation();
				previousMonth();
			});
			$nav_element.append($nav_prev_month_element);
			// month holder
			var $nav_month_element = $(document.createElement('div'));
			$nav_month_element.addClass(plugin.settings.prefix + 'month');
			$nav_month_element.html(plugin.settings.labels.monthNames[currentDate.getMonth()]);
			$nav_element.append($nav_month_element);
			// next month button
			var $nav_next_month_element = $(document.createElement('div'));
			$nav_next_month_element.addClass(plugin.settings.prefix + 'button');
			$nav_next_month_element.addClass(plugin.settings.prefix + 'next_month');
			$nav_next_month_element.html(plugin.settings.labels.nextMonth.replace('{month}', plugin.settings.labels.monthNames[new Date(new Date(currentDate).setMonth(currentDate.getMonth() + 1)).getMonth()].substring(0, 3)));
			$nav_next_month_element.attr('title', plugin.settings.labels.nextMonthTooltip);
			$nav_next_month_element.click(function (e) {
				e.preventDefault();
				e.stopPropagation();
				nextMonth();
			});
			$nav_element.append($nav_next_month_element);

			// LINE 2
			// previous year button
			var $nav_prev_year_element = $(document.createElement('div'));
			$nav_prev_year_element.addClass(plugin.settings.prefix + 'button');
			$nav_prev_year_element.addClass(plugin.settings.prefix + 'previous_year');
			$nav_prev_year_element.html(plugin.settings.labels.previousYear.replace('{year}', new Date(new Date(currentDate).setYear(currentDate.getFullYear() - 1)).getFullYear().toString()));
			$nav_prev_year_element.attr('title', plugin.settings.labels.previousYearTooltip);
			$nav_prev_year_element.click(function (e) {
				e.preventDefault();
				e.stopPropagation();
				previousYear();
			});
			$nav_element.append($nav_prev_year_element);
			// year holder
			var $nav_year_element = $(document.createElement('div'));
			$nav_year_element.addClass(plugin.settings.prefix + 'year');
			$nav_year_element.html(currentDate.getFullYear());
			$nav_element.append($nav_year_element);
			// next year button
			var $nav_next_year_element = $(document.createElement('div'));
			$nav_next_year_element.addClass(plugin.settings.prefix + 'button');
			$nav_next_year_element.addClass(plugin.settings.prefix + 'next_year');
			$nav_next_year_element.html(plugin.settings.labels.nextYear.replace('{year}', new Date(new Date(currentDate).setYear(currentDate.getFullYear() + 1)).getFullYear().toString()));
			$nav_next_year_element.attr('title', plugin.settings.labels.nextYearTooltip);
			$nav_next_year_element.click(function (e) {
				e.preventDefault();
				e.stopPropagation();
				nextYear();
			});
			$nav_element.append($nav_next_year_element);

			// CALENDAR HOLDER
			var $calendar_element = $(document.createElement('table'));
			$calendar_element.addClass(plugin.settings.prefix + 'calendar');
			$picker_element.append($calendar_element);
			// tr element (header)
			var $calendar_tr_element = $(document.createElement('tr'));
			$calendar_element.append($calendar_tr_element);
			// td element (week header)
			var $calendar_td_element = $(document.createElement('th'));
			$calendar_td_element.addClass(plugin.settings.prefix + 'week_header');
			$calendar_td_element.html(plugin.settings.labels.week);
			$calendar_tr_element.append($calendar_td_element);
			for (var i = 0; i < 7; i++) {
				// td element (day header)
				$calendar_td_element = $(document.createElement('th'));
				$calendar_td_element.addClass(plugin.settings.prefix + 'day_header');
				$calendar_td_element.html(plugin.settings.labels.dayNames[i]);
				$calendar_tr_element.append($calendar_td_element);
			}

			// DATES
			var firstDayOfMonth = currentDate;
			var lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate() - 1);
			var firstWeekAndYear = getWeekAndYear(firstDayOfMonth);
			var lastWeekAndYear = getWeekAndYear(lastDayOfMonth);
			var mondayFirstWeek = getDateOfISOWeek(firstWeekAndYear.week, firstWeekAndYear.year);
			var sundayLastWeek = getDateOfISOWeek(lastWeekAndYear.week, lastWeekAndYear.year, 6);
			var initDate = new Date();

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
					var date = new Date(mondayFirstWeek.getFullYear(), mondayFirstWeek.getMonth(), mondayFirstWeek.getDate() + (x + (row * 7)));
					$td_element.html(date.getDate());
					$td_element.data('date', date);
					$td_element.click(function () {
						selectDate($(this).data('date'));
					});
					$td_element.addClass(plugin.settings.prefix + 'day');
					if (formatDate(date, 0) == $element.val()) {
						$td_element.addClass(plugin.settings.prefix + 'day_active');
					}
					if (date < firstDayOfMonth || date > lastDayOfMonth) {
						$td_element.addClass(plugin.settings.prefix + 'day_other');
					}
					if (date.getDay() == 0 || date.getDay() == 6) {
						$td_element.addClass(plugin.settings.prefix + 'day_weekend');
					}
					if (date.toDateString() == initDate.toDateString()) {
						$td_element.addClass(plugin.settings.prefix + 'day_today');
					}
					$tr_element.append($td_element);
				}
			}
			
			// operations holder
			var $operations_element = $(document.createElement('div'));
			$operations_element.addClass(plugin.settings.prefix + 'operations');
			$picker_element.append($operations_element);
			// "remove" button
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
			// "today" button
			var $opr_today_element = $(document.createElement('div'));
			$opr_today_element.addClass(plugin.settings.prefix + 'button');
			$opr_today_element.addClass(plugin.settings.prefix + 'today');
			$opr_today_element.html(plugin.settings.labels.today);
			$opr_today_element.attr('title', plugin.settings.labels.todayTooltip);
			$opr_today_element.click(function (e) {
				e.preventDefault();
				e.stopPropagation();
				today();
			});
			$operations_element.append($opr_today_element);

			if (document.activeElement === $input_element[0]) {
				showPicker();
			}
		};

		
		//// ================== DATE CHOOSING METHODS ================== ////
		var today = function () {
			currentDate.setYear(new Date().getFullYear());
			currentDate.setMonth(new Date().getMonth());
			$element.val(formatDate(new Date(), 0));
			$element.trigger('change');
			hidePicker();
		};

		var previousMonth = function () {
			currentDate.setMonth(currentDate.getMonth() - 1);
			refreshPicker();
		};
		var nextMonth = function () {
			currentDate.setMonth(currentDate.getMonth() + 1);
			refreshPicker();
		};
		
		var previousYear = function () {
			currentDate.setYear(currentDate.getFullYear() - 1);
			refreshPicker();
		};
		var nextYear = function () {
			currentDate.setYear(currentDate.getFullYear() + 1);
			refreshPicker();
		};
		
		var selectDate = function (date) {
			$element.val(formatDate(date, 0));
			$element.trigger('change');
			hidePicker();
		};

		
		//// ================== OTHER METHODS ================== ////
		var empty = function () {
			$element.val('');
			$element.trigger('change');
			hidePicker();
		};

		var showPicker = function () {
			$holder_element.removeClass('picker-hidden').addClass('picker-visible');
			if (plugin.settings.useDimmer) {
				$('#' + plugin.settings.prefix + 'dimmer').show();
			}
		};
		
		var hidePicker = function () {
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


		//// ================== "DESTROY" METHOD ================== ////
		plugin.destroy = function () {
			$input_element.remove();
			$.removeData(element, 'datetator');
			$element.unbind('change', refreshPicker);
			$element.show();
			if ($('.datetator').length === 0) {
				$('#' + plugin.settings.prefix + 'dimmer').remove();
			}
		};

		
		//// ================== INITIALIZE PLUGIN ================== ////
		plugin.init();
	};

	
	//// ================== INSTANTIATE PLUGIN METHOD ================== ////
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
