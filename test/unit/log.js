test( 'The utils log method should safely log to the console when available', function() {
  $.fn.blade.utils.log('This is a test message');
  ok(true, 'Logging a message did not raise an error');
});

test( 'The utils log method can be overridden', function() {
  var originalLog = $.fn.blade.utils.log;

  $.fn.blade.utils.log = function(msg){
    return 'New log: ' + msg;
  };

  var result = $.fn.blade.utils.log('test message');
  deepEqual('New log: test message', result, "Log messages do not match!");

  $.fn.blade.utils.log = originalLog;
});