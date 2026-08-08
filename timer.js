(function(global){
  class IntervalTimer {
    constructor({onTick=()=>{},onBell=()=>{},onComplete=()=>{},onStateChange=()=>{}}={}){this.callbacks={onTick,onBell,onComplete,onStateChange};this.blocks=[];this.blockIndex=0;this.roundIndex=0;this.running=false;this.startedAt=0;this.elapsedBefore=0;this.raf=0}
    setBlocks(blocks){this.blocks=blocks.map(b=>({duration:Math.max(1000,Number(b.duration)||60000),repeats:Math.max(1,Math.round(Number(b.repeats)||1)),label:b.label||''}));this.reset()}
    current(){return this.blocks[this.blockIndex]||{duration:60000,repeats:1,label:''}}
    getSnapshot(now=performance.now()){const block=this.current();const total=block.duration;let elapsed=this.running?this.elapsedBefore+(now-this.startedAt):this.elapsedBefore;return {running:this.running,blockIndex:this.blockIndex,roundIndex:this.roundIndex,blockCount:this.blocks.length,roundCount:block.repeats,remaining:Math.max(0,total-elapsed),duration:total,elapsed:Math.min(total,elapsed),done:!this.blocks.length}}
    emit(){this.callbacks.onTick(this.getSnapshot())}
    loop=()=>{if(!this.running)return;let snap=this.getSnapshot();if(snap.remaining<=0){this.callbacks.onBell(snap);this.advance();return}this.emit();this.raf=requestAnimationFrame(this.loop)}
    start(){if(!this.blocks.length)return;if(this.isDone())this.reset();this.running=true;this.startedAt=performance.now();this.callbacks.onStateChange(true);this.loop()}
    pause(){if(!this.running)return;this.elapsedBefore+=performance.now()-this.startedAt;this.running=false;cancelAnimationFrame(this.raf);this.callbacks.onStateChange(false);this.emit()}
    reset(){this.running=false;cancelAnimationFrame(this.raf);this.blockIndex=0;this.roundIndex=0;this.elapsedBefore=0;this.callbacks.onStateChange(false);this.emit()}
    isDone(){return this.blockIndex>=this.blocks.length}
    advance(){this.elapsedBefore=0;this.roundIndex++;if(this.roundIndex>=this.current().repeats){this.roundIndex=0;this.blockIndex++}if(this.isDone()){this.running=false;this.callbacks.onComplete();this.emit();return}this.startedAt=performance.now();this.emit();this.raf=requestAnimationFrame(this.loop)}
    skip(){if(this.isDone())return;this.callbacks.onBell(this.getSnapshot());this.advance()}
  } global.IntervalTimer=IntervalTimer;
})(window);
