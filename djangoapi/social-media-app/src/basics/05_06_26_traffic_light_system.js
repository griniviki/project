
const traffic_system = document.querySelector(".traffic_light_system");
function createLight(className) {
  const light = document.createElement("div");
  light.className = className;
  return light;
}
const red = createLight("red");
const orange = createLight("orange");
const green = createLight("green");
traffic_system.append(red, orange, green);

let step = 0;
setInterval(() => {
  // reset all lights
  red.style.backgroundColor = "black";
  orange.style.backgroundColor = "black";
  green.style.backgroundColor = "black";

  if (step === 0) {
    red.style.backgroundColor = "red";      // red on
  } else if (step === 1) {
    orange.style.backgroundColor = "orange"; // orange on
  } else if (step === 2) {
    green.style.backgroundColor = "green";   // green on
  } 
  step++;
  if (step > 2) step = 0; // loop back to red
}, 4000); 

