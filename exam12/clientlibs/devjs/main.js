(function (win, $, doc) {
    'use strict';
    
    var defaultEvt = function (container, args) {
        var defParams = {
        	obj : container,
        	activeClass : 'is-active',
        	personaWrap : '.manual-download-filter-new__persona',
        	personaBx : '.manual-download-filter-new__persona-box',
        	personaLink : '.manual-download-filter-new__persona-toggler',
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
        	this.personaLink = this.obj.find(this.opts.personaLink);
        },
        bindEvents : function () {
        	this.personaBx.on('mouseenter focusin mouseleave focusout', $.proxy(this.onHoverFunc, this));
        },
        setLayout : function () {
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
        }
    };
    $.fn.pluginCall = function () {
        for (var i = 0, max = this.length; i < max; i++) {
            new defaultEvt(this.eq(i));
        }
    };
    $(function () {
        $('#content').pluginCall();
        $(win).trigger('resize');
    });
        
})(window, window.jQuery, window.document)