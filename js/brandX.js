'use strict';

menuOpen();
changeNight();

//header menu toggle
function menuOpen() {
  var menuBtn = document.querySelector('#header .menu-box')

  menuBtn.addEventListener('click', function() {
    document.querySelector('#header .gnb-wrap').classList.toggle('active');
    document.querySelector('#header .header-wrap').classList.toggle('active');
  });
};

//light-dark mode change toggle
function changeNight () {
  var nightBtn = document.querySelector('#main .scroll-bottom-btn')

  nightBtn.addEventListener('click', function() {
  document.querySelector('#header').classList.toggle('night');
  document.querySelector('#main').classList.toggle('night');
  document.querySelector('#footer').classList.toggle('night');
  });
};


//main-banner 넘기기
mainImageSlide();

function mainImageSlide() {
  var slideNow = 0;
  var slideFirst = 1;

  showSlide(slideFirst);

  $('#main .control li a').on('click', function() {
    var index = $('#main .control li').index($(this).parent());
    showSlide(index + 1);
  });

  function showSlide(n) {
    $('#main .slide-img li').css({'display': 'none'});
    $('#main .slide-img li:eq(' + (n - 1) + ')').css({'display': 'block'});
    $('#main .control li').removeClass('on');
    $('#main .control li:eq(' + (n - 1) + ')').addClass('on');
    slideNow = n;
  }
}



//scrollFixed JS
if (matchMedia("screen and (min-width: 990px)").matches) {
  scrollFixed();
  $(window).on('scroll', function() {
    scrollFixed();
  });

  $(window).on('resize', function(){
    scrollFixed();
  });

  function scrollFixed() {
    var scrollAmt = $(document).scrollTop();
    var fixedStart = $('#main .content-2x').offset().top;
    var divHeight = $('#main .content-2x .content-l').height();
    var fixedEnd = $(window).innerHeight();
    if (scrollAmt < fixedStart) {
      $("#main .content-2x").removeClass("fixed");
    }
    else if(scrollAmt >= fixedStart && scrollAmt <= (fixedStart + divHeight - fixedEnd)) { 
      $("#main .content-2x").addClass("fixed");
      $("#main .content-2x").removeClass("fixedEnd");
    }
    else if (scrollAmt > (fixedStart + divHeight - fixedEnd)) {
      $("#main .content-2x").removeClass("fixed");
      $("#main .content-2x").addClass("fixedEnd");
    }
  }
}


if (matchMedia("screen and (max-width: 768px)").matches) {
  $(window).scroll(function(){ 
    var scroll = $(document).scrollTop(); 
    if(scroll > 40){ 
      $("#header").addClass("fixed");
    }
    else { 
      $("#header").removeClass("fixed");
    }
    });
} 


//하단 슬라이드 넘기기
setImageSlide();

function setImageSlide(selector ,first) {
  var $selector = $(selector);
  var numSlide = $selector.find('.div.office-box .office-img li').length;
  var slideNow = 0;
  var slidePrev = 0;
  var slideNext = 0;
  var slideFirst = first;

  var delX = 0;
  var startX = 0;
  var offsetX = 0;

  $('div.office-box .office-img').on('mousedown', function(e) {
    e.preventDefault();
    startX = e.clientX;
    offsetX = $(this).position().left;
    $(this).css({'transition': 'none'})
    
    $(document).on('mousemove', function(e) {
      delX = e.clientX - startX;
      if((slideNow === 1 && delX > 0) || (slideNow === numSlide && delX < 0)) {
        delX = delX / 10;
      }
      $('div.office-box .office-img').css({'left': (offsetX + delX) + 'px'});
    });

    $(document).on('mouseup', function(e) {
      if(delX < -50 && slideNow !== numSlide) {
        showSlide(slideNext);
      } else if (delX > 50 && slideNow !== 1) {
        showSlide(slidePrev);
      } else {
        showSlide(slideNow);
      }
      $(document).off('mousemove mouseup');
    });
    console.log(delX + '/' + startX + '/' + offsetX)
  });

  $selector.find('div.office-box .office-img li').each(function(i) {
    //슬라이드 옆으로 넘기는거 같은 효과, 모든 slide 옆으로 배열
    $(this).css({'left': (i * 100) + '%', 'display': 'block'});
    //indicator 자동으로 넣기
    $selector.find('.indicator').append('<li><a href="#">'+ (i + 1) +'번 슬라이드</a></li>\n')
  });


  showSlide(slideFirst);

  $selector.find('.indicator li a').on('click', function() {
    var index = $selector.find('.indicator li a').index($(this).parent());
    showSlide(index + 1);
  });

  $selector.find('office-box .control .a.prev').on('click', function() {
    showSlide(slidePrev);
  });

  $selector.find('office-box .control a.next').on('click', function() {
    showSlide(slideNext);
  });


  function showSlide(n) {
    // slide 옆으로 넘기는 효과
    if(slideNow === 0) {
      $selector.find('div.office-box .office-img').css({'transition': 'none','left': -((n-1) * 100) + '%'});
    } else {
      $selector.find('div.office-box .office-img').css({'transition': 'left 0.5s','left': -((n-1) * 100) + '%'});
    };
    $selector.find('.indicator li').removeClass('on');
    $selector.find('.indicator li:eq(' + (n - 1) + ')').addClass('on');
    slideNow = n;
    slidePrev = (n === 1) ? numSlide : (n - 1);
    slideNext = (n === numSlide) ? 1 : (n + 1);
    console.log(slidePrev + ' / ' + slideNow + ' / ' + slideNext);
  }
}

//스크롤시 animate

$('#main .content-2x .content-r .content-r-fixed').children().addClass('up-scroll');
$('#main .content-2x .content-l').children().addClass('up-scroll');
$('#main .brand-article').children().addClass('up-scroll');
$('#main .go-brand').children().addClass('up-scroll');
$('#main .office-box .office-img').children().addClass('up-scroll');


function isElementUnderBottom(elem, triggerDiff) {
  const { top } = elem.getBoundingClientRect();
  const { innerHeight } = window;
  return top > innerHeight + (triggerDiff || 0);
}

function handleScroll() {
  const elems = document.querySelectorAll('.up-scroll');
  elems.forEach(elem => {
    if (isElementUnderBottom(elem, -20)) {
      elem.style.opacity = "0";
      elem.style.transform = 'translateY(70px)';
    } else {
      elem.style.opacity = "1";
      elem.style.transform = 'translateY(0px)';
    }
  })
}

window.addEventListener('scroll', handleScroll);