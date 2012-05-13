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
        * @options: object map of values used to extend $.fn.blade.defaults
        */
        init: function(options){
            $.extend($.fn.blade.defaults, options);
        },
        
        /**
        * Main method of the BladeJs plugin 
        * Maps provided HTML5 data attributes to a jQuery ajax request object and attempts to send to the server
        * @data-url: specifies the URL of the ajax request. FORM tags may use the ACTION attribute instead.
        * @data-on (optional): specifies the event on which this is handled, forms defaulted to 'submit' all other elements to 'click'
        * @data-data-type (optional): specify the dataType property passed to the ajax request.
        * @data-type (optional): specify the type property passed to the ajax request. Default to GET
        * @data-error-before-send (optional): set to the beforeSend callback of the jQuery request object - defaulted to $.fn.blade.defaults.ajaxBeforeSend
        * @data-success-callback (optional): set to the success callback of the jQuery request object - defaulted to $.fn.blade.defaults.ajaxSuccess
        * @data-error-callback (optional): set to the error callback of the jQuery request object - defaulted to $.fn.blade.defaults.ajaxError
        * @data-serialize (optional): If provided, the value will be forwarded to jQueryEval.
        *                               If nothing is provided GET requests will serialize themselves while POST requests serialize the parent FORM tag
        */
        ajaxOn: function(){
            return this.each(function(i,el){
                var $el = $(el);
                $el.on($el.blade('getRegisteredEvent'), function(){
                    $this = $(this);
                    var request = {
                        url: $this.is('form') ? $this.attr('action') : $this.data('url'),
                        datatype: $this.data('dataType'),
                        type: $this.data('type') || 'GET',
                        context: $this,
                        data: $this.data('serialize')
                            ? $this.blade('jQueryEval',$this.data('serialize')).serialize()
                            : $this.data('type') == 'POST' ? $this.closest('form').serialize() : $this.serialize(),
                        beforeSend: $this.blade('resolveObj',$this.data('beforeSend')),
                        success: $this.blade('resolveObj',$this.data('successCallback')),
                        error: $this.blade('resolveObj',$this.data('errorCallback'))
                    };
                    $this.blade('executeAjax',request);
                    return false;
                });
            });
        },

        /**
        * NOTE: Still evaluating if this is needed.
        * BladeJs relies heavily on HTML5 data attributes.
        * Because of this it was determined to be important to "namespace" our data attributes
        * The default namespace is "blade" but this can be changed via $.fn.blade.dataNamespace.
        * Due to this customization we access all BladeJs data properties through this custom wrapper.
        * It handles appending the dataNamespace to the requested data attribute.
        * @key - the data key, free from any namespace, whose value is requested
        *   for example, the markup uses data-blade-serialize you will pass this function "serialize" with $.fn.blade.dataNamespace set to "blade"
        */
        dataFor: function(key){
            if(!key){
                return null;
            }
            if(!$.fn.blade.defaults.dataNamespace){
                return this.data(key);
            }
            return this.data($.fn.blade.defaults.dataNamespace + key.charAt(0).toUpperCase() + key.slice(1));
        },

        /**
        * Defaults a success and error handler if they are not provided.
        * Then passes the provided request parameter to jQuery for execution.
        * @request: object that will passed directly to jQuery - any property on this object will be passed to $.ajax.
        */
        executeAjax: function(request){
            if(!request.beforeSend && $.fn.blade.defaults.ajaxBeforeSend){
                request.beforeSend = $.fn.blade.defaults.ajaxBeforeSend
            }
            if(!request.success){
                request.success = $.fn.blade.defaults.ajaxSuccess;
            }
            if(!request.error){
                request.error = $.fn.blade.defaults.ajaxError;
            }
            $.ajax(request);
        },

        /**
        * Uses the provided jquery element to determine the event which will handle actions.
        *   if a @data-on attribute is provided this will be used above anything else.
        * Otherwise, certain elements carry certain implicit events:
        *   FORM-"submit", SELECT-"change", INPUT:TEXT-"blur"
        * Finally, this will fall back to the provided @defaultEvent 
        *   and if this is not provided then "click" will be returned
        * @defaultEvent: if no matching event is found then this event will be returned.
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
        * @query: defines the strategy to be used when locating items. The following example formats are supported:
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
            return $();
        },

        /**
        * Attempts to resolve an object reference from the provided string.
        * @stringName string name of an object to be resolved
        * @return object reference, null, or undefined.
        */
        resolveObj: function(stringName){
            return window[stringName];
        },

        /**
        * Adds the given content to the DOM via the specified updateMode.
        * All updates are executed relative to the current context jQuery object.
        * @content: the content to be inserted into the DOM
        * @updateMode: the method which will be used to update the DOM with the new content.
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
        * @content: the content to be inserted into the DOM
        * @query: uses @jQueryEval to determine which element will be updated
        * @updateMode: the method which will be used to update the DOM with the new content.
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
    $.fn.blade = function(method){
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.blade' );
        }
    };

    /*********************************************************
    *   BLADE DEFAULTS:
    *   Provides global default options
    *   Specific executions will override these via data attributes in mark up.
    *********************************************************/
    $.fn.blade.defaults = {
        /**
        * Default global error handler which will be attached to ajax requests
        *  a more specific handler is not specified.
        */
        ajaxError: function(jqxhr, status, error){
            alert('An error was returned by the server and handled by the default BladeJs handler.\nTo specify a new global handler, provide a new callback via blade.defaults.ajaxError_Default.\nThe server responded with:\n'+jqxhr.responseText);
        },

        /**
        * Default ajax success response - called if no other method is specified
        *   Replaces the html of data-update element with the returned HTML.
        * This works well for simple ajax form posts or simple ajax GET updates of small portions of the page.
        * @data-update: jQuery selector of the element to replace with server HTML.
        * @data-update-mode: determines how the resulting data will be inserted into the DOM.
        */
        ajaxSuccess: function(response){
            this.blade('updateWith', response.Html, this.data('update'), this.data('updateMode'))
        },

        /**
        * Placeholder for a default before send callback
        */
        ajaxBeforeSend: null,

        /**
        * Default data prefix.
        * for example, setting this to 'bl' will 
        */
        dataNamespace: 'blade'
    };

 })(jQuery);
