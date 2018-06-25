$(function() {
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
            this.tabCont = this.tabWrap.find('.cast_cont');
            this.tabContChild = this.tabCont.children();
            this.prevBth = this.tabWrap.find('.btn_prev');
            this.nextBth = this.tabWrap.find('.btn_next');
        },
        initLayout : function() {
            this.currentIndex = 0;
            this.oldIndex = this.currentIndex;
            // this.tabMenuChild.removeClass('.active');
            // this.tabMenuChild.eq(0).addClass('.active');
            // this.tabContChild.hide();
            // this.tabContChild.eq(0).show();
            this.setArray();
        },
        setArray : function(){
            //규칙 리셋 = 삭제한 인덱스 초기화
            this.arrayIndex = [];
            for(var i = 0; i < this.tabMenuChild.length; i++){
                this.arrayIndex.push(i);
                // i가 listChild의 갯수보다 작아지면 arrayIndex의 뒤에 i를 추가(리셋)한다.
            };
        },
        bindEvent : function() {
            this.prevBth.on('click', $.proxy(this.btnPrevFunc, this));
            this.nextBth.on('click', $.proxy(this.btnNextFunc, this));
        },
        btnPrevFunc : function() {
            
        },
        btnNextFunc : function() {

        }
    };
    // var slideMenu = {
    //     init : function() {
    //         this.setElements();
    //         this.initLayout();
    //         this.bindEvent();
    //     },
    //     setElements : function() {
    //         this.slideWrap = $('.js-slide-wrap');
    //         this.slideWrap2 = $('.js-slide-wrap2');
    //         this.slideMenu = this.slideWrap.find('.slide_tab ul');
    //         this.slideMenu2 = this.slideWrap2.find('.slide_tab ul');
    //         this.slideMenuChild = this.slideMenu.children();
    //         this.slideMenuChild2 = this.slideMenu2.children();
    //         this.slideCont = this.slideWrap.find('.slide_cont');
    //         this.slideCont2 = this.slideWrap2.find('.slide_cont');
    //         this.slideContChild = this.slideCont.children();
    //         this.slideContChild2 = this.slideCont2.children();
    //         this.prevBth = this.slideWrap.find('.btn_prev');
    //         this.nextBth = this.slideWrap.find('.btn_next');
    //         this.prevBth2 = this.slideWrap2.find('.btn_prev');
    //         this.nextBth2 = this.slideWrap2.find('.btn_next');
    //     },
    //     initLayout : function() {
    //         this.slideMenuChild.removeClass('.active');
    //         this.slideMenuChild2.removeClass('.active');
    //         this.slideMenuChild.eq(0).addClass('.active');
    //         this.slideMenuChild2.eq(0).addClass('.active');
    //         this.slideContChild.hide();
    //         this.slideContChild2.hide();
    //         this.slideContChild.eq(0).show();
    //         this.slideContChild2.eq(0).show();
    //         this.setArray();
    //     },
    //     setArray : function(){
    //         //규칙 리셋 = 삭제한 인덱스 초기화
    //         this.arrayIndex = [];
    //         for(var i = 0; i < this.slideContChild.length; i++){
    //             this.arrayIndex.push(i);
    //             // i가 listChild의 갯수보다 작아지면 arrayIndex의 뒤에 i를 추가(리셋)한다.
    //         };
    //     },
    //     bindEvent : function() {
    //         this.prevBth.on('click', $.proxy(this.btnPrevFunc, this));
    //         this.nextBth.on('click', $.proxy(this.btnNextFunc, this));
    //         this.prevBth2.on('click', $.proxy(this.btnPrevFunc, this));
    //         this.nextBth2.on('click', $.proxy(this.btnNextFunc, this));
    //     },
    //     btnPrevFunc : function() {
            
    //     },
    //     btnNextFunc : function() {

    //     }
    // };
    tabMenu.init();
    // slideMenu.init();
});