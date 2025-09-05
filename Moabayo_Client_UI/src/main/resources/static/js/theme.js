// /js/theme.js
(function () {
  const KEY = 'mb.theme';
  const BOUND = new WeakSet();
  const mm = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')) || null;

  const get = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const set = v  => { try { localStorage.setItem(KEY, v); } catch {} };
  const has = () => { try { return localStorage.getItem(KEY) != null; } catch { return false; } };

  function setTheme(t, persist){
    const theme = (t === 'dark') ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.body && document.body.classList.toggle('dark', theme === 'dark'); // 레거시 호환
    document.querySelectorAll('#switch-mode').forEach(sw => sw.checked = (theme === 'dark'));
    if (persist) set(theme);
  }
  function preferred(){
    const s = get(); if (s) return s;
    const a = document.documentElement.getAttribute('data-theme'); if (a) return a;
    return (mm && mm.matches) ? 'dark' : 'light';
  }
  setTheme(preferred(), false);

  function bind(){
    document.querySelectorAll('label[for="switch-mode"]').forEach(lb=>{
      if (BOUND.has(lb)) return;
      lb.addEventListener('click', (e)=>{ e.preventDefault();
        const cur = document.documentElement.getAttribute('data-theme') || 'light';
        setTheme(cur === 'dark' ? 'light' : 'dark', true);
      }, {passive:false});
      BOUND.add(lb);
    });
    document.querySelectorAll('#switch-mode').forEach(sw=>{
      if (BOUND.has(sw)) return;
      sw.addEventListener('change', (e)=> setTheme(e.currentTarget.checked ? 'dark' : 'light', true));
      BOUND.add(sw);
    });
  }
  (document.readyState === 'loading')
    ? window.addEventListener('DOMContentLoaded', bind, {once:true})
    : bind();
  new MutationObserver(bind).observe(document.documentElement, {childList:true, subtree:true});

  mm && mm.addEventListener?.('change', ()=>{ if (!has()) setTheme(mm.matches ? 'dark' : 'light', false); });
  window.addEventListener('storage', (e)=>{ if (e.key === KEY) { const v = get(); if (v) setTheme(v, false); }});
})();
