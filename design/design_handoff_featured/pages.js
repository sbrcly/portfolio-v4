/* Round 7 shared chrome behaviour for the page mockups (not production code).
   mount(root, { frameH, vh, onFrame }) wires:
   - the current section: the last [data-chapter] whose top is at or above the viewport's midline;
   - the margin or bar head: every [data-cur-num] / [data-cur-label] inside root takes the current
     section's data-num / data-label with main's timing (out 400ms, 200ms dark, in 600ms; a blank
     chapter empties the head);
   - export frames: #frame=<chapter id>[&dy=N] | title | end. onFrame(y|null) is called with the
     scroll offset the page should render at (the section's top under the frame, plus dy). */
(function () {
  const ease = 'cubic-bezier(.16,1,.3,1)';
  function mount(root, opts) {
    const frameH = opts.frameH, vh = () => opts.vh();
    const secs = Array.from(root.querySelectorAll('[data-chapter]'));
    const nums = Array.from(root.querySelectorAll('[data-cur-num]'));
    const labs = Array.from(root.querySelectorAll('[data-cur-label]'));
    const heads = nums.concat(labs);
    let cur = null, timer = null, frozen = false;
    const rm = () => !!opts.reducedMotion();
    const zoom = () => (opts.zoom ? opts.zoom() : 1) || 1;
    const docTop = (el) => (el.getBoundingClientRect().top + window.scrollY) / zoom() - (opts.shift ? opts.shift() : 0);
    const set = (s, on) => {
      heads.forEach((h) => {
        const isNum = h.hasAttribute('data-cur-num');
        const v = s ? (isNum ? s.dataset.num : s.dataset.label) : '';
        if (v !== undefined && h.textContent !== v) h.textContent = v;
        h.style.transition = rm() ? 'none' : (on ? `opacity 600ms ${ease}, color 600ms ${ease}` : 'opacity 400ms ease, color 400ms ease');
        h.style.opacity = on && s && v ? 1 : 0;
      });
      // In the bar (phone): a label that would reach the nav table yields, and the numeral stands alone.
      root.querySelectorAll('[data-bar]').forEach((bar) => {
        const label = bar.querySelector('[data-cur-label]'), num = bar.querySelector('[data-cur-num]');
        const nav = bar.parentElement.querySelector('nav');
        if (!label || !nav) return;
        label.style.maxWidth = 'none'; label.style.overflow = 'visible';
        const avail = bar.parentElement.clientWidth - 40 - nav.offsetWidth - (num ? num.offsetWidth : 0) - 24;
        if (label.scrollWidth > avail) { label.style.maxWidth = '0px'; label.style.overflow = 'hidden'; label.style.opacity = 0; }
      });
    };
    const show = (s, instant) => {
      if (s === cur) return;
      const had = cur; cur = s;
      clearTimeout(timer);
      if (instant || rm()) { set(s, true); return; }
      set(had, false);
      timer = setTimeout(() => { set(s, false); requestAnimationFrame(() => requestAnimationFrame(() => set(s, true))); }, had ? 600 : 0);
    };
    const current = (y) => {
      const mid = y + vh() / 2; let c = null;
      secs.forEach((s) => { if (docTop(s) <= mid) c = s; });
      return c;
    };
    const tick = () => { if (!frozen) show(current(window.scrollY)); };
    const frame = () => {
      const m = /frame=([a-z0-9-]+)/.exec(location.hash || '');
      const dm = /dy=(-?\d+)/.exec(location.hash || '');
      if (!m) { frozen = false; opts.onFrame(null); tick(); return; }
      frozen = true;
      const k = m[1], dy = dm ? +dm[1] : 0;
      let y = 0;
      if (k === 'end') y = Math.max(0, (opts.docHeight ? opts.docHeight() : document.documentElement.scrollHeight) - vh());
      else if (k !== 'title') { const s = secs.find((x) => x.id === k || x.dataset.chapter === k); if (s) y = docTop(s) - frameH; }
      y = Math.max(0, y + dy);
      opts.onFrame(y);
      requestAnimationFrame(() => { window.scrollTo(0, 0); show(current(y), true); });
    };
    let raf = null;
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = null; tick(); }); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('hashchange', frame);
    setTimeout(frame, 50);
    if (document.fonts) document.fonts.ready.then(() => setTimeout(frame, 120));
    window.addEventListener('load', () => setTimeout(frame, 250));
    show(current(window.scrollY), true);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); window.removeEventListener('hashchange', frame); clearTimeout(timer); };
  }
  window.VigilPages = { mount };
})();
