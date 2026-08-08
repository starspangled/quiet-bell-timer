(function(global){
  let bell, volume=.55;
  function createBellAudio(){
    bell=new Audio('./bell.wav');
    bell.preload='auto';
    bell.setVolume=function(v){volume=Number(v);bell.volume=volume};
    bell.playBell=function(){const chime=new Audio('./bell.wav?v=3');chime.preload='auto';chime.volume=volume;const p=chime.play();if(p)p.catch(()=>{})};
    bell.setVolume(volume);
    return {setVolume:v=>bell.setVolume(v),play:()=>bell.playBell(),unlock:()=>{bell.muted=true;const p=bell.play();if(p)p.then(()=>{bell.pause();bell.currentTime=0;bell.muted=false}).catch(()=>{bell.muted=false})}};
  }
  global.createBellAudio=createBellAudio;
})(window);
