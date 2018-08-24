(function (win, $, doc) {
    'use strict';

    var defaultEvt = function (container, args) {
        var defParams = {
        	obj : container,
        	viewType : null
        }
        this.obj = $('#content');
        this.opts = $.extend(defParams, {});
        this.init();
    };
    defaultEvt.prototype = {
        init : function () {
            this.setElements();
            this.bindEvents();
            this.setLayout();
        },
        setElements : function () {
        	// resize ?
        },
        bindEvents : function () {
        },
        setLayout : function () {
        }
    };
    
    var filterPersona = function (container, args) {
        var defParams = {
        	obj : container,
        	activeClass : 'is-active',
            disabledClass : 'is-disabled',
            checkedClass : 'is-checked',
        	personaWrap : '.manual-download-filter-new__persona',
        	personaBx : '.manual-download-filter-new__persona-box',
            checkWrap : '.js-chkbox-wrap',
        	resetBtn : '.s-btn-reset'
        };
        this.obj = $('#content');
        this.opts = $.extend(defParams, {});
        this.init();
    };
    filterPersona.prototype = {
        init : function () {
            this.setElements();
            this.bindEvents();
            this.setLayout();
        },
        setElements : function () {
        	this.personaWrap = $(this.opts.personaWrap);
        	this.personaBx = this.obj.find(this.opts.personaBx);
        	this.checkWrap = this.personaWrap.find(this.opts.checkWrap);
        	this.checkInput = this.checkWrap.find('input');
        	this.resetBtn = this.obj.find(this.opts.resetBtn);
        },
        bindEvents : function () {
        	this.personaBx.on('mouseenter focusin mouseleave focusout', $.proxy(this.onHoverFunc, this));
            this.checkInput.on('change', $.proxy(this.checkFunc, this));
            this.resetBtn.on('click', $.proxy(this.resetBtnFunc, this));
        },
        setLayout : function () {
        	this.personaBx.removeClass(this.opts.activeClass);
        	this.resetBtn.addClass(this.opts.disabledClass);
        },
        onHoverFunc : function (e) {
        	var target = $(e.currentTarget);
    		if (e.type === 'mouseenter' || e.type === 'focusin') {
    			if (!target.hasClass(this.opts.activeClass)) {
	    			target.addClass(this.opts.activeClass);
	    		}
    		} else if (e.type === 'mouseleave' || e.type === 'focusout') {
    			if (this.checkWrap.hasClass(this.opts.checkedClass)) {
    				target.addClass(this.opts.activeClass);
    			} else {
        			target.removeClass(this.opts.activeClass);
    			}
    		}
        },
        checkFunc : function () {
            if (this.checkWrap.find('input').filter(':checked')) {
            	this.personaBx.addClass(this.opts.activeClass);
                this.checkWrap.addClass(this.opts.checkedClass);
            }
            // 각각 나누기
            this.resetCheckFunc();
        },
        resetBtnFunc : function () {
        	this.checkWrap.removeClass(this.opts.checkedClass);
        	this.resetBtn.addClass(this.opts.disabledClass);
        },
        resetCheckFunc : function () {
        	if (this.checkWrap.hasClass(this.opts.checkedClass)) {
        		this.personaBx.addClass(this.opts.activeClass);
        		this.resetBtn.removeClass(this.opts.disabledClass);
        	}
        }
    };

    var filterSearch = function (container, args) {
        var defParams = {
        	obj : container,
        	searchWrap : '.js-inptext-wrap',
        	btnClear : '.support-input__clear',
        	selectWrap : '.js-select-wrap',
        	selectBtn : '.support-select__placeholder',
        	selectTxt : '.js-align-placeholder',
        	selectOpt : '.support-select__options',
        	selectOptLink : '.support-select__options a'
        };
        this.obj = $('#content');
        this.opts = $.extend(defParams, {});
        this.init();
    };
    filterSearch.prototype = {
        init : function () {
            this.setElements();
            this.bindEvents();
            this.setLayout();
        },
        setElements : function () {
        	this.searchWrap = $(this.opts.searchWrap);
        	this.searchLabel = this.searchWrap.find('label');
        	this.searchInput = this.searchWrap.find('input');
        	this.btnClear = this.obj.find(this.opts.btnClear);
        	this.selectBtn = this.obj.find(this.opts.selectBtn);
        	this.selectTxt = this.obj.find(this.opts.selectTxt);
        	this.selectOpt = this.obj.find(this.opts.selectOpt);
        	this.selectOptLink = this.obj.find(this.opts.selectOptLink);
        },
        bindEvents : function () {
        	this.selectBtn.on('click', $.proxy(this.onSelectEvt, this));
            this.selectOptLink.on('click', $.proxy(this.onSelectOpt, this));
            this.searchLabel.on('click', $.proxy(this.searchFunc, this));
            this.searchInput.on('mouseenter focusin change', $.proxy(this.searchFunc, this));
        },
        setLayout : function () {
        	this.selectOpt.hide();
        },
        searchFunc : function (e) {
        	if (e.type === 'mouseenter' || e.type === 'focusin') {
        		this.searchLabel.hide();
        	} else if (e.type === 'change') {
        		this.searchLabel.hide();
        		this.btnClear.show();
        	}
        	// close 버튼 처리, 리셋 기능, 내용이 없을 경우 placeholder 활성화
        },
        onSelectEvt : function () {
        	this.selectOpt.show();
            var selectOutsideTime = setTimeout($.proxy(function () {
                this.onSelectOutside(true);
            }, this), 30);
        },
        onSelectOpt :function (e) {
            var targetOpt = e.currentTarget;
            this.targetTxt = targetOpt.text;
            this.selectTxt.text(this.targetTxt);
            this.onSelectOutsideFunc();
        },
        onSelectOutside : function (type) {
            if (type) {
                this.selectOpt.on('clickoutside', $.proxy(this.onSelectOutsideFunc, this));
            } else {
                this.selectOpt.off('clickoutside');
            }
        },
        onSelectOutsideFunc : function () {
            this.selectOpt.hide();
            var selectCloseTime = setTimeout($.proxy(function () {
                this.onSelectOutside(false);
            }, this), 30);
        }
    };

    var filterNewList = function (container, args) {
        var defParams = {
        	obj : container,
            filterActiveClass : 'filter-active',
            checkedClass : 'is-checked',
        	showClass : 'is-show',
            filterWrap : '.manual-download-filter-new__list',
            filterBtn : '.manual-download-filter-new__list-title',
            filterList : '.manual-download-filter-new__list-items',
            checkWrap : '.js-chkbox-wrap',
            manualWrap : '.manual-download-filter-new__module',
            manualList : '.manual-download-filter-new__content-list li'
        };
        this.obj = $('#content');
        this.opts = $.extend(defParams, {});
        this.init();
    };
    filterNewList.prototype = {
        init : function () {
            this.setElements();
            this.bindEvents();
            this.setLayout();
        },
        setElements : function () {
        	this.filterWrap = $(this.opts.filterWrap);
        	this.filterBtn = this.obj.find(this.opts.filterBtn);
        	this.filterList = this.obj.find(this.opts.filterList);
        	this.checkWrap = this.obj.find(this.opts.checkWrap);
        	this.checkInput = this.checkWrap.find('input');
        	this.manualWrap = this.obj.find(this.opts.manualWrap);
        	this.manualList = this.obj.find(this.opts.manualList);
        },
        bindEvents : function () {
            this.filterBtn.on('click', $.proxy(this.filterFunc, this));
            this.checkInput.on('change', $.proxy(this.checkFunc, this));
        },
        setLayout : function () {
        	this.filterWrap.removeClass(this.opts.filterActiveClass);
        	this.filterList.hide();
        	this.checkWrap.removeClass(this.opts.checkedClass);
        	this.manualList.addClass(this.opts.showClass);
        },
        filterFunc : function (e) {
        	e.preventDefault();
        	var target = $(e.currentTarget);
        	this.currentIndex = target.parent().index();
        	this.slideFunc();
        },
        slideFunc : function () {
    		this.filterWrap.eq(this.currentIndex).toggleClass(this.opts.filterActiveClass);
    		this.filterList.eq(this.currentIndex).slideToggle();
            // 각각 나누기
        },
        checkFunc : function (e) {
        	var target = $(e.currentTarget);
        	this.currentIndex = target.parent().index();
            if (this.checkWrap.find('input').filter(':checked')) {
                this.checkWrap.toggleClass(this.opts.checkedClass);
            }
            // 각각 나누기
        }
    };

    $.fn.pluginCall = function () {
        for (var i = 0, max = this.length; i < max; i++) {
            new defaultEvt(this.eq(i));
            new filterSearch(this.eq(i));
            new filterPersona(this.eq(i));
            new filterNewList(this.eq(i));
        }
    };
    $(function () {
        $('#content').pluginCall();
        $(win).trigger('resize');
    });
        
})(window, window.jQuery, window.document)