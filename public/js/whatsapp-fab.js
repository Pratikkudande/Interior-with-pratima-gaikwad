(function () {
  var SIZE = 58;
  var MARGIN = 16;

  function pinWhatsAppFab() {
    var fab = document.getElementById('whatsappFab');
    if (!fab) return;

    if (fab.parentElement !== document.body) {
      document.body.appendChild(fab);
    }

    var vv = window.visualViewport;
    var vw = vv ? vv.width : window.innerWidth;
    var vh = vv ? vv.height : window.innerHeight;
    var offsetLeft = vv ? vv.offsetLeft : 0;
    var offsetTop = vv ? vv.offsetTop : 0;

    var top = offsetTop + vh - SIZE - MARGIN;
    var left = offsetLeft + vw - SIZE - MARGIN;

    fab.style.position = 'fixed';
    fab.style.zIndex = '2147483647';
    fab.style.display = 'inline-flex';
    fab.style.alignItems = 'center';
    fab.style.justifyContent = 'center';
    fab.style.width = SIZE + 'px';
    fab.style.height = SIZE + 'px';
    fab.style.borderRadius = '50%';
    fab.style.background = '#25d366';
    fab.style.border = '2px solid #fff';
    fab.style.boxShadow = '0 10px 28px rgba(37, 211, 102, 0.5)';
    fab.style.textDecoration = 'none';
    fab.style.top = top + 'px';
    fab.style.left = left + 'px';
    fab.style.right = 'auto';
    fab.style.bottom = 'auto';
    fab.style.margin = '0';
    fab.style.opacity = '1';
    fab.style.visibility = 'visible';
    fab.style.pointerEvents = 'auto';
  }

  pinWhatsAppFab();
  document.addEventListener('DOMContentLoaded', pinWhatsAppFab);
  window.addEventListener('resize', pinWhatsAppFab, { passive: true });
  window.addEventListener('scroll', pinWhatsAppFab, { passive: true });

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', pinWhatsAppFab);
    window.visualViewport.addEventListener('scroll', pinWhatsAppFab);
  }
})();
