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
	if ( !String.prototype.format ) {
		String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != 'undefined'
				? args[number] : match ;
			});
		};
	}

	if ( !Date.prototype.format2 ) {
		Date.prototype.format2 = function ( date ) {
			if (!date) {
				date = this;
			}
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var seconds = date.getSeconds();
			hours = hours < 10 ? '0' + hours : hours;
			minutes = minutes < 10 ? '0' + minutes : minutes;
			seconds = seconds < 10 ? '0' + seconds : seconds;
			var strTime = hours + ':' + minutes + ':' + seconds;
			var month = date.getMonth() + 1;
			month = month < 10 ? '0' + month : month;
			var day = date.getDate();
			day = day < 10 ? '0' + day : day;
			return date.getFullYear() + '-' + month  + '-' + day + ' ' + strTime;
		}
	}
	
	if ( !Date.prototype.formatToTimestamp ) {
		Date.prototype.formatToTimestamp = function ( date ) {
			if (!date) {
				date = this;
			}

			var hours = date.getHours();
			var minutes = date.getMinutes();
			var seconds = date.getSeconds();
			hours = hours < 10 ? '0' + hours : hours;
			minutes = minutes < 10 ? '0' + minutes : minutes;
			seconds = seconds < 10 ? '0' + seconds : seconds;
			var strTime = hours + minutes + seconds;
			var month = date.getMonth() + 1;
			month = month < 10 ? '0' + month : month;
			var day = date.getDate();
			day = day < 10 ? '0' + day : day;

			return '' + date.getFullYear()   + month + day + strTime;
		}
	}
		
	if ( !Date.prototype.addHour ) {
		Date.prototype.addHour = function( hour, date ) {
			if ( !date ) {
				date = this;
			}

			var dateInteger = date.getTime();
			dateInteger += 60 * 60 * 1000 * hour;
			
			this.setTime( dateInteger );
			// return new Date( dateInteger );
			return this;
		}
	}

	if ( Date.prototype.addDay ) {
		Date.prototype.addDay = function( day, date ) {
			if ( !date ) {
				date = this;
			}

			return date.addHour( 24 * day );
		}
	}

	if ( Date.prototype.addWeek ) {
		Date.prototype.addWeek = function( week, date ) {
			if ( !date ) {
				date = this;
			}

			return date.addDay( week * 7 );
		}
	}

	if ( Date.prototype.addMonth ) {
		Date.prototype.addMonth = function( month, date ) {
			if ( !date ) {
				date = this;
			}

			var currentMonth = date.getMonth();
			date.setMonth( currentMonth + month );
			return date;
		}
	}

	if ( Date.prototype.addYear ) {
		Date.prototype.addYear = function( year, date ) {
			if ( !date ) {
				date = this;
			}

			var currentMonth = date.getMonth();
			date.setMonth( currentMonth + year * 12 );
			return date;
		}
	}

	var uiTemplates = {
		shadowTemplate : '<div class="mot_shade" ></div>',
		alertWindowTemplate: '' 
			+ '<div id="mot_alert_window" >'
				+ '<div class="alert_title">消息</div>'
				+ '<div class="alert_body"></div>'
				+ '<div class="alert_footer clearfix">'
					+ '<a href="javascript:void(0);" class="ok_button alert_button" >确定</a>'
				+ '</div>'
			+ '</div>',
		windowTemplate : ''
			+ '<div class="mot_main">'
				+ '<div class="mot_main_panel" class="{0}" >'
					+ '<a href="javascript:void(0);" class="panel_close_button"></a>'
					+ '<div class=main_panel_div>'
						+ '<div class="main_panel_inner">'
							+ '<div class="title_div" >'
								+ '<h1>{1}</h1>'
							+ '</div>'
						+ '</div>'
					+ '</div>'
				+ '</div>'
			+ '</div>',
		loadingWindow: ''
			+ '<div class="mot_loading_window">'
				+ '<img src="http://zh.moegirl.org/extensions/FancyBoxThumbs/modules/fancyBox/source/fancybox_loading.gif?2013-11-26T15:31:40Z" alt="loading" style="width: 24px;height: 24px;" class="loading_image" />'
			+ '</div>'

	}

	if ( !window.motUITemplates ) {
		window.motUITemplates = uiTemplates;
	}


	
	function mwUtility() {
		$( 'body' ).css( { positon: 'relative' } );

		this.alertWindow = $( uiTemplates.alertWindowTemplate ).appendTo( 'body' ).hide();
		this.alertShade = $( uiTemplates.shadowTemplate ).attr( 'id', 'mot_alert_shade' ).appendTo( 'body' ).hide();
		this.alertCallback;

		this.loadingWindow = $( uiTemplates.loadingWindow ).appendTo( 'body' ).hide();

		var self = this;
		this.alertOKButton = $( '.ok_button', this.alertWindow )
			.click( function() {
				self.closeAlert();
				if ( !!self.alertCallback ) {
					self.alertCallback();
					self.alertCallback = undefined;
				}
			});
		this.api = new mw.Api();
		this.csrfToken = '';
		this.namespaces = {};
		
		var self = this;
		(function getCsrfToken() {
			self.api.get({
				action: 'query',
				meta: 'tokens'
			})
			.done( function( data ) {
				self.csrfToken = data.query.tokens.csrftoken;
			});
		})();

		(function getAllNamespaces() {
			self.api.get({
				action: 'query',
				meta: 'siteinfo',
				siprop: 'namespaces'
			})
			.done( function( data ) {
				if ( typeof data.query.namespaces !== 'undefined' ) {
					self.namespaces = data.query.namespaces;
				}
			} );
		})();
	}

	mwUtility.prototype.isUserPage = function( ) {
		return parseInt( mw.config.get( 'wgNamespaceNumber' ) ) === 2;
	}

	mwUtility.prototype.isTemplatePage = function( data ) {
		return parseInt( mw.config.get( 'wgNamespaceNumber' ) ) === 10;
	}

	mwUtility.prototype.alert = function( message, title, callback ) {
		this.alertWindow.show();
		this.alertShade.show();
		$( '.alert_title', this.alertWindow ).text( title );
		$( '.alert_body', this.alertWindow ).text( message );
		this.alertCallback = callback;
	}

	mwUtility.prototype.closeAlert = function() {
		this.alertWindow.hide();
		this.alertShade.hide();
	}

	mwUtility.prototype.showLoading = function() {
		this.loadingWindow.show();
	}

	mwUtility.prototype.hideLoading = function() {
		this.loadingWindow.hide();
	}

	mwUtility.prototype.currentPageIsWatched = function( callback ) {
		this.api.get({
			action: 'query',
			prop: 'info',
			inprop: 'watched',
			titles: mw.config.get( 'wgPageName' )
		})
		.done( function( data ) {
			var watched = false;
			$.each( data.query.pages, function( i, page ) {
				if ( typeof page.watched != 'undefined' ) {
					watched = true;
					return false;
				}
			});

			callback( watched );
		});
	}

	if ( !window.motMWUtility ) {
		var utility = new mwUtility();
		window.motMWUtility = utility;
	}


	/* MoreButton class
	*************************************************************/
	function MoreButton() {
		this.moreButtonTemplate = '<div id="moegirl_more_button" role="navigation" class="vectorMenu" aria_labelledby="p_cactions_label">'
			+ '<h3 id="p_cactions_label" tabindex="0"><span>更多</span><a href="#" tabindex="_1"></a></h3>'
				+ '	<div class="menu">'
					+ '<ul></ul>'
				+ '</div>'
			+ '</div>';
		this.menuItemTemplate = '<li id="{0}"><a class="{0}" href="javascript:void(0);">{1}</a></li>'
		this.orignalMoreButtonId = '#p-cactions';

		
		this.button = $( this.moreButtonTemplate ); 
		this.menu = $( '.menu ul', this.button );
	}

	MoreButton.prototype.replaceOrignal = function() {
		$( this.orignalMoreButtonId )
			.before( this.button )
			.remove();	
	}

	MoreButton.prototype.addMenuItem = function( id, text, call ) {
		$( this.menuItemTemplate.format( id, text ))
			.appendTo( this.menu )
			.click( function( event ) {
				call( event );
			});
	}
		
	var motMoreButton = new MoreButton();
	//motMoreButton.replaceOrignal();
	window.motMoreButton = motMoreButton;

	/* MoreButton class
	*************************************************************/


	var infoPage = new InfoPage();
	motMoreButton.addMenuItem( 'mlot_view_page_info_menu', '查看页面信息', function( event ) {
		infoPage.show();
	});



	/* InfoPage class
	*************************************************************/
	function InfoPage() {
		this.api = new mw.Api();
		this.isInit = false;
		this.window;
		this.shadow;
		this.closeButton;
		this.textResources = {
			operationTool_MainTitle: "AnnA's 管理工具",
			linkPagesUnit_Title: '链入页面',
			subPagesUnit_Title: '子页面',
			pageLogUnit_Title: '页面日志',
			templateLinksUnit_Title: '未使用此模板的链接',
			userLogUnit_Title: '用户日志',
			userContributionUnit_Title: '用户贡献',
			mwConfig_ArticlePath: 'wgArticlePath'
		};
		this.unitTemplate = ''
			+ '<div class="fl_l page_info_unit">'
				+ '<div class="clearfix unit_title">'
					+ '<h2 class="fl_l">{0}</h2>'
					+ '<a href="{1}" target="_blank" class="more_link fl_r" >更多...</a>'
				+ '</div>'
				+ '<div class="clearfix unit_body">'
				+ '</div>'
			+ '</div>';
		this.vscrollUnitTemplate = ''
			+ '<div class="fl_l page_info_unit vscroll_unit">'
				+ '<div class="clearfix unit_title">'
					+ '<h2 class="fl_l">{0}</h2>'
				+ '</div>'
				+ '<div class="clearfix unit_body">'
				+ '</div>'
			+ '</div>';

		this.infoPageBodyTemplate = '<div class="page_infos"></div>';
		this.pageInfoLineTemplate = '<div class="page_info_line clearfix"></div>';
		this.pageLinkLineContentTemplate = '<div class="body_line">(<a target="_blank" href="{0}" class="text_link" >链</a>) <a target="_blank" href="{1}" class="text_link" >{2}</a></div>';
		this.unitLineCount = 12;
		this.doubleLineCount = 7;
		this.normalLinkLineTemplate = '<div class="body_line"><a target="_blank" href="{0}" class="text_link" >{1}</a></div>';
		this.pageName = mw.config.get( 'wgPageName' );
		this.pathPrefix = mw.config.get( this.textResources.mwConfig_ArticlePath );
		
	}

	InfoPage.prototype.show = function() {
		if ( !this.isInit ) {
			this.createWindow( this.textResources.operationTool_MainTitle, 'infopage_main' );
			this.isInit = true;
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
		this.isInit = false;
	}

	InfoPage.prototype.createWindow = function( title, className ) {
		this.shadow = $( motUITemplates.shadowTemplate )
			.appendTo( 'body' )
			.addClass( 'page_info' )
			.hide();
		this.window = $( motUITemplates.windowTemplate.format( className, title ))
			.appendTo( 'body' )
			.addClass( 'page_info' )
			.hide();

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
		var logUnit = this.createLogUnit().appendTo( unitLine );
		
		if ( motMWUtility.isTemplatePage() ) {
			var unitLine2 = $( this.pageInfoLineTemplate ).appendTo( unitBody );
			this.createTemplateLinksUnit().appendTo( unitLine2 ).addClass( 'first' );
		} else if ( motMWUtility.isUserPage() ) {
			var unitLine2 = $( this.pageInfoLineTemplate ).appendTo( unitBody );
			this.createUserLogUnit().appendTo( unitLine2 ).addClass( 'first' );
			this.createUserContributionUnit().appendTo( unitLine2 );
		} else {
		}
	}

	InfoPage.prototype.createUserContributionUnit = function() {
		var pageUserName = mw.config.get( 'wgTitle' );
		var moreLink = this.pathPrefix.replace( '$1', 'Special:Contributions/' + pageUserName );

		var control = $( this.unitTemplate.format( this.textResources.userContributionUnit_Title, moreLink ));
		var controlBody = $( '.unit_body', control );

		var lineTemplate =''
				+ '<div class="body_line" >'
					+ '<span>{0}</span> - <a target="_blank" href="{1}">{2}</a>'
				+ '</div>'
		var self = this;

		this.api.get({
			action: 'query',
			list: 'usercontribs',
			ucuser: pageUserName,
			ucprop: 'title|timestamp|flags|tags',
			uclimit: this.unitLineCount
		}).done( function ( data ) {
			$( data.query.usercontribs ).each( function( i, v ) {
				var time = new Date( v.timestamp ).format2();
				var pageTitle = v.title;
				var pageLink = self.pathPrefix.replace( '$1', pageTitle );

				$( lineTemplate.format( time, pageLink, pageTitle )).appendTo( controlBody );
			}); 
		});

		return control;
	}

	InfoPage.prototype.createUserLogUnit = function() {
		var pageUserName = mw.config.get( 'wgTitle' );
		var moreLink = this.pathPrefix.replace( '$1', 'Special:Log&user=' + pageUserName );
		var control = $( this.unitTemplate.format( this.textResources.userLogUnit_Title, moreLink ));
		var controlBody = $( '.unit_body', control );

		var lineTemplate =''
				+ '<div class="body_line_1 line_type_2" >'
					+ '<div class="sub_des" >{0}</div>'
					+ '<div class="main_des" >{1} - <a target="_blank" href="{2}">{3}</a></div>'
					+ '</div>'

		var self = this;

		this.api.get({
			action: 'query',
			list: 'logevents',
			leuser: pageUserName,
			lelimit: this.doubleLineCount * 10
		}).done( function( data ) {
			var index = 0;
			$.each( data.query.logevents, function( i, v ) {
				
				if ( !self.filterLog( v ) || index >= self.doubleLineCount ) {
					return;
				}
				var ctime = new Date( v.timestamp ).format2();
				var action = self.getOperationString( v.action );
				var pageTitle = v.title;
				var pageLink = self.pathPrefix.replace( '$1', pageTitle );

				$( lineTemplate.format( ctime, action, pageLink, pageTitle ) ).appendTo( controlBody );
				index++;
			});
		});

		return control;
	}



	InfoPage.prototype.createTemplateLinksUnit = function() {
		var control = $( this.vscrollUnitTemplate.format( this.textResources.templateLinksUnit_Title ));
		var controlBody = $( '.unit_body', control );

		var self = this;

		this.api.get({
			action: 'query',
			generator: 'links',
			gplnamespace: 0,
			gpllimit: 500,
			prop: 'templates',
			tllimit: 500,
			tlnamespace: 10,
			tltemplates: this.pageName,
			titles: this.pageName
		}).done( function( data ) {
			if ( typeof data.query === 'undefined' ) {
				return;
			}

			$.each( data.query.pages, function( i, v ) {
				if ( typeof v.missing != 'undefined' ) {
					return;
				}

				var flag = false;
				if (typeof v.templates == 'undefined') {
					flag = false;
				}
				
				$( v.templates ).each( function( tempI, tempValue ) {
					if (tempValue.title === self.pageName) {
						flag = true;
					}
				});

				if ( !flag ) {
					var title = v.title;
					var pageLink = self.pathPrefix.replace( '$1', title );
					$( self.normalLinkLineTemplate.format( pageLink, title )).appendTo( controlBody );
				}
			});	
		});

		return control;
	}

	

	InfoPage.prototype.createLogUnit = function() {
		var logPagePath = this.pathPrefix.replace( '$1', 'Special:Log&page=$1' );
		var moreLink = logPagePath.replace( '$1', this.pageName + '&hide_patrol_log=0' );
		
		var control = $( this.unitTemplate.format( this.textResources.pageLogUnit_Title, moreLink ));
		var controlBody = $( '.unit_body', control );

		var self = this;
		var lineTemplate =''
				+ '<div class="body_line_1 line_type_2" >'
					+ '<div class="sub_des" >{0}</div>'
					+ '<div class="main_des" >{1} - (<a target="_blank" href="{2}">贡献</a>) <a target="_blank" href="{3}">{4}</a></div>'
					+ '</div>' 
		this.api.get({
			action: 'query',
			list: 'logevents',
			letitle: this.pageName,
			lelimit: (this.doubleLineCount * 10)
		}).done( function( data ) {
			var index = 0;
			$.each( data.query.logevents, function( i, v ) {
				
				if ( !self.filterLog( v ) || index >= self.doubleLineCount ) {
					return;
				}
				var ctime = new Date( v.timestamp ).format2();
				var action = self.getOperationString( v.action );
				var user = v.user;
				var userContributionLink = self.getUserContributePageLink( user );
				var userPageLink = self.getUserPageLink( user );

				$( lineTemplate.format( ctime, action, userContributionLink, userPageLink, user) ).appendTo( controlBody );
				index++;
			});
		});

		return control;
	}

	InfoPage.prototype.filterLog = function( log ) {
		return true;
		if ( log.type === 'thanks' || ( log.type === 'patrol' && log.patrol.auto === 1) ) {
			return false;
		}

		return true;
	}

	InfoPage.prototype.createPageLinksUnit = function() {
		var pageLinkPath = this.pathPrefix.replace( '$1', '特殊:链入页面/$1' );
		var currentPageLinkUrl = pageLinkPath.replace( '$1', this.pageName );
		var control = $( this.unitTemplate.format( this.textResources.linkPagesUnit_Title, currentPageLinkUrl ));
		var controlBody = $( '.unit_body', control );

		var self = this; 
		this.api.get({
			action: 'query',
			list: 'backlinks',
			bltitle: this.pageName,
			bllimit: this.unitLineCount
		}).done(function( data ) {
			$.each( data.query.backlinks, function( i, v ) {
				var pageTitle = v.title;
				var pageLink = self.pathPrefix.replace( '$1', pageTitle );
				var pagePageLink = pageLinkPath.replace( '$1', pageTitle );

				var line = $( self.pageLinkLineContentTemplate.format( pagePageLink, pageLink, pageTitle)).appendTo( controlBody );
			});
		});

		return control;
	}

	InfoPage.prototype.createSubPageLinksUnit = function() {
		var moreLink = this.pathPrefix.replace( '$1', 'Special:PrefixIndex' ) 
			+ '&prefix=' + this.pageName;
		var control = $( this.unitTemplate.format( this.textResources.subPagesUnit_Title, moreLink ));
		var controlBody = $( '.unit_body', control );

		var self = this;	
		this.api.get({
			action: 'query',
			list: 'prefixsearch',
			pssearch: this.pageName,
			pslimit: this.unitLineCount
		}).done( function( data ) {
			$.each( data.query.prefixsearch, function( i, v ) {
				var pageTitle = v.title;
				if ( pageTitle == self.pageName ) {
					return;
				}
				var pageLink = self.pathPrefix.replace( '$1', pageTitle );
				var line = $( self.normalLinkLineTemplate.format( pageLink, pageTitle)).appendTo( controlBody );
			} );
		});

		return control;
	}

	InfoPage.prototype.getUserPageLink = function( userName ) {
		return this.pathPrefix.replace( '$1', 'User:' + userName );
	}

	InfoPage.prototype.getUserContributePageLink = function( userName ) {
		var contributionLinkPath = 'Special:Contributions/$1';
		contributionLinkPath = this.pathPrefix.replace( '$1', contributionLinkPath ); 

		return contributionLinkPath.replace( '$1', userName );
	}

	InfoPage.prototype.getOperationString = function( operationType ) {
		switch( operationType )  {
			case 'patrol':
				return '标记';
			case 'move':
				return '移动';
			case 'move_redir':
				return '重定向'
			case 'block':
				return '阻挡';
			case 'protect':
				return '保护';
			case 'unprotect':
				return '解除保护';
			case 'delete':
				return '删除';
			case 'upload':
				return '上传';
			case 'import':
				return '导入';
			case 'merge':
				return '合并';
			case 'review':
				return '检查';
			default:
				return '操作';
		}
	}
	/* InfoPage class
	*************************************************************/

	/* OperationPage class
	*************************************************************/
	function OperationPage() {
		this.api = new mw.Api();
		this.isInit = false;
		this.window;
		this.shade;
		this.body;
		this.closeButton;
		this.texts = {
			windowTitle : '管理员操作'
		}

		this.pageName = mw.config.get( 'wgPageName' );
		this.pathPrefix = mw.config.get( 'wgArticlePath' );
		this.sectionTemplate = ''
			+ '<div>' 
				+ '<fieldset class="section_c" >'
					+ '<legend >'
						+ '{0}'
					+ '</legend>'
					+ '<div class="section_body" >' 
					+ '</div>'
				+ '</fieldset>'
			+ '</div>';

		this.reasonSeparatorText = "......";

	}
	
	OperationPage.prototype.show = function() {
		if ( !this.isInit ) {
			this.createWindow( this.texts.windowTitle, 'operation_page' );
		}

		this.window.show();
		this.shade.show();
	}

	OperationPage.prototype.hide = function() {
		this.window.hide();
		this.shade.hide();
	}

	OperationPage.prototype.close = function() {
		this.window.remove();
		this.shade.remove();
		this.isInit = false;
	}

	OperationPage.prototype.createWindow = function( title, className ) {
		this.shade = $( motUITemplates.shadowTemplate )
			.appendTo( 'body' )
			.addClass( className )
			.hide();
		this.window = $( motUITemplates.windowTemplate.format( className + '_window', title ))
			.appendTo( 'body' )
			.addClass( className )
			.hide();

		this.closeButton =  $( '.panel_close_button', this.window );

		var self = this;
		this.closeButton.click( function() {
			self.close();
		});
		
		this.body = $( '<div class="operation_body"></div>').appendTo( '.main_panel_inner', this.window ); 

		this.createDeleteSection().appendTo( this.body );
		this.createMoveSection().appendTo( this.body );

		this.createProtectSection().appendTo( this.body );
	}

	OperationPage.prototype.createProtectSection = function() {
		var section = $( this.sectionTemplate.format( '保护' ) );
		var sectionBody = $( '.section_body', section ).addClass( 'protect_section' );

		var template = ''
			+ '<div class="section_line clearfix">'
				+ '<div class="fl_l section_title normal_title ">设置适用范围：</div>'
				+ '<div class="fl_l">'
					+ '<select id="protect_protect_mode_dropdown" >'
							+ '<option selected value="0" >同时设置编辑和移动</option>'
							+ '<option value="1">分别设置编辑和移动</option>'
					+ '</select>'
				+ '</div>'
			+ '</div>' 
			+ '<div id="protect_pedit_area">'
				+ '<div class="subtitle">保护设置</div>'
				+ '<div class="section_line clearfix">'
					+ '<div class="fl_l section_title normal_title">操作等级：</div>'
						+ '<div class="fl_l">'
							+ '<select>'
								+ '<option selected >所有用户</option>'
								+ '<option>自动确认用户</option>'
								+ '<option>管理员</option>'
							+ '</select>'
						+'</div>'
				+ '</div>'
				+ '<div class="section_line clearfix">'
					+ '<div class="fl_l section_title normal_title">终止时间：</div>'
						+ '<div class="fl_l">'
							+ '<select >'
								+ '<option value="othertime">其它时间</option>'
								+ '<option value="1 hour">1小时</option>'
								+ '<option value="1 day">1天</option>'
								+ '<option value="1 week">1周</option>'
								+ '<option value="2 weeks">2周</option>'
								+ '<option value="1 month">1个月</option>'
								+ '<option value="3 months">3个月</option>'
								+ '<option value="6 months">6个月</option>'
								+ '<option value="1 year">1年</option>'
								+ '<option value="infinite" selected="">不限期</option>'
							+ '</select>'
						+'</div>'
				+ '</div>'
				+ '<div class="section_line clearfix">'
					+ '<div class="fl_l section_title normal_title">其他时间：</div>'
						+ '<div class="fl_l">'
							+ '<input type="text" id="protect_pedit_other_time_textbox" name="protect_pedit_other_time_textbox" />'
						+'</div>'
				+ '</div>'
			+ '</div>'
			+ '<div id="protect_pmove_area">'
				+ '<div class="subtitle">保护移动</div>'
				+ '<div class="section_line clearfix">'
					+ '<div class="fl_l section_title normal_title">操作等级：</div>'
					+ '<div class="fl_l">'
						+ '<select>'
							+ '<option selected >所有用户</option>'
							+ '<option>自动确认用户</option>'
							+ '<option>管理员</option>'
						+ '</select>'
					+'</div>'
				+ '</div>'
			+ '</div>'
			+ '<div id="protect_common_area">'
				+ '<div class="subtitle">通用设置</div>'
				+ '<div class="section_line clearfix">'
					+ '<div class="fl_l section_title">&nbsp;</div>'
					+ '<div class="fl_l">'
						+ '<input type="checkbox" id="protect_cascaded_checkbox" name="protect_cascaded_checkbox" />'
						+ '<label class="checkbox_label" for="protect_cascaded_checkbox">保护嵌入该页面的页面（级联保护）</label>'
					+'</div>'
				+ '</div>'
				+ '<div class="section_line clearfix">'
					+ '<div class="fl_l section_title normal_title">原因：</div>'
					+ '<div class="fl_l">'
						+ '<select id="protect_protect_reason_dropdown"></select>'
					+'</div>'
				+ '</div>'
				+ '<div class="section_line clearfix">'
					+ '<div class="fl_l section_title normal_title">其他/附加原因：</div>'
					+ '<div class="fl_l"><input type="text" id="protect_protect_reason_textbox" name="protect_protect_reason_textbox" /></div>'
				+ '</div>'
				+ '<div class="section_line clearfix">'
					+ '<div class="fl_l section_title">&nbsp;</div>'
					+ '<div class="fl_l">'
						+ '<input type="checkbox" id="protect_watch_checkbox" name="protect_watch_checkbox" />'
						+ '<label class="checkbox_label" for="protect_watch_checkbox">监视来源页面和目标页面</label>'
					+'</div>'
				+ '</div>'
			+ '</div>'
			+ '<div class="section_line clearfix">'
				+ '<div class="fl_l section_title ">&nbsp;</div>'
				+ '<div class="fl_l">'
					+ '<a class="click_button" href="javascript:void(0);" id="protect_protect_button" >保护页面</a>'
				+ '</div>'
			+ '</div>'
			+ '';
		$( template ).appendTo( sectionBody );

		var modeSelectDropdown = section.find( '#protect_protect_mode_dropdown' );
		var editArea = section.find( '#protect_pedit_area' );
		var moveArea = section.find( '#protect_pmove_area' );
		var protectReasonDrowdown = section.find( '#protect_protect_reason_dropdown' ); 
		this.initReasonDropdown( protectReasonDrowdown, 'MediaWiki:Protect-dropdown', function( element ) {
			$( '<option selected value="其他原因">其他原因</option>' ).appendTo( element );
				var optGroup = $( '<optgroup label="常见保护原因" ></optgroup>' ).appendTo( element );
				// $( '<option value=""></option>' );
				optGroup.append( $( '<option value="过渡破坏">过渡破坏</option>' ) );
				optGroup.append( $( '<option value="过多垃圾信息">过多垃圾信息</option>' ) );
				optGroup.append( $( '<option value="负面的编辑战">负面的编辑战</option>' ) );
				optGroup.append( $( '<option value="高流量页面">高流量页面</option>' ) );
		} );
		this.protectModeDropdownHandler( modeSelectDropdown, editArea, moveArea );

		var self = this;
		modeSelectDropdown.on( 'change', function() {
			self.protectModeDropdownHandler( modeSelectDropdown, editArea, moveArea );
		} );


		
		return section;

	}

	OperationPage.prototype.getEndDateControlValue = function( dropdownValue, textBoxValue ) {
		var newDate = new Date();	
		if ( dropdownValue == 'infinite' ) {
			return 	
		} else if ( dropdownValue == 'othertime' ) {
			newDate = new Date( textBoxValue );
		} else if ( dropdownValue == '1 hour' ) {
			newDate.addHour( 1 );
		} else if ( dropdownValue == '1 day' ) {
			newDate.addDay( 1 );
		} else if ( dropdownValue == '1 week' ) {
			newDate.addWeek( 1 );
		} else if ( dropdownValue == '2 weeks' ) {
			newDate.addWeek( 2 );
		} else if ( dropdownValue == '1 month' ) {
			newDate.addMonth( 1 );
		} else if ( dropdownValue == '3 months' ) {
			newDate.addMonth( 3 );
		} else if ( dropdownValue == '6 months' ) {
			newDate.addMonth( 6 );
		} else if ( dropdownValue == '1 year' ) {
			newDate.addYear( 1 );
		} else {
		}
		
		
		return newDate.formatToTimestamp();
	}

	OperationPage.prototype.protectModeDropdownHandler = function( dropdown, editArea, moveArea ) {
		if ( dropdown.val() == 0 ) {
			editArea.find( '.subtitle' ).text( '保护设置' );
			moveArea.hide();
		} else {
			editArea.find( '.subtitle' ).text( '保护编辑' );
			moveArea.show();
		}
	}

	OperationPage.prototype.createMoveSection = function() {
		var section = $( this.sectionTemplate.format( '移动' ) );
		var sectionBody = $( '.section_body', section ).addClass( 'move_section' );
		
		var template = ''
			+ '<div class="section_line clearfix">'
				+ '<div class="fl_l section_title normal_title">命名空间：</div>'
					+ '<div class="fl_l">'
						+ '<select id="move_namespace_dropdown"></select>'
					+'</div>'
			+ '</div>'
			+ '<div class="section_line clearfix">'
				+ '<div class="fl_l section_title normal_title">新页面：</div>'
				+ '<div class="fl_l"><input type="text" id="move_new_page_textbox" name="move_new_page_textbox" /></div>'
			+ '</div>'
			+ '<div class="section_line clearfix">'
				+ '<div class="fl_l section_title normal_title">原因：</div>'
				+ '<div class="fl_l"><input type="text" id="move_reason_textbox" name="move_reason_textbox" /></div>'
			+ '</div>'
			+ '<div class="section_line clearfix">'
				+ '<div class="fl_l section_title ">&nbsp;</div>'
				+ '<div class="fl_l">'
					+ '<input type="checkbox" id="move_left_redirect_checkbox" name="move_left_redirect_checkbox" checked />'
					+ '<label class="checkbox_label" for="move_left_redirect_checkbox">保留重定向</label>'
				+ '</div>'
			+ '</div>'
			+ '<div class="section_line clearfix">'
				+ '<div class="fl_l section_title ">&nbsp;</div>'
				+ '<div class="fl_l">'
					+ '<input type="checkbox" id="move_watch_checkbox" name="move_watch_checkbox" />'
					+ '<label class="checkbox_label" for="move_watch_checkbox">监视来源页面和目标页面</label>'
				+ '</div>'
			+ '</div>'
			+ '<div class="section_line clearfix">'
				+ '<div class="fl_l section_title ">&nbsp;</div>'
				+ '<div class="fl_l">'
					+ '<a class="click_button" href="javascript:void(0);" id="move_move_button" >移动页面</a>'
				+ '</div>'
			+ '</div>'
			+ '';

		$( template ).appendTo( sectionBody );

		var namespaceDropdown = $( '#move_namespace_dropdown', section );
		var newPageTextbox = $( '#move_new_page_textbox', section ).val( this.pageName ); 
		var moveButton = $( '#move_move_button', section );
		var watchCheckbox = $( '#move_watch_checkbox', section );
		motMWUtility.currentPageIsWatched( function( isWatched ) {
			watchCheckbox.attr( 'checked', isWatched );
		} );
		var reasonTextbox = $( '#move_reason_textbox', section );
		var redirectCheckbox = $( '#move_left_redirect_checkbox', section );
		var self = this;
		moveButton.click( function() {
			var from = self.pageName;
			var selectedNamespaceOption = $( 'option:selected', namespaceDropdown );
			var namespace = '';
			if ( selectedNamespaceOption.attr( 'value' ) != '0' ) {
				namespace = selectedNamespaceOption.text() + ":";
			}
			var to = namespace + newPageTextbox.val();
			var watchParam = watchCheckbox.is( ':checked' ) ? 'watch' : 'preferences';

			var noredirect = !redirectCheckbox.is( ':checked' ); 
			var reason = reasonTextbox.val();

			var apiData = {
				action: 'move',
				from: from,
				to: to,
				reason: reason,
				watchlist: watchParam,
				token: motMWUtility.csrfToken
			}

			if ( noredirect ) {
				apiData[ 'noredirect' ] = '';
			}

			motMWUtility.showLoading();
			self.api.post( apiData ).done( function( data ) {
				motMWUtility.hideLoading();
				console.log( data );
				motMWUtility.alert( '移动页面成功', '成功', function() {
					var newPageUrl = self.pathPrefix.replace( '$1', data.move.to );
					window.location.assign( newPageUrl );
				} );
			})
			.fail( function( jqXHR, textStatus ) {
				motMWUtility.hideLoading();
				console.log( textStatus ); 
				motMWUtility.alert( textStatus.error.info );
			});
			
		});
		this.initNamesapceDropdown( namespaceDropdown );

		return section;
	}

	OperationPage.prototype.initNamesapceDropdown = function( dropdown ) {
		$( '<option selected value="0" >(主)</option>' ).appendTo( dropdown );
		$.each( motMWUtility.namespaces, function( i, v ) {
			if ( i <= 0 ) {
				return;
			}
			$( '<option value="{0}" >{1}</option>'.format( v.id, v["*"] ) ).appendTo( dropdown );
		} );
	}

	OperationPage.prototype.createDeleteSection = function() {
		var section = $( this.sectionTemplate.format( '删除' ));
		var sectionBody = $( '.section_body', section ).addClass( 'delete_section' );

		var template = ''
			+ '<div class="section_line clearfix">'
				+ '<div class="fl_l section_title normal_title">原因：</div>'
				+ '<div class="fl_l">'
					+ '<select id="delete_delete_reason_dropdown"></select>'
				+'</div>'
			+ '</div>'
			+ '<div class="section_line clearfix">'
				+ '<div class="fl_l section_title normal_title">其他/附加原因：</div>'
				+ '<div class="fl_l"><input type="text" id="delete_delete_reason_textbox" name="delete_delete_reason_textbox" /></div>'
			+ '</div>'
			+ '<div class="section_line clearfix">'
				+ '<div class="fl_l section_title ">&nbsp;</div>'
				+ '<div class="fl_l">'
					+ '<input type="checkbox" id="delete_add_watch_checkbox" name="delete_add_watch_checkbox" />'
					+ '<label class="checkbox_label" for="delete_add_watch_checkbox">监视本页</label>'
				+ '</div>'
			+ '</div>'
			+ '<div class="section_line clearfix">'
				+ '<div class="fl_l section_title ">&nbsp;</div>'
				+ '<div class="fl_l">'
					+ '<a class="click_button" href="javascript:void(0);" id="delete_delete_button" >删除页面</a>'
				+ '</div>'
			+ '</div>';
		$( template ).appendTo( sectionBody );
		
		var addWatchCheckbox = $( '#delete_add_watch_checkbox', section );
		motMWUtility.currentPageIsWatched( function( isWatched ) {
			addWatchCheckbox.attr( 'checked', isWatched );
		} );

		var deleteReasonDropdown = $( '#delete_delete_reason_dropdown', section );
		this.initReasonDropdown( deleteReasonDropdown, 'MediaWiki:Deletereason-dropdown', function( element ) {
			$( '<option selected value="其他原因">其他原因</option>' ).appendTo( element );
				var optGroup = $( '<optgroup label="常见删除原因" ></optgroup>' ).appendTo( element );
				// $( '<option value=""></option>' );
				optGroup.append( $( '<option value="广告">广告</option>' ) );
				optGroup.append( $( '<option value="破坏行为">破坏行为</option>' ) );
				optGroup.append( $( '<option value="侵犯著作权">侵犯著作权</option>' ) );
				optGroup.append( $( '<option value="作者申请">作者申请</option>' ) );
				optGroup.append( $( '<option value="受损重定向">受损重定向</option>' ) );	
		} );

		var self = this;
		var deleteButton = $( '#delete_delete_button', section )
			.click( function( event ) {
				var reason = deleteReasonDropdown.val();
				var reasonText = $( '#delete_delete_reason_textbox', section ).val();

				if ( $.trim( reasonText ) !== '' ) {
					reason = reason + self.reasonSeparatorText + reasonText;
				}

				var watchParam = addWatchCheckbox.is( ':checked' ) ? 'watch' : 'preferences';
				motMWUtility.showLoading();
				self.api.post({
					action: 'delete',
					title: self.pageName,
					watchlist: watchParam,
					reason: reason,
					token: motMWUtility.csrfToken
				})
				.done( function( data ) {
					motMWUtility.hideLoading();
					motMWUtility.alert( '删除成功', '成功', function() {
						window.location.reload();
					} );
					console.log( data );
				}).
				fail( function ( xhr, textStatus, exception ) {
					motMWUtility.hideLoading();
					motMWUtility.alert( textStatus.error.info );
				});
			});

		
		return section;
	}
	
	OperationPage.prototype.initReasonDropdown = function( dropdown, pageName, defaultReasonFunc ) {
		this.api.get( {
			action: 'query',
			prop: 'revisions',
			titles: pageName,
			rvprop: 'content'
		} )
		.done( function( data ) {
			if ( typeof data.query.pages['-1'] != 'undefined' && typeof defaultReasonFunc === 'function' ) {
				defaultReasonFunc( dropdown );
			} else {
				$( '<option selected value="其他原因">其他原因</option>' ).appendTo( dropdown );

				var optionRaw = '';

				$.each( data.query.pages, function(i, v) {
					if (v.title === pageName ) {
						optionRaw = v.revisions[0]['*'];
					}
					return false;
				});

				if ( typeof optionRaw === 'undefined' || optionRaw === '' ) {
					return;
				}

				var current = dropdown;
				var valueArray = optionRaw.split( /\r|\n/ );

				$.each( valueArray, function( i, v )  {
					if ( v.startsWith( '**' ) ) {
						var optionTemplate = '<option value="{0}">{0}</option>'.format( v.substr( 2 ) );
						current.append( $( optionTemplate ) );
					} else if ( v.startsWith( '*' ) ) {
						var optionGroupTemplate = '<optgroup label="' + v.substr( 1) + '" ></optgroup>'
						current = $( optionGroupTemplate );
						dropdown.append( current );
					}
				});
			}
		} );
	}

	var operationPage = new OperationPage();
	motMoreButton.addMenuItem( 'mot_operation_page_menu', '保护/移动/删除', function( event ) {
		operationPage.show();
	});
	/* OperationPage class
	*************************************************************/
	
})( window, document, jQuery );
