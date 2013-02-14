test('The ajaxOn method serializes a field', function() {

  $.fn.blade({beforeSend:function(xhr, settings){
    ok(settings !== null, 'Settings was null!');
    deepEqual('GET', settings.type, 'Incorrect request Type was set.');
    var qs = settings.url.substring(settings.url.indexOf('?')+1);
    deepEqual('FirstName=Geddy', qs, 'Field was not properly serialized into the query string');

    // need to make sure and clear this so it does not interfere with other tests!
    $.fn.blade({beforeSend:null});
  }});

  $('#FirstName').blade('ajaxOn').change();
});

test('The ajaxOn method handles custom serialize attributes', function() {

  $.fn.blade({beforeSend:function(xhr, settings){
    ok(settings !== null, 'Settings was null!');
    var qs = settings.url.substring(settings.url.indexOf('?')+1);
    deepEqual($('#UserForm').serialize(), qs, 'Form was not properly serialized');

    // need to make sure and clear this so it does not interfere with other tests!
    $.fn.blade({beforeSend:null});
    return false;
  }});

  $('#UserFormSubmitButton').blade('ajaxOn').click();
});

test('The ajaxOn method serializes a form', function() {

  $.fn.blade({beforeSend:function(xhr, settings){
    ok(settings !== null, 'Settings was null!');
    deepEqual('POST', settings.type, 'Incorrect request Type was set.');
    deepEqual($('#UserForm').serialize(), settings.data, 'Form was not properly serialized');

    // need to make sure and clear this so it does not interfere with other tests!
    $.fn.blade({beforeSend:null});
  }});

  $('#UserForm').blade('ajaxOn').submit();
});
