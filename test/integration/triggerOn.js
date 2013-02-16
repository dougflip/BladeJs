test( 'The triggerOn method can submit a form from a dropdown change by ID', function() {
  $('#triggerOnForm').on('submit', function(){
    ok(true);
    return false;
  });
  $('#triggerOn .submit-by-id').blade('triggerOn').trigger('change');
});

test( 'The triggerOn method can submit a form from a dropdown change by jQueryEval', function() {
  $('#triggerOnFormEval').on('submit', function(){
    ok(true);
    return false;
  });
  $('#triggerOn .submit-by-jquery-eval').blade('triggerOn').trigger('change');
});

test( 'The triggerOn method can submit a form from using a custom event', function() {
  $('#triggerOnFormHover').on('submit', function(){
    ok(true);
    return false;
  });
  $('#triggerOn .submit-with-on').blade('triggerOn').trigger('click');
});
