'use strict';

import { Component } from 'barfoos2.0/core.js';
import { moduleLocations } from 'barfoos2.0/defs.js';
import { extend, Mix } from 'barfoos2.0/toolkit.js';
import { win } from 'barfoos2.0/domkit.js';
import ServerConnection from 'barfoos2.0/serverconnection.js';

import html from '../markup/main.html';
import style from '../style/main.scss';

/*****************************************************************************************************
 *  test buy module
 *****************************************************************************************************/
class testBuy extends Mix( Component ).With( ServerConnection ) {
	constructor( input = { }, options = { } ) {
		extend( options ).with({
			name:			'testBuy',
			location:		moduleLocations.center,
			tmpl:			html
		}).and( input );

		super( options );

		return this.init();
	}

	async init() {
		await super.init();

		this.addNodeEvent( 'form.test', 'submit', this.confirmClick );

		return this;
	}

	async destroy() {
		super.destroy && super.destroy();
		[ style ].forEach( s => s.unuse() );
	}

	async confirmClick( event ) {
		event.preventDefault();
		event.stopPropagation();

		let res = await this.send({
			type:		'buy',
			payload:	{
				fake:	'test'
			}
		}, {
			noTimeout:	true
		});

		if( res.data.ppUrl === -1 ) {
			// something went wrong!
			alert('oops, try again' );
		} else if( typeof res.data.ppUrl === 'string' ) {
			win.location.href = res.data.ppUrl;
		}
	}
}
/****************************************** cookieConfirmSection End ******************************************/

async function start( ...args ) {
	[ style ].forEach( style => style.use() );

	return await new testBuy( ...args );
}

export { start };
