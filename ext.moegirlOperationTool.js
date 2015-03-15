function test12() {
	var api = new mw.Api();
	api.get({
		action: 'query',
		list: 'allpages'
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
	        ? args[number]
	        : match
	      ;
	    });
	  };
	}

	var resText = {
		operationTool_MainTitle: "AnnA's 管理工具",
		linkPagesUnit_Title: '链入页面'
	}

		
	var moreButtonTemplate = '<div id="moegirl_more_button" role="navigation" class="vectorMenu" aria_labelledby="p_cactions_label">'
			+ '<h3 id="p_cactions_label" tabindex="0"><span>更多</span><a href="#" tabindex="_1"></a></h3>'
		+ '</div>';
	var moreButton = $( moreButtonTemplate );
	var orignalMoreButtonId = '#p-cactions';

	
	replaceMoreButton();

	moreButton.click( tooglePanel() );

	function tooglePanel() {
		var hasShow = false;
		var isExpand = false;
		var mainShade;
		var mainPanel;

		function initPanel() {
			var shadeTemplate = '<div id="mot_shade" ></div>';
			var mainPanelTemplate = ''
				+ '<div id="mot_main">'
					+ '<div id="mot_main_panel" >'
						+ '<a href="javascript:void(0);" class="panel_close_button"></a>'
						+ '<div class="main_panel_inner">'
							+ '<div class="title_div" >'
								+ '<h1>' + resText.operationTool_MainTitle  + '</h1>'
							+ '</div>'
							+ '<div class="page_infos">'
								+ '<div class="page_info_line clearfix">'
									+ '<div class="fl_l page_info_unit first">'
										+ '<div class="clearfix unit_title">'
											+ '<h2 class="fl_l">'+ resText.linkPageUnit_Title  +'</h2>'
											+ '<a href="javascript:void(0);" class="more_link fl_r" >更多...</a>'
										+ '</div>'
										+ '<div class="clearfix unit_body">'
											+ '<div class="body_line">'
												+ '(<a href="javascript:void(0)" class="text_link" >链</a>) <a href="javascript:void(0)" class="text_link" >萌娘百科更新姬</a>'
											+ '</div>'
											+ '<div class="body_line">'
												+ '(<a href="javascript:void(0)" class="text_link" >链</a>) <a href="javascript:void(0)" class="text_link" >格列夫游记</a>'
											+ '</div>'
											+ '<div class="body_line">'
													+ '(<a href="javascript:void(0)" class="text_link" >链</a>) <a href="javascript:void(0)" class="text_link" >公会同盟副议长塞莉莲,如果再长一点点呢</a>'
											+ '</div>'
										+ '</div>'
									+ '</div>'
									+ '<div class="fl_l page_info_unit"></div>'
									+ '<div class="fl_l page_info_unit"></div>'
								+ '</div>'
								+ '<div class="page_info_line clearfix">'
									+ '<div class="fl_l page_info_unit first"></div>'
									+ '<div class="fl_l page_info_unit"></div>'
									+ '<div class="fl_l page_info_unit"></div>'
								+ '</div>'
							+ '</div>'
						+ '</div>'
					+ '</div>'
				+ '</div>';


			var $body = $( 'body' );
			$body.css({ position: 'relative' });
			mainShade = $( shadeTemplate ).appendTo( $body );
			mainPanel = $( mainPanelTemplate ).appendTo( $body );

			var closeButton = $( '.panel_close_button', mainPanel );
			closeButton.click( function() {
				hidePanel();
			});
			hasShow = true;
		}

		function showPanel() {
			if ( !$.isEmptyObject( mainShade )) {
				mainShade.show();
			}

			if ( !$.isEmptyObject( mainPanel )) {
				mainPanel.show();
			}	
			
			isExpand = true;
		}

		function hidePanel() {
			if ( !$.isEmptyObject( mainShade )) {
				mainShade.hide();
			}

			if ( !$.isEmptyObject( mainPanel )) {
				mainPanel.hide();
			}
			isExpand = false;

		}

		return function() {
			if ( !hasShow ) {
				initPanel();
			}

			if ( isExpand ) {
				hidePanel();		
			} else {
				showPanel();		
			}
		}
	}
	

	function replaceMoreButton() {
		$( orignalMoreButtonId )
			.before( moreButton )
			.remove();	
	}

	/* OperationToolService class
	 *************************************************************/
	function OperationToolService( mw, res, config ) {
		this.mw = mw;
		this.api = new mw.Api();
		this.res= res;
		this.config = config;
	}

	OperationToolService.prototype.unitTemplate = ''
		+ '<div class="clearfix unit_title">'
			+ '<h2 class="fl_l">{0}</h2>'
			+ '<a href="{1}" class="more_link fl_r" >更多...</a>'
		+ '</div>'
		+ '<div class="clearfix unit_body">'
		+ '</div>';
	OperationToolService.prototype.unitLineTemplate= '<div class="body_line"></div>';

	OperationToolService.prototype.pageLinkLineContentTemplate= '(<a href="{0}" class="text_link" >链</a>) <a href="{1}" class="text_link" >{2}</a>';


	OperationToolService.prototype.createPageLinksUnit( container ) {
		var self = this; 
		var control = $( unitTemplate.format( this.res.linkPagesUnit_Title,  ))
		this.api.get({
			action: 'query',
			list: 'allpages',
			aplimit: 15
		}).done(function( data ) {
			
		});
		
	}
	
	// OperationToolService class


})( window, document, jQuery );
