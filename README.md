BladeJs
=======

Overview
--------

BladeJS is a small JavaScript library which attempts to make interactive AJAX communication via jQuery easier for developers. The main goal of the project is to reduce the amount of JavaScript code needed to write responsive applications. BladeJS provides a generalized approach which allows developers to provide arguments/data within HTML markup by way of HTML5 data attributes. This helps to limit the amount of common JavaScript code needed to make these communications possible.

Example
-------
#### The long version
This HTML snippet should help to illustrate BladeJS:

<code>
&lt;select class="ajax-on" data-on="change" data-url="/Address/UpdateByType" data-serialize=".address-type" data-success="ajaxSuccess_Default" &gt;...&lt;/select&gt;
</code>

There are a few items to note:
- the CSS class of "ajax-on" is arbitrary and serves as a selector to apply the BladeJs ajaxOn plugin
- data-on specifies the "change" event for this element
- data-url provides the URL to the server side method to be invoked
- data-serialize specifies what data should be serialized via jQuery and included in the request
- data-success specifies a function which will handle the response of the ajax request

#### The shorter version

Although the above markup works fine, the same functionality can be achieved with less typing. By default in BladeJs select elements operate on the "change" event. This means we do not need to explicitly set this attribute and we can remove it entirely. Secondly, the success function can be registered with BladeJs on setup as the default success handler. This leaves us with just the URL and the data to serialize:

<code>
&lt;select class="ajax-on" data-url="/Address/UpdateByType" data-serialize=".address-type" &gt;...&lt;/select&gt;
</code>

####So what does this actually do?
Good question! 
First, we need to initialize the select element:

<code>
$(function(){
  $('.ajax-on').blade('ajaxOn')
});
</code>

Now every time the element triggers a "change" event BladeJs will serialize all elements with the "address-type" class, send the values to "/Address/UpdateByType", and pass the response to the ajaxSuccess_Default function. And that is the core of BladeJs.

data-serialize
--------------
The data-serialize attribute accepts a special syntax which makes serializing data for the server easy. Lets look at the three approaches that BladeJs provides:
### select: 
// TODO: add info

### traverse: 
// TODO: add info

### func: 
// TODO: add info
