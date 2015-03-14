// Wrap with anonymous function
( function ( window, document, $, undefined ) {
	'use strict';
	
	var moreButtonTemplate = '<div id="moegirl-more-button" role="navigation" class="vectorMenu" aria-labelledby="p-cactions-label">'
			+ '<h3 id="p-cactions-label" tabindex="0"><span>更多</span><a href="#" tabindex="-1"></a></h3>'
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
			var shadeTemplate = '<div id="mot-shade" ></div>';
			var mainPanelTemplate = ''
				+ '<div id="mot-main">'
					+ '<div id="mot-main-panel" >'
						+ '<div class="panel-close-button"></div>'
						+ '<div class="main-panel-inner">'
							+ '<div class="title-div" >'
								+ '<h1>AnnA&#39;s 管理工具</h1>'
							+ '</div>'
							+ '<div class="page-infos">'
								+ '<div class="page-info-line clearfix">'
									+ '<div class="fl-l page-info-unit first"></div>'
									+ '<div class="fl-l page-info-unit"></div>'
									+ '<div class="fl-l page-info-unit"></div>'
								+ '</div>'
								+ '<div class="page-info-line clearfix">'
									+ '<div class="fl-l page-info-unit first"></div>'
									+ '<div class="fl-l page-info-unit"></div>'
									+ '<div class="fl-l page-info-unit"></div>'
								+ '</div>'
							+ '</div>'
						+ '</div>'
					+ '</div>'
				+ '</div>';


			var $body = $( 'body' );
			$body.css({ position: 'relative' });
			mainShade = $( shadeTemplate ).appendTo( $body );
			mainPanel = $( mainPanelTemplate ).appendTo( $body );

			var closeButton = $( '.panel-close-button', mainPanel );
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
})( window, document, jQuery );
