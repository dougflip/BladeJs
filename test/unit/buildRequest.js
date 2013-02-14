// sample callback functions
function defaultSuccess(){}
function defaultError(){}

function customSuccess(){}
function customError(){}

test('The buildRequest method should return all defaults when nothing is specified', function(){
  // set up Blade
  $.fn.blade({ success:defaultSuccess, error:defaultError });

  var request = $.fn.blade.utils.buildRequest(null, null, null);

  ok(request != null, "The returned request object was null!");
  deepEqual(request.context, null, "A context was set even though none was specified");
  deepEqual(request.data, null, "A data property was set even though none was specified");
  ok(request.propagate == false, "The request propagate value was set to true");
  deepEqual(request.success, defaultSuccess, "Default success was not properly set");
  deepEqual(request.error, defaultError, "Default success was not properly set");
});

test('The buildRequest method can set a context', function(){
  // set up Blade
  $.fn.blade({ success:defaultSuccess, error:defaultError });

  var context = {};
  var request = $.fn.blade.utils.buildRequest(context, null, null);

  ok(request != null, "The returned request object was null!");
  deepEqual(request.context, context, "A context was NOT set when specified");
});

test('The buildRequest method can set data properly', function(){
  // set up Blade
  $.fn.blade({ success:defaultSuccess, error:defaultError });

  var data = { one: 'one', two: 'two' };
  var request = $.fn.blade.utils.buildRequest(null, null, data);

  ok(request != null, "The returned request object was null!");
  deepEqual(request.data, data, "A data property was NOT set when specified");
});

test('The buildRequest method can resolve callback functions from strings', function(){
  // set up Blade
  $.fn.blade({ success:defaultSuccess, error:defaultError });

  var overrides = { success: 'customSuccess', error: 'customError' };
  var request = $.fn.blade.utils.buildRequest(null, overrides, null);

  ok(request != null, "The returned request object was null!");
  deepEqual(request.success, customSuccess, "The customSuccess handler was not properly set");
  deepEqual(request.error, customError, "The customError handler was not properly set");
});

test('The buildRequest method can do all of the above at once', function(){
  // set up Blade
  $.fn.blade({ success:defaultSuccess, error:defaultError });
  var context = {};
  var data = { one: 'one', two: 'two' };
  var overrides = { success: 'customSuccess', error: 'customError' };
  var request = $.fn.blade.utils.buildRequest(context, overrides, data);

  ok(request != null, "The returned request object was null!");
  deepEqual(request.context, context, "A context was set even though none was specified");
  deepEqual(request.data, data, "A data property was set even though none was specified");
  ok(request.propagate == false, "The request propagate value was set to true");
  deepEqual(request.success, customSuccess, "Default success was not properly set");
  deepEqual(request.error, customError, "Default success was not properly set");
});
