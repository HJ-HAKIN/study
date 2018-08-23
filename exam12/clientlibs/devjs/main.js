(function (win, $, doc) {
    'use strict';
    
    var defaultEvt = function (container, args) {
        var defParams = {
        	obj : container,
        	activeClass : 'is-active',
        	showClass : 'is-show',
            disabledClass : 'is-disabled',
            checkedClass : 'is-checked',
        	personaWrap : '.manual-download-filter-new__persona',
        	personaBx : '.manual-download-filter-new__persona-box',
        	resetBtn : '.s-btn-reset',
        	searchWrap : '.js-inptext-wrap',
        	inpClear : '.support-input__clear',
        	selectWrap : '.js-select-wrap',
        	selectBtn : '.support-select__placeholder',
        	selectTxt : '.js-align-placeholder',
        	selectOpt : '.support-select__options',
        	selectOptLink : '.support-select__options a',
        	manualWrap : '.manual-download-filter-new__module',
        	manualList : '.manual-download-filter-new__content-list li',
            resetBtn : '.s-btn-reset',
            checkWrap : '.js-chkbox-wrap',
            viewType : null,
            resizeStart : null
        };
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
        	this.personaWrap = this.obj.find(this.opts.personaWrap);
        	this.personaBx = this.obj.find(this.opts.personaBx);
        	this.resetBtn = this.obj.find(this.opts.resetBtn);
        	this.searchWrap = this.obj.find(this.opts.searchWrap);
        	this.searchLabel = this.searchWrap.find('label');
        	this.searchInput = this.searchWrap.find('input');
        	this.inpClear = this.obj.find(this.opts.inpClear);
        	this.selectBtn = this.obj.find(this.opts.selectBtn);
        	this.selectTxt = this.obj.find(this.opts.selectTxt);
        	this.selectOpt = this.obj.find(this.opts.selectOpt);
        	this.selectOptLink = this.obj.find(this.opts.selectOptLink);
        	this.manualWrap = this.obj.find(this.opts.manualWrap);
        	this.manualList = this.obj.find(this.opts.manualList);
        	this.checkWrap = this.obj.find(this.opts.checkWrap);
        	this.checkInput = this.checkWrap.find('input');
            this.currentIndex = null;
            this.oldIndex = null;
        },
        bindEvents : function () {
        	this.personaBx.on('mouseenter focusin mouseleave focusout', $.proxy(this.onHoverFunc, this));
        	this.selectBtn.on('click', $.proxy(this.onSelectEvt, this));
            this.selectOptLink.on('click', $.proxy(this.onSelectOpt, this));
            this.searchLabel.on('click', $.proxy(this.searchFunc, this));
            this.searchInput.on('mouseenter focusin', $.proxy(this.searchFunc, this));
            this.checkInput.on('change', $.proxy(this.checkFunc, this));
        },
        setLayout : function () {
        	this.personaBx.removeClass(this.opts.activeClass);
        	this.resetBtn.addClass(this.opts.disabledClass);
        	this.checkWrap.removeClass(this.opts.disabledClass);
        	this.selectOpt.hide();
        	this.manualList.addClass(this.opts.showClass);
        	this.checkWrap.removeClass(this.opts.checkedClass);
        	this.filterWrap.removeClass(this.opts.filterActiveClass);
        	this.filterList.hide();
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
        searchFunc : function (e) {
        	if (e.type === 'mouseenter' || e.type === 'focusin') {
        		this.searchLabel.hide();
        		this.inpClear.show();
        	}
        	// close 버튼 처리, 리셋 기능, 내용이 없을 경우 placeholder 활성화
        },
        checkFunc : function () {
            if (this.checkWrap.find('input').filter(':checked')) {
                this.checkWrap.toggleClass(this.opts.checkedClass);
                console.log(this.checkWrap.prop('checked'));
            }
            // 각각 나누기
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
        	this.currentFunc();
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
            new filterNewList(this.eq(i));
        }
    };
    $(function () {
        $('#content').pluginCall();
        $(win).trigger('resize');
    });
        
})(window, window.jQuery, window.document)