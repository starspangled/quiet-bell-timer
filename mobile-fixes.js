(function(){
  const test=document.getElementById('test-bell-button');
  if(test)test.addEventListener('click',function(){const bell=new Audio('./bell.wav?v=3');bell.volume=.7;bell.play().catch(()=>{})});
  const start=document.getElementById('start-button');
  if(start)start.addEventListener('click',function(){const unlock=new Audio('./bell.wav');unlock.muted=true;unlock.play().then(()=>{unlock.pause();unlock.currentTime=0;unlock.muted=false}).catch(()=>{})},{once:false});
  const reset=document.getElementById('reset-button');
  if(reset)reset.addEventListener('click',function(){
    const status=document.getElementById('timer-status');
    if(status)status.textContent='READY WHEN YOU ARE';
    const start=document.getElementById('start-button');
    if(start){start.disabled=false;start.textContent='Start the set'}
  });
})();
