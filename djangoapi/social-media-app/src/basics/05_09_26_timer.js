const createDiv = document.querySelector(".right-section");


const divBox = document.createElement("div");
divBox.className = "divBox";
divBox.setAttribute("style", "margin: 15px; display: flex; flex-direction: column; justify-content: center; align-items: center;");
console.log(divBox.getAttribute("style"));

const timeBox = createElement({ tagName: "div", className: "timeBox" });
timeBox.setAttribute("style", "font-size: 40px; width: 190px; height: 130px; margin: 5px; display: flex; align-items: center; justify-content: center; background-color: rgb(27, 66, 27)");

divBox.append(timeBox);
createDiv.append(divBox);


// buttons container
const buttons = createElement({ tagName: "div", className: "buttons" });
buttons.setAttribute("style", "display: flex; flex-direction: row; gap: 10px; justify-content: center;");

const btn1 = createElement({ tagName: "button", className: "start", content: "START" });
const btn2 = createElement({ tagName: "button", className: "stop", content: "STOP" });
const btn3 = createElement({ tagName: "button", className: "reset", content: "RESET" });
const allbtns = [btn1, btn2, btn3];  // put them in an array
allbtns.forEach(btn => {
  btn.setAttribute("style", "background-color: rgb(88, 84, 84)");
});

// declare intervalId at top
let intervalId = null;

// start button
btn1.addEventListener("click", () => {
    intervalId = setInterval(() => {
    const date = new Date();
    const time = date.toLocaleTimeString();
    timeBox.textContent = time;   // show readable time
}, 1000);
});

// STOP button: clear the interval
btn2.addEventListener("click", () => {
    clearInterval(intervalId);
    timeBox.setAttribute("style", "font-size: 35px; width: 190px; height: 130px; margin: 5px; display: flex; align-items: center; justify-content: center; background-color: red");
});

btn3.addEventListener("click", () => {
    timeBox.setAttribute("style", "font-size: 35px; width: 190px; height: 130px; margin: 5px; display: flex; align-items: center; justify-content: center; background-color: grey");
});

buttons.append(btn1, btn2, btn3);
divBox.append(buttons);



function createElement({tagName, className, content}) {
    const tag = document.createElement(tagName);
    if (className) tag.classList.add(className);
    if (content) tag.textContent = content;
    return tag;
};
