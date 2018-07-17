(function (win, $) {
    var obj = function (container, args) {
        var defParams = {
            container : container || '.box',
            activeClass : 'chk_active',
            openClass : 'opened',
            checkBox : '.check_box',
            radioBox : '.radio_box',
            selectBox : '.select_box',
            selectBtn : '.select_menu',
            selectList : 'ul',
            selectTxt : 'li a',
            checkInput : '.ipt_chk',
            radioInput : '.ipt_rdo',
            viewType : null
        };
        this.obj = $(container);
        this.opts = $.extend(defParams, (args || {}));
        this.init();
        // console.log(this);
    };
    obj.prototype = {
        init : function () {
            this.setElements();
            this.initLayout();
            this.bindEvents();
        },
        setElements : function () {
            this.checkWrap = this.obj.find(this.opts.checkBox);
            this.checkInput = this.obj.find(this.opts.checkInput);
            this.radioWrap = this.obj.find(this.opts.radioBox);
            this.radioInput = this.obj.find(this.opts.radioInput);
            this.selectWrap = this.obj.find(this.opts.selectBox);
            this.selectBtn = this.obj.find(this.opts.selectBtn);
            this.selectList = this.obj.find(this.opts.selectList);
            this.selectTxt = this.obj.find(this.opts.selectTxt);
        },
        initLayout : function () {
            this.checkWrap.eq(0).find(this.checkInput).attr('checked', 'checked');
            this.checkWrap.eq(0).addClass(this.opts.activeClass);
            this.radioWrap.eq(0).find(this.radioInput).attr('checked', 'checked');
            this.radioWrap.eq(0).addClass(this.opts.activeClass);
            this.selectWrap.removeClass(this.opts.openClass);
            this.selectList.hide();
        },
        bindEvents : function () {
            this.checkInput.on('change', $.proxy(this.checkEvt, this));
            this.radioInput.on('change', $.proxy(this.radioEvt, this));
            this.selectBtn.on('click', $.proxy(this.selectEvt, this));
            this.selectTxt.on('click', $.proxy(this.selectOpt, this));
        },
        checkEvt : function () {
            if (this.checkWrap.find(this.checkInput).filter(':checked')) {
                this.checkWrap.toggleClass(this.opts.activeClass);
                console.log(this.checkWrap.find(this.checkInput).prop('checked'));
            }
        },
        radioEvt : function () {
            if (this.radioWrap.find(this.radioInput).filter(':checked')) {
                this.radioWrap.toggleClass(this.opts.activeClass);
                console.log(this.radioWrap.eq(0).find(this.radioInput).prop('checked'));
                console.log(this.radioWrap.eq(1).find(this.radioInput).prop('checked'));
            }
        },
        selectEvt : function () {
            this.slideEvt();
            var selectOutsideTime = setTimeout($.proxy(function () {
                this.onSelectOutside(true);
            }, this), 30);
        },
        slideEvt : function () {
            if (this.selectList.is(':visible')) return false;
            this.selectList.stop().slideDown(150);
            this.selectWrap.toggleClass(this.opts.openClass);
        },
        selectOpt :function (e) {
            var targetOpt = e.currentTarget;
            this.targetTxt = targetOpt.text;
            this.selectBtn.text(this.targetTxt);
            this.onSelectOutsideFunc();
        },
        onSelectOutside : function (type) {
            if (type) {
                this.selectList.on('clickoutside', $.proxy(this.onSelectOutsideFunc, this));
            } else {
                this.selectList.off('clickoutside');
                this.selectWrap.removeClass(this.opts.openClass);
            }
        },
        onSelectOutsideFunc : function () {
            this.selectList.hide();
            var selectCloseTime = setTimeout($.proxy(function () {
                this.onSelectOutside(false);
            }, this), 30);
        }
    };
    $.fn.pluginCall = function () {
        for (var i = 0, max = this.length; i < max; i++) {
            new obj(this.eq(i), {viewType : true});
        }
    };

    $(function () {
        // var objCall = new obj('#container');
        // var objCall2 = new obj('.wrap', {
        //     viewType : false
        // });

        $('#container').pluginCall();
        // 
    });

})(window, window.jQuery);

// .인터렉션 : 
// - form, 셀렉트박스 구현
// - form은 checked의 true, false로 체크 (prop)
// - 셀렉트 박스는 outside 추가, 플러그인 제작

// on.('change');
// prop('checked', false);
// toggleClass('.is-checked', true);

// filter(':checked')
// toggleClass('클래스명', 대상.prop('checked'))

// targetText = target.text()
// a.text(targetText)


// select 텍스트 픽해서 넣기/옆에 버튼 상태 세분화?