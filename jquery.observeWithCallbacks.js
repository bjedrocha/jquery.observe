/**
 * jquery.observeWithCallbacks.js
 *-------------------------------------
 * An example using Mutation Observers with specified callbacks.
 *
 * Author: Bart Jedrocha 2013
 * License: MIT
 */

!function( $, window, document, undefined ) {
    "use strict";

    // Globals
    // --------------------------------

    // local references to handy prototype methods
    var slice = Array.prototype.slice;
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    // older versions of Chrome use the prefix, play it safe
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    // minimum required config for all this to work
    var mutationConfig = { attributes: true, childList: true, characterData: true };

    function has( obj, key ) {
        return hasOwnProperty.call( obj, key );
    }

    var Observer = function( options, target ) {
        this.init( options, target );
    }

    Observer.prototype = {

        // be a good citizen, set the constructor properly
        constructor: Observer,

        init: function( options, target ) {
            var $target = this.$target = $( target );
            this.options = $.extend( {}, $.fn.observe.defaults, options );
            var insertTriggers = this.options.insertTriggers;
            var removeTriggers = this.options.removeTriggers;

            // setup the observer
            this.observer = new MutationObserver( function( mutations ) {
                mutations.forEach( function( mutation ) {

                    if ( mutation.type === 'childList' ) {
                        // we only care about mutation of tree nodes

                        $.each( mutation.addedNodes, function( index, node ) {
                            for ( var trigger in insertTriggers ) {
                                if ( $( node ).is( trigger ) ) {
                                    insertTriggers[ trigger ].call( node );
                                }
                            }
                        } );

                        $.each( mutation.removedNodes, function( index, node ) {
                            for ( var trigger in removeTriggers ) {
                                if ( $( node ).is( trigger ) ) {
                                    removeTriggers[ trigger ].call( node );
                                }
                            }
                        } );
                    }
                } );
            } );

            // finally, register the observer
            this.observer.observe( $target[0], mutationConfig );
        },

        insert: function( trigger, callback ) {
            if ( !has( this.options.insertTriggers, trigger ) ) {
                this.options.insertTriggers[ trigger ] = callback;
            }
        },

        remove: function( trigger, callback ) {
            if ( !has( this.options.removeTriggers, trigger ) ) {
                this.options.removeTriggers[ trigger ] = callback;
            }
        },

        destroy: function( ) {
            // disconnect the observer
            this.observer.disconnect();

            // remove plugin
            this.$target.removeData( 'observer' );
        }
    };

    // Plugin Definition
    // --------------------------------
    $.fn.observe = function( params ) {
        var args = slice.call( arguments, 1 );

        return this.each( function() {
            var $this = $( this ),
                data = $this.data( 'observer' ),
                options = typeof params == 'object' && params;

            if ( !data ) {
                $this.data( 'observer', ( data = new Observer( options, this ) ) );
            }

            if ( typeof params === 'string' && $.isFunction( data[ params ] ) ) {
                data[ params ].apply( data, args );
            }
        } );
    };

    $.fn.observe.Constructor = Observer;

    // Plugin Defaults
    // --------------------------------
    $.fn.observe.defaults = {
        insertTriggers: {},
        removeTriggers: {}
    }
}( jQuery, window, document );