(function (win, $) {
    var tabMenu = {
        init : function() {
            this.setElements();
            this.initLayout();
            this.bindEvent();
        },
        setElements : function() {
            this.tabWrap = $('.js-tab-wrap');
            this.tabMenu = this.tabWrap.find('.cast_tab ul');
            this.tabMenuChild = this.tabMenu.children();
            this.tabMenuLink = this.tabMenuChild.find('a');
            this.tabCont = this.tabWrap.find('.cast_cont');
            this.tabContChild = this.tabCont.children();
            this.prevBth = this.tabWrap.find('.btn_prev');
            this.nextBth = this.tabWrap.find('.btn_next');
            this.pageCount = this.tabWrap.find('.cast_num .current');
            this.pageMax = this.tabWrap.find('.cast_num .total');
        },
        initLayout : function() {
            this.currentIndex = 0;
            this.oldIndex = this.currentIndex;
            this.filterHash();
            this.tabMenuChild.eq(this.currentIndex).addClass('active');
            this.tabContChild.eq(this.currentIndex).addClass('active');
            this.countIndex();
        },
        bindEvent : function() {
            this.tabMenuLink.on('click', $.proxy(this.btnTabFunc, this));
            this.prevBth.on('click', $.proxy(this.btnPrevFunc, this));
            this.nextBth.on('click', $.proxy(this.btnNextFunc, this));
            $(win).on('hashchange', $.proxy(this.onHashChange, this));
        },
        btnTabFunc : function(e) {
            e.preventDefault();
            var target = $(e.currentTarget);
            var targetIndex = target.parent().index();
            this.currentIndex = targetIndex;
            this.findIndex();
            this.countIndex();
            this.getHashId();
        },
        findIndex : function() {
            this.tabMenuChild.removeClass('active');
            this.tabContChild.removeClass('active');
            this.tabMenuChild.eq(this.currentIndex).addClass('active');
            this.tabContChild.eq(this.currentIndex).addClass('active');
            this.oldIndex = this.currentIndex;
        },
        countIndex : function() {
            this.count = this.currentIndex + 1;
            this.pageCount.text(this.count);
            this.countMax = this.tabMenuChild.length;
            this.pageMax.text(this.countMax);
        },
        btnPrevFunc : function(e) {
            e.preventDefault();
            this.currentIndex = this.currentIndex - 1;
            if (this.currentIndex < 0) {
                this.currentIndex = this.countMax - 1;
            }
            this.findIndex();
            this.countIndex();
            this.getHashId();
        },
        btnNextFunc : function(e) {
            e.preventDefault();
            if (this.currentIndex >= this.countMax - 1) {
                this.currentIndex = 0;
            } else {
                this.currentIndex = this.currentIndex + 1;
            }
            this.findIndex();
            this.countIndex();
            this.getHashId();
        },
        onHashChange : function () {
            this.filterHash();
            this.findIndex();
            this.getHashId();
        },
        filterHash : function () {
            var getHash = win.location.hash;
            var hashTarget = this.tabContChild.filter(getHash);
            this.currentIndex = (hashTarget.length) ? hashTarget.index() : 0;
        },
        getHashId : function () {
            var hashNum = this.tabContChild.eq(this.currentIndex).attr('id');
            win.location.hash = '#' + hashNum;
        }
    };
    var slideMenu = {
        init : function() {
            this.setElements();
            this.initLayout();
            this.bindEvent();
        },
        setElements : function() {
            this.slideWrap = $('.js-slide-wrap');
            this.slideMenu = this.slideWrap.find('.slide_tab ul');
            this.slideMenuChild = this.slideMenu.children();
            this.slideMenuLink = this.slideMenuChild.find('a');
            this.slideCont = this.slideWrap.find('.slide_cont');
            this.slideContChild = this.slideCont.children();
            this.prevBth = this.slideWrap.find('.btn_prev');
            this.nextBth = this.slideWrap.find('.btn_next');
        },
        initLayout : function() {
            this.currentIndex = 0;
            this.oldIndex = this.currentIndex;
            this.slideMenuChild.removeClass('active');
            this.slideContChild.hide();
            this.slideMenuChild.eq(0).addClass('active');
            this.slideContChild.eq(0).show();
            this.countIndex();
        },
        bindEvent : function() {
            this.slideMenuLink.on('click', $.proxy(this.btnDotFunc, this));
            this.prevBth.on('click', $.proxy(this.btnPrevFunc, this));
            this.nextBth.on('click', $.proxy(this.btnNextFunc, this));
        },
        btnDotFunc : function(e) {
            e.preventDefault();
            this.direction = 'next';
            var target = $(e.currentTarget);
            var targetIndex = target.parent().index();
            this.currentIndex = targetIndex;
            this.fadeFunc();
            this.findIndex();
        },
        findIndex : function() {
            this.slideMenuChild.eq(this.oldIndex).removeClass('active');
            this.slideContChild.eq(this.oldIndex).show();
            this.slideMenuChild.eq(this.currentIndex).addClass('active');
            this.slideContChild.eq(this.currentIndex).show();
            this.oldIndex = this.currentIndex;
        },
        countIndex : function() {
            this.countMax = this.slideMenuChild.length;
        },
        btnPrevFunc : function(e) {
            e.preventDefault();
            this.direction = 'prev';
            this.currentIndex = this.currentIndex - 1;
            if (this.currentIndex < 0) {
                this.currentIndex = this.countMax - 1;
            }
            this.slideFunc();
            this.findIndex();
        },
        btnNextFunc : function(e) {
            e.preventDefault();
            this.direction = 'next';
            if (this.currentIndex >= this.countMax - 1) {
                this.currentIndex = 0;
            } else {
                this.currentIndex = this.currentIndex + 1;
            }
            this.slideFunc();
            this.findIndex();
        },
        fadeFunc : function() {
            this.slideContChild.eq(this.oldIndex).css({
                'left' : '0'
            }).stop().fadeOut();
            this.slideContChild.eq(this.currentIndex).css({
                'left' : '0'
            }).stop().fadeIn();
        },
        slideFunc : function() {
            if (this.direction != 'prev') {
                this.slideContChild.eq(this.oldIndex).stop().animate({
                    'left' : '-100%'
                });
                this.slideContChild.eq(this.currentIndex).css({
                    'left' : '100%', 
                    'display' : 'block'
                }).stop().animate({
                    'left' : '0'
                });
            } else {
                this.slideContChild.eq(this.oldIndex).stop().animate({
                    'left' : '100%'
                });
                this.slideContChild.eq(this.currentIndex).css({
                    'left' : '-100%', 
                    'display' : 'block'
                }).stop().animate({
                    'left' : '0'
                });
            }
        }
    };
    $(function () {
        tabMenu.init();
        slideMenu.init();
    });
})(window, window.jQuery);