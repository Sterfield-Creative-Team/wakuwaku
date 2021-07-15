import $ from 'jquery';
import Swiper from 'swiper/bundle';

export default () => {

  $(() => {
    //const $window = $(window)

    // Top page mainvisual
    var swiper = new Swiper('.mySwiper', {
      spaceBetween: 30,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      autoplay: {
        delay: 5000,
      }
    });

    // Top page video
    const video = document.querySelector("video");
    const videoBtn = document.getElementById("video-btn");

    if (videoBtn != undefined ) {

      videoBtn.addEventListener('click', (event) => {

        if (video.paused) {
          video.play();
          videoBtn.style.display = "none";
          video.setAttribute("controls", "controls");
        } else {
          video.pause();
        }

      });

      video.addEventListener('click', (event) => {

        const style = window.getComputedStyle(videoBtn);
        const value = style.getPropertyValue('display');

        if (value == "none") {
          video.pause();
          videoBtn.style.display = "block";
          video.removeAttribute("controls");
        }

      });

    }

    // sp ハンバーガーメニュー
    $('.btn__trigger').on('click',function() {
      $(this).toggleClass('active');

      if ($(this).hasClass('active')) {
          $('.navi').addClass('active');
      } else {
          $('.navi').removeClass('active');
      }
    });

    $(".navi__btn").on("click",function(){
      $(this).next().slideToggle();
      $(this).toggleClass('isActive');
    });

  })

}