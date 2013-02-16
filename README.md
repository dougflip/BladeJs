BladeJs jQuery Plugin
=====================

BladeJs is a small JavaScript library which maps HTML5 data attributes to jQuery AJAX requests.
The core functionality is designed to make AJAX via jQuery even easier than it already is out of the box.
Check out some [examples](http://www.dougflip.com/BladeJs) and [wiki](https://github.com/dougflip/BladeJs/wiki)
for a full list of features.

##Basic Usage

####Set up within document ready
We will set up a few configurations in document ready to get the most of BladeJs.
First, we'll provide a few default handlers that cover our most common success and failure actions.
Then we'll wire two CSS classes, `ajax-on` and `ajax-now`, to be handled by the core BladeJs methods

<pre>
$(function(){
  $.fn.blade({success: myapp.blade.success_default, error: myapp.blade.error_default});
  $('.ajax-on').blade('ajaxOn');
  $('.ajax-now').blade('ajaxNow');
});
</pre>

That's it! Now we just need some markup to see it in action.

####The ajaxOn plugin
Let's build a select list which will make an AJAX request on change.

<pre>
&lt;select class="ajax-on" data-url="/Address/UpdateByType">
</pre>

Now every time the select triggers a `change` event
BladeJs will serialize this element,
send the value to `/Address/UpdateByType`, and pass the response to `myapp.blade.success_default`.

####The ajaxNow plugin
Instead of a user event, say you just want to load data into an element on document ready.
For example, you have a report on a dashboard which you want to load via AJAX because it is a long query.

<pre>
&lt;div class="ajax-now" data-url="/Reports/Dashboard" success="myapp.blade.insertReport">
</pre>

Here, we tell BladeJs to run the AJAX request immediately because we mapped the CSS class to `ajaxNow`.
We are also using a different success function simply by specifying the fully qualified name.

##More Info
BladeJs uses defaults as much as possible, but any of these values can be overridden via data attributes.
The idea is for the plugin to work effortlessly for common scenarios,
but provide the flexibility to handle more advanced situations.
Check out the [wiki](https://github.com/dougflip/BladeJs/wiki) and [examples](http://www.dougflip.com/BladeJs)
for more in depth info.

##Tests
Unit tests are written using [QUnit](http://qunitjs.com/).
Viewing the unit tests in the browser is as simple as opening `test/index.html`.

A `grunt.js` file is also provided to run the unit tests from the command line using [Grunt](http://gruntjs.com/).
Please refer to the [Grunt documentation](https://github.com/gruntjs/grunt/blob/0.3-stable/docs/toc.md)
for full details, but here is a quick start for what its worth:
- install Grunt via npm: `npm install -g grunt`
- ensure Grunt is added to your path (was not auto added on install for me)
- I believe you need [PhantomJS](http://phantomjs.org/) installed (I already had it installed)
- run the tests! `grunt test -v`
