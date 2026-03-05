/*--------------------------------

使用方式：
<!-- 觸發按鈕 -->
<button data-popup-trigger="popUp_1">產品詳情</button>
<button data-popup-trigger="popUp_cart1">購物車</button>
<button data-popup-trigger="popUp_login">登入</button>
<!-- 對應彈窗 -->
<div id="popUp_1" class="popUpWrap"><div class="popUpWrap__inner">產品內容<span class="close">X</span></div></div>
<div id="popUp_cart1" class="popUpWrap"><div class="popUpWrap__inner">購物車內容<span class="close">X</span></div></div>
<div id="popUp_login" class="popUpWrap"><div class="popUpWrap__inner">登入表單<span class="close">X</span></div></div>

--------------------------------*/

$(document).ready(function () {
    'use strict';

    // 定義彈窗相關的 CSS 選擇器
    var POPUP_SELECTORS = {
        containers: '.popUpWrap',
        popups: '[id^="popUp_"]',
        triggers: '[data-popup-trigger^="popUp_"]',
        closeButtons: '.close, [data-close]'
    };

    // 彈窗觸發器點擊事件處理
    $(document).on('click', POPUP_SELECTORS.triggers, function (e) {
        // 手機版才執行彈窗
        if (window.innerWidth > 768) return true;

        e.preventDefault();
        e.stopPropagation();

        var triggerValue = $(this).attr('data-popup-trigger');
        var $targetPopup = $('#' + triggerValue);

        if ($targetPopup.length === 0 || !$targetPopup.hasClass('popUpWrap')) return false;

        // 如果點擊的是當前已開啟的，不處理
        if ($targetPopup.is(':visible')) return false;

        // 關閉所有現有彈窗（不等待 callback，直接切換）
        $(POPUP_SELECTORS.containers).filter(':visible').fadeOut(200);

        // 顯示目標彈窗
        $targetPopup.fadeIn(300, function() {
            // 使用 initSwiper，確保顯示後才初始化或更新
            if (window.initSwiper) window.initSwiper($(this));
        }).css('display', 'flex');
        $('body').addClass('popup-open');

        // 為可訪問性添加焦點管理
        $targetPopup.attr('tabindex', '-1').focus();

        return false;
    });

    // 遮罩點擊關閉功能
    $(document).on('click', '.js-mask', function (e) {
        closePopup($(this).closest('.popUpWrap'));
    });

    // ESC 鍵關閉彈窗功能
    $(document).on('keydown', function (e) {
        if (e.keyCode === 27 || e.which === 27) {
            closePopup($('.popUpWrap:visible'));
        }
    });

    // 關閉按鈕點擊事件
    $(document).on('click', '.close, [data-close]', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closePopup($(this).closest('.popUpWrap'));
    });

    // 關閉彈窗輔助函式
    function closePopup($el) {
        if (!$el || $el.length === 0) return;
        $el.fadeOut(300, function () {
            if ($('.popUpWrap:visible').length === 0) {
                $('body').removeClass('popup-open');
            }
        });
    }

    // 初始化時隱藏所有彈窗並確保遮罩存在
    $('.popUpWrap').each(function () {
        $(this).hide();
        if ($(this).find('.js-mask').length === 0) {
            $(this).append('<span class="js-mask"></span>');
        }
    });
});