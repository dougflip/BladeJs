/*!
 * BladeJs jQuery plugin
 * version: 0.0.1 (2012-05-12)
 * @requires jQuery v1.7.0 or later
 *
 * Project repository: https://github.com/dougflip/bladejs
 */
 ;(function($){

    /*********************************************************
    *   BLADE METHODS:
    *   Map of publicly available functions
    *   accessed via $().blade('functionName')
    *   ajaxOn is the default method and accessed as $().blade();
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
        * @data {String} url specifies the URL of the ajax request. FORM tags may use the ACTION attribute instead.
        * @data {String} on specifies the event on which this is handled, forms defaulted to 'submit' all other elements to 'click'
        * @data {String} dataType specify the dataType property passed to the ajax request.
        * @data {String} type specify the type property passed to the ajax request.
        * @data {String} beforeSend set to the beforeSend callback of the jQuery request object - defaulted to $.fn.blade.defaults.ajaxBeforeSend
        * @data {String} success set to the success callback of the jQuery request object - defaulted to $.fn.blade.defaults.ajaxSuccess
        * @data {String} error set to the error callback of the jQuery request object - defaulted to $.fn.blade.defaults.ajaxError
        * @data {String} serialize If provided, the value will be forwarded to jQueryEval.
        *                           If nothing is provided GET requests will serialize themselves while POST requests serialize the parent FORM tag
        * @data {String} confirm set to a callback which will be invoked after BladeJs has created the request object, but before it is sent
        *                           Your application will provide the user with a chance to "cancel" the request.
        *                           If the action is "confirmed" you are responsible for forwarding the request to jQuery - otherwise discard the object
        *                           BladeJs provides a default implementation, $.fn.blade.defaults.confirmAction, that can be overridden.
        *                           To signify the default is to be used, simply provide an empty data-blade-confirm attribute.
        */
        ajaxOn: function(){
            return this.each(function(i,el){
                var $el = $(el);
                $el.on($el.blade('getRegisteredEvent'), function(){
                    $this = $(this);
                    var d = $this.data()
                    var request = {
                        url: $this.is('form') ? $this.attr('action') : d.bladeUrl,
                        datatype: d.bladeDataType,
                        type: d.bladeType || $this.attr('method'),
                        context: $this,
                        data: d.bladeSerialize
                            ? $this.blade('jQueryEval',d.bladeSerialize).serialize()
                            : d.bladeType == 'POST' ? $this.closest('form').serialize() : $this.serialize(),
                        beforeSend: $this.blade('resolveObj',d.bladeBeforeSend),
                        success: $this.blade('resolveObj',d.bladeSuccess),
                        error: $this.blade('resolveObj',d.bladeError),
                    };
                    if(d.bladeConfirm !== undefined){
                        request.confirm = $this.blade('resolveObj',d.bladeConfirm) || $.fn.blade.defaults.confirmAction;
                    }
                    $this.blade('executeAjax',request);
                    return false;
                });
            });
        },

        /**
        * Defaults a success and error handler if they are not provided.
        * Then passes the provided request parameter to jQuery for execution.
        * @param {Object} request object that will passed directly to jQuery - any property on this object will be passed to $.ajax.
        */
        executeAjax: function(request){
            if(!request.beforeSend){
                request.beforeSend = $.fn.blade.defaults.ajaxBeforeSend
            }
            if(!request.success){
                request.success = $.fn.blade.defaults.ajaxSuccess;
            }
            if(!request.error){
                request.error = $.fn.blade.defaults.ajaxError;
            }
            if(request.confirm){
                return request.confirm(request);
            }
            return $.ajax(request);
        },

        /**
        * Uses the provided jquery element to determine the event which will handle actions.
        *   if a @data-on attribute is provided this will be used above anything else.
        * Otherwise, certain elements carry certain implicit events:
        *   FORM-"submit", SELECT-"change", INPUT:TEXT-"blur"
        * Finally, this will fall back to the provided @defaultEvent 
        *   and if this is not provided then "click" will be returned
        * @param {String} defaultEvent if no matching event is found then this event will be returned.
        */
        getRegisteredEvent: function(defaultEvent){
            if(this.data('on')){
                return this.data('on');
            } 
            if(this.is('form')){
                return 'submit';
            } 
            if (this.is('select')){
                return 'change';
            } 
            if (this.is('input:text')){
                return 'blur';
            }
            return defaultEvent || 'click';
        },

        /**
        * Attempts to locate a jQuery set by performing a set of opertations.
        * In practice, HTML elements will contain references via a data attribute that will be resolved by this function.
        * For example, a select list may indicate on change it needs to serialize all inputs within its own containing DIV tag:
        *       <select data-serialize="traverse: closest('div').find(':input')">
        * This function would receive the data attribute string as query and perform the search relative to the select element (which will be scoped as keyword this).
        * @param {String} query defines the strategy to be used when locating items. The following example formats are supported:
        *           "#someId, .someClass, someTagName" - any valid jQuery selector. Simply gets wrapped in the $ sign.
        *           "select: #someId, .someClass, someTagName" - same as above just explicitly stated as selector
        *           "traverse: closest('.container').find(':input')" - navigates from/relative to the current context (this). Any chained jQuery functions are accepted
        *           "func: someFunction" - a function to be called which is passed this and returns a jQuery object
        */
        jQueryEval: function(query){
            var match = /^(select|traverse|func):\s*(.*)$/.exec(query);
            if(match == null || match.length < 1 || match[1] == 'select'){
                return $(query);
            } 
            if(match[1] == 'traverse') {
                return eval('$this.'+match[2]);
            } 
            if (match[1] == 'func'){
                return this.blade('resolveObj',match[2])(this);
            }
            $.fn.blade.defaults.log('BladeJs.jQueryEval: Unable to parse the provided query: '+ query + '. No elements were selected');
            return $();
        },

        /**
        * Attempts to resolve an object reference from the provided string.
        * @param {String} stringName string name of an object to be resolved
        * @return object reference, null, or undefined.
        */
        resolveObj: function(objName){
            if(!objName){
                return null;
            }
            var result = window[objName];
            if(!result){
                $.fn.blade.defaults.log('BladeJs.resolveObj: Unable to resolve object of name: '+ objName);
            }
            return result;
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
        * Wrapper over @update as a convienence method for making DOM updates.
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
            $.fn.blade.defaults.log('Method ' +  method + ' does not exist on jQuery.blade' );
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
        ajaxError: function(jqxhr, status, error){
            $.fn.blade.defaults.log('BladeJs.defaults.ajaxError: Request failed with error: '+ error + ' and status: ' + status);
        },

        /**
        * Default ajax success handler - called if no other method is specified
        * This should be replaced by specifying a new method via $.fn.blade({ajaxSuccess:function(){}});
        * This implementation simply logs the server response.
        */
        ajaxSuccess: function(response){
            $.fn.blade.defaults.log('BladeJs.defaults.ajaxSuccess: Request succeeded with response: '+ response);
        },

        /**
        * Default ajax before send handler
        * There is no default implementation provided for this method.
        */
        ajaxBeforeSend: null,

        /**
        * Default function to be executed when an action requires user confirmation.
        * This default implementation simply shows a browser confirm window before sending the request to jQuery.
        * @ param {object} request The request object, fully populated by Blade, which is to be passed to jQuery if the action is confirmed.
        */
        confirmAction: function(request){
            if(confirm('Please confirm that you wish to proceed with this action.\nClick "OK" to continue; otherwise click "Cancel')){
                $.ajax(request);
            } 
        },

        /**
        * Default log method used by blade to record errors and other interesting events.
        * This should be replaced by specifying a new method via $.fn.blade({log:function(){}});
        * This implementation simply attempts to log information to the browser console log.
        */
        log: function(msg){
            if(window.console && console.log){
                console.log(msg);
            }
        }
    };

 })(jQuery);
