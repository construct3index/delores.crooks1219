var minTime = 30 * 1000; // 30 seconds
var interval = 130 * 1000; // 130 seconds
var adsTimer =
function()
{
    window.location.href = "html5player://showInterstitial";    
    setTimeout(adsTimer, minTime + Math.random() * interval);
}
setTimeout(adsTimer, minTime + Math.random() * interval);

// inst.GetRuntime().SetSuspended(true);
// or c3_runtimeInterface._GetLocalRuntime().SetSuspended(true);

function muteGame(){
    inst.GetRuntime().SetSuspended(true);
}
function unmuteGame(){
    inst.GetRuntime().SetSuspended(false);
} 
function unmuteGameClicked(){
    setTimeout(() => {  inst.GetRuntime().SetSuspended(false);  }, 7000);
} 
