(function (win, $, doc) {
    'use strict';
    win.smg = win.smg || {};
    win.smg.support = win.smg.support || {};

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    win.smg.support.common = (function () {
        return {
            customEvent : {
                PAGEIS : {
                    EVENT_MANAGER : $('<div data-evt-manager=\'page\'/>'),
                    PAGEOBJS : [],
                    REPOSITION : 'PAGE_REPOSITION'
                }
            },
            stickyDatas : [],
            breakpoints : {
                MOBILE : 768
            },
            util : {
                isDetecting : (function () {
                    var isMac = (navigator.appVersion.indexOf("Mac") !== -1),
                        isEmulator = navigator.connection && (navigator.platform.indexOf('Win') !== -1),
                        isWinSafari = (function () {
                            var appNetscape = (navigator.appName === "Netscape"),
                                appVersionMac = (navigator.appVersion.indexOf("Mac") !== -1),
                                userAgentSafari = (navigator.userAgent.indexOf("Safari") !== -1),
                                userAgentChrome = (navigator.userAgent.indexOf("Chrome") !== -1);
                            return (appNetscape && !appVersionMac && userAgentSafari && !userAgentChrome);
                        })();
                    if ((isMac && !isEmulator) || isWinSafari) {
                        $('body').addClass('ios-safari');
                    }
                })(),
                isSupportTransform : (function () {
                    return ('WebkitTransform' in doc.body.style || 'MozTransform' in doc.body.style || 'msTransform' in doc.body.style || 'OTransform' in doc.body.style || 'transform' in doc.body.style);
                })(),
                isSupportTransition : (function () {
                    return ('WebkitTransition' in doc.body.style || 'MozTransition' in doc.body.style || 'msTransition' in doc.body.style || 'OTransition' in doc.body.style || 'transition' in doc.body.style);
                })(),
                isSupportTransforms3d : (window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
                    var div = document.createElement('div').style;
                    return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
                })(),
                isDevice : (function () {
                    return ('ontouchstart' in win || (win.DocumentTouch && doc instanceof win.DocumentTouch));
                })(),
                isIOS : (function () {
                    return (/iPad|iPhone|iPod/.test(navigator.userAgent));
                })(),
                def : function (org, src) {
                    for (var prop in src) {
                        if (!hasOwnProperty.call(src, prop)) continue;
                        if ('object' === $.type(org[prop])) {
                            org[prop] = ('array' === $.type(org[prop])) ? src[prop].slice(0) : this.def(org[prop], src[prop]);
                        } else {
                            org[prop] = src[prop];
                        }
                    }
                    return org;
                },
                wait : function(timeout){
                    var deferred = $.Deferred();
                    setTimeout(deferred.resolve, timeout);
                    return deferred.promise();
                },
                winSize : (function () {
                    var isWinSafari = (function () {
                        var appNetscape = (navigator.appName === "Netscape"),
                            appVersionMac = (navigator.appVersion.indexOf("Mac") !== -1),
                            userAgentSafari = (navigator.userAgent.indexOf("Safari") !== -1),
                            userAgentChrome = (navigator.userAgent.indexOf("Chrome") !== -1);
                        return (appNetscape && !appVersionMac && userAgentSafari && !userAgentChrome);
                    })();
                    if (isWinSafari) {
                        return function () {
                            var win_wh = {
                                w : $(win).width(),
                                h : $(win).height()
                            };
                            return win_wh;
                        }
                    } else {
                        return function () {
                            var win_wh = {
                                w : win.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth,
                                h : win.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight
                            };
                            return win_wh;
                        }
                    }
                })(),
                requestAFrame : (function () {
                    return win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame || win.msRequestAnimationFrame ||
                        function (callback) {
                            return win.setTimeout(callback, 1000 / 60);
                        };
                })(),
                cancelAFrame : (function () {
                    return win.cancelAnimationFrame || win.webkitCancelAnimationFrame || win.webkitCancelRequestAnimationFrame || win.mozCancelAnimationFrame || win.oCancelAnimationFrame || win.msCancelAnimationFrame ||
                        function (id) {
                            win.clearTimeout(id);
                        };
                })(),
                getRestrictBytes : function (str, maxBytes) {
                    var strLeng = str.length,
                        rByte = 0,
                        rLen = 0,
                        strChar = '';
                    maxBytes = maxBytes || 100;
                    for (var i = 0; i < strLeng; i++) {
                        strChar = str.charAt(i);
                        if (escape(strChar).length > 4) {
                            rByte += 2;
                        } else {
                            rByte++;
                        }
                        if (rByte <= maxBytes) {
                            rLen = i+1;
                        }
                    }
                    return {
                        bytes : rByte,
                        rectLeng : rLen
                    }
                },
                imgLoader : function (selector, callback) {
                    $(selector).each(function () {
                        var cb = (callback || function () {});
                        if (this.complete || $(this).height() > 0) {
                            cb.apply(this);
                        } else {
                            $(this).on('load', function () {
                                cb.apply(this);
                                $(this).off('load');
                            });
                        }
                    });
                },
                emitter : {
                    subscribers : {},
                    on : function (event, cb, context) {
                        this.subscribers = $.extend({}, this.subscribers);
                        this.subscribers[event] = this.subscribers[event] || [];
                        this.subscribers[event].push({
                            callback : cb,
                            context : context
                        });
                    },
                    off : function (event, cb, context) {
                        var idx, subs = this.subscribers[event], sub;
                        if (subs) {
                            idx = subs.length - 1;
                            while (idx >= 0) {
                                sub = subs[idx];
                                if ((sub.callback === cb) && (!context || sub.context === context)) {
                                    subs.splice(idx, 1);
                                    break;
                                }
                                idx--;
                            }
                        }
                    },
                    emit : function (event) {
                        var subs = this.subscribers[event], idx = 0, args = Array.prototype.slice.call(arguments, 1), sub;
                        if (subs) {
                            while (idx < subs.length) {
                                sub = subs[idx];
                                sub.callback.apply(sub.context || this, args);
                                idx++;
                            }
                        }
                    }
                }
            }
        }
    })();

    var CST_EVENT = win.smg.support.common.customEvent,
        STICKYDATAS = win.smg.support.common.stickyDatas;

    win.smg.support.page = (function () {
        return {
            init : function () {
                this.bindEvents();
            },
            bindEvents : function () {
                CST_EVENT.PAGEIS.EVENT_MANAGER.on(CST_EVENT.PAGEIS.REPOSITION, $.proxy(this.pageReposition, this));
                $(doc).on('click', '.js-top-go', $.proxy(this.pageTopgo, this));
                $(win).on('load', $.proxy(this.loadFunc, this));
            },
            pageReposition : function () {
                for (var i = 0, max = CST_EVENT.PAGEIS.PAGEOBJS.length; i < max; i++) {
                    CST_EVENT.PAGEIS.PAGEOBJS[i].reInit();
                }
            },
            loadFunc : function () {
                this.pageReposition();
            },
            stickyArea : function (targetScroll) {
                var offsetTops = [],
                    keyMins = [],
                    keyMin, height;
                for (var key in STICKYDATAS) {
                    var sticky = STICKYDATAS[key],
                        stickyData = sticky.data;
                    if (stickyData.offsetTop <= targetScroll) {
                        keyMins.push(stickyData.offsetTop);
                        keyMin = Math.max.apply(null, keyMins);
                    }
                }
                if (!keyMins.length) {
                    height = 0;
                } else {
                    for (var key in STICKYDATAS) {
                        var sticky = STICKYDATAS[key],
                            stickyData = sticky.data;
                        if (stickyData.offsetTop === keyMin) {
                            height = stickyData.stickyHeight;
                        }
                    }
                }
                return height;
            },
            pageTopgo : function (e) {
                e.preventDefault();
                if ($(win).scrollTop() <= 0) return;
                $('html, body').animate({
                    scrollTop : 0
                });
            }
        }
    })();

    $(function () {
        win.smg.support.page.init();
    });
})(window, window.jQuery, window.document);