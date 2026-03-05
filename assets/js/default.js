
document.addEventListener('DOMContentLoaded', () => {
  // 移除淡入效果
  document.body.classList.remove('page-fade');
  initializeScrollApp();
  // 初始化 Intersection Observer
  initIntersectionObserver();
});


// 定義全域選擇器常數（避免與 header.js 衝突）
const INDEX_SELECTORS = {
  navbar: '.navbar', //<header>
  body: 'body'
};

// 快取常用的 jQuery 物件
const $window = $(window);
const $document = $(document);
const $navbar = $(INDEX_SELECTORS.navbar);
const $body = $(INDEX_SELECTORS.body);

$document.ready(function () {
  onResizeFunction();
  // $window.on('resize', onResizeFunction);
  $window.on('scroll', onScrollFunction);
});

function onResizeFunction() {
  // 處理視窗尺寸變更時的邏輯
  adjustHeaderHeight();
}

function onScrollFunction(e) {
  adjustHeaderHeight();
  // handleMenubarBackground();
}

//!====依header高度變動時自動調節高度
function adjustHeaderHeight() {
  var scrollTop = $window.scrollTop();
  var headerH = $navbar.innerHeight();

  if (scrollTop > 250) {
    //表頭fixed
    $navbar.addClass('navbar--fixed');
  } else {
    $navbar.is('.navbar--fixed') && $navbar.removeClass('navbar--fixed');
  }

  $body.css({
    '--headerH': headerH + 'px',
  });
}

// 初始化 Intersection Observer
function initIntersectionObserver() {
  // 設定觀察器選項
  const options = {
    root: null, // 使用視窗作為根元素
    rootMargin: '0px', // 不設定邊距
    threshold: 0.2 // 當元素20%進入視窗時觸發
  };

  // 建立觀察器
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 當元素進入視窗時，添加 js--viewEd class
        entry.target.classList.add('js--viewEd');
        // 一旦添加完 class，就不再觀察該元素
        observer.unobserve(entry.target);
      }
    });
  }, options);

  // 取得所有需要觀察的元素
  const viewElements = document.querySelectorAll('.js--view');
  
  // 開始觀察每個元素
  viewElements.forEach(element => {
    observer.observe(element);
  });
}

//!====平滑滾動功能
function initializeScrollApp() {
  'use strict';
  $(function () {

    $('header a[href^="#"], .smScroll').on('click', function (event) {
      var target = $(this.getAttribute('href'));
      if (target.length) {
        event.preventDefault();
        $('html, body')
          .stop()
          .animate({ scrollTop: target.offset().top - 100 }, 500);
      }
    });
  });
}
