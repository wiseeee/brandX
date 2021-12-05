'use strict';

$(document).ready(function() {
  preventDefaultAnchor();
  scrollAnimate();
  menuOpen();
  changeNight();
  mainImageSlide();
  scrollFixed();
  headerFixed();
  setImageSlide('div.office-box ul.office-img', 1);
});

// a[href="#"] 기본 동작 방지(상단 이동)
function preventDefaultAnchor() {
  $(document).on('click', 'a[href="#"]', function(e) {
    e.preventDefault();
  });
}


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

function scrollFixed() {
  $(window).on('scroll resize', function() {
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
  });
}



function headerFixed() {
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


function setImageSlide(selector ,first) {
  var $selector = $(selector);
  var numSlide = $selector.find('li').length;
  var slideNow = 0;
  var slidePrev = 0;
  var slideNext = 0;
  var slideFirst = first;

  var delX = 0;
  var startX = 0;
  var offsetX = 0;
  var boxWidth = 0;
  var barWidth = 0;
  var offsetLeft = 0;
  var minOffsetLeft = 0;
  var isBlocked = true;
  var counter = 0;

  resetUI();
  showSlide(slideFirst);
  progressBar();

  

  function progressBar() {
      var leftOffset = $selector.find('li').position().left;
      var width = $selector.parent().find('div.progress-container').outerWidth(true);
      var scrolled = (leftOffset / width) * 100;

      if(leftOffset > 0) {
        $selector.parent().find('.progress-container .progress-bar').css({'width': scrolled + '%'})
      } else {
        
      }
  }

  $selector.parent().find('.control a.prev').on('click', function() {
    if (offsetLeft >= 0) {
      $selector.find('ul.office-img').css({'transition': 'none'}).stop(true).animate({'left': '10px'}, 80).animate({'left': 0}, 160, function() {
        showSlide(slideNow);
      });
    } else {
      showSlide(slidePrev);
    }
  });

  $selector.parent().find('.control a.next').on('click', function() {
    if (offsetLeft <= minOffsetLeft) {
      $selector.find('ul.office-img').css({'transition': 'none'}).stop(true).animate({'left': (minOffsetLeft - 10) + 'px'}, 80).animate({'left': minOffsetLeft + 'px'}, 160, function() {
        showSlide(slideNow);
      });
    } else {
      showSlide(slideNext);
    }
  });



  $selector.on('touchstart', function(e) {
    e.preventDefault();
    startX = e.touches[0].clientX;
    offsetX = $(this).position().left;
    $(this).css({'transition': 'none'})
    
    $(document).on('touchmove', function(e) {
      delX = e.touches[0].clientX - startX;
      if(Math.abs(delX) > 5) isBlocked = true;
      if((slideNow === 1 && delX > 0) || (slideNow === numSlide && delX < 0)) {
        delX = delX / 10;
      }
      $selector.css({'left': (offsetX + delX) + 'px'});

      $(document).on('touchend', function(e) {
        $(document).off('touchmove touchend');
        if (delX < -50 && slideNow != numSlide) {
          if(offsetLeft <= minOffsetLeft) {
            $selector.css({'transition': 'none'}).stop(true).animate({'left': (minOffsetLeft - 10) + 'px'}, 80).animate({'left': minOffsetLeft + 'px'}, 160, function() {
              showSlide(slideNow);
            });
          } else {
            showSlide(slideNext);
          }
        } else if (delX > 50 && slideNow != 1) {
          if (offsetLeft >= 0) {
            $selector.css({'transition': 'none'}).stop(true).animate({'left': '10px'}, 80).animate({'left': 0}, 160, function() {
              showSlide(slideNow);
            });
          } else {
            showSlide(slidePrev);
          }
        } else {
          showSlide(slideNow);
        }
        delX = 0;
      });
    });
  });

  $(window).on('resize', function() {
    if (counter > 10) {
      resetUI();
      showSlide(slideNow);
      counter = 0;
    }
    counter++;
  })

  function resetUI() {
    boxWidth = $selector.parent('div.office-box').outerWidth(true);
    barWidth = 0;
    $selector.find('li').each(function() {
      barWidth += $(this).outerWidth(true);
    });
    $selector.css({'width': (barWidth + 10) + 'px'});
    minOffsetLeft = boxWidth - barWidth;
  }

  function showSlide(n) {
    // slide 옆으로 넘기는 효과
    offsetLeft = -$selector.find('li:eq(' + (n - 1) + ')').position().left;
    if (offsetLeft < minOffsetLeft) {
      offsetLeft = minOffsetLeft;
      numSlide = n;
    }
    $selector.css({'transition': 'left 0.5s', 'left': offsetLeft + 'px'});
    slideNow = n;
    slidePrev = (n <= 1) ? numSlide : (n - 1);
    slideNext = (n > numSlide) ? 1 : (n + 1);
  }
}

//스크롤시 animate

function scrollAnimate() {
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
}

