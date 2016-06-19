/**
 * Created by xingweiwei on 15/6/19.
 */
(function($, window) {

	'use strict'

	//默认隐藏标题，自动处理成 XXX...
	//全文自动设置为 title属性
	$.fn.extend({
		init_title: function() {
			$(this).each(function() {
				var sv = "";
				var __div = $(this);
				var max_length = __div.attr("max-length");
				if (max_length === undefined)
					max_length = 20;

				var value = __div.html();

				if (value.length > max_length) {
					var start = value.substr(0, max_length - 4);
					var end = value.substr(max_length - 1, 1)
					sv = start + "...";

					__div.html(sv);
					__div.attr('title', value);
				}

			});
		},

		//滚动距离顶部一定距离后固定在屏幕上方
		scrollFixedTools: function(offset) {
			window.onscroll = function() {
				var scrollTop = $(window).scrollTop();
				if (scrollTop > offset) {
					this.attr('id', 'scrolltop_fixed');
					this.css({
						'position': 'fixed',
						'top': '0',
						'z-index': '99'
					});
					$('body').css('padding', '170px 0 0 0');
				} else {
					this.attr('id', '');
					this.css({
						'position': 'relative'
					});
					$('body').css('padding', '0');
				}
			}
		},
		//回到顶部
		scrollToTop: function(offset) {
			$('.scrolltop_item .more_btn').click(function() {
				var $this = $(this);
				if ($this.find('span').hasClass('rotateto225')) {
					$this.find('span').removeClass('rotateto225').addClass('rotatefrom225');
					$this.prev().stop().animate({
						height: '0'
					});
				} else {
					$this.find('span').removeClass('rotatefrom225').addClass('rotateto225');
					$this.prev().stop().animate({
						height: '285px'
					});
				}
			});
			$(window).scroll(function() {
				var scrollTop = $(window).scrollTop();
				if (scrollTop > 300) {
					$('.scrolltop_item').stop().fadeIn();
				} else {
					var morebtn = $('.scrolltop_item .more_btn');
					$('.scrolltop_item').stop().fadeOut();
				}
			});
			$('.scrolltop_item .gotop_btn').click(function() {
				$('html,body').animate({
					scrollTop: '0px'
				}, 200);
			});
		},
		//联系我们浮动菜单
		suspendMenu: function(offset) {
			$(window).scroll(function() {
				var scrollTop = $(window).scrollTop();
				if (scrollTop > 300) {
					$('.gotop_btn').stop().fadeIn().css('display', 'block');
				} else {
					$('.gotop_btn').stop().fadeOut();
				}
			});
			$('.toolbar_tabs .gotop_btn').click(function() {
				$('html,body').animate({
					scrollTop: '0px'
				}, 200);
			});
			$('#suggest_btn').click(function() {
				art.dialog({
					title: '意见反馈',
					lock: true,
					content: document.querySelector('.feedback_container_float'),
					okVal: '发送',
					ok: function() {},
					cancelVal: '取消',
					cancel: function() {},
				});
			})
		},

		//banner双向滑动效果
		toolsSlide: function(bsContainer, bsInner, arrowLeft, arrowRight, liPadding) {
			var config = {
				bsContainer: '',
				bsInner: '',
				arrowLeft: '',
				arrowRight: '',
				liPadding: 0
			}
			var $this = $(this),
				thisLi = $this.find('li'),
				thisLiWidth = $this.find('li').width(),
				thisUl = $this.find('ul'),
				thisUlWidth = thisUl.width(),
				slideFlag = true,
				liLength = $this.find('li').length,
				flag = 0,
				liCount = 0;

			var ulEl = function() {
				return $('<ul>' + thisUl.html() + '</ul>');
			}
			for (var i = 0; i < 2; i++) {
				$(bsInner).append(ulEl());
			};

			$(bsInner).find('ul').eq(0).addClass('prev');
			$(bsInner).find('ul').eq(2).addClass('next');

			sortUl();
			if (liLength > 4) {
				$(bsContainer).hover(function() {
					$(arrowLeft + ',' + arrowRight).show();
				}, function() {
					$(arrowLeft + ',' + arrowRight).hide();
				});
			} else {
				$(bsInner).css({
					width: (thisLiWidth + 50) * liLength
				});
			}
			$(arrowRight).click(function() {
				liCount++;
				var ulLength = $(bsInner).find('ul').length;
				if (slideFlag == true) {
					slideFlag = false;
					if (liCount >= 5) {
						$this.find('ul').stop().animate({
							'left': '+=' + thisLiWidth
						}, 'fast', 'swing', function() {
							$this.find('ul').eq(2).detach();
							$(bsInner).prepend(ulEl());
							sortUl();
							$(bsInner).find('ul').removeClass();
							$(bsInner).find('ul').eq(0).addClass('prev');
							$(bsInner).find('ul').eq(2).addClass('next');
							liCount = 0;
							slideFlag = true;
						});
					} else {
						$this.find('ul').stop().animate({
							'left': '+=' + thisLiWidth
						}, 'fast', 'swing', function() {
							slideFlag = true;
						});
					}
				}
			});
			$(arrowLeft).click(function() {
				liCount--;
				var ulLength = $(bsInner).find('ul').length;
				if (slideFlag == true) {
					slideFlag = false;
					if (liCount <= -5) {
						$this.find('ul').stop().animate({
							'left': '-=' + thisLiWidth
						}, 'fast', 'swing', function() {
							$this.find('ul').eq(2).detach();
							$(bsInner).append(ulEl());
							sortUl();
							$(bsInner).find('ul').removeClass();
							$(bsInner).find('ul').eq(0).addClass('prev');
							$(bsInner).find('ul').eq(2).addClass('next');
							liCount = 0;
							slideFlag = true;
						});
					} else {
						$this.find('ul').stop().animate({
							'left': '-=' + thisLiWidth
						}, 'fast', 'swing', function() {
							slideFlag = true;
						});
					}
				}
			});

			function sortUl() {
				var ulLength = $(bsInner).find('ul').length;
				for (var i = 0; i < ulLength; i++) {
					$this.find('ul').eq(i).css({
						'left': (thisUlWidth) * (i - 1)
					});
				}
			}
		},
		carousel: function(options) {
			var config = {
				container: '',
				slide: '',
				slidewidth: 0,
				arrowleft: '',
				arrowright: '',
				pagination: ''
			}
			$.extend(config, options);
			var $this = $(this),
				thisWidth = $this.width(),
				slideEl = $(config.slide),
				liLength = $(config.slide).length,
				liCount = 0,
				slideFlag = true,
				pagination = 0,
				paginationEl = $(pagination),
				loopCount = 0;

			var queueWidth = thisWidth / 2,
				carouselLength = 3,
				queueCount = ~~(carouselLength / 2);

			if (config.slidewidth == 0) {
				var slideWidth = $(config.slide).width(),
					slideheight = $(config.slide).height();
			} else {
				var slideWidth = config.slidewidth;
			}
			var unitScale = 1 / carouselLength,
				unitOpacity = 1 / carouselLength,
				unitLeft = slideWidth / carouselLength;

			$(config.slide).css({
				height: '100%'
			})
			$this.css({
				position: 'relative',
				overflow: 'hidden'
			});

			if (config.pagination != '') {
				for (var i = liLength; i >= 0; i--) {
					$('.carousel_pagination_wrapper div').css({
						'width': 15 * (liLength * 2)
					}).append('<a href="javascript:;"><span></span></a>');
				};
				paginationEl.find('a').eq(0).addClass('active');
			};
			$(config.slide).css({
				width: slideWidth,
				height: '100%',
				position: 'absolute'
			})
			$(config.slide).each(function(i) {
				$(this).addClass('active_' + i);
				if (i <= queueCount) {
					$(config.slide).eq(i).css({
						left: i * unitLeft + unitLeft,
						opacity: (liLength - queueCount) * unitOpacity,
						'z-index': i,
						// transform: 'scale(' + (queueCount - i) * unitScale + ')'
					});
				} else if (i > queueCount) {
					$(config.slide).eq(i).css({
						left: i * unitLeft + unitLeft,
						opacity: (i - queueCount) * unitOpacity,
						'z-index': i - queueCount - 1,
						// transform: 'scale(' + (i - queueCount) * unitScale + ')'
					});

				}
			})
			$(config.slide).eq(queueCount).addClass('active');
			$(config.arrowleft).click(function() {



			})
			$(config.arrowright).click(function() {
				$(config.slide).each(function(i) {
					var $this = $(this);
					console.log('active_' + (liLength - 1 - loopCount))
					if ($this.hasClass('active_' + (liLength - 1 - loopCount))) {
						if (slideFlag) {
							$this.stop().animate({
								'left': '-=' + unitLeft * 2
							}, 'fast', 'swing', function() {
								slideFlag = true;
							});
						};

					} else if (!$this.hasClass('active_' + (liLength - loopCount - 1))) {
						if (slideFlag) {
							$this.stop().animate({
								'left': '+=' + unitLeft
							}, 'fast', 'swing', function() {
								slideFlag = true;
							});
						};

					}
				})

				if (slideFlag) {
					loopCount++;
					if (loopCount == liLength) {
						loopCount = 0;
					};
					sortLi();
					slideFlag = false;
				};

			})

			function sortLi() {
				if (slideFlag) {
					for (var i = 0; i <= liLength; i++) {
						if (i <= queueCount) {
							$(config.slide).eq(i).css({
								// left: i * unitLeft + unitLeft,
								opacity: (liLength - queueCount) * unitOpacity,
								'z-index': i,
								// transform: 'scale(' + (queueCount - i) * unitScale + ')'
							});
						} else if (i > queueCount) {
							$(config.slide).eq(i).css({
								// left: i * unitLeft + unitLeft,
								opacity: (i - queueCount) * unitOpacity,
								'z-index': i - queueCount - 1,
								// transform: 'scale(' + (i - queueCount) * unitScale + ')'
							});

						}
					};
					slideFlag = false;
				};
			}

		},
		loading: function(options) {
			var $this = $(this);
			options = $.extend({
				autodestroy: false,
				duration: 0,
				img: 'img/dynamicloading_100_55.gif',
				text: 'loading',
				style: 'dynamicloading',
				background: '#fff',
				initiation: function() {
					var loadingHTML = $("<div class='" + options.style + "'><div><img src=" + options.img + "><label>" + options.text + "</label></div></div>");
					var thisWidth = $this.width();
					var thisHeigt = $this.height();
					$this.css('position', 'relative');
					loadingHTML.css({
						'width': thisWidth,
						'height': thisHeigt
					});
					loadingHTML.find('img').css({
						'display': 'block'
					});
					loadingHTML.find('label').css({
						'display': 'block'
					});
					if (options.style == 'dynamicloading') {
						loadingHTML.css({
							'background': options.background,
							'position': 'absolute',
							'top': '0px',
							'z-index': '99999'
						});
						loadingHTML.find('img').css({
							'margin': (thisHeigt / 2 - 45) + 'px auto 0'
						});
						loadingHTML.find('label').css({
							'margin': '30px 0 0 0',
							'text-align': 'center'
						});
					}
					$this.append(loadingHTML);
				}
			}, options);

			if (typeof(options) == 'string') {
				switch (options) {
					case 'destroy':
						$('.' + options.style).fadeOut();
						setTimeout(function() {
							$('.' + options.style).detach();
						}, 1000);
						break;
					default:
						break;
				}
			} else if (options.duration > 0) {
				options.initiation();
				setTimeout(function() {
					$('.' + options.style).fadeOut();
					setTimeout(function() {
						$('.' + options.style).detach();
					}, 1000);
				}, options.duration);
			} else {
				options.initiation();
			}
			return this;
		},
		showLoadingImg: function(options) {
			var options = $.extend({
				loadmsg: '小忆拼命加载中'
			}, options);
			if ($('#index_loadingimg').length <= 0) {
				$(document.body).prepend('<div id="index_loadingimg" class="loadingimg" style="display: none;"><span class="loadingimg_roundborder"><img src="img/dynamicloading_100_55.gif" /><label>' + options.loadmsg + '</label></span></div>');
			}
			if ($('#index_loadinglayer').length <= 0) {
				$(document.body).prepend('<div id="index_loadinglayer" class="loadinglayer" style="display: none;"></div>');
			}
			$(this).each(function() {
				$(this).click(function() {
					$("#index_loadingimg").show();
					$("#index_loadinglayer").show();
				})
			})
		},
		loginPopupDialog: function() {
			var windowHeight = $(window).height(),
				marginTop = (windowHeight - 560) / 2;
			if (marginTop < 0) { marginTop = 0; }
			$(this).each(function() {
				$(this).click(function() {
					console.log(marginTop);
					$('.common_login_container').addClass('active');
					$('.common_login_wrapper').css('margin-top', marginTop);

				});
				$('.common_loginheader_wrapper a').click(function() {
					$('.common_login_container').removeClass('active');
				});
			});
		},
		popup: function(options) {
			options = $.extend({
				closebtn: '',
				maskopacity: 0,
				noborder: false,
				noalign: false
			}, options);
			var $this = $(this),
				thisParent = $this.parent(),
				popupWrapperEl = $('<div></div>').addClass('commonPopupWrapper'),
				popupContainerEl = $('<div></div>').addClass('commonPopupContainer'),
				contentWidth = $this.width();
			$('body').append(popupContainerEl.append(popupWrapperEl));
			popupWrapperEl.css({
				width: contentWidth,
				border: '10px solid rgba(153,153,153,0.5)',
				'border-radius': 10
			});
			popupContainerEl.css({
				display: 'block',
				position: 'fixed',
				top: 0,
				left: 0,
				'z-index': 99999,
				width: $(window).width(),
				height: $(window).height(),
				background: 'rgba(0,0,0,' + options.maskopacity + ')'
			});
			popupContainerEl.resize(function() {
				popupContainerEl.css({
					width: $(window).width(),
					height: $(window).height(),
				});
			});
			popupWrapperEl.append($this);
			$this.css({
				display: 'block'
			});
			popupWrapperEl.css({
				display: 'block',
				opacity: 1
			});
			if (popupWrapperEl.height() > $(window).height() - 20) {
				popupWrapperEl.css({
					width: ($this.outerWidth() + 15),
					height: ($(window).height() - 100),
					overflow: 'auto'
				});

			};
			if (!options.noalign) {
				popupWrapperEl.align();
			}
			if (options.closebtn != '') {
				$(options.closebtn).each(function() {
					$(this).one('click', function() {
						popupContainerEl.detach();
						thisParent.append($this.hide());
					});
				});
			};
		},
		priceCalculator: function(options) {
			var that = $(this),
				totalPriceArr = [],
				config = {
					onchange: function() {}
				};
			if (typeof options == 'Object') {
				$.extend(config, options);
			} else if (typeof options == 'String') {
				switch (options) {
					case 'destroy':
						destroy();
						break;
				}
			}
			$.each(that, function(index) {
				var $this = $(this),
					modifyBtn = $this.find('a');
				if ($this.is('input')) {
					var counterEl = $this;
				} else {
					var counterEl = $this.find('input');
				}
				modifyBtn.off('click');
				modifyBtn.on('click', function(e) {
					var counter = counterEl.val();
					switch ($(this).index()) {
						case 0:
							counter--;
							if (counter < 0) {
								counter = 0;
							}
							break;
						case 2:
							counter++;
							break;
					}
					e.stopPropagation();
					counterEl.val(counter);
					config.onchange();
					fireonchange(counterEl);
				})
				counterEl.on('keydown keyup', function(e) {
					var $this = $(this),
						counterVal='',
						counter = 0,
						keycode = e.charCode ? e.charCode : e.keyCode;
					switch (e.type) {
						case 'keydown':
							if (keycode != 8 && keycode != 37 && keycode != 39 && keycode < 48 || keycode > 57 && keycode < 96 || keycode > 105) {
								e.preventDefault();
							} else if (keycode != 37 && keycode != 39) {
								$this.val() != 0 ? $this.val() != 0 : $this.val('');
							}
							break;
						case 'keyup':
							counterEl.val(counterEl.val().replace(/\D/g,''))
							config.onchange();
							fireonchange(counterEl);
							break;
					}
				});
				counterEl.blur(function(){
					var $this=$(this);
					if ($this.val()=='') {
						$this.val(0)
					};
				})
			});

			function destroy() {
				$.each(that, function(index) {
					$(this).find('a').unbind('click');
				});
			}

			function fireonchange(_this) {
				_this.trigger('onchange');
			}
		},
		priceCalculator_full: function(options) {
			var that = $(this),
				totalPriceArr = [],
				config = {
					unitprice: '',
					subtotal: '',
					totalprice: '',
					onchange: function() {}
				};
			if (typeof options == 'Object') {
				$.extend(config, options);
			} else if (typeof options == 'String') {
				switch (options) {
					case 'destroy':
						destroy();
						break;
				}
			}
			init(that);
			$.each(that, function(index) {
				var $this = $(this),
					modifyBtn = $this.find('a');
				if ($this.is('input')) {
					var counterEl = $this;
				} else {
					var counterEl = $this.find('input');
				}
				modifyBtn.off('click');
				modifyBtn.on('click', function(e) {
					var counter = counterEl.val();
					switch ($(this).index()) {
						case 0:
							counter--;
							if (counter < 0) {
								counter = 0;
							}
							break;
						case 2:
							counter++;
							break;
					}
					e.stopPropagation();
					counterEl.val(counter);
					setter(index, counter);
					config.onchange();
					fireonchange(counterEl);
				})
				counterEl.on('keydown keyup', function(e) {
					var $this = $(this),
						counter = 0,
						keycode = e.charCode ? e.charCode : e.keyCode;
					switch (e.type) {
						case 'keydown':
							if (keycode != 8 && keycode != 37 && keycode != 39 && keycode < 48 || keycode > 57 && keycode < 96 || keycode > 105) {
								e.preventDefault();
							} else if (keycode != 37 && keycode != 39) {
								$this.val() != 0 ? $this.val() != 0 : $this.val('');
							}
							break;
						case 'keyup':

							counter = Number(counterEl.val());
							setter(index, counter);
							config.onchange();
							fireonchange(counterEl);
							break;
					}
				})
			});

			function destroy() {
				$.each(that, function(index) {
					$(this).find('a').unbind('click');
				});
			}

			function getUnitprice(index) {
				if (typeof config.unitprice == 'number') {
					var unitPrice = config.unitprice;
				} else if (typeof config.unitprice == 'string') {
					var unitPrice = $(config.unitprice).eq(index).text().replace("￥", '');
				}
				return unitPrice;
			}

			function setter(index, counter) {
				var result = getUnitprice(index) * counter;
				$(config.subtotal).eq(index).html(parseFloat(result).toFixed(2));

				totalprice(index, result)
			}

			function totalprice(index, price) {
				totalPriceArr[index] = price;

				var totalPrice = 0;
				for (var i = totalPriceArr.length - 1; i >= 0; i--) {
					totalPrice += totalPriceArr[i];
				};
				//console.log(totalPriceArr[0])
				$(config.totalprice).html(parseFloat(totalPrice).toFixed(2));
			}

			function init(_this) {
				var length = _this.length;
				$.each(_this, function(index) {
					var val = _this.eq(index).find('input').val();
					setter(index, val)
				});
			}

			function fireonchange(_this) {
				_this.trigger('onchange');
			}
		},
		//footer自动贴底效果，任意调整浏览器窗口高度都可以自动贴底，同时让页面主体内容垂直居中
		footerAlignBottom: function(options) {
			options = $.extend({
				marginOffset: 10,
				footer: '.footer'
			}, options);
			var $this = $(this);
			realign();
			$(window).resize(function() {
				realign();
			});

			function realign() {
				var availHeight = $(window).height();
				var thisHeight = $this.height();
				var loginMargin = availHeight - 210 - thisHeight;
				if (loginMargin > 0) {
					$this.css({
						'margin-top': loginMargin / 2 + options.marginOffset,
						'margin-bottom': loginMargin / 2 + options.marginOffset
					});
					$(options.footer).css('position', 'absolute');
				} else if (loginMargin < 0) {
					$this.css({
						'margin-top': 0,
						'margin-bottom': 0,
					});
				}
			}
		},
		imgAlignCenter: function() {
			var $this = $(this),
				windowWidth = $(window).width(),
				imgWidth = $this.width();
			$(window).resize(function() {
				$this.css({
					'margin-left': (windowWidth - imgWidth) / 2
				});
			});
			$this.css({
				'margin-left': (windowWidth - imgWidth) / 2
			});
		},
		align: function(options) {
			options = $.extend({
				position: 'both',
				container: '',
				isimage: false,
				offsetx: 0,
				offsety: 0,
				ignore: ''
			}, options);

			var that = this,
				imgSrc = that.attr('src'),
				reload = false,
				container = $(options.container),
				thisWidth = 0,
				thisHeight = 0,
				containerWidth = 0,
				containerHeight = 0,
				timer,
				ignoreX = 0,
				ignoreY = 0,
				ignoreArr = [],
				windowWidth = $(window).width(),
				windowHeight = $(window).height();
			//_this.attr('src', imgSrc + '?' + Date.parse(new Date()))

			initAligning();
			$(window).resize(function() {
				initAligning();
			});

			function initAligning() {
				if (typeof options.ignore === 'string') {
					ignoreArr = options.ignore.split(',');
					for (var i = 0; i < ignoreArr.length; i++) {
						ignoreX += $(ignoreArr[i]).width();
						ignoreY += $(ignoreArr[i]).height();
					}
				}
				//当居中元素是img标签时，特殊处理！
				if (that.is('img')) {
					//递归判断需要居中的图片是否加载完成，如果没有就重载
					var checkImageLoaded = function() {
						that.each(function(index) {
							var $this = $(this);
							if ($this.height() == 0) {
								console.log('load failed ' + $(this).width())
								reload = true;
								return false;
							} else {
								containerWidth = container.eq(index).width();
								containerHeight = container.eq(index).height();
								checkPosition($this)
								console.log('第' + index + '张图片的高度:' + containerHeight);
							}
						});
						if (reload) {
							reload = false;
							checkBrowser({
								ie: function() {
									timer = window.setTimeout(function() {
										checkImageLoaded();
									}, 100);
								},
								other: function() {
									timer = setTimeout(function() {
										checkImageLoaded();
									}, 100);
								}
							})
						}
					}
					checkImageLoaded();
					//缺省情况
				} else {
					//需要遍历每个居中对象，判断其每个container尺寸不同时，需分别处理
					//当设置了container时，以container尺寸大小居中
					if (options.container != '') {
						that.each(function(index) {
							var $this = $(this);
							containerHeight = container.eq(index).height();
							containerWidth = container.eq(index).width();
							console.log(containerHeight)
							if ($this.is(':hidden')) {
								return true
							} else {
								checkPosition($this);
							}
						});
						//当没有设置container时，以窗口尺寸大小居中
					} else {
						containerWidth = $(window).width();
						containerHeight = $(window).height();
						that.each(function(index) {
							var $this = $(this);
							if ($this.is(':hidden')) {
								return true
							} else {
								checkPosition($this);
							}
						});
					}
				}
			}

			function checkPosition(_this) {
				checkBrowser({
					ie: function() {
						window.clearTimeout(timer);
					},
					other: function() {
						clearTimeout(timer);
					}
				})

				var thisWidth = _this.outerWidth(),
					thisHeight = _this.outerHeight();

				switch (options.position) {
					case 'both':
						var marginY = (containerHeight - thisHeight) / 2;
						if (thisWidth <= $(window).width()) {
							if (options.offsetx != 0) {
								_this.css({
									'margin': marginY + options.offsety - ignoreY + 'px ' + (containerWidth - thisWidth) / 2 + offsetX - ignoreX + 'px'
								});
							} else {
								_this.css({
									'margin': marginY + options.offsety - ignoreY + 'px auto'
								});
							}
						} else {
							var marginX = (containerWidth - thisWidth) / 2;
							_this.css({
								'margin': marginY + options.offsety - ignoreY + 'px ' + (marginX + options.offsetx) + 'px'
							});
						}
						break;
					case 'top':
						aligning(function(thisWidth, thisHeight) {
							if ($(document).height() > $(window).height()) {
								return;
							} else {
								_this.css({
									'margin': (containerWidth - thisWidth) / 2 + ' auto'
								});
							}
						});
						break;
					case 'right':
						aligning(function(thisWidth, thisHeight) {
							_this.css({
								'margin': (windowHeight - thisHeight) / 2 + 'px 0 0 ' + (containerWidth - thisWidth) + 'px'
							});
						});
						break;
					case 'bottom':
						aligning(function(thisWidth, thisHeight) {
							_this.css({
								'margin': (windowHeight - thisHeight + options.offsety - ignoreY) + 'px auto 0'
							});
						});
						break;
					case 'left':
						aligning(function(thisWidth, thisHeight) {
							_this.css({
								'margin': (windowHeight - thisHeight) / 2 + 'px 0 0 0'
							});
						});
						break;
				}
			}

			function aligning(callback) {
				thisWidth = that.outerWidth();
				thisHeight = that.outerHeight();
				return callback(thisWidth, thisHeight);
			}

			function checkBrowser(callback) {
				callback = $.extend({
					ie: function() {
						return;
					},
					other: function() {
						return;
					}
				}, callback)
				if (navigator.appName.indexOf("Explorer") > -1) {
					console.log('IE')
					callback.ie();
				} else {
					// console.log('other')
					callback.other();
				}
			}
			//屏幕方向探测器
			function orientationSensor(callback) {
				var windowWidth = $(window).width(),
					windowHeight = $(window).height(),
					orientation = '';
				callback = $.extend({
					portrait: function() {},
					landscape: function() {},
					orientationchange: function(windowWidth, windowHeight) {}
				}, callback)

				checkoritation();
				$(window).resize(function() {
					checkoritation();
				});

				function checkoritation() {
					callback.orientationchange();
					if (windowWidth < windowHeight) {
						return callback.portrait();
					} else {
						return callback.landscape();
					}
				}
				return (windowWidth < windowHeight) ? orientation = 'portrait' : orientation = 'landscape';
			}
		},
		//滑块拖动控件
		sliderControl: function(options, callback) {
			var config = $.extend({
				density: 100,
				axisx: '',
				offset: 0,
				returnto: false,
				progress: ''
			}, options);

			var that = $(this),
				isMousedown = false,
				offsetLeft = that.offset().left,
				startX = 0,
				startY = 0,
				axisWidth = $(config.axisx).width(),
				sliderWidth = that.width(),
				unitWidth = axisWidth / config.density,
				index = 0,
				progress = 0,
				returned = false,
				offsetVal = [],
				container = that.parent(),
				timer;

			var touchStart, touchMove, touchEnd;
			touchStart = isMobile() ? 'touchstart' : 'mousedown';
			touchMove = isMobile() ? 'touchmove' : 'mousemove';
			touchEnd = isMobile() ? 'touchend' : 'mouseup';

			config.density += 1;

			if (typeof config.offset == 'string') {
				$(config.offset).each(function(i) {
					offsetVal[i] = Number($(this).val());
				});
			} else if (typeof config.offset == 'number') {
				that.each(function(i) {
					offsetVal[i] = config.offset;
					$(config.returnto).val(offsetVal[i]);

				});
			}
			that.each(function(i) {
				//that.css('margin-left', -sliderWidth / 2);
				that.eq(i).on(touchStart, function(e) {
					isMousedown = true;
					if (isMobile()) {
						var touch = e.originalEvent.touches[0];
					} else {
						var touch = e;
					}
					var startX = touch.clientX,
						startY = touch.clientY;
					index = i;
				});
				container.on(touchMove, function(e) {
					if (isMousedown) {
						if (isMobile()) {
							var touch = e.originalEvent.touches[0];
						} else {
							var touch = e;
						}
						var moveX = touch.pageX - offsetLeft;
						//在滑动滑块的时候阻止默认事件
						if (moveX - startX != 0) {
							e.preventDefault();
						}
						if (touch.clientX < offsetLeft + axisWidth && touch.clientX > offsetLeft) {
							if (returned) {
								that.eq(index).css('margin-left', moveX - sliderWidth / 2);
								returned = false;
							}
						}
						if (!returned) {
							progress = progress * (config.density / axisWidth) + offsetVal[index];
							if (progress >= config.density + offsetVal[index]) {
								progress = config.density + offsetVal[index] - 1;
							};
							if ($(config.returnto).eq(index).is('input')) {
								$(config.returnto).eq(index).val(Math.floor(progress));
							} else {
								$(config.returnto).eq(index).html(Math.floor(progress));
							}
							returned = true;
						};
						if (moveX < 0) {
							progress = 0;
						} else if (moveX >= axisWidth) {
							progress = axisWidth;
						} else {
							progress = moveX + 1;
						}
						if (typeof options == 'string') {
							switch (options) {
								case 'onmove':
									callback();
									break;
							}
							return;
						}
					}
				});
			});

			$(config.returnto).each(function(i) {
				var thisReturnto = $(this),
					initVal = Number(thisReturnto.val()),
					timer;
				if (thisReturnto.is('input')) {
					var isFirefox = 0;
					if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) {
						thisReturnto.attr('autocomplete', 'off')
					}
					thisReturnto.keyup(function() {
						clearTimeout(timer);
						var $this = $(this),
							inputVal = constrainInputVal(Number($(this).val()), initVal);

						timer = setTimeout(function() {
							$(this).val(inputVal);
							that.eq(i).css('margin-left', (inputVal - offsetVal[i]) * (axisWidth / config.density));
							$this.blur();
						}, 1000);
					});
				} else {
					var value = Number($(this).val());
					$(this).html(value);
				}
				thisReturnto.blur(function() {
					var inputVal = constrainInputVal(Number($(this).val()), initVal);
					$(this).val(inputVal);
					that.eq(i).css('margin-left', (inputVal - offsetVal[i]) * (axisWidth / config.density));
				})
			});

			$(document).on(touchEnd, function() {
				isMousedown = false;
			});

			function constrainInputVal(inputVal, initVal) {
				if (inputVal <= initVal) {
					inputVal = initVal;
				} else if (inputVal > initVal && inputVal < config.density + initVal) {
					inputVal = inputVal;
				} else if (inputVal >= config.density + initVal) {
					inputVal = config.density + initVal - 1
				} else if (isNaN(value)) {
					inputVal = initVal;
				}
				return inputVal;
			}

			function isMobile() {
				var sUserAgent = navigator.userAgent.toLowerCase(),
					bIsIpad = sUserAgent.match(/ipad/i) == "ipad",
					bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os",
					bIsMidp = sUserAgent.match(/midp/i) == "midp",
					bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4",
					bIsUc = sUserAgent.match(/ucweb/i) == "ucweb",
					bIsAndroid = sUserAgent.match(/android/i) == "android",
					bIsCE = sUserAgent.match(/windows ce/i) == "windows ce",
					bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile",
					bIsWebview = sUserAgent.match(/webview/i) == "webview";
				return (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM);
			}
		}
	});

	$.extend({
		globalhint: function() {
			$('.globalhint_close_btn').click(function() {
				$('.globalhint_wrapper').fadeOut('fast');
			});
		},
		tipsBox: function(options) {
			options = $.extend({
				obj: null,
				str: "+1",
				startSize: "12px",
				endSize: "30px",
				interval: 600,
				color: "#5d7895",
				callback: function() {}
			}, options);
			$("body").append("<span class='num'>" + options.str + "</span>");
			var box = $(".num");
			var left = options.obj.offset().left + options.obj.width() / 2;
			var top = options.obj.offset().top;
			box.css({
				"position": "absolute",
				"left": left + "px",
				"top": top + "px",
				"z-index": 9999,
				"font-size": options.startSize,
				"line-height": options.endSize,
				"color": options.color
			});
			box.animate({
				"font-size": options.endSize,
				"opacity": "0",
				"top": top - parseInt(options.endSize) + "px"
			}, options.interval, function() {
				box.remove();
				options.callback();
			});
		},
		collideLoading: function(options) {
			options = $.extend({
				onScrollBottom: function() {
					alert('已触发底部但没有任何操作');
				}
			}, options);

			var doc = document,
				docEle = doc.documentElement,
				docBody = doc.body,
				docHeightContext = doc.body ? doc.body : docEle,
				
				clientHeight = 0,
				windowHeight = doc.all ? docEle.offsetHeight : window.innerHeight;

			window.onscroll = function() {
				var scrollTop = docEle.scrollTop || window.pageYOffset || docBody.scrollTop,
					docHeight = docHeightContext.scrollHeight;

				if (docBody.clientHeight && docEle.clientHeigh) {
					clientHeight = Math.min(docBody.clientHeight, docEle.clientHeight);
				} else {
					clientHeight = Math.max(docBody.clientHeight, docEle.clientHeight);
				}

				clientHeight = window.innerHeight;

				console.log(windowHeight + ' ' + scrollTop + ' ' + docHeight)
				if (windowHeight + scrollTop >= docHeight) {
					options.onScrollBottom();
				}
			}
		},
		orientationSensor: function(callback) {
			var windowWidth = $(window).width(),
				windowHeight = $(window).height(),
				orientation = '';
			callback = $.extend({
				portrait: function() {},
				landscape: function() {},
				orientationchange: function(windowWidth, windowHeight) {

				}
			}, callback);

			checkoritation();
			$(window).resize(function() {
				checkoritation();
			});

			function checkoritation() {
				callback.orientationchange();
				if (windowWidth < windowHeight) {
					return callback.portrait();
				} else {
					return callback.landscape();
				}
			}
			return (windowWidth < windowHeight) ? orientation = 'portrait' : orientation = 'landscape';
		},
		remResizing: function(options) {
			options = $.extend({
				fontsize: 16,
				baseline: 320,
				threshold: 0,
				basedonnarrow: false,
				basedonwide: false,
				dropoff: false,
				aligncenter: false,
				inward: false
			}, options);
			var htmlEl = $('html'),
				bodyEl = $('body'),
				frontline = $(window).width(),
				windowHeight = $(window).height();

			if (options.baseline <= 0) {
				options.baseline = 1;
			};
			sizeConstraint();
			$(window).on('resize', function() {
				sizeConstraint();
			});

			function sizeConstraint() {
				if (options.basedonnarrow) {
					orientationSensor({
						portrait: function() {
							frontline = $(window).width(),
								windowHeight = $(window).height();
						},
						landscape: function() {
							frontline = $(window).height(),
								windowHeight = $(window).width();
						}
					});
				} else {
					frontline = $(window).width(),
						windowHeight = $(window).height();
				}

				var factor = 0;
				if (options.baseline == 0) {
					//alert('当最小宽度等于0时')
					factor = 1;
				} else if (frontline <= options.baseline) {
					//alert('当最小宽度不等于0且屏幕宽度小于等于最小宽度时')
					if (options.inward) {
						factor = frontline / options.threshold;
					} else {
						factor = frontline / options.baseline;
					}
				} else if (frontline > options.baseline && frontline <= options.threshold || options.threshold == 0) {
					//alert('当屏幕宽度大于最小宽度且小于等于最大宽度，或没有最大宽度时')
					if (options.threshold >= 0) {
						if (options.inward) {
							factor = frontline / options.threshold;
						} else {
							factor = frontline / options.baseline;
						}
					}
				} else if (frontline > options.threshold) {
					//alert('当屏幕宽度大于最大宽度时')
					factor = frontline / options.threshold;

					if (options.aligncenter) {
						bodyEl.css({
							margin: '0 auto',
							width: options.threshold
						});
					} else {
						bodyEl.css('margin', 0);
					}
					// if (options.dropoff) {
					//  alert('dsadas')
					//  htmlEl.css('font-size', 'none');
					//  return;
					// };
				}
				htmlEl.css('font-size', options.fontsize * factor);
				if (options.dropoff && frontline > options.threshold) {
					// alert('dsadas')
					htmlEl.css('font-size', '')
				};
			}
			//屏幕方向探测器
			function orientationSensor(callback) {
				var windowWidth = $(window).width(),
					windowHeight = $(window).height(),
					orientation = '';
				checkoritation();
				$(window).resize(function() {
					checkoritation();
				});

				function checkoritation() {
					if (typeof(callback) != 'undefined') {
						if (windowWidth < windowHeight) {
							return callback.portrait();
						} else {
							return callback.landscape();
						}
					} else {
						callback = {
							portrait: function() {},
							landscape: function() {}
						}
					}
				}
				//console.log((frontline < windowHeight) ? orientation = 'portrait' : orientation = 'landscape')
				return (windowWidth < windowHeight) ? orientation = 'portrait' : orientation = 'landscape';
			}
		},
		editphoto: function(config) {
			var initConfig = config;
			var transformData = {
				scale: 1,
				rotate: 0,
				left: 0,
				top: 0
			}

			var config = $.extend({
				image: '',
				tools: {
					photoFrame: '',
					turnRightBtn: '',
					turnLeftBtn: '',
					zoomInBtn: '',
					zoomOutBtn: '',
					reScaleBtn: '',
					rePositionBtn: '',
					originalSizeBtn: '',
					scrollBar: ''
				},
				destroy: false
			}, config);
			if (config.destroy == true) {
				destroy();
			};

			var windowWidth = $(window).width(),
				windowHeight = $(window).height(),
				image = $(config.image),
				frameRatio = 0.9, //相框宽高比,此值由被点击的槽位宽高比决定
				startPosX = 0,
				startPosY = 0,
				imageTop = 0,
				imageLeft = 0,
				endPosX = 0,
				endPosY = 0,
				offsetPosX = 0,
				offsetPosY = 0,
				originalWidth = 0,
				originalHeight = 0,
				originalRatio = 0,
				saveRatio = 0,
				epscrollbarWidth,
				zoomingSlider,
				sliderPosX,
				initMarginleft = 0,
				marginleft = 0;

			if (config.tools.scrollBar != '') {
				epscrollbarWidth = $(config.tools.scrollBar).find('label').width(),
					zoomingSlider = $(config.tools.scrollBar).find('span'),
					sliderPosX = zoomingSlider.offset().left * transformData.scale;
				//  sliderPosX=(windowWidth-(windowWidth*0.8))/2;
			} else {
				return;
			}

			init();

			function init() {
				image.css('transition', 'transform 0.5s');
				image.css(transformData);
				var photoframe = $(config.tools.photoFrame);

				if (frameRatio >= 1) {
					photoframe.css({
						width: $(window).width() * 0.9,
						height: ($(window).width() * 0.9) / frameRatio
					});
				} else if (frameRatio > 0 && frameRatio < 1) {
					photoframe.css({
						width: $(window).height() * 0.6 * frameRatio,
						height: $(window).height() * 0.6
					})
					if (photoframe.width() > $(window).width()) {
						photoframe.css({
							width: $(window).width(),
							height: photoframe.height() * ($(window).width() / photoframe.width())
						});
						alert(photoframe.height());
					};
				}

				//获取图片原始尺寸
				var imgObj = new Image;
				imgObj.src = image.attr('src');
				originalWidth = imgObj.width;
				originalHeight = imgObj.height;
				originalRatio = originalWidth / (photoframe.width() * 0.9);

				if (windowWidth < windowHeight) {
					$(config.tools.scrollBar).css('width', windowWidth);
				} else {
					$(config.tools.scrollBar).css('width', windowHeight);
				}
				$(window).resize(function() {
					if (windowWidth < windowHeight) {
						$(config.tools.scrollBar).css('width', windowWidth);
					} else {
						$(config.tools.scrollBar).css('width', windowHeight);
					}
				})

				//根据图片原始宽度和屏幕宽度的比利算出滑块初始位置
				// initMarginleft = $(config.tools.scrollBar).find('label').width() / originalRatio;        
				// zoomingSlider.css('margin-left', initMarginleft);

				initMarginleft = 1 / originalRatio;
				zoomingSlider.css('margin-left', (initMarginleft * 100) + '%');
				//先居中相框再居中图片
				$(config.tools.photoFrame).align();
				image.align({
					container: '.makebook_epeditarea_wrapper'
				});
			};
			//原始尺寸
			$(config.tools.originalSizeBtn).on('touchend', function() {
				image.css(cssSettings({
					'scale': originalRatio
				}));
				saveRatio = initMarginleft * originalRatio;
				zoomingSlider.css('margin-left', '80%');
			});
			//向右转
			$(config.tools.turnRightBtn).on('touchend', function() {
				transformData.rotate += 90;
				image.css(cssSettings(transformData));
			});
			//向左转
			$(config.tools.turnLeftBtn).on('touchend', function() {
				transformData.rotate -= 90;
				image.css(cssSettings(transformData));
			});
			//放大
			$(config.tools.zoomoutBtn).on('touchend', function() {
				marginleft -= epscrollbarWidth / 2 / 5
				if (marginleft <= 0) {
					marginleft = 0;
				}
				image.css(cssSettings({
					'scale': Number(marginleft / epscrollbarWidth) * 2
				}));
				zoomingSlider.css('margin-left', marginleft);
			});
			//缩小
			$(config.tools.zoominBtn).on('touchend', function() {
				marginleft += epscrollbarWidth / 2 / 5;
				if (marginleft >= epscrollbarWidth - 10) {
					marginleft = epscrollbarWidth - 10;
				}
				image.css(cssSettings({
					'scale': Number(marginleft / epscrollbarWidth) * 2
				}));
				zoomingSlider.css('margin-left', marginleft);
			});
			//重新归位
			$(config.tools.rePositionBtn).on('touchend', function() {
				transformData = $.extend(transformData, {
					left: 0,
					top: 0
				});
				image.css(transformData);
			});

			if (initConfig == 'transformData') {
				switch (config) {
					case 'transformData':
						return {
							'transform': 'rotate(' + transformData.rotate + 'deg) scale(' + transformData.scale + ')',
							'-webkit-transform': 'rotate(' + transformData.rotate + 'deg) scale(' + transformData.scale + ')',
							'position': 'absolute',
							'left': transformData.left,
							'top': transformData.top
						}
				}
			};

			function sliderEvent(e) {
				var touch = e.originalEvent.touches[0];
				var movingPosX = touch.pageX;

				// marginleft = ((movingPosX-(windowWidth-(windowWidth*0.8))/2)/windowWidth)*0.8;
				marginleft = (movingPosX / windowWidth) - (sliderPosX / windowWidth);
				// console.log("windowWidth: "+windowWidth+' sliderPosX: '+sliderPosX+' movingPosX: '+movingPosX)               

				if (marginleft <= 0) {
					//console.log('<0')
					marginleft = 0;
				} else if (marginleft >= 0.8) {
					marginleft = 0.8
				} else {
					zoomingSlider.css('margin-left', (marginleft * 100) + '%');
					var scalecss = {
						scale: marginleft * originalRatio
					}
					image.css(cssSettings(scalecss));
					console.log('滑块操作后的marginleft: ' + marginleft);
				}
				if (marginleft > saveRatio) {
					//大于最低清晰度
					//console.log(marginleft+' '+saveRatio)
				};
			}
			zoomingSlider.on('touchstart', function(e) {
				sliderEvent(e);
			});
			zoomingSlider.on('touchmove', function(e) {
				console.log(windowWidth)
				sliderEvent(e);
			});
			image.on('touchstart', function(e) {
				console.log('image touchstart')
				var touch = e.originalEvent.touches[0];
				startPosX = touch.pageX,
					startPosY = touch.pageY,
					imageLeft = Number(image.css('left').replace('px', '')),
					imageTop = Number(image.css('top').replace('px', ''))
				console.log(transformData)
			});

			function eventHandler(e, transformData) {
				if ($(e.target).closest(image).length > 0) {
					var touch = e.touches[0];
					switch (e.type) {
						case 'touchstart':
							startPosX = touch.pageX,
								startPosY = touch.pageY,
								imageLeft = Number(image.css('left').replace('px', '')),
								imageTop = Number(image.css('top').replace('px', ''))
							break;
						case 'touchmove':
							e.preventDefault;
							endPosX = touch.pageX,
								endPosY = touch.pageY,
								offsetPosX = endPosX - startPosX;
							offsetPosY = endPosY - startPosY;
							var positioncss = {
								position: 'relative',
								left: offsetPosX + imageLeft,
								top: offsetPosY + imageTop
							};
							cssSettings(positioncss);
							transformData = $.extend(transformData, positioncss)
							image.css(transformData);
							break;
					}
				}
			}

			//某些必须集合多个参数的样式的设置模式
			function cssSettings(config) {
				transformData = $.extend(transformData, config);
				var cssObj = transformData;
				if (transformData.rotate || transformData.scale) {
					$.extend(transformData, {
						'transform': 'rotate(' + transformData.rotate + 'deg) scale(' + transformData.scale + ')'
					});
					// console.log(transformData);
					return transformData;
				};
			}
			var touchstartEvent = function() {
					window.addEventListener('touchstart', eventHandler, false);
				}(),
				touchmoveEvent = function() {
					window.addEventListener('touchmove', eventHandler, false);
				}()
			$('.orange_btn').on('touchend', function() {
				console.log(transformData);
			});

			function destroy() {
				touchstartEvent = null;
				touchmoveEvent = null;
				$('.action_btn').off();
			}
		},
		imageTransition: function(options) {
			var config = $.extend({
				mintime: 2,
				maxtime: 2,
				transittime: 1,
				container: '',
				imagesrc: []
			}, options);
			var bgLength = config.imagesrc.length,
				index = 0,
				imgReady = false,
				imgCounter = 0,
				randomPeriod = 1000,
				windowWidth = $(window).width(),
				windowHeight = $(window).height(),
				container = $(config.container),
				ffimgcontainerClass = 'ffimgcontainer',
				ffimgcontainerEl = $('<div></div>').addClass(ffimgcontainerClass).css({
					width: '100%',
					height: '100%',
					position: 'absolute',
					left: 0,
					top: 0
				})

			config.mintime = (config.mintime < config.transittime * 2) ? config.transittime * 2 : config.mintime;
			config.maxtime = (config.maxtime < config.mintime) ? config.mintime : config.maxtime;
			//加载所有图片
			for (var i = 0; i < bgLength; i++) {
				var imgEl = $('<img/>').attr('src', config.imagesrc[i]).css('position', 'absolute').addClass('transition_bg').hide();
				container.append(imgEl);
			}
			container.append(ffimgcontainerEl);
			var bgImg = $('.transition_bg');
			ffimgcontainerEl.append(bgImg);
			//检查每个图片是否加载完成
			bgImg.each(function(index) {
				$(this).load(function() {
					imgCounter++;
					console.log(imgCounter)
					if (imgCounter == bgLength) {
						console.log('imgReady');
						var bgImgWidth = bgImg.width(),
							bgImgHeight = bgImg.height();
						console.log(bgImgWidth);
						var timer = setInterval(function() {
							randomPeriod = config.mintime * 1000 + (Math.random() * (config.maxtime - config.mintime) * 1000);
							console.log(randomPeriod);
							if (index == bgLength) {
								index = 0;
							};
							if (getVendorPrefix() == 'webkit') {
								container.css({
									'background-image': 'url(' + config.imagesrc[index] + ')',
									'-webkit-transition': 'background-image ' + config.transittime + 's'
								});
							} else {
								bgImg.eq(index - 1).fadeOut(config.transittime * 1000);
								bgImg.eq(index).fadeIn(config.transittime * 1000);
								bgImg.eq(index).css({
									top: (windowHeight - bgImgHeight) / 2,
									left: (windowWidth - bgImgWidth) / 2
								});
								console.log(bgImgHeight);
							}
							index++;
						}, config.mintime * 1000 + (Math.random() * (config.maxtime - config.mintime) * 1000));
					};
				});
			});

			function getVendorPrefix() {
				var body = document.body || document.documentElement,
					style = body.style,
					vendor = ['webkit', 'khtml', 'moz', 'ms', 'o'];

				for (var i = 0; i < vendor.length; i++) {
					if (typeof style[vendor[i] + 'Transition'] === 'string') {
						return vendor[i];
					}
				}
			}
		}
	});
	$('.bannerslider_wrapper').toolsSlide({
		bsContainer: '.bannerslider_wrapper',
		bsInner: '.ybbanner_wrapper .bannerslider_inner',
		arrowLeft: '.ybbanner_wrapper .bs_arrowbtn_left',
		arrowRight: '.ybbanner_wrapper .bs_arrowbtn_right',
		liPadding: 40
	});
	$('.manage_tab').toolsSlide({
		bsContainer: '.bannerslider_wrapper',
		bsInner: '.manage_tab .bannerslider_inner',
		arrowLeft: '.manage_tab .bs_arrowbtn_left',
		arrowRight: '.manage_tab .bs_arrowbtn_right',
		liPadding: 40
	});
	$('.hide_title').init_title();

})(jQuery, window);