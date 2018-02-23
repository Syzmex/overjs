
import itis from 'whatitis';
import invariant from 'invariant';
import polyfill from './raf-polyfill';


const { requestAnimationFrame, cancelAnimationFrame } = polyfill();

export default ( callback ) => {

  invariant(
    itis.Function( callback ),
    'Expecting callback of requestAnimFrame is a function.'
  );

  let id;
  const getFrameHandler = () => id;
  const cancel = () => cancelAnimationFrame( id );
  id = requestAnimationFrame( function frameCallback( time ) {
    callback( Math.round( time * 10 ) / 10, cancel );
    id = requestAnimationFrame( frameCallback );
  });

  return { cancel, getFrameHandler };
};
