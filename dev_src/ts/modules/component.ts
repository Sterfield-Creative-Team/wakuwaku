import $ from 'jquery';
import Swiper from 'swiper/bundle';

export default () => {

  $(() => {
    //const $window = $(window)

    var swiper = new Swiper('.mySwiper', {
      spaceBetween: 30,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });

    $("#video-btn").on('click',function (){
      //console.log('');
    });

  })

}