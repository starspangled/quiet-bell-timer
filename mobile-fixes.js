(function(){
  const reset=document.getElementById('reset-button');
  if(reset)reset.addEventListener('click',function(){
    const status=document.getElementById('timer-status');
    if(status)status.textContent='READY WHEN YOU ARE';
    const start=document.getElementById('start-button');
    if(start){start.disabled=false;start.textContent='Start the set'}
  });
})();
