(function(global){
  let volume=.55;
  function createBellAudio(){
    const bell=new Audio('./bell.wav?v=4');
    bell.preload='auto';
    const api={
      setVolume(v){volume=Number(v);bell.volume=volume},
      unlock(){bell.muted=true;bell.currentTime=0;const p=bell.play();if(p)p.then(()=>{bell.pause();bell.currentTime=0;bell.muted=false}).catch(()=>{bell.muted=false})},
      play(){bell.muted=false;bell.volume=volume;bell.currentTime=0;const p=bell.play();if(p)p.catch(()=>{})}
    };
    api.setVolume(volume);global.bellController=api;return api;
  }
  global.createBellAudio=createBellAudio;
})(window);
