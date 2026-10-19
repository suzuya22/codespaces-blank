/**
 * Touch Emulator for Unity WebGL (Mouse-to-Touch Bridge)
 * Permite que scripts con UnityEngine.InputSystem.EnhancedTouch funcionen
 * en PC con el ratón sin modificar los binarios del juego.
 * 
 * Para deshabilitar o revertir:
 * Simplemente borra o comenta la etiqueta <script src="TemplateData/touch-emulator.js"></script> en index.html.
 */
(function () {
  // Si el usuario está en un dispositivo móvil táctil físico real, no emular
  var isPhysicalTouch = ('ontouchstart' in window) && (navigator.maxTouchPoints > 0);
  if (isPhysicalTouch && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    return;
  }

  var isMouseDown = false;
  var targetCanvas = null;

  function createTouch(e) {
    if (typeof Touch !== 'undefined') {
      try {
        return new Touch({
          identifier: 1,
          target: targetCanvas,
          clientX: e.clientX,
          clientY: e.clientY,
          screenX: e.screenX,
          screenY: e.screenY,
          pageX: e.pageX,
          pageY: e.pageY,
          radiusX: 2,
          radiusY: 2,
          rotationAngle: 0,
          force: 1
        });
      } catch (err) {
        if (document.createTouch) {
          return document.createTouch(window, targetCanvas, 1, e.pageX, e.pageY, e.screenX, e.screenY);
        }
      }
    }
    return null;
  }

  function dispatchTouchEvent(type, e) {
    if (!targetCanvas) return;
    var touch = createTouch(e);
    if (!touch) return;

    var touches = (type === 'touchend') ? [] : [touch];
    var targetTouches = (type === 'touchend') ? [] : [touch];
    var changedTouches = [touch];

    var touchEvent;
    if (typeof TouchEvent !== 'undefined') {
      try {
        touchEvent = new TouchEvent(type, {
          bubbles: true,
          cancelable: true,
          view: window,
          touches: touches,
          targetTouches: targetTouches,
          changedTouches: changedTouches
        });
      } catch (err) {
        // Fallback para navegadores antiguos
        if (document.createEvent) {
          touchEvent = document.createEvent('TouchEvent');
          if (touchEvent.initTouchEvent) {
            touchEvent.initTouchEvent(type, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, touches, targetTouches, changedTouches);
          }
        }
      }
    }

    if (touchEvent) {
      targetCanvas.dispatchEvent(touchEvent);
    }
  }

  function init() {
    targetCanvas = document.querySelector('#unity-canvas');
    if (!targetCanvas) {
      setTimeout(init, 100);
      return;
    }

    // Escuchar mousedown solo en el canvas del juego
    targetCanvas.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return; // Solo clic izquierdo
      isMouseDown = true;
      dispatchTouchEvent('touchstart', e);
    }, { passive: false });

    // Escuchar movimiento y soltado en window para que no se "pegue" si sale del canvas
    window.addEventListener('mousemove', function (e) {
      if (!isMouseDown) return;
      dispatchTouchEvent('touchmove', e);
    }, { passive: false });

    window.addEventListener('mouseup', function (e) {
      if (!isMouseDown) return;
      isMouseDown = false;
      dispatchTouchEvent('touchend', e);
    }, { passive: false });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
