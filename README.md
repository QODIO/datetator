Datetator
==========
Datetator is a jQuery-based replacement for input boxes, making them date pickers. It affects the original input box directly, which is used as the data container.
[You can see a demo here](http://opensource.faroemedia.com/datetator).


Usage
-----
###### include in head:
```html
<link rel="stylesheet" href="fm.datetator.jquery.css"/>
<script src="jquery-1.11.0.min.js"></script>
<script src="fm.datetator-de.jquery.js"></script> <!-- Optional translations here -->
<script src="fm.datetator.jquery.js"></script>
```

###### to activate replacement:
```javascript
$('#inputBox').datetator();
```
If you don't wan't to meddle with scripting, there is an alternative to activate replacement, by using inline markup. 
```html
<input type="text" class="datetator" data-datetator-use-dimmer="true" data-datetator-use-remove="false">
```

###### if you want to change settings:
```javascript
$('#inputBox').datetator({
    prefix: 'datetator_',       // CSS class prefix
    height: 'auto',             // Auto or element
    useDimmer: false,           // Dims the screen when result list is visible
    useRemove: true,            // Determines if the 'remove' button should be visible
    class: '',                  // Adds a custom class to the datator input element
    language: 'en',             // The language to be used
    labels: {                   // Contains all the labels for the plugin, 
                                // - this can be changed to other languages (or use tranlation files)
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
    }
});
```


CSS classes
-----------
Here is a list of all the css classes

Class                         | Description
----------------------------- | ------------------------------------------------------------------------------
`prefix_`element              | This is the new input box. It has some extra classes called `picker-visible` and `picker-hidden` which tell if the picker is visible or not.
`prefix_`picker               | The holder for the picker popup.
`prefix_`dimmer               | This is the dimmer
`prefix_`navigation           | This is the top bar of the picker, containing month, year and navigation buttons
`prefix_`button               | This is a global class for all buttons
`prefix_`previous_month       | This class for the previous month button
`prefix_`month                | This class is for the month display within the navigation bar
`prefix_`next_month           | This class fot the next month button
`prefix_`previous_year        | This class for the previous year button
`prefix_`year                 | This class is for the year display within the navigation bar
`prefix_`next_year            | This class fot the next year button
`prefix_`calendar             | This is the holder for the calendar
`prefix_`week_header          | The table header cell containing the week title
`prefix_`day_header           | The table header cell containing the day names
`prefix_`week                 | The table cell containing week numbers
`prefix_`day                  | The table cell containing the day dates. This element contains the `prefix_`day_active class if it is the chosen date. This element can also contain the `prefix_`day_other class if dates are outside current month, and `prefix_`day_weekend for weekend dates.
`prefix_`operations           | This is the holder for the bottom buttons 
`prefix_`empty                | This class for the remove/delete/empty button
`prefix_`today                | This class for the today button


DOM Structure
-------------
* dimmer
* element: *containing the `picker-visible`|`picker-hidden` class*
    * picker
        * navigation:
            * previous_month *containing the `button` class*
            * month
            * next_month *containing the `button` class*
            * previous_year *containing the `button` class*
            * year
            * next_year *containing the `button` class*
        * calendar *this is a table element*
            * tr
                * th *first one is `week_header`, others are `day_header`*
            * tr
                * td *first one is `week`, others are `day`*
            * tr...
        * operations
            * empty *containing the `button` class*
            * today *containing the `button` class*


jQuery methods
--------------
Method             | Description
------------------ | -----------
refresh            | This method is used internally by the plugin, but you can also call it manually, it is used to refresh the plugin. A scenario where this would be useful is if the data in the original input box is changed by some other script.
destroy            | This method is used to remove the instance of the plugin from the input box and restore it to its original state.


###### Method usage
```javascript
$('#inputBox').datetator('refresh');
```
or 
```javascript
$('#inputBox').datetator('destroy');
```


Translations
---------------------
It's very easy to make your own translations. Make a copy of the file `fm.datetator-en.jquery.js`, substitute `en` with your own country code, change the translations inside said file, and then include the script before you include `fm.datetator.jquery.js`, but after you include the jQuery library (as shown in the usage section).


Browser compatibility
---------------------
* IE 9+
* Chrome 3+
* Firefox 3.6+
* Safari 5+
* Opera 10.5+



Copyright and license
---------------------
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
