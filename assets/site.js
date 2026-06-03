// =====================================================================
//  Chris Iredale Portfolio — shared interactions
//  mobile menu · scroll reveal · reactive blueprint cursor ·
//  mouse parallax · magnetic plates · scroll progress
// =====================================================================
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var fine   = window.matchMedia('(pointer:fine)').matches;

  // ---------- mobile menu ----------
  var btn=document.querySelector('.menu-btn');
  var mnav=document.querySelector('.mnav');
  if(btn&&mnav){btn.addEventListener('click',function(){mnav.classList.toggle('open');});}

  // ---------- scroll reveal ----------
  var els=document.querySelectorAll('.rise');
  function revealAll(){ els.forEach(function(el){el.classList.add('in');}); }
  if(reduce){ revealAll(); }
  else if('IntersectionObserver' in window && els.length){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);} });
    },{rootMargin:'0px 0px -8% 0px',threshold:0.08});
    els.forEach(function(el){io.observe(el);});
    // reveal anything already in view immediately (don't wait on IO delivery)
    requestAnimationFrame(function(){
      var vh=window.innerHeight||document.documentElement.clientHeight;
      els.forEach(function(el){ var r=el.getBoundingClientRect(); if(r.top<vh*0.95){ el.classList.add('in'); } });
    });
    // safety: never leave content stuck hidden if IO callbacks don't deliver
    setTimeout(revealAll, 1600);
    window.addEventListener('load', function(){ setTimeout(revealAll, 400); });
  } else { revealAll(); }

  if(reduce || !fine) return; // motion features below are desktop + motion-ok only

  // track pointer for parallax
  var mx=window.innerWidth/2, my=window.innerHeight/2;
  document.addEventListener('mousemove',function(e){ mx=e.clientX; my=e.clientY; },{passive:true});

  // ---------- mouse parallax ----------
  var pEls=[].map.call(document.querySelectorAll('[data-parallax]'),function(el){
    return {el:el, d:parseFloat(el.getAttribute('data-parallax'))||12};
  });
  // ---------- magnetic plates ----------
  var plates=document.querySelectorAll('.plate');

  var raf=false;
  function frame(){
    raf=false;
    var cx=window.innerWidth/2, cy=window.innerHeight/2;
    var nx=(mx-cx)/cx, ny=(my-cy)/cy; // -1..1
    pEls.forEach(function(p){
      p.el.style.transform='translate('+(nx*p.d).toFixed(2)+'px,'+(ny*p.d).toFixed(2)+'px)';
    });
  }
  document.addEventListener('mousemove',function(){ if(!raf){raf=true;requestAnimationFrame(frame);} },{passive:true});

  plates.forEach(function(pl){
    var inner=pl.children;
    pl.addEventListener('mousemove',function(e){
      var r=pl.getBoundingClientRect();
      var dx=(e.clientX-(r.left+r.width/2))/r.width;
      var dy=(e.clientY-(r.top+r.height/2))/r.height;
      for(var i=0;i<inner.length;i++){
        if(inner[i].classList.contains('plate__halftone')) continue;
        inner[i].style.transform='translate('+(dx*10).toFixed(1)+'px,'+(dy*10).toFixed(1)+'px)';
      }
    });
    pl.addEventListener('mouseleave',function(){
      for(var i=0;i<inner.length;i++){
        if(inner[i].classList.contains('plate__halftone')) continue;
        inner[i].style.transform='';
      }
    });
  });
})();
