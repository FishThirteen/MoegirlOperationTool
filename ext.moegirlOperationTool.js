function test12() {
	var api = new mw.Api();
	var pageTitle = mw.config.get( 'wgPageName' );
	api.get({
		action: 'query',
		list: 'allpages',
		titles: 'User:Admin'
	}).done( function( data )  {
		console.log( data );
	});
}
// Wrap with anonymous function
( function ( window, document, $, undefined ) {
	'use strict';

	// simple string.format
	if (!String.prototype.format) {
		String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != 'undefined'
				? args[number] : match ;
			});
		};
	}

	$( 'body' ).css( { positon: 'relative' } );

	var textResources = {
		operationTool_MainTitle: "AnnA's 管理工具",
		linkPagesUnit_Title: '链入页面',
		subPagesUnit_Title: '子页面',
		mwConfig_ArticlePath: 'wgArticlePath'
	}
	
	var uiTemplates = {
		shadowTemplate : '<div id="mot_shade" ></div>',
		windowTemplate : ''
			+ '<div id="mot_main">'
				+ '<div id="mot_main_panel" class="{0}" >'
					+ '<a href="javascript:void(0);" class="panel_close_button"></a>'
					+ '<div class="main_panel_inner">'
						+ '<div class="title_div" >'
							+ '<h1>{1}</h1>'
						+ '</div>'
					+ '</div>'
				+ '</div>'
			+ '</div>'

	}


		
	var moreButtonTemplate = '<div id="moegirl_more_button" role="navigation" class="vectorMenu" aria_labelledby="p_cactions_label">'
			+ '<h3 id="p_cactions_label" tabindex="0"><span>更多</span><a href="#" tabindex="_1"></a></h3>'
		+ '</div>';
	var moreButton = $( moreButtonTemplate );
	var orignalMoreButtonId = '#p-cactions';

	replaceMoreButton();
	

	var infoPage = new InfoPage();
	moreButton.click( function() {
		infoPage.show();
	});

	function replaceMoreButton() {
		$( orignalMoreButtonId )
			.before( moreButton )
			.remove();	
	}


	/* InfoPage class
	*************************************************************/
	function InfoPage( ) {
		this.api = new mw.Api();
		this.isInit = false;
		this.window;
		this.shadow;
		this.closeButton;
		this.unitTemplate = ''
			+ '<div class="fl_l page_info_unit">'
				+ '<div class="clearfix unit_title">'
					+ '<h2 class="fl_l">{0}</h2>'
					+ '<a href="{1}" target="_blank" class="more_link fl_r" >更多...</a>'
				+ '</div>'
				+ '<div class="clearfix unit_body">'
				+ '</div>'
			+ '</div>';

		this.infoPageBodyTemplate = '<div class="page_infos"></div>';
		this.pageInfoLineTemplate = '<div class="page_info_line clearfix"></div>';
		this.pageLinkLineContentTemplate = '<div class="body_line">(<a target="_blank" href="{0}" class="text_link" >链</a>) <a target="_blank" href="{1}" class="text_link" >{2}</a></div>';
		this.unitLineCount = 10;
		this.normalLinkLineTemplate = '<div class="body_line"><a target="_blank" href="{0}" class="text_link" >{1}</a></div>';
		this.pageName = mw.config.get( 'wgPageName' );
	}

	InfoPage.prototype.show = function() {
		if ( !this.isInit ) {
			this.createWindow( 'infopage_main', textResources.operationTool_MainTitle );
		}
		this.window.show();
		this.shadow.show();
	}

	InfoPage.prototype.hide = function() {
		this.shadow.hide();
		this.window.hide();
	}

	InfoPage.prototype.close = function() {
		this.shadow.remove();
		this.window.remove();
	}

	InfoPage.prototype.createWindow = function( title, className ) {
		this.shadow = $( uiTemplates.shadowTemplate ).appendTo( 'body' );
		this.window = $( uiTemplates.windowTemplate.format( title, className ))
			.appendTo( 'body' );

		this.shadow.hide();
		this.window.hide();

		this.closeButton =  $( '.panel_close_button', this.window );

		var self = this;
		this.closeButton.click( function() {
			self.close();
		});

		var unitBody = $( this.infoPageBodyTemplate )
			.appendTo( $( '.main_panel_inner', this.window ) );

		var unitLine = $( this.pageInfoLineTemplate ).appendTo( unitBody );

		var pageLinkUnit = this.createPageLinksUnit()
			.appendTo( unitLine )
			.addClass( 'first' );

		var subPageLinkUnit = this.createSubPageLinksUnit().appendTo( unitLine );
	}


	InfoPage.prototype.createPageLinksUnit = function() {
		var pageLinkPath = mw.config.get( textResources.mwConfig_ArticlePath )
			.replace( '$1', '特殊:链入页面/$1' );
		var currentPageLinkUrl = pageLinkPath.replace( '$1', this.pageName );
		var control = $( this.unitTemplate.format( textResources.linkPagesUnit_Title, currentPageLinkUrl ));
		var controlBody = $( '.unit_body', control );

		var self = this; 
		this.api.get({
			action: 'query',
			list: 'backlinks',
			bltitle: this.pageName,
			aplimit: this.unitLineCount
		}).done(function( data ) {
			$.each( data.query.backlinks, function( i, v ) {
				var pageTitle = v.title;
				var pageLink = mw.config.get( textResources.mwConfig_ArticlePath ).replace( '$1', pageTitle );
				var pagePageLink = pageLinkPath.replace( '$1', pageTitle );

				var line = $( self.pageLinkLineContentTemplate.format( pagePageLink, pageLink, pageTitle)).appendTo( controlBody );
			});
		});

		return control;
	}

	InfoPage.prototype.createSubPageLinksUnit = function() {
		var moreLink = mw.config.get( textResources.mwConfig_ArticlePath )
			.replace( '$1', 'Special:PrefixIndex' ) + '&prefix=' + this.pageName;
		var control = $( this.unitTemplate.format( textResources.subPagesUnit_Title, moreLink ));
		var controlBody = $( '.unit_body', control );

		var self = this;	
		this.api.get({
			action: 'query',
			list: 'prefixsearch',
			pssearch: this.pageName,
			aplimit: this.unitLineCount
		}).done( function( data ) {
			$.each( data.query.prefixsearch, function( i, v ) {
				var pageTitle = v.title;
				if ( pageTitle == self.pageName ) {
					return;
				}
				var pageLink = mw.config.get( textResources.mwConfig_ArticlePath ).replace( '$1', pageTitle );
				var line = $( self.normalLinkLineTemplate.format( pageLink, pageTitle)).appendTo( controlBody );
			} );
		});

		return control;
	}
})( window, document, jQuery );
