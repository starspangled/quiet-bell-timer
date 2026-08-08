(function(global){
  class IntervalTimer{
    constructor({onTick=()=>{},onBell=()=>{},onComplete=()=>{},onStateChange=()=>{}}={}){this.cb={onTick,onBell,onComplete,onStateChange};this.blocks=[];this.blockIndex=0;this.roundIndex=0;this.running=false;this.startedAt=0;this.elapsedBefore=0;this.handle=0}
    setBlocks(blocks){this.blocks=blocks.map(b=>({duration:Math.max(1000,Number(b.duration)||60000),repeats:Math.max(1,Math.round(Number(b.repeats)||1)),label:b.label||''}));this.reset()}
    current(){return this.blocks[this.blockIndex]||{duration:60000,repeats:1,label:''}}
    snapshot(){const b=this.current();const elapsed=this.running?this.elapsedBefore+(performance.now()-this.startedAt):this.elapsedBefore;return{running:this.running,blockIndex:this.blockIndex,roundIndex:this.roundIndex,blockCount:this.blocks.length,roundCount:b.repeats,remaining:Math.max(0,b.duration-elapsed),duration:b.duration,elapsed:Math.min(b.duration,elapsed),done:!this.blocks.length}}
    tick=()=>{if(!this.running)return;const s=this.snapshot();if(s.remaining<=0){this.cb.onBell(s);this.advance()}else{this.cb.onTick(s);this.handle=setTimeout(this.tick,100)}}
    start(){if(!this.blocks.length)return;this.running=true;this.startedAt=performance.now();this.cb.onStateChange(true);this.tick()}
    pause(){if(!this.running)return;this.elapsedBefore+=performance.now()-this.startedAt;this.running=false;clearTimeout(this.handle);this.cb.onStateChange(false);this.cb.onTick(this.snapshot())}
    reset(){this.running=false;clearTimeout(this.handle);this.blockIndex=0;this.roundIndex=0;this.elapsedBefore=0;this.cb.onStateChange(false);if(this.blocks.length)this.cb.onTick(this.snapshot())}
    advance(){this.elapsedBefore=0;this.roundIndex++;if(this.roundIndex>=this.current().repeats){this.roundIndex=0;this.blockIndex++}if(this.blockIndex>=this.blocks.length){this.running=false;this.cb.onComplete();this.cb.onTick({...this.snapshot(),done:true});return}this.startedAt=performance.now();this.cb.onTick(this.snapshot());this.handle=setTimeout(this.tick,100)}
    skip(){if(!this.blocks.length||this.blockIndex>=this.blocks.length)return;this.cb.onBell(this.snapshot());this.advance()}
  }
  global.IntervalTimer=IntervalTimer;
})(window);
