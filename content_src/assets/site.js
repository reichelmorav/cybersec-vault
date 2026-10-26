(function(){
  "use strict";
  var menuBtn = document.getElementById('menuBtn');
  var toplinks = document.querySelector('.toplinks');
  if (menuBtn && toplinks) {
    menuBtn.addEventListener('click', function(){
      toplinks.classList.toggle('open');
    });
  }

  var toggle = document.getElementById('langToggle');
  var grid = document.getElementById('articleGrid');
  if (toggle && grid) {
    var buttons = toggle.querySelectorAll('button');
    var cards = grid.querySelectorAll('.article-card');
    buttons.forEach(function(btn){
      btn.addEventListener('click', function(){
        buttons.forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        var lang = btn.getAttribute('data-lang');
        cards.forEach(function(card){
          var show = lang === 'all' || card.getAttribute('data-lang') === lang;
          card.hidden = !show;
        });
      });
    });
  }
})();
