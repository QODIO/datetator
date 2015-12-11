/*
 English translation by Ingi P. Jacobsen

 This file isn't really used, as the english translation has been
 hardcoded into the plugin. But you want to change the english 
 translation without changing the plugin itself, you could use 
 this file, or you want to do a translation of your own language, 
 this would work well as a template.
*/
var datetator_labels = $.extend({}, typeof datetator_labels !== 'undefined' ? datetator_labels : {}, {
	en: {
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
});