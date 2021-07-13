export default () => {

  /**
   * タッチイベントの振り分け
   * @type {Object}
   */
  const EVENT: {[s: string] : string } = {}
  if ('ontouchstart' in window) {
    EVENT.TOUCH_START = 'touchstart'
    EVENT.TOUCH_MOVE = 'touchmove'
    EVENT.TOUCH_END = 'touchend'
  } else {
    EVENT.TOUCH_START = 'mousedown'
    EVENT.TOUCH_MOVE = 'mousemove'
    EVENT.TOUCH_END = 'mouseup'
  }
  
  window.addEventListener('DOMContentLoaded', () => {

    let isTouching: boolean = false;
    let prevTouchPosition: { [s: string]: number } = {};
    let prevScrollTop: number = document.documentElement.scrollTop || document.body.scrollTop;
    let isRunning = true;

    window.addEventListener(EVENT.TOUCH_START, (e: MouseEvent | TouchEvent) => {
      isTouching = true;
      prevTouchPosition = {};
      prevTouchPosition['top'] = 'pageY' in e ? (e as MouseEvent).pageY : (e as TouchEvent).changedTouches[0].pageY;
    });
    window.addEventListener(EVENT.TOUCH_MOVE, (e: MouseEvent | TouchEvent) => {
      if (isTouching) {
        let currentPageY = 'pageY' in e ? (e as MouseEvent).pageY : (e as TouchEvent).changedTouches[0].pageY;
        if ('top' in prevTouchPosition) {
          if (prevTouchPosition.top - currentPageY >= 0) {
            document.body.classList.add('is-scrollUp');
          } else if (prevTouchPosition.top - currentPageY < 0) {
            document.body.classList.remove('is-scrollUp');
          }
        }
      }
    });
    window.addEventListener(EVENT.TOUCH_END, (e: MouseEvent | TouchEvent) => {
      isTouching = false;
      prevTouchPosition = {};
    });
    window.addEventListener('scroll', () => {
      if (isRunning) {
        isRunning = false;
        requestAnimationFrame(function () {
          isRunning = true;
          const winScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
          onScroll (winScrollTop);
          prevScrollTop = winScrollTop;
        })
      }
    });

    onScroll(document.documentElement.scrollTop || document.body.scrollTop)
    function onScroll (winScrollTop: number) {
      if (winScrollTop > 0) {
        if (winScrollTop - prevScrollTop >= 0) {
          document.body.classList.add('is-scrollUp');
        } else if (winScrollTop - prevScrollTop < 0) {
          document.body.classList.remove('is-scrollUp');
        }
        if (winScrollTop >= 300) {
          document.body.classList.remove('is-pageTopHide');
        } else {
          document.body.classList.add('is-pageTopHide');
        }
      } else {
        document.body.classList.remove('is-scrollUp');
        document.body.classList.add('is-pageTopHide');
      }
      if (winScrollTop > window.innerHeight) {
        document.body.classList.add('is-headerFixed');
      } else {
        document.body.classList.remove('is-headerFixed');
      }
    }

    const triggersToggleMenu = document.querySelectorAll('.js-toggleMenu');
    triggersToggleMenu.forEach(triggerToggleMenu => {
      triggerToggleMenu.addEventListener('click', () => {
        if(document.body.classList.contains('is-menuActive')) {
          document.body.classList.remove('is-menuActive');
        } else {
          document.body.classList.add('is-menuActive');
        }
      });
    });
    const triggersCloseMenu = document.querySelectorAll('.js-closeMenu');
    triggersCloseMenu.forEach(triggerCloseMenu => {
      triggerCloseMenu.addEventListener('click', () => {
        document.body.classList.remove('is-menuActive');
      });
    });

    const triggersToggleSubMenu = document.querySelectorAll('.js-toggleSubMenu');
    triggersToggleSubMenu.forEach(triggerToggleSubMenu => {
      triggerToggleSubMenu.addEventListener('click', () => {
        if(triggerToggleSubMenu.classList.contains('is-active')) {
          triggerToggleSubMenu.classList.remove('is-active');
        } else {
          const activeTriggersToggleSubMenu = document.querySelectorAll('.js-toggleSubMenu.is-active');
          activeTriggersToggleSubMenu.forEach(activeTriggerToggleSubMenu => {
            activeTriggerToggleSubMenu.classList.remove('is-active');
          });
          triggerToggleSubMenu.classList.add('is-active');
        }
      });
    });

  });



}