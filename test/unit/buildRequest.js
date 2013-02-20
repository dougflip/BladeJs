var buildRequestNs = {
  // sample callback functions
  defaultSuccess: function(){},
  defaultError: function(){},

  customSuccess: function(){},
  customError: function(){},

  nestedNs: {
    customSuccess: function(){}
  }
};

test('The buildRequest method should return all defaults when nothing is specified', function(){
  // set up Blade
  $.fn.blade({ success:buildRequestNs.defaultSuccess, error:buildRequestNs.defaultError });

  var request = $.fn.blade.utils.buildRequest(null, null, null);

  ok(request != null, "The returned request object was null!");
  deepEqual(request.context, null, "A context was set even though none was specified");
  deepEqual(request.data, null, "A data property was set even though none was specified");
  ok(request.propagate == false, "The request propagate value was set to true");
  deepEqual(request.success, buildRequestNs.defaultSuccess, "Default success was not properly set");
  deepEqual(request.error, buildRequestNs.defaultError, "Default success was not properly set");
});

test('The buildRequest method can set a context', function(){
  // set up Blade
  $.fn.blade({ success:buildRequestNs.defaultSuccess, error:buildRequestNs.defaultError });

  var context = {};
  var request = $.fn.blade.utils.buildRequest(context, null, null);

  ok(request != null, "The returned request object was null!");
  deepEqual(request.context, context, "A context was NOT set when specified");
});

test('The buildRequest method can set data properly', function(){
  // set up Blade
  $.fn.blade({ success:buildRequestNs.defaultSuccess, error:buildRequestNs.defaultError });

  var data = { one: 'one', two: 'two' };
  var request = $.fn.blade.utils.buildRequest(null, null, data);

  ok(request != null, "The returned request object was null!");
  deepEqual(request.data, data, "A data property was NOT set when specified");
});

test('The buildRequest method can resolve callback functions from strings', function(){
  // set up Blade
  $.fn.blade({ success:buildRequestNs.defaultSuccess, error:buildRequestNs.defaultError });

  var overrides = { success: 'buildRequestNs.customSuccess', error: 'buildRequestNs.customError' };
  var request = $.fn.blade.utils.buildRequest(null, overrides, null);

  ok(request != null, "The returned request object was null!");
  deepEqual(request.success, buildRequestNs.customSuccess, "The customSuccess handler was not properly set");
  deepEqual(request.error, buildRequestNs.customError, "The customError handler was not properly set");
});

test('The buildRequest method can resolve callback functions from strings in the bladeSpace', function(){
  // set up Blade
  $.fn.blade({
    success:buildRequestNs.defaultSuccess,
    error:buildRequestNs.defaultError,
    bladeSpace: buildRequestNs.nestedNs
  });

  var overrides = { success: 'customSuccess', error: 'buildRequestNs.customError' };
  var request = $.fn.blade.utils.buildRequest(null, overrides, null);

  ok(request != null, "The returned request object was null!");
  deepEqual(request.success, buildRequestNs.nestedNs.customSuccess, "The customSuccess handler was not properly set");
  deepEqual(request.error, buildRequestNs.customError, "The customError handler was not properly set");

  $.fn.blade({bladeSpace: document});
});

test('The buildRequest method can do all of the above at once', function(){
  // set up Blade
  $.fn.blade({
    success:buildRequestNs.defaultSuccess,
    error:buildRequestNs.defaultError,
    bladeSpace: buildRequestNs
  });
  var context = {};
  var data = { one: 'one', two: 'two' };
  var overrides = { success: 'customSuccess', error: 'customError' };
  var request = $.fn.blade.utils.buildRequest(context, overrides, data);

  ok(request != null, "The returned request object was null!");
  deepEqual(request.context, context, "A context was set even though none was specified");
  deepEqual(request.data, data, "A data property was set even though none was specified");
  ok(request.propagate == false, "The request propagate value was set to true");
  deepEqual(request.success, buildRequestNs.customSuccess, "Default success was not properly set");
  deepEqual(request.error, buildRequestNs.customError, "Default success was not properly set");
});
