/**
 * The load cascade: on a full page load, whatever is in the first viewport
 * comes in from the top of the screen down. Each part starts transparent and
 * 8px low and settles over 480 ms, delayed by how far down the viewport its
 * top edge is: nothing at the top, 400 ms at the fold.
 *
 * A part opts in with data-cascade="", or a parent opts its children in with
 * data-cascade="children". The part is never a block that fades with the
 * scroll (data-fade) but something inside one, so the two opacities multiply.
 *
 * Two inline scripts, both run by the parser, so before the first paint.
 * The first, in the head, marks the page pending, which hides every part
 * (globals.css). The second, at the end of the body, measures the parts,
 * starts an animation on each one in the viewport, and clears the mark; a
 * part below the fold is never touched. The animations are the Web
 * Animations API's: they hold the hidden state until their delay is up and
 * leave nothing behind, and no attribute changes under React.
 *
 * Without JavaScript nothing is hidden. Nor under reduced motion, nor going
 * back or forward. A client-side navigation runs no inline script, so it
 * never plays there. A page loaded in a background tab waits until it is
 * shown.
 */

const PENDING = "data-cascade-pending";
const PARTS = '[data-cascade=""],[data-cascade="children"]>*';

const DURATION = 480;
const SPAN = 400; // the delay at the fold
const RISE = 8;
const EASING = "cubic-bezier(.16,1,.3,1)";

// If the second script never runs, the page's parsing still clears the mark.
const guard = `(function(){
var r=document.documentElement,n=performance.getEntriesByType("navigation")[0];
if(!r.animate||!matchMedia("(prefers-reduced-motion: no-preference)").matches||n&&n.type==="back_forward")return;
r.setAttribute("${PENDING}","");
document.addEventListener("DOMContentLoaded",function(){r.removeAttribute("${PENDING}")});
})()`;

// A chapter in the URL is landed on first, where the browser would land on
// it at once anyway (from 960px up, globals.css), since it only gets there
// after this has measured; a reload's own position is already restored.
// Every box is read before any animation is made. A part with no box
// (display: none at this width) is skipped.
const plan = `(function(){
var d=document,r=d.documentElement;
if(!r.hasAttribute("${PENDING}"))return;
try{
var n=performance.getEntriesByType("navigation")[0],t=location.hash.length>1&&d.getElementById(decodeURIComponent(location.hash.slice(1)));
if(t&&n&&n.type==="navigate"&&getComputedStyle(r).scrollBehavior!=="smooth")t.scrollIntoView();
var h=innerHeight,p=[];
d.querySelectorAll('${PARTS}').forEach(function(e){
var b=e.getBoundingClientRect();
if(b.width&&b.height&&b.top<h&&b.bottom>0)p.push([e,Math.max(0,b.top)/h*${SPAN}]);
});
var a=p.map(function(i){
return i[0].animate([{offset:0,opacity:0,transform:"translateY(${RISE}px)"}],{duration:${DURATION},delay:i[1],easing:"${EASING}",fill:"backwards"});
});
if(d.visibilityState==="hidden"){
a.forEach(function(x){x.pause()});
d.addEventListener("visibilitychange",function s(){
if(d.visibilityState==="hidden")return;
d.removeEventListener("visibilitychange",s);
a.forEach(function(x){x.play()});
});
}
}catch(e){}
r.removeAttribute("${PENDING}");
})()`;

/** In the head. */
export function CascadeGuard() {
  return <script dangerouslySetInnerHTML={{ __html: guard }} />;
}

/** At the end of the body, after everything it measures. */
export function CascadePlan() {
  return <script dangerouslySetInnerHTML={{ __html: plan }} />;
}
