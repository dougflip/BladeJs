/*!
 * BladeJs jQuery plugin
 * Copyright 2012 Doug DiFilippo (dougflip) http://www.dougflip.com/BladeJs
 * Project repository: https://github.com/dougflip/bladejs
 *
 * version: 0.0.3 (2013-01-09)
 * @requires jQuery v1.7.0 or later
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */
(function($){
  /*********************************************************
   *   PUBLIC JQUERY EXTENSION METHODS:
   *   Map of publicly available functions
   *   accessed via $().blade('functionName')
   *   init is the default method and accessed as $().blade();
   *********************************************************/
  var methods = {
    /**
     * Accepts an object map of values used to extend $.fn.blade.defaults.
     * @param {Object} options object map of values used to extend $.fn.blade.defaults
     */
    init: function(options){
      $.extend($.fn.blade.defaults, options);
    },

    /**
     * Main method of the BladeJs plugin
     * Maps provided HTML5 data attributes to a jQuery ajax request object and attempts to send to the server
     * All data attributes are merged with $.fn.blade.defaults to create the request object.
     * This means that any value type property supported by jQuery AJAX can simply be supplied as a data attribute.
     * It is recommended that any situation beyond this scope should be handled with a custom `beforeSend` handler.
     * @data {String} confirm set to a callback which will be invoked after BladeJs has created the request object, but before it is sent
     *                Your application will provide the user with a chance to "cancel" the request.
     *                If the action is "confirmed" you are responsible for forwarding the request to jQuery - otherwise discard the object
     *                BladeJs provides a default implementation, $.fn.blade.defaults.confirmAction, that can be overridden.
     *                To signify the default is to be used, simply provide an empty data-blade-confirm attribute.
     */
    ajaxOn: function(){
      return this.blade('on', function(){
        var $this = $(this);

        // combine defaults with data atts
        var request = $.extend({context: $this}, $.fn.blade.defaults, $this.data());
        request.data = $this.blade('serialize');

        for(var i=0; i < callbacks.length; i++){
          if(typeof request[callbacks[i]] === 'string'){
            request[callbacks[i]] = $.fn.blade.utils.resolveObject(request[callbacks[i]]);
          }
        }

        executeAjax(request);

        return request.stopPropagation === undefined ? false : request.stopPropagation;
      });
    },

    /**
     * Uses the selected jquery element to determine the event which will handle actions.
     * This will always be an array.
     * For regular events this will be an array with one element - the event name.
     * For delegation, this first item in the array is the event
     *   and the second item is selector to be matched.
     * If a @data-on attribute is provided this will be used above anything else.
     * Otherwise, certain elements carry implicit events:
     *   FORM-"submit", SELECT-"change", INPUT:TEXT-"blur"
     * Finally, this will fall back to 'click'
     */
    getRegisteredEvent: function(){
      var d = this.data();
      if(d.on){
        // check for use of 'on' as with delegate
        return d.on.split(/\s+\|\s+/);
      }
      if(this.is('form')){
        return ['submit'];
      }
      if (this.is('select') || this.is('input:text')){
        return ['change'];
      }
      return ['click'];
    },

    /**
     * Attempts to locate a jQuery set by performing a set of operations.
     * In practice, HTML elements will contain references via a data attribute that will be resolved by this function.
     * For example, a select list may indicate on change it needs to serialize all inputs within its own containing DIV tag:
     *       <select data-serialize="traverse: closest('div').find(':input')">
     * This function would receive the data attribute string as query and perform the search relative to the select element (which will be scoped as keyword this).
     * @param {String} query defines the strategy to be used when locating items. The following example formats are supported:
     *           "#someId, .someClass, someTagName" - any valid jQuery selector. Simply gets wrapped in the $ sign.
     *           "traverse: closest('.container').find(':input')" - navigates from/relative to the current context (this). Any chained jQuery functions are accepted
     *           "func: someFunction" - a function to be called which is passed this and returns a jQuery object
     */
    jQueryEval: function(query){
      if(!query){
        $.fn.blade.utils.log('BladeJs.jQueryEval: NULL/Empty query provided - returning empty set');
        return $();
      }
      var match = /^\s*(traverse|func)\s*:\s*(.*)$/.exec(query);
      if(match && match.length === 3){
        switch(match[1]){
          case 'traverse':
            return eval('this.'+match[2]);
          case 'func':
            return $.fn.blade.utils.resolveObject(match[2])(this);
        }
      }
      return $(query);
    },

    /**
     * Registers the provided function via blade.getRegisteredEvent.
     * In this way we better de-couple the function logic from the event by which is was triggered.
     * @param {Function} func a function to be executed when the registered event is triggered.
     * @see blade.getRegisteredEvent
     */
    on: function(func){
      return this.each(function(i,el){
        var $el = $(el);
        var evt = $el.blade('getRegisteredEvent');
        if(evt.length > 1){
          $el.on(evt[0], evt[1], func);
        } else {
          $el.on(evt[0], func);
        }
      });
    },

    // update this to NOT consider 'type'
    //  should just be a straight serialization based on values
    /**
     * Serializes the current element according to Blade conventions.
     * With no bladeSerialize attribute the following checks are performed:
     *   POSTs serialize the closest form tag; GETs serialize the current element.
     * When bladeSerialize is of type string then the value is forwarded to @jQueryEval
     * When bladeSerialize is any other type then the value is simply returned.
     * @return {*}
     */
    serialize: function(){
      // if there is no data attribute then serialize self
      // if the data attribute is an object -- return the object
      // if the data attribute is a string, call jQueryEval then return the serialize()
      var toSerialize = this.data('data');
      if(!toSerialize){
        return this.serialize();
      }
      if(typeof toSerialize !== 'string'){
        return toSerialize;
      }
      return this.blade('jQueryEval', toSerialize).serialize();
    },

    /**
     * Triggers an event on the specified element on a specified event.
     * Example, a dropdown can be registered to trigger a form 'submit' on 'change'
     * @data {String} on the event which will initiate the trigger call
     * @data {String} selector a selector (fed to jQueryEval) which specifies the element to be triggered
     * @data {String} event the event to be triggered on the target element
     * Example: <input data-on="change" data-selector="#myForm" data-trigger="submit" />
     *          The change event on the input will cause submit to trigger on #myForm
     */
    triggerOn: function(){
      return this.blade('on', function(){
        var $this = $(this);
        var data = $this.data();
        $(this).blade('jQueryEval', data.selector).trigger(data.event);
      });
    },

    /**
     * Adds the given content to the DOM via the specified updateMode.
     * All updates are executed relative to the current context jQuery object.
     * @param {String} content the content to be inserted into the DOM
     * @param {String} updateMode the method which will be used to update the DOM with the new content.
     *   The default is 'html' which uses jQuery's html() function to set the inner html of the current element.
     */
    update: function(content, updateMode){
      updateMode = updateMode || 'html';
      switch(updateMode.toLowerCase()){
        case 'append':
          return $(content).appendTo(this);
        case 'after':
          return $(content).insertAfter(this);
        case 'before':
          return $(content).insertBefore(this);
        case 'prepend':
          return $(content).prependTo(this);
        case 'replace':
          return $(content).replaceAll(this);
        default:
          return this.html(content);
      }
    },

    /**
     * Wrapper over @update as a convenience method for making DOM updates.
     * @param {String} content the content to be inserted into the DOM
     * @param {String} query uses @jQueryEval to determine which element will be updated
     * @param {String} mode the method which will be used to update the DOM with the new content.
     */
    updateWith: function(content, query, mode){
      return this.blade('jQueryEval', query).blade('update', content, mode);
    }
  };

  /*********************************************************
   *   BLADE NAMESPACE:
   *   Creates the single plugin namespace within the jQuery object
   *   Forwards string method names to the appropriate internal method - defaulted to init.
   *********************************************************/
  /**
   * @param {String} method the name of the method to be accessed within the blade namespace
   */
  $.fn.blade = function(method){
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.fn.blade.utils.log('Method ' +  method + ' does not exist on jQuery.blade' );
    }
  };

  /*********************************************************
   *   BLADE DEFAULTS:
   *   Provides global default options
   *   Specific executions will override these via data attributes in mark up.
   *********************************************************/
  $.fn.blade.defaults = {
    /**
     * Default ajax error handler - called if no other method is specified
     * This should be replaced by specifying a new method via $.fn.blade({ajaxError:function(){}});
     * This implementation simply logs the server response.
     */
    error: function(jqxhr, status, error){
      $.fn.blade.utils.log('BladeJs.defaults.ajaxError: Request failed with error: '+ error + ' and status: ' + status);
    },

    /**
     * Default ajax success handler - called if no other method is specified
     * This should be replaced by specifying a new method via $.fn.blade({ajaxSuccess:function(){}});
     * This implementation simply logs the server response.
     */
    success: function(response){
      $.fn.blade.utils.log('BladeJs.defaults.ajaxSuccess: Request succeeded with response: '+ response);
    }
  };

  /*********************************************************
   *   PUBLIC METHODS
   *********************************************************/
  $.fn.blade.utils = {
    /**
     * Basic log method used by blade to record errors and other interesting events.
     * This can easily be replaced by specifying a new method via $.fn.blade.utils.log = yourLogFunction;
     * This implementation simply attempts to log information to the browser console log.
     */
    log: function(msg){
      if(window.console && console.log){
        console.log(msg);
      }
    },
    /**
     * Attempts to locate an object by string name.
     * First checks against the provided context (which is defaulted to document)
     *  and if not found, will try to 'eval' the string for resolution.
     * @param {String} objName the name of the object to be resolved
     * @param {Object} objContext an object to which the string name belongs -- this can save an eval call
     * @return {Object} a reference to the object -- undefined if not found
     */
    resolveObject: function(objName, objContext){
      var ctx = objContext || document;
      return ctx[objName] || eval(objName);
    }
  };

  /*********************************************************
   *   PRIVATE METHODS
   *********************************************************/
  /**
   * Checks for a confirm handler.
   * Then passes the provided request parameter to jQuery for execution.
   * @param {Object} request object that will passed directly to jQuery
   *                          any property on this object will be passed to $.ajax.
   *                          If request.confirm is present, then the function will be executed instead
   */
  var executeAjax = function(request){
    return request.confirm ? request.confirm(request) : $.ajax(request);
  };

  var callbacks = ['success', 'error', 'beforeSend', 'confirm'];
})(jQuery);
