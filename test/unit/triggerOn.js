test( 'The triggerOn method can submit a form from a dropdown change', function() {
  $('#UserForm').on('submit', function(){
    // just verify the handler was executed
    //  qUnit will fail if no assertions are run.
    ok(true);
    return false;
  });
  $('#Title').blade('triggerOn').trigger('change');
});