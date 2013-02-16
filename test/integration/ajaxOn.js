test('The ajaxOn method serializes a single field for a GET request', function() {

  $.fn.blade({beforeSend:function(xhr, settings){
    ok(settings !== null, 'Settings was null!');
    deepEqual('GET', settings.type, 'Incorrect request Type was set.');
    var qs = settings.url.substring(settings.url.indexOf('?')+1);
    deepEqual('FirstName=Geddy', qs, 'Field was not properly serialized into the query string');

    // need to make sure and clear this so it does not interfere with other tests!
    $.fn.blade({beforeSend:null});
    return false
  }});

  $('#ajaxOn .single-field-no-data').blade('ajaxOn').change();
});

test('The ajaxOn method forwards to jQueryEval for traversal support', function() {

  $.fn.blade({beforeSend:function(xhr, settings){
    ok(settings !== null, 'Settings was null!');
    var qs = settings.url.substring(settings.url.indexOf('?')+1);
    deepEqual(qs, $('#ajaxOn .get-form').serialize(), 'Form was not properly serialized');

    // need to make sure and clear this so it does not interfere with other tests!
    $.fn.blade({beforeSend:null});
    return false;
  }});

  $('#ajaxOn .forward-to-jquery-eval').blade('ajaxOn').click();
});

test('The ajaxOn method serializes a POST form', function() {

  $.fn.blade({beforeSend:function(xhr, settings){
    ok(settings !== null, 'Settings was null!');
    deepEqual('POST', settings.type, 'Incorrect request Type was set.');
    deepEqual($('#ajaxOn .post-form').serialize(), settings.data, 'Form was not properly serialized');

    // need to make sure and clear this so it does not interfere with other tests!
    $.fn.blade({beforeSend:null});
    return false;
  }});

  $('#ajaxOn .post-form').blade('ajaxOn').submit();
});
