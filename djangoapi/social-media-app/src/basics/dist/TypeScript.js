"use strict";
let message1 = "Hello";
let message2;
message2 = "hi";
let message3;
message3 = "Tschuess";
const message4 = "Hallo";
var i = 1;
function var1() {
    for (var i = 0; i < 10; i++) {
        var test = i;
    }
    console.log(i);
}
var1();
function var2() {
    var a = 10;
    var a = 20;
    console.log(a);
}
var2();
function var3() {
    for (var i = 0; i < 5; i++) {
        setTimeout(function () {
            console.log(i);
        }, 10);
    }
}
var3();
function let1() {
    console.log(i);
    for (let i = 0; i < 10; i++) {
        let test = i;
    }
    console.log(i);
}
let1();
let a = 100;
function let2() {
    let a = 10;
    console.log(a);
}
console.log(a);
function let3() {
    for (let i = 0; i < 5; i++) {
        setTimeout(function () {
            console.log(i);
        }, 10);
    }
}
let3();
let isDone = false;
const a1_int = 10;
const a2_float = 10.1;
const a3_hex = 0x000a;
const a4_binary = 0b1010;
const a5_octal = 0o12;
console.log(a2_float);
console.log(a3_hex);
console.log(a4_binary);
console.log(a5_octal);
const firstName = "Ivan";
const age = 25;
const messageTemplate = `Hello, I am ${firstName} + I am ${age}`;
const messageConcat = 'Hello, my name is' + firstName + age;
const mySymbol1 = Symbol('typescript');
console.log(mySymbol1);
const mySymbol2 = Symbol('typesript');
console.log(mySymbol2);
console.log(mySymbol1 === mySymbol2);
let year;
year = ['January', 'February', 'March'];
const list = [1, 2, 3, 4];
for (let i = 0; i < list.length; i++) {
    console.log(list[i]);
}
const values = [-1, -2, -3];
for (let i = 0; i < values.length; i++) {
    console.log(values[i]);
}
const nested = [[1], [2], [3]];
for (let i = 0; i < nested.length; i++) {
    console.log(nested[i]);
}
let x;
x = ['Hello', 10];
console.log(x);
console.log(x[0]);
console.log(x[1]);
const y = [1, 'hello', 'world'];
console.log(y[2]);
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
const c1 = Color.Green;
console.log(c1);
var Status;
(function (Status) {
    Status[Status["Success"] = 1] = "Success";
    Status[Status["Error"] = 5] = "Error";
    Status[Status["Rejected"] = 10] = "Rejected";
})(Status || (Status = {}));
const c2 = Status.Success;
console.log(c2);
var Shape;
(function (Shape) {
    Shape[Shape["Circle"] = 2] = "Circle";
    Shape[Shape["Triangle"] = 3] = "Triangle";
    Shape[Shape["Square"] = 4] = "Square";
})(Shape || (Shape = {}));
const c3 = Shape.Square;
console.log(c3);
const c4 = Status[1];
console.log(c4);
(function (Shape) {
    Shape["Circ"] = "circle";
    Shape["Tria"] = "triangle";
    Shape["Sq"] = "square";
})(Shape || (Shape = {}));
const cd = Shape.Sq;
console.log(cd);
var Fruit;
(function (Fruit) {
    Fruit[Fruit["Apple"] = 0] = "Apple";
    Fruit[Fruit["Orange"] = 1] = "Orange";
    Fruit[Fruit["Tomato"] = 2] = "Tomato";
})(Fruit || (Fruit = {}));
function drawImage2(fruit) {
    const domElement = document.createElement('img');
    switch (fruit) {
        case 0:
            domElement.src = './apple.jpg';
            break;
        case 1:
            domElement.src = './orange.jpg';
            break;
        case 2:
            domElement.src = './tomato.jpg';
            break;
    }
    domElement.setAttribute("width", "150");
    domElement.setAttribute("height", "100");
    const rightSection = document.querySelector('.form-section');
    rightSection === null || rightSection === void 0 ? void 0 : rightSection.appendChild(domElement);
}
drawImage2(Fruit.Orange);
let someValue = "Hello";
someValue = false;
someValue = 100;
someValue.toFixed();
function myProcedure() {
    alert('hello');
}
let someValue1 = undefined;
someValue = null;
let someData = "Hello";
let strlength1 = someData.length;
let strlength2 = someData.length;
function add1(x, y) {
    return x + y;
}
const result1 = add1(1, 2);
console.log(result1);
function add2(x, y) {
    return x + y;
}
const result3 = add2(10, 20);
console.log(result3);
let myAdd;
let myProc;
function myAddDeclaration(x, y) {
    return x + y;
}
myAdd = myAddDeclaration;
console.log(myAdd(11, 11, 11));
myProc = function () {
    console.log("Hello me");
};
myProc();
function getFullName(firstName, lastName) {
    if (lastName) {
        return firstName + " " + lastName;
    }
    else {
        return firstName;
    }
}
const fullName1 = getFullName("Ivan", "Kapytko");
const fullName2 = getFullName("Ivan");
console.log(fullName1);
console.log(fullName2);
function getDisplayName(firstName, lastName = "Kapytko") {
    return "Display Name:" + firstName + " " + lastName;
}
const fullName3 = getDisplayName("Ivan", "Kapytko");
const fullName4 = getDisplayName("Ivan");
const fullName5 = getDisplayName("Ivan", undefined);
console.log(fullName3);
console.log(fullName4);
console.log(fullName5);
function printValue(message, ...names) {
    console.log(message);
    for (let i = 0; i < names.length; i++) {
        console.log(names[i]);
    }
}
printValue("sample 1");
printValue("sample 2", "1", "2");
printValue("sample 3", "1", "2", "abc");
function test5() {
    console.log(this);
}
test5();
const someObj = {
    name: "test",
    testFunc: test5,
};
someObj.testFunc();
const someInstance = new test5();
console.log(someInstance);
function test6(x, y) {
    console.log(x + y);
    console.log(this);
}
const someTestObj = {
    name: "test",
};
test6.call(someTestObj, 10, 20);
test6.apply(someTestObj, [30, 40]);
const newFunc = test6.bind(someTestObj, 50);
newFunc(60);
const increment = function (x) { return x + 1; };
const incrementArrow1 = (x) => { return x + 1; };
const incrementArrow2 = (x) => x + 1;
const incrementArrow3 = x => x + 1;
const myFunction = (callback) => {
    console.log(callback(10));
};
myFunction(x => x + 1);
function repeatOperation(count, callback) {
    console.log("start");
    for (let i = 0; i < count; i++) {
        callback();
    }
    console.log("stop");
}
const settings = {
    displayName: "test",
    test1() {
        repeatOperation(3, function () {
        });
    },
    test2() {
        repeatOperation(3, () => console.log(this.displayName));
    },
};
settings.test1();
settings.test2();
function showMessage(message) {
    switch (typeof message) {
        case "number":
            console.log("Hello");
            break;
        case "string":
            console.log(message);
            break;
    }
}
showMessage(1);
showMessage("test");
showMessage(true);
//# sourceMappingURL=TypeScript.js.map