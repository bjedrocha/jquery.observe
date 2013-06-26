/**
 * jquery.observeWithEvents.js
 * ------------------------------------
 * An example of using Mutation Observers with jQuery events.
 * Allows you to use $.on() to bind a handler to an event corresponding
 * to either DOM insertion or removal.
 *
 * Author: Bart Jedrocha 2013
 * License: MIT
 */

!function( $, window, document, undefined ) {
    "use strict";

    // Globals
    // --------------------------------

    // local reference [].slice method
    var slice = Array.prototype.slice;

    // older versions of Chrome use the prefix, play it safe
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    // minimum required config for all this to work
    var mutationConfig = { attributes: true, childList: true, characterData: true };

    
    // Observer Definition
    // --------------------------------
    var Observer = function( options, target ) {
        this.init( options, target );
    };

    Observer.prototype = {

        // be a good citizen, set the constructor properly
        constructor: Observer,

        init: function( options, target ) {
            var $target = this.$target = $( target );
            this.options = $.extend( {}, $.fn.observe.defaults, options );
            var triggerNodes = this.options.triggers;

            // setup the observer
            this.observer = new MutationObserver( function( mutations ) {
                mutations.forEach( function( mutation ) {

                    if ( mutation.type === 'childList' ) {
                        // we only care about the mutation of tree nodes

                        $.each( mutation.addedNodes, function( index, node ) {

                            if ( triggerNodes.length == 0 ) {

                                // if no triggers have been added, fire on insertion
                                // of any child node
                                $target.trigger( 'insertNode', [ node ] );
                            } else {

                                // else, match the added node against the array
                                // of triggers and fire if found
                                triggerNodes.forEach( function( triggerNode ) {
                                    if ( $( node ).is( triggerNode ) ) {
                                        $target.trigger( 'insertNode', [ node ] );
                                    }
                                } );
                            }

                        } );

                        $.each( mutation.removedNodes, function( index, node ) {

                            if ( triggerNodes.length == 0 ) {

                                // if no triggers have been added, fire on removal
                                // of any child node
                                $target.trigger( 'removeNode', [ node ] );
                            } else {

                                // else, match the removed node against the array
                                // of triggers and fire if found
                                triggerNodes.forEach( function( triggerNode ) {
                                    if ( $( node ).is( triggerNode ) ) {
                                        $target.trigger( 'removeNode', [ node ] );
                                    }
                                } );
                            }


                        } );
                    }
                } );
            } );

            // finally, register the observer
            this.observer.observe( $target[0], mutationConfig );
        },

        add: function( triggerNode ) {
            var index = $.inArray( triggerNode, this.options.triggers );
            
            // add only if triggerNode doesn't already exist in the array
            if ( index < 0 ) {
                this.options.triggers.push( triggerNode );
            }
        },

        remove: function( triggerNode ) {
            var index = $.inArray( triggerNode, this.options.triggers );

            // remove if found
            if ( index >= 0) {
                this.options.triggers.splice( index, 1 );
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

        return this.each( function( ) {
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
        triggers: []
    };
}( jQuery, window, document );