
import now from 'performance-now';


const root = typeof window === 'undefined' ? global : window;
const vendors = [ 'moz', 'webkit' ];
const suffix = 'AnimationFrame';
let raf = root[`request${suffix}`];
let caf = root[`cancel${suffix}`] || root[`cancelRequest${suffix}`];

for ( let i = 0; !raf && i < vendors.length; i++ ) {
  const prefix = vendors[i];
  raf = root[`${prefix}Request${suffix}`];
  caf = root[`${prefix}Cancel${suffix}`]
    || root[`${prefix}CancelRequest${suffix}`];
}

// Some versions of FF have rAF but not cAF
if ( !raf || !caf ) {

  let chain;
  let id = 0;
  let lastTime = 0;
  const handles = {};
  const frameDuration = 1000 / 60;
  const throwError = ( err ) => () => {
    throw err;
  };
  const compose = ( callback1, callback2 ) => ( lastTime ) => {
    return callback1( callback2( lastTime ));
  };
  const handler = ( handle, next ) => ( lastTime ) => {
    if ( handles[handle] !== false ) {
      next( lastTime );
    } else {
      handles[handle] = null;
    }
    return lastTime;
  };
  const next = ( handled ) => {
    chain = chain ? compose( handled, chain ) : handled;
  };
  const toCall = function() {
    const cp = chain;
    // Clear chain here to prevent
    // callbacks from appending listeners
    // to the current frame's chain
    chain = null;
    try {
      cp( lastTime );
    } catch ( e ) {
      setTimeout( throwError( e ), 0 );
    }
  };

  raf = function( callback ) {
    if ( !chain ) {
      const currTime = now();
      const timeToCall = Math.max( 0, frameDuration - ( currTime - lastTime ));
      lastTime = timeToCall + currTime;
      root.setTimeout( toCall, Math.round( timeToCall ));
    }
    next( handler( ++id, callback ));
    return id;
  };

  caf = function( arg ) {
    handles[arg] = false;
  };
}

// export function requestAnimFrame( fn ) {
//   // Wrap in a new function to prevent
//   // `cancel` potentially being assigned
//   // to the native rAF function
//   return raf.call( root, fn );
// }

// export function cancelAnimFrame( ...args ) {
//   for ( let i = 0, l = args.length; i < l; i++ ) {
//     caf.call( root, args[i]);
//   }
// }

// root.requestAnimationFrame = raf;
// root.cancelAnimationFrame = caf;

export requestAnimationFrame = raf;
export cancelAnimationFrame = caf;
