// sample callback functions
function defaultSuccess(){}
function defaultError(){}

function customSuccess(){}
function customError(){}

test('Callbacks should be defaulted when there is no data attribute', function(){

  $.fn.blade({
    success:defaultSuccess,
    error:defaultError,
    beforeSend:function(xhr, settings){
      deepEqual(defaultSuccess, settings.success, "Default success was not properly set!");
      deepEqual(defaultError, settings.error, "Default error was not properly set!");
    }
  });

  $('.default-callbacks').blade('ajaxOn').change();
});

test('Callbacks should be overridden by data attributes', function(){

  $.fn.blade({
    success:defaultSuccess,
    error:defaultError,
    beforeSend:function(xhr, settings){
      deepEqual(customSuccess, settings.success, "Custom success was not properly set!");
      deepEqual(customError, settings.error, "Custom error was not properly set!");

      // need to make sure and clear this so it does not interfere with other tests!
      $.fn.blade({beforeSend:null});
    }
  });

  $('.custom-callbacks').blade('ajaxOn').change();
});
