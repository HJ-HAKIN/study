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
        filterpluginName = '가',
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
            this.filterModule = this.obj.find(this.opts.filterModule); // Manual & Download 개별 컴포넌트 영역 
            this.personaAnchor = this.obj.find(this.opts.personaAnchor); // User Guide 포함 그룹 컴포넌트 영역
        },
        manualDownloadPluginCall : function () {
            var _this = this;
            for (var i = 0, max = this.filterModule.length; i < max; i++) { // i는 0, 최대값은 filterModule 갯수이며 i가 최대값보다 작으면 1씩 증가한다.
                (function (index) {
                    var target = _this.filterModule.eq(index); // target은 filterModule의 순서 index 값
                    _this.opts.ManualDownloadPlugins.push(new win.smg.support[filterpluginName](target, {
                        loadAfter : $.proxy(_this.loadAfterFunc, _this)
                    })); // ManualDownloadPlugins 배열 끝에 () 괄호 안의 내용을 추가
                })(i);
            }
            for (var i = 0, max = this.personaAnchor.length; i < max; i++) { // i는 0, 최대값은 filterModule 갯수이며 i가 최대값보다 작으면 1씩 증가한다.
                (function (index) {
                    var target = _this.personaAnchor.eq(index);
                    _this.opts.personaAnchorPlugins.push(new win.smg.support[personaPluginName](target));
                })(i); // personaAnchorPlugins 배열 끝에 () 괄호 안의 내용을 추가
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
            for (var i = 0, max = this.opts.ManualDownloadPlugins.length; i < max; i++) { // i는 0, 최대값은 ManualDownloadPlugins 갯수이며 i가 최대값보다 작으면 1씩 증가한다.
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
            var globalText = this.filterObj.data('global-text'); // data-global-text
            this.globalText = {
                Collapse : (globalText && globalText.Collapse) ? $.trim(globalText.Collapse) : '', // 현재 개체에서 선행 공백과 후행 공백을 모두 제거
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
            var stickyWrapClass = this.filterArea.attr('class'), // stickyWrapClass는 filterArea의 class값
                jsStickyWrapClass = 'js-' + stickyWrapClass; // stickyWrapClass 앞에 js- 붙인 것을 jsStickyWrapClass로 명명
            this.filterArea.wrap('<div class="' + jsStickyWrapClass + '"/>'); // filterArea 밖에 div.jsStickyWrapClass 생성
            this.filterObjWrap = this.filterArea.parent(); // filterArea의 부모 요소를 filterObjWrap로 지정
        },
        changeEvents : function (event) {
            var events = [], // events라는 배열 생성
                eventNames = event.split(' '); // event의 문자열을 부분 문자열의 배열로 나눔
            for (var key in eventNames) { // 개체의 각 속성이나 배열의 각 요소에 대해 하나 이상의 문을 실행
                events.push(eventNames[key] + this.opts.customEvent);
            }
            return events.join(' '); // events의 배열의 모든 요소를 연결해 하나의 문자열로 만듦
        },
        bindEvents : function () {
            $(win).on(this.changeEvents('resize orientationchange'), $.proxy(this.resizeFunc, this)); // resize, orientationchange의 changeEvents가 있으면 resizeFunc를 실행
            this.filterToggler.on(this.changeEvents('click'), $.proxy(this.filterToggleFunc, this)); // filterToggler를 click하면 filterToggleFunc를 실행
            this.listToggleBtn.on(this.changeEvents('click'), $.proxy(this.listToggleFunc, this)); // listToggleBtn을 click하면 listToggleFunc를 실행
            this.listWrap.on(this.changeEvents('ajaxafter'), $.proxy(this.listAjaxAfter, this)); // listWrap에 ajaxafter의 changeEvents가 있으면 listAjaxAfter를 실행
        },
        bindResponsiveEvents : function (type) { // 반응형 이벤트
            if (type) { // bindResponsiveEvents이 true 일 때 = PC
                $(win).off(this.changeEvents('scroll')); // scroll 이벤트 끄기
                this.filterMoToggler.off(this.changeEvents('click')); // filterMoToggler click 이벤트 끄기
            } else { // bindResponsiveEvents이 false 일 때 = MO
                $(win).on(this.changeEvents('scroll'), $.proxy(this.scrollFunc, this)); // scroll 이벤트 켜기 = scroll 하면 scrollFunc 실행
                this.filterMoToggler.on(this.changeEvents('click'), $.proxy(this.filterMoClickFunc, this)); // filterMoToggler click 이벤트 켜기 = click 하면 filterMoClickFunc 실행
            }
        },
        resizeFunc : function () {
            this.winWidth = UTIL.winSize().w; // window width
            if (this.opts.resizeStart == null) { // resizeStart의 값이 없을 때
                this.opts.resizeStart = this.winWidth; // resizeStart를 winWidth로 지정
                this.resizeAnimateFunc(); // resizeAnimateFunc 실행
            }
            win.clearTimeout(this.resizeEndTime); // setTimeout () 메서드로 설정된 타이머를 지움
            this.resizeEndTime = win.setTimeout($.proxy(this.resizeEndFunc, this), 150); // 0.15초 후에 resizeEndFunc를 실행
        },
        resizeEndFunc : function () {
            this.opts.resizeStart = null;
            this.setLayout();
            if (UTIL.winSize().w <= BREAKPOINTS.MOBILE) { // 윈도우 가로 사이즈가 모바일 분기 지정 사이즈보다 작거나 같을 때 아래 함수 실행
                this.createHeightFunc();
                this.fixedObjFunc();
                this.setFilterRange();
            }
            UTIL.cancelAFrame.call(win, this.resizeRequestFrame); // cancelAFrame에서 resizeRequestFrame을 호출
        },
        resizeAnimateFunc : function () {
            this.setLayout();
            if (UTIL.winSize().w <= BREAKPOINTS.MOBILE) { // 윈도우 가로 사이즈가 모바일 분기 지정 사이즈보다 작거나 같을 때 아래 함수 실행
                this.createHeightFunc();
                this.fixedObjFunc();
                this.setFilterRange();
            }
            this.resizeRequestFrame = UTIL.requestAFrame.call(win, $.proxy(this.resizeAnimateFunc, this)); // requestAFrame에서 resizeAnimateFunc을 호출한 것을 resizeRequestFrame으로 명명
        },
        setLayout : function () {
            if (!UTIL.isSupportTransform) {
                if (this.opts.viewType != 'pc') { // viewType이 pc로 지정되어 있지 않으면
                    this.opts.viewType = 'pc'; // viewType을 pc로 명시
                    this.setPcLayout();
                }
            } else {
                if (UTIL.winSize().w > BREAKPOINTS.MOBILE) { // 윈도우 가로 사이즈가 모바일 분기 지정 사이즈보다 클 때 아래 함수 실행
                    if (this.opts.viewType != 'pc') { // viewType이 pc로 지정되어 있지 않으면
                        this.opts.viewType = 'pc'; // viewType을 pc로 명시
                        this.setPcLayout();
                        this.bindResponsiveEvents(true); // 반응형 이벤트 true = PC
                    }
                } else { // 윈도우 가로 사이즈가 모바일 분기 지정 사이즈보다 작거나 같으면 아래 함수 실행
                    if (this.opts.viewType != 'mo') { // viewType이 mo로 지정되어 있지 않으면
                        this.opts.viewType = 'mo'; // viewType을 mo로 명시
                        this.setMoLayout();
                        this.bindResponsiveEvents(false); // 반응형 이벤트 false = MO
                    }
                }
            }
        },
        setPcLayout : function () { // 기본 pc 세팅
            this.scrollLock.init.call(this, false);
            this.bindOutsideEvents(false);
            this.filterMoToggler.attr(this.opts.accessData.accessAria, false);
            this.filterObjWrap.css('height', ''); // filterObjWrap의 height 값 리셋
            this.filterArea.show().css('top', ''); // filterArea 노출하고 top 값 리셋
            this.filterArea.removeClass(this.opts.filterFixedClass); // filterArea에서 filterFixedClass에 해당하는 class를 제거
            this.filterArea.removeClass(this.opts.filterToggleClass); // filterArea에서 filterToggleClass에 해당하는 class를 제거
        },
        setMoLayout : function () { // 기본 mo 세팅
            this.filterArea.removeClass(this.opts.filterFixedClass); // filterArea에서 filterFixedClass에 해당하는 class를 제거
            this.filterArea.removeClass(this.opts.filterToggleClass); // filterArea에서 filterToggleClass에 해당하는 class를 제거
        },
        scrollFunc : function () {
            this.fixedObjFunc();
            this.setFilterRange();
        },
        createHeightFunc : function () {
            if (!UTIL.isSupportTransform) { // isSupportTransform이 아니면
                this.filterObjWrap.css('height', '');
                this.filterArea.css('top', '');
            } else { // 맞으면
                if (UTIL.winSize().w > BREAKPOINTS.MOBILE) { // 윈도우 가로 사이즈가 모바일 분기 지정 사이즈보다 클 때 아래 함수 실행
                    this.filterObjWrap.css('height', '');
                    this.filterArea.css('top', '');
                } else { // 그 외의 경우
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
            
            if (scrollTop >= filterEndRange) { // scrollTop이 filterEndRange보다 크거나 같으면
                this.filterArea.hide(); // filterArea 숨기기
            } else { // 아니면
                this.filterArea.show(); // filterArea 보이기
            }
        },
        setPosition : function () {
            if (this.opts.viewType === 'pc') { // viewType이 pc일 때
                this.filterArea.css('top', ''); // filterArea의 top 값을 리셋
            } else { // 아니면
                if (this.filterArea.hasClass(this.opts.filterFixedClass)) { // filterArea에 filterFixedClass가 있으면
                    this.filterArea.css('top', this.filterObjPosition); // filterArea의 top 값을 filterObjPosition으로
                } else { // 아니면
                    this.filterArea.css('top', ''); // filterArea의 top 값을 리셋
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
            if (type) { // bindOutsideEvents가 true일 때
                this.filterLayerArea.on('clickoutside touchendoutside', $.proxy(this.onLayerOutsideFunc, this));
            } else { // false일 때
                this.filterLayerArea.off('clickoutside touchendoutside');
            }
        },
        onLayerOutsideFunc : function (e) {
            e.preventDefault(); // 이벤트 스크롤 튀는 현상 막기
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
            e.preventDefault(); // 이벤트 스크롤 튀는 현상 막기
            this.filterViewFunc(e);
            this.accessbilityFunc(true);
        },
        filterViewFunc : function (e) {
            var target = $(e.currentTarget); // 지금 선택된 타겟
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
            if (!UTIL.isSupportTransform || (UTIL.isSupportTransform && this.winWidth > BREAKPOINTS.MOBILE)) { // isSupportTransform이 아니거나 isSupportTransform에 winWidth가 모바일 분기보다 클 때
                this.outCallback('loadAfter');
            }
        },
        accessbilityFunc : function (type) {
            if (type) { // accessbilityFunc = true
                var currentAccessType = !this.filterToggler.data(this.opts.accessData.dataActive),
                    globalTxt = (currentAccessType) ? this.globalText.Expand : this.globalText.Collapse;
                this.filterToggler.data(this.opts.accessData.dataActive, currentAccessType);
                this.filterToggler.find(this.opts.accessText).text(globalTxt);
            } else { // accessbilityFunc = false
                this.listToggleBtn.toggleClass(this.opts.icoUpClass, this.currentAllView);
                this.listToggleBtn.toggleClass(this.opts.icoDownClass, !this.currentAllView);
                this.listToggleBtn.text(this.currentAllView ? this.globalText.showLess : this.globalText.showMore);
            }
        },
        initListView : function () {
            this.currentAllView = false;
            if (this.listNum <= this.listViewNum) { // listNum이 listViewNum보다 작거나 같으면
                this.listBtnArea.hide(); // listBtnArea 숨기기
            } else { // 아니면
                this.listBtnArea.show(); // listBtnArea 보이기
            }
            for (var i = 0, max = this.listNum; i < max; i++) { // i는 0, 최대값은 listNum 갯수이며 i가 최대값보다 작으면 1씩 증가한다.
                var contChildTarget = this.listChild.eq(i); // contChildTarget는 listChild의 인덱스 i 순서
                if (i < this.listViewNum) { // 만약 i가 listViewNum보다 작으면
                    contChildTarget.addClass(this.opts.listViewClass); // contChildTarget에 listViewClass 추가
                } else { // 아니면
                    contChildTarget.removeClass(this.opts.listViewClass); // contChildTarget에 listViewClass 제거
                }
            }
            this.listToggleBtn.toggleClass(this.opts.icoUpClass, this.currentAllView); // currentAllView라면 listToggleBtn에 icoUpClass를 toggle
            this.listToggleBtn.toggleClass(this.opts.icoDownClass, !this.currentAllView); // currentAllView가 아니라면 listToggleBtn에 icoDownClass를 toggle
            this.accessbilityFunc(false);
            this.outCallback('loadAfter');
        },
        listToggleFunc : function (e) {
            e.preventDefault(); // 이벤트 스크롤 튀는 현상 막기
            this.currentAllView = !this.currentAllView; // currentAllView는 currentAllView가 아님
            this.setListLayout();
            this.scrollMoveFunc(this.listWrap);
            this.accessbilityFunc(false);
        },
        listAjaxAfter : function () {
            this.listChild = this.listParent.children(); // listParent의 자식요소
            this.listNum = this.listParent.children().length; // listParent의 자식요소의 갯수
            this.initListView();
        },
        setListLayout : function () {
            if (this.currentAllView) { // currentAllView 일 때
                this.listChild.addClass(this.opts.listViewClass); // listChild에 listViewClass 추가
            } else { // 아니면
                this.listChild.eq(this.listViewNum - 1).addClass(this.opts.listViewClass).nextAll().removeClass(this.opts.listViewClass); // listChild 중 listViewNum - 1인 순서의 요소에 listViewClass 추가하고 선택한 요소 다음의 모든 형제 요소에 listViewClass를 제거
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
            if (UTIL.winSize().w > BREAKPOINTS.MOBILE) { // 윈도우 가로 사이즈가 모바일 분기 지정 사이즈보다 클 때 아래 함수 실행
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
            this.objResetBtn.toggleClass(this.opts.disabledClass, !this.objInput.prop('checked')); // objInput이 checked 되지 않으면 objResetBtn에 disabledClass를 toggle
            this.objResetBtn.prop('disabled', !this.objInput.prop('checked')); // objInput이 checked 되지 않으면 objResetBtn는 disabled 상태
        },
        changeEvents : function (event) {
            var events = [], // events라는 배열 생성
                eventNames = event.split(' '); // event의 문자열을 부분 문자열의 배열로 나눔
            for (var key in eventNames) { // 개체의 각 속성이나 배열의 각 요소에 대해 하나 이상의 문을 실행
                events.push(eventNames[key] + this.opts.customEvent);
            }
            return events.join(' '); // events의 배열의 모든 요소를 연결해 하나의 문자열로 만듦
        },
        bindEvents : function () {
            $(win).on(this.changeEvents('resize orientationchange'), $.proxy(this.resizeFunc, this)); // resize, orientationchange의 changeEvents가 있으면 resizeFunc를 실행
        },
        resizeBindEvents : function (type) {
            if (type) { // resizeBindEvents = true
                this.obj.on(this.changeEvents('focusin mouseenter mouseleave'), $.proxy(this.onHoverFunc, this)); // obj에 focusin, mouseenter, mouseleave 이벤트 onHoverFunc 지정
                this.objInput.on(this.changeEvents('change'), $.proxy(this.onChangeFunc, this)); // objInput의 상태 변화 시 onChangeFunc 실행
                this.objResetBtn.on(this.changeEvents('click'), $.proxy(this.onResetFunc, this)); // objResetBtn를 click하면 onResetFunc 실행
            } else { // resizeBindEvents = false
                this.obj.off(this.changeEvents('focusin mouseenter mouseleave')); // obj에 focusin, mouseenter, mouseleave 이벤트를 끄기
                this.objInput.off(this.changeEvents('change')); // objInput의 상태 변화 이벤트 끄기
                this.objResetBtn.off(this.changeEvents('click')); // objResetBtn를 click 이벤트 끄기
            }
        },
        resizeFunc : function () {
            this.winWidth = UTIL.winSize().w; // window width
            if (this.opts.resizeStart == null) { // resizeStart의 값이 없을 때
                this.opts.resizeStart = this.winWidth; // resizeStart를 winWidth로 지정
                this.resizeAnimateFunc(); // resizeAnimateFunc 실행
            }
            win.clearTimeout(this.resizeEndTime); // setTimeout () 메서드로 설정된 타이머를 지움
            this.resizeEndTime = win.setTimeout($.proxy(this.resizeEndFunc, this), 150); // 0.15초 후에 resizeEndFunc를 실행
        },
        resizeEndFunc : function () {
            this.opts.resizeStart = null; // resizeStart를 비
            this.resizeControl();
            UTIL.cancelAFrame.call(win, this.resizeRequestFrame); // cancelAFrame에 resizeRequestFrame를 저장
        },
        resizeAnimateFunc : function () {
            this.resizeControl();
            this.resizeRequestFrame = UTIL.requestAFrame.call(win, $.proxy(this.resizeAnimateFunc, this)); // requestAFrame에 호출한 resizeAnimateFunc를 resizeRequestFrame에 저장
        },
        resizeControl : function () {
            if (!UTIL.isSupportTransform || UTIL.isSupportTransform && (this.winWidth > BREAKPOINTS.MOBILE)) { // isSupportTransform이 아니거나 isSupportTransform에 winWidth가 모바일 분기보다 클 때
                if (this.opts.viewType !== 'pc') { // viewType이 pc가 아닐 때
                    this.opts.viewType = 'pc'; // viewType을 pc로 지정
                    this.resizeBindEvents(true); // resizeBindEvents = true 실행
                }
            } else { // 그렇지 않으면
                if (this.opts.viewType !== 'mo') { // viewType이 mo가 아닐 때
                    this.opts.viewType = 'mo'; // viewType을 mo로 지정
                    this.resizeBindEvents(false); // resizeBindEvents = false 실행
                }
            }
        },
        onChangeFunc : function () {
            if (this.objInput.filter(':checked').length) { // objInput 중 checked 상태인 요소의 갯수를 반환
                this.objResetBtn.removeClass(this.opts.disabledClass); // objResetBtn에 disabledClass 제거
                this.objResetBtn.prop('disabled', false); // objResetBtn의 disabled 상태 해제
            } else { // 아닐 경우
                this.objResetBtn.addClass(this.opts.disabledClass); // objResetBtn에 disabledClass 추가
                this.objResetBtn.prop('disabled', true); // objResetBtn의 disabled 상태 추가
            }
        },
        onResetFunc : function () {
            this.objInput.prop('checked', false); // objInput의 checked 상태를 해제
            this.objInput.closest(this.opts.inputWrap).removeClass(this.opts.checkedClass); // objInput에서 가장 가까운 inputWrap에서 checkedClass를 제거
            this.objResetBtn.addClass(this.opts.disabledClass); // objResetBtn에 disabledClass 추가
            this.objResetBtn.prop('disabled', true); // objResetBtn을 disabled 상태로 변경
            this.obj.triggerHandler('mouseleave'); // 마우스 오버를 잃었을 때 지정된 이벤트 trigger
        },
        onHoverFunc : function (e) {
            var target = $(e.currentTarget); // 지금 선택된 타겟
            if (target.hasClass(this.opts.windowClass)) return; // target에 windowClass가 있으면 발생
            if (e.type === 'mouseenter' || e.type === 'focusin') { // obj에 마우스를 올리거나, 포커스가 갔을 때
                if (!target.hasClass(this.opts.activeClass)) { // target이 activeClass를 가지고 있지 않으면
                    target.addClass(this.opts.activeClass); // target에 activeClass를 넣
                    this.bindOutsideEvents(target, true); // target 기준으로 bindOutsideEvents를 true 상태로 실행
                }
            } else if (e.type === 'mouseleave' || e.type === 'focusout') { // obj에서 마우스를 내리거나, 포커스가 나갔을 때
                if (this.objInput.filter(':checked').length) return; // objInput이 checked된 갯수를 return
                this.bindOutsideEvents(target, false); // target 기준으로 bindOutsideEvents를 false 상태로 실행
            }
            this.outCallback('loadAfter');
        },
        bindOutsideEvents : function (target, type) {
            if (type) { // bindOutsideEvents = true
                this.obj.removeClass(this.opts.activeClass); // obj에서 activeClass를 제거
                target.on('focusoutside', $.proxy(function () { // focus 잃을 때 이벤트 발생
                    target.triggerHandler('mouseleave'); // 마우스 오버를 잃었을 때 지정된 이벤트 trigger
                }, this));
                target.addClass(this.opts.activeClass); // target에 activeClass를 추가
            } else { // bindOutsideEvents = false
                if (target) {
                    target.removeClass(this.opts.activeClass); // target에서 activeClass를 제거
                    target.off('focusoutside'); // focus 잃을 때 이벤트 끄기
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
            for (var i = 0, max = this.obj.length; i < max; i++) { // i는 0, 최대값은 obj 갯수이며 i가 최대값보다 작으면 1씩 증가한다.
                this.callPlugins.push(new win.smg.support[pluginName](this.obj.eq(i), { // 새로운 요소를 배열의 끝에 추가
                    loadAfter : $.proxy(this.globalObjsCall, this)
                }));
            }
        },
        globalObjs : function () {
            for (var i = 0, max = this.callPlugins.length; i < max; i++) { // i는 0, 최대값은 callPlugins 갯수이며 i가 최대값보다 작으면 1씩 증가한다.
                CST_EVENT.PAGEIS.PAGEOBJS.push(this.callPlugins[i]); // 새로운 요소를 배열의 끝에 추가
            }
        },
        globalObjsCall : function () {
            CST_EVENT.PAGEIS.EVENT_MANAGER.trigger(CST_EVENT.PAGEIS.REPOSITION); // 선택된 요소에 대해 지정된 이벤트와 이벤트의 기본 동작을 trigger
        }
    }, UTIL.emitter);
    $(function () {
        win.supportManualDownloadFilterNew = new win.smg.support.manualDownloadFilterNewCall();
    });
})(window, window.jQuery, window.document);