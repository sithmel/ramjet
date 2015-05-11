import cloneNode from './cloneNode';
import {
	ANIMATION_DIRECTION,
	ANIMATION_DURATION,
	ANIMATION_ITERATION_COUNT,
	ANIMATION_NAME,
	ANIMATION_TIMING_FUNCTION,
	ANIMATION_END
} from '../utils/detect';
import parseColor from '../utils/parseColor';
import parseBorderRadius from '../utils/parseBorderRadius';

export default class HtmlWrapper {
	constructor ( node, options ) {
		this.init( node, options );
	}

	init ( node, options ) {
		let bcr = node.getBoundingClientRect();
		const style = window.getComputedStyle( node );
		const opacity = +( style.opacity );

		let clone = cloneNode( node );

		const rgba = parseColor( style.backgroundColor );

		let transform;
		let borderRadius;

		const offsetParent = node.offsetParent;
		const offsetParentStyle = window.getComputedStyle( offsetParent );
		const offsetParentBcr = offsetParent.getBoundingClientRect();

		clone.style.position = 'absolute';
		clone.style.top = ( bcr.top - parseInt( style.marginTop, 10 ) - ( offsetParentBcr.top - parseInt( offsetParentStyle.marginTop, 10 ) ) ) + 'px';
		clone.style.left = ( bcr.left - parseInt( style.marginLeft, 10 ) - ( offsetParentBcr.left - parseInt( offsetParentStyle.marginLeft, 10 ) ) ) + 'px';

		// TODO use matrices all the way down, this is silly
		//transform = `matrix(${transform.join(',')})`;
		transform = '';

		// TODO create a flat array? easier to work with later?
		borderRadius = {
			tl: parseBorderRadius( style.borderTopLeftRadius ),
			tr: parseBorderRadius( style.borderTopRightRadius ),
			br: parseBorderRadius( style.borderBottomRightRadius ),
			bl: parseBorderRadius( style.borderBottomLeftRadius )
		};

		clone.style.webkitTransformOrigin = clone.style.transformOrigin = '0 0';

		this.isSvg = false;
		this.node = node;
		this.clone = clone;
		this.transform = transform;
		this.borderRadius = borderRadius;
		this.opacity = opacity;
		this.rgba = rgba;

		this.left = bcr.left;
		this.top = bcr.top;
		this.width = bcr.width;
		this.height = bcr.height;
	}

	insert () {
		this.node.parentNode.appendChild( this.clone );
	}

	detach () {
		this.clone.parentNode.removeChild( this.clone );
	}

	setOpacity ( opacity ) {
		this.clone.style.opacity = opacity;
	}

	setTransform( transform ) {
		this.clone.style.transform = this.clone.style.webkitTransform = this.clone.style.msTransform = transform;
	}

	setBackgroundColor ( color ) {
		this.clone.style.backgroundColor = color;
	}

	setBorderRadius ( borderRadius ) {
		this.clone.style.borderRadius = borderRadius;
		// TODO handle corners with two radii
		// this.clone.style.borderTopLeftRadius     = borderRadius.topLeft;
		// this.clone.style.borderTopRightRadius    = borderRadius.topRight;
		// this.clone.style.borderBottomRightRadius = borderRadius.bottomRight;
		// this.clone.style.borderBottomLeftRadius  = borderRadius.bottomLeft;
	}

	animateWithKeyframes ( id, duration, callback ) {
		this.clone.style[ ANIMATION_DIRECTION ] = 'alternate';
		this.clone.style[ ANIMATION_DURATION ] = `${duration/1000}s`;
		this.clone.style[ ANIMATION_ITERATION_COUNT ] = 1;
		this.clone.style[ ANIMATION_NAME ] = id;
		this.clone.style[ ANIMATION_TIMING_FUNCTION ] = 'linear';

		this.clone.addEventListener( ANIMATION_END, callback );
	}
}