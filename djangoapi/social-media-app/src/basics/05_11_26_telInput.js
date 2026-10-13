

const telbox = document.querySelector(".right-section");
telbox.className = 'telbox';


const telcontainer = document.createElement("div");
telcontainer.setAttribute("style", "width: 250px; height: 100px; margin: 5px; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: rgb(27, 66, 27)");
telcontainer.className = "telcontaine";

const telinput = document.createElement("input");
telinput.type = "tel";
telinput.className = "telinput";
telinput.placeholder = "000-000-00-00";

telinput.setAttribute("style", `
  font-size: 20px;
  width: 190px;
  height: 40px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(27, 66, 27);
  color: white;
  border: none;
  border-radius: 6px;
  text-align: center;
`);


const savebutton = document.createElement("button");
savebutton.className = "savebuttonn";

savebutton.addEventListener("click", () => {
    const telPattern = /^\d{3}-\d{3}-\d{2}-\d{2}$/;
    const telValue = telinput.value; // get what user typed
    if (telPattern.test(telValue)) {
        localStorage.setItem("userTel", telValue); // save to LocalStorage
        alert("Phone number saved: " + telValue); // optional feedback
    } else {
        telinput.style.backgroundColor = "red";
    }
    
});

savebutton.addEventListener("mouseenter", () => {
  savebutton.style.backgroundColor = "rgb(120, 200, 120)";
});

savebutton.setAttribute("style", "background-color: rgb(190, 247, 190); border-radius: 8%; height: 20px; width: 70px");


telcontainer.append(telinput);
telcontainer.append(savebutton);

telbox.append(telcontainer);



console.dir(telinput);      // the input.telinput
console.dir(telinput.classList); // the DOMTokenList of classes
console.dir(savebutton);    // the button.savebuttonn



const div = document.querySelector("div");

console.log(div.nodeName); // "DIV"
console.log(div.innerHTML); // "Hello"

console.log(div.firstChild.nodeType); // 3 → text node
console.log(div.firstChild.nodeName); // "#text"
console.log(div.firstChild.nodeValue); // "Hello"
