BladeJs jQuery Plugin
=====================

BladeJs is a small JavaScript library which maps HTML5 data attributes to jQuery AJAX requests. Built as a jQuery plugin the core functionality handles registering events, serializing data, invoking AJAX methods, and passing the response to a JavaScript function. Check out some [examples](http://www.dougflip.com/BladeJs) and [wiki](https://github.com/dougflip/BladeJs/wiki) for a full list of features.

####Basic Usage
We will set up two things in document ready in order to make the most of BladeJs.
First, we'll provide a few default handlers that cover our most common success and failure actions.
Then we'll wire any element with the CSS class <code>ajax-on</code> to be handled by the ajaxOn method of Blade.

<pre>
$(function(){
  $.fn.blade({ajaxSuccess: bladeSuccess_default, ajaxError: bladeError_default});
  $('.ajax-on').blade('ajaxOn');
});
</pre>

Let's build a select list which will make an AJAX request on change.

<pre>
&lt;select class="ajax-on" data-blade-url="/Address/UpdateByType" data-blade-serialize=".address-type"&gt;
</pre>

Now every time the select triggers a <code>change</code> event BladeJs will serialize all elements with the "address-type" CSS class, send the values to "/Address/UpdateByType", and pass the response to the bladeSuccess_default function.

####More Info
BladeJs uses defaults as much as possible, but any of these values can be overridden via data attributes. The idea is for the plugin to work effortlessly for common scenarios, but provide the flexibility to handle more advanced situations. Check out the [wiki](https://github.com/dougflip/BladeJs/wiki) and [examples](http://www.dougflip.com/BladeJs) for more in depth info.

####Unit Tests
Unit tests are written using [QUnit](http://qunitjs.com/).
Viewing the unit tests in the browser is as simple as opening `test/index.html`.

A `grunt.js` file is also provided to run the unit tests from the command line using [Grunt](http://gruntjs.com/).
Please refer to the [Grunt documentation](https://github.com/gruntjs/grunt/blob/0.3-stable/docs/toc.md) for full details, but here is a quickstart for what its worth:
- install Grunt via npm: `npm install -g grunt`
- ensure Grunt is added to your path - for me this meant: `PATH=$PATH:/usr/local/share/npm/bin ; export PATH`
- I believe you need [PhantomJS](http://phantomjs.org/) installed (I already had it installed)
- run the tests! `grunt test --verbose`