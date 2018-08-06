(function (win, $, doc) {
    'use strict';
    win.smg = win.smg || {};
    win.smg.support = win.smg.support || {};
    win.smg.support.common = win.smg.support.common || {};

    var CST_EVENT = win.smg.support.common.customEvent,
        UTIL = win.smg.support.common.util,
        BREAKPOINTS = win.smg.support.common.breakpoints,
        PAGE = win.smg.support.page,
        pluginName = 'manualDownloadFilterNew',
        filterpluginName = 'productManualDownloadNewPlugin',
        personaPluginName = 'manualPersonaPlugin';

    win.smg.support[pluginName] = function (container, args) {
        var defParams = {
            obj : container,
            filterModule : '.manual-download-filter-new__module',
            personaAnchor : '.manual-download-filter-new__persona-box',
            ManualDownloadPlugins : [],
            personaAnchorPlugins : [],
            loadAfter : null
        }
        this.opts = UTIL.def(defParams, (args || {}));
        if (!(this.obj = $(this.opts.obj)).length) return;
        this.init();
    };
    win.smg.support[pluginName].prototype = {
        init : function () {
            this.setElements();
            this.manualDownloadPluginCall();
        },
        setElements : function () {
            this.filterModule = this.obj.find(this.opts.filterModule);
            this.personaAnchor = this.obj.find(this.opts.personaAnchor);
        },
        manualDownloadPluginCall : function () {
            var _this = this;
            for (var i = 0, max = this.filterModule.length; i < max; i++) {
                (function (index) {
                    var target = _this.filterModule.eq(index);
                    _this.opts.ManualDownloadPlugins.push(new win.smg.support[filterpluginName](target, {
                        loadAfter : $.proxy(_this.loadAfterFunc, _this)
                    }));
                })(i);
            }
            for (var i = 0, max = this.personaAnchor.length; i < max; i++) {
                (function (index) {
                    var target = _this.personaAnchor.eq(index);
                    _this.opts.personaAnchorPlugins.push(new win.smg.support[personaPluginName](target));
                })(i);
            }
        },
        loadAfterFunc : function () {
            this.outCallback('loadAfter');
        },
        outCallback : function (ing) {
            var callbackObj = this.opts[ing];
            if (callbackObj == null) return;
            callbackObj();
        },
        reInit : function () {
            var _this = this;
            for (var i = 0, max = this.opts.ManualDownloadPlugins.length; i < max; i++) {
                (function (index) {
                    var target = _this.opts.ManualDownloadPlugins[i];
                    target.reInit();
                })(i);
            }
        }
    };

    //filter plugin
    win.smg.support[filterpluginName] = function (container, args) {
        var defParams = {
            obj : container,
            anchorObj : '.support-anchor-navi',
            filterObj : '.manual-download-filter-new',
            filterArea : '.manual-download-filter-new__filters',
            filterWrap : '.manual-download-filter-new__list',
            filterLayerArea : '.manual-download-filter-new__list-group',
            filterListWrap : '.manual-download-filter-new__list-items',
            filterToggler : '.manual-download-filter-new__list-title',
            filterMoToggler : '.support-filter-btn',
            filterActiveClass : 'filter-active',
            filterFixedClass : 'is-fixed',
            filterToggleClass : 'is-opened',
            filterToggleSpeed : 100,
            filterViewType : false,
            accessText : '.blind',
            accessData : {
                accessAria : 'aria-expanded',
                dataActive : 'accessbility-Active'
            },
            listWrap : '.manual-download-filter-new__content-list',
            listParent : 'ul',
            listBtnArea : '.manual-download-filter-new__content-cta',
            listToggleBtn : '.s-btn-text',
            listViewClass : 'is-show',
            icoDownClass : 's-ico-down',
            icoUpClass : 's-ico-up',
            duration : 500,
            scrollLock : true,
            scrollLockClass : 'hive-scroll-lock',
            scrollLockOpts : {
                scrollLocked : false,
                lockElements : 'html',
                appliedLock : {},
                prevStyles : {},
                prevScroll : {},
                lockStyles : {
                    'overflow-y' : 'scroll',
                    'position' : 'fixed',
                    'width' : '100%'
                }
            },
            customEvent : '.' + pluginName + (new Date()).getTime(),
            viewType : null,
            loadAfter : null
        };
        this.opts = UTIL.def(defParams, (args || {}));
        if (!(this.obj = $(this.opts.obj)).length) return;
        this.init();
    };
    win.smg.support[filterpluginName].prototype = {
        init : function () {
            this.setElements();
            this.initOpts();
            this.initLayout();
            this.setLayout();
            this.bindEvents();
        },
        setElements : function () {
            this.anchorObj = $(this.opts.anchorObj);
            this.filterObj = $(this.opts.filterObj);
            this.filterArea = this.obj.find(this.opts.filterArea);
            this.filterWrap = this.filterArea.find(this.opts.filterWrap);
            this.filterLayerArea = this.filterArea.find(this.opts.filterLayerArea);
            this.filterListWrap = this.filterWrap.find(this.opts.filterListWrap);
            this.filterToggler = this.filterWrap.find(this.opts.filterToggler);
            this.filterMoToggler = this.filterArea.find(this.opts.filterMoToggler);
            this.listWrap = this.obj.find(this.opts.listWrap);
            this.listParent = this.listWrap.find(this.opts.listParent);
            this.listChild = this.listParent.children();
            this.listBtnArea = this.listWrap.find(this.opts.listBtnArea);
            this.listToggleBtn = this.listBtnArea.find(this.opts.listToggleBtn);
            this.accessText = this.filterWrap.find(this.opts.accessText);
        },
        initOpts : function () {
            var globalText = this.filterObj.data('global-text');
            this.globalText = {
                Collapse : (globalText && globalText.Collapse) ? $.trim(globalText.Collapse) : '',
                Expand : (globalText && globalText.Expand) ? $.trim(globalText.Expand) : '',
                showMore : (globalText && globalText.showMore) ? $.trim(globalText.showMore) : '',
                showLess : (globalText && globalText.showLess) ? $.trim(globalText.showLess) : ''
            };
            this.listViewNum = this.listWrap.data('view-list');
            this.listNum = this.listChild.length;
        },
        initLayout : function () {
            this.filterToggleType = true;
            this.listChild.removeClass(this.opts.listViewClass);
            this.initFilterArea();
            this.initListView();
        },
        initFilterArea : function () {
            var stickyWrapClass = this.filterArea.attr('class'),
                jsStickyWrapClass = 'js-' + stickyWrapClass;
            this.filterArea.wrap('<div class="' + jsStickyWrapClass + '"/>');
            this.filterObjWrap = this.filterArea.parent();
        },
        changeEvents : function (event) {
            var events = [],
                eventNames = event.split(' ');
            for (var key in eventNames) {
                events.push(eventNames[key] + this.opts.customEvent);
            }
            return events.join(' ');
        },
        bindEvents : function () {
            $(win).on(this.changeEvents('resize orientationchange'), $.proxy(this.resizeFunc, this));
            this.filterToggler.on(this.changeEvents('click'), $.proxy(this.filterToggleFunc, this));
            this.listToggleBtn.on(this.changeEvents('click'), $.proxy(this.listToggleFunc, this));
            this.listWrap.on(this.changeEvents('ajaxafter'), $.proxy(this.listAjaxAfter, this));
        },
        bindResponsiveEvents : function (type) {
            if (type) {
                $(win).off(this.changeEvents('scroll'));
                this.filterMoToggler.off(this.changeEvents('click'));
            } else {
                $(win).on(this.changeEvents('scroll'), $.proxy(this.scrollFunc, this));
                this.filterMoToggler.on(this.changeEvents('click'), $.proxy(this.filterMoClickFunc, this));
            }
        },
        resizeFunc : function () {
            this.winWidth = UTIL.winSize().w;
            if (this.opts.resizeStart == null) {
                this.opts.resizeStart = this.winWidth;
                this.resizeAnimateFunc();
            }
            win.clearTimeout(this.resizeEndTime);
            this.resizeEndTime = win.setTimeout($.proxy(this.resizeEndFunc, this), 150);
        },
        resizeEndFunc : function () {
            this.opts.resizeStart = null;
            this.setLayout();
            if (UTIL.winSize().w <= BREAKPOINTS.MOBILE) {
                this.createHeightFunc();
                this.fixedObjFunc();
                this.setFilterRange();
            }
            UTIL.cancelAFrame.call(win, this.resizeRequestFrame);
        },
        resizeAnimateFunc : function () {
            this.setLayout();
            if (UTIL.winSize().w <= BREAKPOINTS.MOBILE) {
                this.createHeightFunc();
                this.fixedObjFunc();
                this.setFilterRange();
            }
            this.resizeRequestFrame = UTIL.requestAFrame.call(win, $.proxy(this.resizeAnimateFunc, this));
        },
        setLayout : function () {
            if (!UTIL.isSupportTransform) {
                if (this.opts.viewType != 'pc') {
                    this.opts.viewType = 'pc';
                    this.setPcLayout();
                }
            } else {
                if (UTIL.winSize().w > BREAKPOINTS.MOBILE) {
                    if (this.opts.viewType != 'pc') {
                        this.opts.viewType = 'pc';
                        this.setPcLayout();
                        this.bindResponsiveEvents(true);
                    }
                } else {
                    if (this.opts.viewType != 'mo') {
                        this.opts.viewType = 'mo';
                        this.setMoLayout();
                        this.bindResponsiveEvents(false);
                    }
                }
            }
        },
        setPcLayout : function () {
            this.scrollLock.init.call(this, false);
            this.bindOutsideEvents(false);
            this.filterMoToggler.attr(this.opts.accessData.accessAria, false);
            this.filterObjWrap.css('height', '');
            this.filterArea.show().css('top', '');
            this.filterArea.removeClass(this.opts.filterFixedClass);
            this.filterArea.removeClass(this.opts.filterToggleClass);
        },
        setMoLayout : function () {
            this.filterArea.removeClass(this.opts.filterFixedClass);
            this.filterArea.removeClass(this.opts.filterToggleClass);
        },
        scrollFunc : function () {
            this.fixedObjFunc();
            this.setFilterRange();
        },
        createHeightFunc : function () {
            if (!UTIL.isSupportTransform) {
                this.filterObjWrap.css('height', '');
                this.filterArea.css('top', '');
            } else {
                if (UTIL.winSize().w > BREAKPOINTS.MOBILE) {
                    this.filterObjWrap.css('height', '');
                    this.filterArea.css('top', '');
                } else {
                    this.anchorObjHeight = this.anchorObj.outerHeight(true);
                    this.filterObjHeight = this.filterArea.outerHeight(true);
                    this.filterObjPosition = (this.anchorObj.length) ? this.anchorObjHeight : 0;
                    this.filterObjWrap.css('height', this.filterObjHeight);
                    this.filterArea.css('top', this.filterObjPosition);
                }
            }
        },
        fixedObjFunc : function () {
            var winTop = $(win).scrollTop();

            var lockScroll = $('html').data('lockScroll'),
                lockType = (lockScroll != null) ? true : false,
                scrollTop = (lockType) ? lockScroll.top : winTop;

            var filterOffsetTop = (lockType) ? lockScroll.top + this.filterObjWrap.offset().top : this.filterObjWrap.offset().top - this.anchorObjHeight;

            if (scrollTop >= filterOffsetTop) {
                if (!this.filterArea.hasClass(this.opts.filterFixedClass)) {
                    this.filterArea.addClass(this.opts.filterFixedClass);
                }
            } else {
                if (this.filterArea.hasClass(this.opts.filterFixedClass) && !lockType) {
                    this.filterArea.removeClass(this.opts.filterFixedClass);
                }
            }
            this.setPosition();
        },
        setFilterRange : function () {
            var winTop = $(win).scrollTop();

            var lockScroll = $('html').data('lockScroll'),
                lockType = (lockScroll != null) ? true : false,
                scrollTop = (lockType) ? lockScroll.top : winTop;

            var filterWrapHeight = this.obj.height(),
                filterOffsetTop = (lockType) ? lockScroll.top + this.obj.offset().top : this.obj.offset().top,
                filterEndRange = filterWrapHeight + filterOffsetTop - this.filterObjHeight;
            
            if (scrollTop >= filterEndRange) {
                this.filterArea.hide();
            } else {
                this.filterArea.show();
            }
        },
        setPosition : function () {
            if (this.opts.viewType === 'pc') {
                this.filterArea.css('top', '');
            } else {
                if (this.filterArea.hasClass(this.opts.filterFixedClass)) {
                    this.filterArea.css('top', this.filterObjPosition);
                } else {
                    this.filterArea.css('top', '');
                }
            }
        },
        scrollLock : {
            init : function (type) {
                if (!this.opts.scrollLock) return;
                var lockClass = this.opts.scrollLockClass,
                    lockOpts = this.opts.scrollLockOpts,
                    lockElements = $(lockOpts.lockElements);
                lockElements.toggleClass(lockClass, type);
                if (type) {
                    if (UTIL.isDevice && UTIL.isIOS) {
                        if (lockOpts.scrollLocked || (lockElements.data('lockScroll') != null)) return;
                        lockOpts.appliedLock = {};
                        this.scrollLock.saveStyles.call(this);
                        this.scrollLock.saveScrolls.call(this);
                        $.extend(lockOpts.appliedLock, lockOpts.lockStyles, {
                            'left' : - lockOpts.prevScroll.scrollLeft,
                            'top' : - lockOpts.prevScroll.scrollTop
                        });
                        lockElements.css(lockOpts.appliedLock);
                        lockElements.data('lockScroll', {
                            'left' : lockOpts.prevScroll.scrollLeft,
                            'top' : lockOpts.prevScroll.scrollTop
                        });
                        lockOpts.scrollLocked = true;
                    }
                } else {
                    if (UTIL.isDevice && UTIL.isIOS) {
                        if (!lockOpts.scrollLocked || (lockElements.data('lockScroll') == null)) return;
                        this.scrollLock.saveStyles.call(this);
                        for (var key in lockOpts.appliedLock) {
                            delete lockOpts.prevStyles[key];
                        }
                        lockElements.attr('style', $('<x>').css(lockOpts.prevStyles).attr('style') || '');
                        lockElements.data('lockScroll', null);
                        $(win).scrollLeft(lockOpts.prevScroll.scrollLeft).scrollTop(lockOpts.prevScroll.scrollTop);
                        lockOpts.scrollLocked = false;
                    }
                }
            },
            saveStyles : function () {
                var styleStrs = [],
                    styleHash = {},
                    lockOpts = this.opts.scrollLockOpts,
                    lockElements = $(lockOpts.lockElements),
                    styleAttr =  lockElements.attr('style');
                if (!styleAttr) return;
                styleStrs = styleAttr.split(';');
                $.each(styleStrs, function styleProp (styleString) {
                    var styleString = styleStrs[styleString];
                    if (!styleString) return;
                    var keyValue = styleString.split(':');
                    if (keyValue.length < 2) return;
                    styleHash[$.trim(keyValue[0])] = $.trim(keyValue[1]);
                });
                $.extend(lockOpts.prevStyles, styleHash);
            },
            saveScrolls : function () {
                var lockOpts = this.opts.scrollLockOpts;
                lockOpts.prevScroll = {
                    scrollLeft : $(win).scrollLeft(),
                    scrollTop : $(win).scrollTop()
                };
            }
        },
        filterMoClickFunc : function (e) {
            e.preventDefault();
            var filterOffsetTop = Math.ceil(this.filterObjWrap.offset().top - this.anchorObjHeight, 10);
            if (!this.opts.filterViewType) {
                if (!this.filterArea.hasClass(this.opts.filterFixedClass)) {
                    $('html, body').stop().animate({
                        scrollTop : filterOffsetTop
                    }, this.opts.duration, $.proxy(function () {
                        this.filterMoToggleFunc();
                        win.setTimeout($.proxy(function () {
                            this.bindOutsideEvents(true);
                        }, this), 10);
                    }, this))
                } else {
                    this.filterMoToggleFunc();
                }
            }
        },
        filterMoToggleFunc : function () {
            this.filterArea.addClass(this.opts.filterToggleClass);
            win.setTimeout($.proxy(function () {
                this.scrollLock.init.call(this, true);
                this.bindOutsideEvents(true);
            }, this), 10);
            this.layerViewType = (this.filterArea.hasClass(this.opts.filterToggleClass)) ? true : false;
            this.filterMoToggler.attr(this.opts.accessData.accessAria, this.layerViewType);
        },
        bindOutsideEvents : function (type) {
            if (type) {
                this.filterLayerArea.on('clickoutside touchendoutside', $.proxy(this.onLayerOutsideFunc, this));
            } else {
                this.filterLayerArea.off('clickoutside touchendoutside');
            }
        },
        onLayerOutsideFunc : function (e) {
            e.preventDefault();
            win.setTimeout($.proxy(function () {
                this.layerViewType = false;
                this.filterArea.removeClass(this.opts.filterToggleClass);
                this.filterMoToggler.attr(this.opts.accessData.accessAria, this.layerViewType);
                this.scrollLock.init.call(this, false);
                this.bindOutsideEvents(false);
                this.outCallback('loadAfter');
            }, this), 10);
        },
        filterToggleFunc : function (e) {
            e.preventDefault();
            this.filterViewFunc(e);
            this.accessbilityFunc(true);
        },
        filterViewFunc : function (e) {
            var target = $(e.currentTarget);
            var targetList = target.parent(this.opts.filterWrap),
            targetListWrap = targetList.find(this.opts.filterListWrap);
            if (!targetList.hasClass(this.opts.filterActiveClass)) {
                targetList.toggleClass(this.opts.filterActiveClass);
                targetListWrap.slideToggle(this.opts.filterToggleSpeed, $.proxy(function () {
                    this.filterViewAfterFunc();
                }, this));
            } else {
                targetListWrap.slideUp(this.opts.filterToggleSpeed, $.proxy(function () {
                    targetList.removeClass(this.opts.filterActiveClass);
                    this.filterViewAfterFunc();
                }, this));
            }
        },
        filterViewAfterFunc : function () {
            if (!UTIL.isSupportTransform || (UTIL.isSupportTransform && this.winWidth > BREAKPOINTS.MOBILE)) {
                this.outCallback('loadAfter');
            }
        },
        accessbilityFunc : function (type) {
            if (type) {
                var currentAccessType = !this.filterToggler.data(this.opts.accessData.dataActive),
                    globalTxt = (currentAccessType) ? this.globalText.Expand : this.globalText.Collapse;
                this.filterToggler.data(this.opts.accessData.dataActive, currentAccessType);
                this.filterToggler.find(this.opts.accessText).text(globalTxt);
            } else {
                this.listToggleBtn.toggleClass(this.opts.icoUpClass, this.currentAllView);
                this.listToggleBtn.toggleClass(this.opts.icoDownClass, !this.currentAllView);
                this.listToggleBtn.text(this.currentAllView ? this.globalText.showLess : this.globalText.showMore);
            }
        },
        initListView : function () {
            this.currentAllView = false;
            if (this.listNum <= this.listViewNum) {
                this.listBtnArea.hide();
            } else {
                this.listBtnArea.show();
            }
            for (var i = 0, max = this.listNum; i < max; i++) {
                var contChildTarget = this.listChild.eq(i);
                if (i < this.listViewNum) {
                    contChildTarget.addClass(this.opts.listViewClass);
                } else {
                    contChildTarget.removeClass(this.opts.listViewClass);
                }
            }
            this.listToggleBtn.toggleClass(this.opts.icoUpClass, this.currentAllView);
            this.listToggleBtn.toggleClass(this.opts.icoDownClass, !this.currentAllView);
            this.accessbilityFunc(false);
            this.outCallback('loadAfter');
        },
        listToggleFunc : function (e) {
            e.preventDefault();
            this.currentAllView = !this.currentAllView;
            this.setListLayout();
            this.scrollMoveFunc(this.listWrap);
            this.accessbilityFunc(false);
        },
        listAjaxAfter : function () {
            this.listChild = this.listParent.children();
            this.listNum = this.listParent.children().length;
            this.initListView();
        },
        setListLayout : function () {
            if (this.currentAllView) {
                this.listChild.addClass(this.opts.listViewClass);
            } else {
                this.listChild.eq(this.listViewNum - 1).addClass(this.opts.listViewClass).nextAll().removeClass(this.opts.listViewClass);
            }
            this.outCallback('loadAfter');
        },
        scrollMoveFunc : function (target) {
            if (!target.length) return;
            var scrollTop = Math.ceil(target.offset().top),
                winTop = $(win).scrollTop(),
                stickyHeight = PAGE.stickyArea(scrollTop),
                filterHeight = this.filterObjHeight,
                moveTopPosition = scrollTop - stickyHeight,
                moveTop = (!this.filterArea.hasClass(this.opts.filterFixedClass)) ? moveTopPosition : moveTopPosition - filterHeight;
            if (moveTop === winTop) return;
            $('html, body').animate({
                'scrollTop' : moveTop
            }, this.opts.duration);
        },
        outCallback : function (ing) {
            var callbackObj = this.opts[ing];
            if (callbackObj == null) return;
            callbackObj();
        },
        reInit : function () {
            this.resizeFunc();
        }
    };

    //persona plugin
    win.smg.support[personaPluginName] = function (container, args) {
        var defParams = {
            obj : container,
            activeClass : 'is-active',
            objResetBtn : '.s-btn-reset',
            disabledClass : 'is-disabled',
            checkedClass : 'is-checked',
            inputWrap : '.js-chkbox-wrap',
            windowClass : 's-detail-window',
            objInput : '.support-checkbox__input',
            customEvent : '.' + pluginName + (new Date()).getTime(),
            viewType : null,
            resizeStart : null,
            loadAfter : null
        };
        this.opts = UTIL.def(defParams, (args || {}));
        if (!(this.obj = $(this.opts.obj)).length) return;
        this.init();
    };
    win.smg.support[personaPluginName].prototype = {
        init : function () {
            if (UTIL.winSize().w > BREAKPOINTS.MOBILE) {
                this.setElements();
                this.initLayout();
                this.resizeFunc();
                this.bindEvents();
            }
        },
        setElements : function () {
            this.objResetBtn = this.obj.find(this.opts.objResetBtn);
            this.objInput = this.obj.find(this.opts.objInput);
        },
        initLayout : function () {
            this.objResetBtn.toggleClass(this.opts.disabledClass, !this.objInput.prop('checked'));
            this.objResetBtn.prop('disabled', !this.objInput.prop('checked'));
        },
        changeEvents : function (event) {
            var events = [],
                eventNames = event.split(' ');
            for (var key in eventNames) {
                events.push(eventNames[key] + this.opts.customEvent);
            }
            return events.join(' ');
        },
        bindEvents : function () {
            $(win).on(this.changeEvents('resize orientationchange'), $.proxy(this.resizeFunc, this));
        },
        resizeBindEvents : function (type) {
            if (type) {
                this.obj.on(this.changeEvents('focusin mouseenter mouseleave'), $.proxy(this.onHoverFunc, this));
                this.objInput.on(this.changeEvents('change'), $.proxy(this.onChangeFunc, this));
                this.objResetBtn.on(this.changeEvents('click'), $.proxy(this.onResetFunc, this));
            } else {
                this.obj.off(this.changeEvents('focusin mouseenter mouseleave'));
                this.objInput.off(this.changeEvents('change'));
                this.objResetBtn.off(this.changeEvents('click'));
            }
        },
        resizeFunc : function () {
            this.winWidth = UTIL.winSize().w;
            if (this.opts.resizeStart == null) {
                this.opts.resizeStart = this.winWidth;
                this.resizeAnimateFunc();
            }
            win.clearTimeout(this.resizeEndTime);
            this.resizeEndTime = win.setTimeout($.proxy(this.resizeEndFunc, this), 150);
        },
        resizeEndFunc : function () {
            this.opts.resizeStart = null;
            this.resizeControl();
            UTIL.cancelAFrame.call(win, this.resizeRequestFrame);
        },
        resizeAnimateFunc : function () {
            this.resizeControl();
            this.resizeRequestFrame = UTIL.requestAFrame.call(win, $.proxy(this.resizeAnimateFunc, this));
        },
        resizeControl : function () {
            if (!UTIL.isSupportTransform || UTIL.isSupportTransform && (this.winWidth > BREAKPOINTS.MOBILE)) {
                if (this.opts.viewType !== 'pc') {
                    this.opts.viewType = 'pc';
                    this.resizeBindEvents(true);
                }
            } else {
                if (this.opts.viewType !== 'mo') {
                    this.opts.viewType = 'mo';
                    this.resizeBindEvents(false);
                }
            }
        },
        onChangeFunc : function () {
            if (this.objInput.filter(':checked').length) {
                this.objResetBtn.removeClass(this.opts.disabledClass);
                this.objResetBtn.prop('disabled', false);
            } else {
                this.objResetBtn.addClass(this.opts.disabledClass);
                this.objResetBtn.prop('disabled', true);
            }
        },
        onResetFunc : function () {
            this.objInput.prop('checked', false);
            this.objInput.closest(this.opts.inputWrap).removeClass(this.opts.checkedClass);
            this.objResetBtn.addClass(this.opts.disabledClass);
            this.objResetBtn.prop('disabled', true);
            this.obj.triggerHandler('mouseleave');
        },
        onHoverFunc : function (e) {
            var target = $(e.currentTarget);
            if (target.hasClass(this.opts.windowClass)) return;
            if (e.type === 'mouseenter' || e.type === 'focusin') {
                if (!target.hasClass(this.opts.activeClass)) {
                    target.addClass(this.opts.activeClass);
                    this.bindOutsideEvents(target, true);
                }
            } else if (e.type === 'mouseleave' || e.type === 'focusout') {
                if (this.objInput.filter(':checked').length) return;
                this.bindOutsideEvents(target, false);
            }
            this.outCallback('loadAfter');
        },
        bindOutsideEvents : function (target, type) {
            if (type) {
                this.obj.removeClass(this.opts.activeClass);
                target.on('focusoutside', $.proxy(function () {
                    target.triggerHandler('mouseleave');
                }, this));
                target.addClass(this.opts.activeClass);
            } else {
                if (target) {
                    target.removeClass(this.opts.activeClass);
                    target.off('focusoutside');
                }
            }
        },
        outCallback : function (ing) {
            var callbackObj = this.opts[ing];
            if (callbackObj == null) return;
            callbackObj();
        },
    }

    win.smg.support.manualDownloadFilterNewCall = function (args) {
        var defParams = {
            obj : '.manual-download-filter-new'
        };
        this.opts = UTIL.def(defParams, (args || {}));
        if (!(this.obj = $(this.opts.obj)).length) return;
        this.init();
    };
    win.smg.support.manualDownloadFilterNewCall.prototype = UTIL.def({
        init : function () {
            this.callComponent();
            this.globalObjs();
        },
        callComponent : function () {
            this.callPlugins = [];
            for (var i = 0, max = this.obj.length; i < max; i++) {
                this.callPlugins.push(new win.smg.support[pluginName](this.obj.eq(i), {
                    loadAfter : $.proxy(this.globalObjsCall, this)
                }));
            }
        },
        globalObjs : function () {
            for (var i = 0, max = this.callPlugins.length; i < max; i++) {
                CST_EVENT.PAGEIS.PAGEOBJS.push(this.callPlugins[i]);
            }
        },
        globalObjsCall : function () {
            CST_EVENT.PAGEIS.EVENT_MANAGER.trigger(CST_EVENT.PAGEIS.REPOSITION);
        }
    }, UTIL.emitter);
    $(function () {
        win.supportManualDownloadFilterNew = new win.smg.support.manualDownloadFilterNewCall();
    });
})(window, window.jQuery, window.document);