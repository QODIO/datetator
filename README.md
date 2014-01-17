Datetator
==========
Datetator is a jQuery-based replacement for input boxes, making them date pickers. It affects the original input box directly, which is used as the data container.
[You can see a demo here](http://opensource.faroemedia.com/datetator).


Usage
-----
###### include in head:
```html
<link rel="stylesheet" href="fm.datetator.jquery.css"/>
<script src="jquery-2.0.3.min.js"></script>
<script src="fm.datetator.jquery.js"></script>
```

###### to activate replacement:
```javascript
$('#inputBox').datetator();
```

###### if you want to change settings:
```javascript
$('#inputBox').datetator({
    prefix: 'datetator_',         // CSS class prefix
    height: 'auto',               // auto or element
    useDimmer: false              // dims the screen when result list is visible
});
```


CSS classes
-----------
Here is a list of all the css classes

Class                         | Description
----------------------------- | ------------------------------------------------------------------------------
datetator                     | This is the new input box. It has some extra classes called `picker-visible` and `picker-hidden` which tell if the picker is visible or not.
`prefix_`picker               | The holder for the picker popup.
`prefix_`dimmer               | This is the dimmer


DOM Structure
-------------
* dimmer
* datetator: *containing the `picker-visible`|`picker-hidden` class*
    * picker
        * date: *containing the `active` class*
        * date...


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


Browser compatibility
---------------------
* IE ???
* Chrome 8+
* Firefox ???
* Safari ???
* Opera ???



Copyright and license
---------------------
The MIT License (MIT)

Copyright (c) 2013 Faroe Media

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
