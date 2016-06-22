(function ($, window) {

    'use strict';

    ///////////////////////////////////////////////////////////////////////
    //
    // 扩展jquery的方法
    //
    //////////////////////////////////////////////////////////////////////

    var settings = {
        initEl: ".common_loadmore_wrapper",
        loadEl: "",
        interval: 100,
        num: 5,
        sort: 'desc',
        load: function (num, cb) {
            !!cb && cb(0);
        }
    };

    var methods = {
        init: function (options) {
            settings = $.extend(settings, options);
            var $showEl = $(settings.initEl);

            $showEl.empty().append(getLoadMoreHtml());

            setLoadStatus('init');

            methods.pollLevel();
        },

        pollLevel: function () {
            setTimeout(_checkLevel, settings.interval);
        }
    };

    var setLoadStatus = function (status) {
        var $showEl = $(settings.initEl);
        var $hintText = $showEl.find('label');
        var $hintIcon = $showEl.find('span img');

        $showEl.attr('data-status', status);

        if (status == "loading") {
            $hintIcon.attr('src', 'img/icon/loading.gif');
            $hintText.text('正在加载');

        }
        if (status == "complete") {
            $hintIcon.attr('src', 'img/icon/ok_1.png');
            $hintText.text('没有更多了');
        }

        if (status == "init") {
            $hintIcon.attr('src', 'img/icon/cylinder_35_48_00000.png');
            $hintText.text('加载更多');
        }

        if (status == "loadOk") {
            $hintIcon.attr('src', 'img/icon/ok_1.png');
            $hintText.text('加载完成');
        }
    };

    var _levelReached = function () {
        var pageHeight = Math.max(document.body.scrollHeight ||
        document.body.offsetHeight);
        var viewportHeight = window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight || 0;
        var scrollHeight = window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop || 0;
        return pageHeight - viewportHeight - scrollHeight < 30;
    };


    var _checkLevel = function () {
        var status = $(settings.showEl).attr('data-status');
        if (status != "complete") {
            if (!_levelReached()) {
                return methods.pollLevel();
            } else {
                setLoadStatus('loading');
                //测试加载流程
                if (settings.debug) {
                    setTimeout(function () {
                        settings.load(settings.num, function (num, data) {
                            if (num <= 0) {
                                setLoadStatus('complete');
                            } else {
                                setLoadStatus('loadOk');
                                $(settings.loadEl).append(data);
                                return methods.pollLevel();
                            }
                        });
                    }, 3000);
                } else {
                    settings.load(settings.num, function (num, data) {
                        if (num <= 0) {
                            setLoadStatus('complete');
                        } else {
                            setLoadStatus('loadOk');
                            $(settings.loadEl).append(data);
                            return methods.pollLevel();
                        }
                    });
                }
            }
        }
    };

    function getLoadMoreHtml() {
        var html = "";

        html += '<div class="common_loadmore_item">';
        html += '<a>';
        html += '<span><img src="img/icon/cylinder_35_48_00000.png"></span>';
        html += '<label>加载更多</label>';
        html += '</a>';
        html += '</div>';

        return html;
    }

    $.fn.extend({
        scrollPagination: function (method) {
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if (typeof method === 'object' || !method) {
                return methods.init.apply(this, arguments);
            } else {
                $.error('Method ' + method + ' does not exist on jQuery.infiniScroll');
            }
        }
    })
})(jQuery, window);
