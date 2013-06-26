## Mutation Observer examples with jQuery

### Background

An experiment in using [Mutation Observers](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) to react to DOM Node insertion and removal.

Currently the examples only work in browsers which support Mutation Observers ( Chrome 18+ and Firefox 14+ )

### Example using events

`jquery.observeWithEvents.js` is a jQuery plugin which showcases a possible approach of using Mutation Observers alongside jQuery's `$.on()` function for registering handlers to specific events.

	var $body = $( document.body );

	// attach observe plugin to $body, body will be 
	// the target of the Mutation Observer and
	// any child nodes inserted into or removed from
	// body will trigger either an `insertNode` or 
	// 'removeNode' event on body
	$body.observe();

	// register the 'insertNode' event handler using jQuery's $.on()
	$body.on( 'insertNode', function( event, el ) {
		// event is the standard jQuery Event object
		// el is the node that was inserted
		console.log( 'node inserted' );
	} );

	// register the 'removeNode' event handler using jQuery's $.on()
	$body.on( 'removeNode', function( event, el ) {
		console.log( 'node removed' );
	} );

You can also specify an array of triggers when calling the plugin. This will cause the `insertNode` and `removeNode` events to fire only when the inserted or removed node is in the list.

	var $body = $( document.body );

	// attach observe plugin to $body,
	// only the child nodes specified within the
	// triggers array will trigger the 'insertNode' or
	// 'removeNode' events
	$body.observe({
		triggers: [ '.foo' ]
	});

	$body.on( 'insertNode', function( event, el ) {
		console.log( 'a node with class foo has been added.' );
	} );

Triggers can be added or removed after the observe() plugin has been attached to an element.

	...
	
	// adds a new trigger,
	// the 'insertNode' and 'removeNode' events will now fire
	// whenever a mutation involves a node with class 'bar'
	$body.observe( 'add', '.bar' );

	// removes a trigger
	$body.observe( 'remove', '.bar' );

To disconnect the observer from the attached element, call `destroy` on observe

	...

	$body.observe( 'destroy' );


This approach makes Mutation Observers behave more like DOM events and allows handlers to be registered using a consisten API ( by using jQuery's $.on() function ).

Currently, this approach has the drawback of not being able to handle delegated events. For example, it would be worthwhile to specify handlers as follows

	$( document.body ).on( 'insertNode', '.foo', function( event, el ) {
		// called only when the inserted node has a class of 'foo'
	} );

	$( document.body ).on( 'insertNode', '.bar', function( event, el ) {
		// called only when the inserted node has a class of 'bar'
	} );

This would allow the developer to define more granular callbacks vs. detecting the inserted node in the callback as is currently supported. I believe adding this support would be fairly trivial on addedNodes as we could simply call `.trigger()` on the inserted node. However, I don't think this would be possible for removed nodes.

### Example using callbacks

`jquery.observeWithCallbacks.js` is an alternate version of the observe plugin which showcases an alternative appraoch of using Mutation Observers with traditional callback parameters.

	var $body = $( document.body );

	// attach observe plugin to $body, body will be 
	// the target of the Mutation Observer
	$body.observe({
		insertTriggers: {
			'.foo': function( node ) {
				// node is the node added
				console.log( '.foo has been inserted.' );
			}
		},
		removeTriggers: {
			'.foo': function( node ) {
				// node is the node removed
				console.log( '.foo has been removed.' );
			}
		}
	});

Like with the previous approach, you can add new insert and remove triggers after the observe plugin has been attached.

	...

	$body.observe( 'insert', '.bar', function( node ) {
		console.log( '.bar inserted' );
	} );

	$body.observe( 'remove', '.bar', function( node ) {
		console.log( '.bar removed' );
	} );

To disconnect the observer from the attached element, call `destroy` on observe

	...

	$body.observe( 'destroy' );

## Other approaches

Friend and colleague Bryan Ashley created [itsDOMLoading](https://github.com/bryanashley/itsDOMLoading) which was a source of inspiration for these experiments. The library also uses Mutation Observers and is library and framework independant (i.e. doesn't require jQuery).

## License

Both code examples are licensed under the MIT license.