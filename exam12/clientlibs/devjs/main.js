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
    filterPersona.prototype = {
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
        	showClass : 'is-show',
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
        	this.personaWrap = this.obj.find(this.opts.personaWrap);
        	this.personaBx = this.obj.find(this.opts.personaBx);
        	this.checkWrap = this.personaWrap.find(this.opts.checkWrap);
        	this.checkInput = this.checkWrap.find('input');
        	this.resetBtn = this.obj.find(this.opts.resetBtn);
        },
        bindEvents : function () {
        	this.personaBx.on('mouseenter focusin mouseleave focusout', $.proxy(this.onHoverFunc, this));
            this.checkInput.on('change', $.proxy(this.checkFunc, this));
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
        		target.removeClass(this.opts.activeClass);
    		}
    		// 선택 시 고정/리셋 버튼 활성화 추가
        },
        checkFunc : function () {
            if (this.checkWrap.find('input').filter(':checked')) {
                this.checkWrap.toggleClass(this.opts.checkedClass);
                console.log(this.checkWrap.prop('checked'));
            }
            // 각각 나누기
        }
    };

    var filterSearch = function (container, args) {
        var defParams = {
        	obj : container,
        	searchWrap : '.js-inptext-wrap',
        	inpClear : '.support-input__clear',
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
        	this.searchWrap = this.obj.find(this.opts.searchWrap);
        	this.searchLabel = this.searchWrap.find('label');
        	this.searchInput = this.searchWrap.find('input');
        	this.inpClear = this.obj.find(this.opts.inpClear);
        	this.selectBtn = this.obj.find(this.opts.selectBtn);
        	this.selectTxt = this.obj.find(this.opts.selectTxt);
        	this.selectOpt = this.obj.find(this.opts.selectOpt);
        	this.selectOptLink = this.obj.find(this.opts.selectOptLink);
        },
        bindEvents : function () {
        	this.selectBtn.on('click', $.proxy(this.onSelectEvt, this));
            this.selectOptLink.on('click', $.proxy(this.onSelectOpt, this));
            this.searchLabel.on('click', $.proxy(this.searchFunc, this));
            this.searchInput.on('mouseenter focusin', $.proxy(this.searchFunc, this));
        },
        setLayout : function () {
        	this.selectOpt.hide();
        },
        searchFunc : function (e) {
        	if (e.type === 'mouseenter' || e.type === 'focusin') {
        		this.searchLabel.hide();
        		this.inpClear.show();
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
            filterWrap : '.manual-download-filter-new__list',
            filterBtn : '.manual-download-filter-new__list-title',
            filterList : '.manual-download-filter-new__list-items',
            checkWrap : '.js-chkbox-wrap',
            checkedClass : 'is-checked'
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
        	this.filterWrap = this.obj.find(this.opts.filterWrap);
        	this.filterBtn = this.filterWrap.find(this.opts.filterBtn);
        	this.filterList = this.filterWrap.find(this.opts.filterList);
        	this.checkWrap = this.filterWrap.find(this.opts.checkWrap);
        	this.checkInput = this.checkWrap.find('input');
        },
        bindEvents : function () {
            this.filterBtn.on('click', $.proxy(this.filterFunc, this));
            this.checkInput.on('change', $.proxy(this.checkFunc, this));
        },
        setLayout : function () {
        	this.filterWrap.removeClass(this.opts.filterActiveClass);
        	this.filterList.hide();
        	this.checkWrap.removeClass(this.opts.checkedClass);
        },
        filterFunc : function (e) {
        	e.preventDefault();
        	var target = $(e.currentTarget);
        	this.currentIndex = target.parent().index();
        	this.slideFunc();
        	console.log(target);
        	console.log(target.parent());
        	console.log(target.parent().index());
        	console.log(this.currentIndex);
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
                console.log(this.checkWrap.prop('checked'));
            }
            // 각각 나누기
        }
    };

    $.fn.pluginCall = function () {
        for (var i = 0, max = this.length; i < max; i++) {
            // new defaultEvt(this.eq(i));
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