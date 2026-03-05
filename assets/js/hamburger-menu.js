// 通用漢堡選單控制器
(function ($) {
    'use strict';

    // DOM 載入完成後初始化
    $(function () {
        initHamburgerMenu();

        // 視窗大小改變時重新初始化
        $(window).on('resize.hamburger', debounce(function () {
            // console.log('視窗大小改變，重新初始化漢堡選單');
            initHamburgerMenu();
        }, 300));
    });

    // 初始化漢堡選單
    function initHamburgerMenu() {
        // console.log('=== 開始初始化漢堡選單 ===');

        // 查找所有帶有 data-menu-toggle 屬性的按鈕
        const $hamburgers = $('[data-menu-toggle]');

        // console.log('找到漢堡選單按鈕數量:', $hamburgers.length);

        if ($hamburgers.length === 0) {
            // console.warn('沒有找到帶有 data-menu-toggle 屬性的元素');
            return;
        }

        // 移除現有的事件綁定，避免重複綁定
        $hamburgers.off('click.hamburger');

        // 為每個按鈕綁定點擊事件
        $hamburgers.each(function () {
            const $btn = $(this);
            const menuToggle = $btn.attr('data-menu-toggle');
            const menuParent = $btn.attr('data-menu-parent');

            // console.log('初始化按鈕:', {
            //     class: $btn.attr('class'),
            //     menuToggle: menuToggle,
            //     menuParent: menuParent
            // });

            if (!menuToggle) {
                // console.warn('按鈕缺少 data-menu-toggle 屬性');
                return;
            }

            // 綁定點擊事件
            $btn.on('click.hamburger', function (e) {
                e.preventDefault();
                e.stopPropagation();

                handleHamburgerClick($(this));
            });
        });

        // 點擊文檔其他地方時關閉選單
        $(document).off('click.hamburger').on('click.hamburger', function (e) {
            if (!$(e.target).closest('[data-menu-toggle]').length &&
                !$(e.target).closest('[class*="nav"]').length) {
                closeAllMenus();
            }
        });

        // console.log('=== 漢堡選單初始化完成 ===');
    }

    // 處理漢堡選單點擊
    function handleHamburgerClick($button) {
        const menuToggle = $button.attr('data-menu-toggle');
        const menuParent = $button.attr('data-menu-parent');

        // console.log('漢堡選單被點擊:', {
        //     menuToggle: menuToggle,
        //     menuParent: menuParent
        // });

        if (!menuToggle) {
            // console.warn('按鈕缺少 data-menu-toggle 屬性');
            return;
        }

        let $targetMenu = null;

        // 策略1: 如果有 menuParent，先找父容器再找選單
        if (menuParent) {
            const $parentContainer = $button.closest('.' + menuParent);
            if ($parentContainer.length > 0) {
                $targetMenu = $parentContainer.find('.' + menuToggle);
                // console.log(`在父容器 .${menuParent} 中找到 .${menuToggle}:`, $targetMenu.length);
            }
        }

        // 策略2: 如果策略1失敗，直接在文檔中搜尋
        if (!$targetMenu || $targetMenu.length === 0) {
            $targetMenu = $('.' + menuToggle);
            // console.log(`直接搜尋找到 .${menuToggle}:`, $targetMenu.length);

            // 如果找到多個，取第一個
            if ($targetMenu.length > 1) {
                $targetMenu = $targetMenu.first();
                // console.log('找到多個選單，使用第一個');
            }
        }

        // 策略3: 如果還是找不到，嘗試一些常見的選擇器變化
        if (!$targetMenu || $targetMenu.length === 0) {
            const variations = [
                '.' + menuToggle,
                '#' + menuToggle,
                '[data-menu="' + menuToggle + '"]',
                '[data-target="' + menuToggle + '"]'
            ];

            for (let selector of variations) {
                $targetMenu = $(selector);
                if ($targetMenu.length > 0) {
                    // console.log(`通過 ${selector} 找到目標選單:`, $targetMenu.length);
                    break;
                }
            }
        }

        if ($targetMenu && $targetMenu.length > 0) {
            toggleMenu($button, $targetMenu);
        } else {
            // console.error(`找不到目標選單: .${menuToggle}`);
            // 輸出除錯資訊
            // console.log('當前DOM中的相關元素:');
            // $('[class*="nav"], [class*="menu"]').each(function() {
            //     console.log('- 元素:', this.tagName, 'class:', $(this).attr('class'));
            // });
        }
    }

    // 切換選單狀態
    function toggleMenu($button, $menu) {
        const isOpen = $button.hasClass('--isOpen');

        // console.log(`切換選單狀態: ${isOpen ? '關閉' : '開啟'}`);

        if (isOpen) {
            // 關閉選單
            $button.removeClass('--isOpen');
            $menu.removeClass('--isOpen');
            // console.log('選單已關閉');
        } else {
            // 先關閉所有其他選單
            closeAllMenus();

            // 開啟當前選單
            $button.addClass('--isOpen');
            $menu.addClass('--isOpen');
            // console.log('選單已開啟');
        }
    }

    // 關閉所有選單
    function closeAllMenus() {
        $('[data-menu-toggle]').removeClass('--isOpen');
        $('[class*="nav"], [class*="menu"]').removeClass('--isOpen');
        // console.log('所有選單已關閉');
    }

    // 防抖函數
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    $('.navLink').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $this = $(this);
        
        closeAllMenus();
        handleHamburgerClick($this);
    });

})(jQuery);
