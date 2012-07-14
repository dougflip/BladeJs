BladeJs jQuery Plugin
=====================

BladeJs is a small JavaScript library which maps HTML5 data attributes to jQuery AJAX requests. Built as a jQuery plugin the core functionality handles registering events, serializing data, invoking AJAX methods, and passing the response to a JavaScript function. Check out some [examples](http://www.dougflip.com/BladeJs) and [wiki](https://github.com/dougflip/BladeJs/wiki) for a full list of features.

####The ajaxOn Method
The ajaxOn method is the central piece of BladeJs. Here we use jQuery to select all elements on the page with an "ajax-on" CSS class and apply the plugin to them.

<pre>
$(function(){
  $('.ajax-on').blade('ajaxOn');
});
</pre>

####The Markup
Now that we have BladeJs looking for ".ajax-on" elements, let's see how to construct some markup. Here's an example of a select list which needs to issue an ajax request when an "onchange" event is triggered. Notice how values are stored as HTML5 attributes and use a "blade" namespace by default.

<pre>
&lt;select class="ajax-on"
          data-blade-on="change" 
          data-blade-url="/Address/UpdateByType" 
          data-blade-serialize=".address-type" 
          data-blade-success="ajaxSuccess"&gt;
</pre>

####The Result
Now every time the select triggers a "change" event BladeJs will serialize all elements with the "address-type" CSS class, send the values to "/Address/UpdateByType", and pass the response to the ajaxSuccess function.

####What Else?
BladeJs is built around defaults and ease of use. For example, in the above markup we can remove the <code>data-blade-on</code> attribute because select elements operate on the change method by default. There is also support for registering global handlers for success, error, and beforeSend callbacks. Check out the [wiki](https://github.com/dougflip/BladeJs/wiki) and [examples](http://www.dougflip.com/BladeJs) for in depth info.
