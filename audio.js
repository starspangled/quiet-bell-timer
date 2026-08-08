(function(global){
  let ctx, master, echo, echoGain, requestedVolume=.55;

  function createBellAudio(){
    function setup(){
      if(ctx) return;
      ctx=new (window.AudioContext||window.webkitAudioContext)();
      master=ctx.createGain(); master.gain.value=requestedVolume*.7; master.connect(ctx.destination);
      echo=ctx.createDelay(1.2); echo.delayTime.value=.38;
      echoGain=ctx.createGain(); echoGain.gain.value=.28;
      echo.connect(echoGain); echoGain.connect(master);
    }
    return {
      setVolume(v){ requestedVolume=Number(v); if(master)master.gain.value=requestedVolume*.7; },
      play(){
        setup(); if(ctx.state==='suspended')ctx.resume();
        const now=ctx.currentTime, input=ctx.createGain();
        const tone=ctx.createOscillator(), overtone=ctx.createOscillator(), shimmer=ctx.createOscillator();
        tone.type='sine'; tone.frequency.value=528;
        overtone.type='sine'; overtone.frequency.value=792;
        shimmer.type='sine'; shimmer.frequency.value=1320;
        input.gain.setValueAtTime(.001,now);
        input.gain.exponentialRampToValueAtTime(.72,now+.018);
        input.gain.exponentialRampToValueAtTime(.001,now+3.4);
        tone.connect(input); overtone.connect(input); shimmer.connect(input);
        input.connect(master); input.connect(echo);
        tone.start(now); overtone.start(now); shimmer.start(now);
        tone.stop(now+3.6); overtone.stop(now+3.6); shimmer.stop(now+3.6);
      }
    };
  }
  global.createBellAudio=createBellAudio;
  global.unlockBellAudio=function(){
    if(!ctx){
      const probe=createBellAudio();
      probe.setVolume(.55);
    }
    if(ctx&&ctx.state==='suspended')ctx.resume();
  };
})(window);
