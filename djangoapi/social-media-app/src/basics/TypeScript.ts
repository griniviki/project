

let message1 = "Hello";
let message2: string
message2 = "hi";
let message3: string
message3 = "Tschuess";

const message4: string = "Hallo";
// змінні, створені з var, знаходяться в глобальній або
// локальній області, яка представлена функцією. 
// Змінна доступна до визначення і після будь-якого блоку 
// В JS для змінних, створених за доп var, існують
// функціональна та глобальна області В
// нижче область В - вся функція
var i = 1; // цю змінну функція не бачить
function var1() {
    //console.log(i);  // undefinied
    //console.log(test); // undefinied

    for (var i = 0; i<10; i++) {
        var test = i;
    }
    console.log(i); // 10
    //console.log(test); //9
}
var1();
// повторне визначення не призводить до помилки
function var2() {
    var a = 10;
    var a = 20;
    console.log(a);  // 20
}
var2();
// виведе 5, 5, 5, 5, 5 
// функції setTimeout кожного разу передається одна і та сама змінна зОВ функції
function var3() {
    for (var i = 0; i < 5; i++) {
        setTimeout(function () {
            console.log(i);
        }, 10);
    }
}
var3();
// use let instead of var (hoisting is not working)
function let1 () {
    console.log(i); // cannt find name i
    for (let i = 0; i < 10; i++) {
        let test = i;
    }
    console.log(i);  // cannt find name i
}
let1();

// ****** //
let a = 100;
function let2() {
    let a= 10;
    // you cant redeclare block-scoped variable a (rar and let)
    // var or let =20;
    console.log(a);
}
console.log(a);

// 0. 1,2,3,4,5
function let3() {
    for (let i = 0; i < 5; i++) {
        setTimeout(function () {   // в середині callback SetTimeout
            console.log(i);
        }, 10)
    }
}
let3();

// TYPES
let isDone: boolean = false;
const a1_int: number = 10;
const a2_float: number = 10.1;  // 10.1
const a3_hex: number = 0x000a;   // 10
const a4_binary: number = 0b1010;  // 10
const a5_octal: number = 0o12;   // 10
console.log(a2_float);   
console.log(a3_hex);
console.log(a4_binary);
console.log(a5_octal);
const firstName: string = "Ivan";
const age: number = 25;
const messageTemplate: string = `Hello, I am ${firstName} + I am ${age}`;
const messageConcat: string = 'Hello, my name is' + firstName + age;
// Symbol is also a primitive type
const mySymbol1: Symbol = Symbol('typescript');
console.log(mySymbol1);
const mySymbol2: Symbol = Symbol('typesript');
console.log(mySymbol2);
console.log(mySymbol1 === mySymbol2);  // false, every call to Symbol() returns a distinct, unique value
// ARRAYS
// масив рядкових значень. В TS є всі методи масивів що і в JS (push, pop, map, filter)
let year: (string | number | boolean)[];
year = ['January', 'February', 'March'];
const list: number[] = [1, 2, 3, 4];
for (let i = 0; i < list.length; i++) {
    console.log(list[i]);
}
// створення масиву використовуючи generic тип даних Array
const values: Array<number | string> = [-1, -2, -3];
for (let i = 0; i < values.length; i++) {
    console.log(values[i]); 
}
// вкладені масиви
const nested: number[][] = [[1], [2], [3]];
// const nested: Array<Array<number>> = [[1], [2], [3]];
for (let i = 0; i < nested.length; i++) {
    console.log(nested[i]);
}
// tuples, кортеж - упорядкований набір фіксованої довжини
// string[] Масив | [string, string] Кортеж
let x: [string, number];  // визначення кортежу
x = ['Hello', 10]; // ініціалізація кортежу
console.log(x);  // (2) ['Hello', 10]
console.log(x[0]);  // Hello
console.log(x[1]);  // 10
const y: [number, string, string] = [1, 'hello', 'world'];
console.log(y[2]);  
// y[0].toLowerCase(); // Property 'oLowerCase' doesnt exist on type number
// enum - перелік, тип даних, який дозволяє задати імена набору цілих значень 
// за замовчуванням перерахування нумерують свої елементи починаючи з 0
// Red = 0, Green = 1, Blue = 2
enum Color {
    Red,
    Green,
    Blue,
}
const c1: Color = Color.Green;
console.log(c1); 
// кожному елементу переахування явно встановлюється значення 
enum Status {
    Success = 1,
    Error = 5,
    Rejected = 10,
}
const c2: Status = Status.Success;
console.log(c2);
// оскільки першому елементу явно встановлено значення 2, всі наступні 
// продовжуватимуть нумерацію з 2 
// Circle = 2, Triangle = 3, Square = 4
enum Shape {
    Circle = 2,
    Triangle,
    Square,
}
const c3 : Shape = Shape.Square;
console.log(c3);
const c4: string = Status[1];
console.log(c4); // Success
enum Shape {
    Circ = 'circle',
    Tria = 'triangle',
    Sq = 'square',
}
const cd : Shape = Shape.Sq; 
console.log(cd); // square
// Example for usage

enum Fruit {
    Apple,
    Orange,
    Tomato,
}

function drawImage2(fruit: number) {
    const domElement:HTMLImageElement = document.createElement('img');
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
    rightSection?.appendChild(domElement);

}
drawImage2(Fruit.Orange);
// dont use any
let someValue: any = "Hello"; // string
someValue = false; // boolean
someValue = 100; // number
someValue.toFixed(); // last assignment was to a number
// void - тип даних, що вказує на відсутність б-я значення 
// Використовується,щоб при визначенні функції 
// явно вказати на відсутність значення, що повертається 
function myProcedure(): void {
    alert('hello');
}
// void можна використати для змінної зі значенням null or undefined
let someValue1: void = undefined;
someValue = null;
// за замовчуванням null і undefined м б присвоєні б я іншому типу даних??
//let testNumber8: number = undefined;??
 // Type assertion - затвердежння типів (приведення типів) 
 // За допомогою можна підказати компілятору, тип з яким працюємо
 let someData: any = "Hello";  // Це означає, що компілятор не знає, який саме тип там зберігається.
 // твердження, що значення someData є типом string
 // використання синтаксису "angle-bracket"
 let strlength1: number = (<string>someData).length;
// твердження, що значення someData є типом string
 // використання синтаксису "as"
 let strlength2: number = (someData as string).length;
 function add1(x,y) {
    return x+y;
 }
 const result1 = add1(1, 2); // наведи курсор на add1
 console.log(result1);
// Типізована функція. Приймає два аргументи типу number та повертає number
function add2(x: number, y: number) {
    return x+y;
    // return "hello"; // should be a mistake
}
//const result2: number = add2(10, 20);
// const result2: number = add2(10); // should be two params
// const result2: number = add2(10, "text"); // should be a number
const result3: string = add2(10, 20);
console.log(result3);
// під час створення змінної можна вказати тип даних 
// який визначає сигнатуру функції. параметри => тип, що повертається.
// приймає два параметри типу і повертає значення 
let myAdd: (x: number, y: number) => number;
// змінній може бути присвоєно функцію, яка нічого не приймає і не повертає
let myProc: () => void;
function myAddDeclaration(x:number, y: number): number {
    return x+y;
}
myAdd = myAddDeclaration;
console.log(myAdd(11, 11, 11)); // виклик функції

myProc = function(): void {  // немає помилки, бо сигнатура відповідає типу myProc вище
    console.log("Hello me");
};
myProc();
// У TS всі параметри функції обовязкові, 
// але якщо вказати ?, він стане опціональним, 
// і якщо під час виклику його не надати, значення цього параметра буде undefined
// опціональні параметри м б тільки останніми
function getFullName(firstName: string, lastName?: string): string {
    if (lastName) {
        return firstName + " " +lastName;
    } else {
        return firstName;
    }
}
const fullName1: string = getFullName("Ivan", "Kapytko");
const fullName2: string = getFullName("Ivan");
console.log(fullName1);
console.log(fullName2);

// Параметри зі значенням за замовченням - параметри методу,
// котрим у оголошенні функції присвоєно значення,
// яке буде використовуватися, якщо функція буде викликана 
// без вказівки значення для данного параметра або якщо значення буде  undefined
function getDisplayName(firstName: string, lastName: string = "Kapytko") {
    return "Display Name:" + firstName + " " + lastName;
}
const fullName3: string = getDisplayName("Ivan", "Kapytko");
const fullName4: string = getDisplayName("Ivan");
const fullName5: string = getDisplayName("Ivan", undefined);
console.log(fullName3);
console.log(fullName4);
console.log(fullName5);
// rest parasm ... стоять в кінці // при виклику такого методу кількість параметрів не обмежується
// тип цієї функції - (message: string, ...names: string[]) => void
// ...names - типом завжди буде масив
function printValue(message: string, ...names: string[]): void {
    console.log(message);
    for (let i = 0; i < names.length; i++) {
        console.log(names[i]);
    }
}
printValue("sample 1"); // prints only message
printValue("sample 2", "1", "2"); // prints  message + two names
printValue("sample 3", "1", "2", "abc");
// sample 3
// 1
// 2
// abc
function test5() { 
    console.log(this);
}
test5(); 
// this - контекст функції
// this - змінна, яка встановлюється під час запуску функції
// У strict mode, коли ти викликаєш звичайну функцію test5() без об’єкта,
// значення this всередині неї буде undefined.
// У старому (не strict) JavaScript this у такому випадку посилався 
// б на глобальний об’єкт (window у браузері, global у Node.js).
const someObj = {
    name: "test",
    testFunc: test5,
}
someObj.testFunc(); // {name: 'test', testFunc: ƒ} 
const someInstance = new test5(); // test5 {}
console.log(someInstance);
// встановлення контексту функції, що викликається
function test6(x: number, y: number) {
    console.log(x+y);
    console.log(this);
}
const someTestObj = {
    name: "test",
};
test6.call(someTestObj, 10, 20); // 30
test6.apply(someTestObj, [30, 40]); // 70
const newFunc = test6.bind(someTestObj, 50); //110
newFunc(60);

const increment = function (x: number) {return x +1;}
const incrementArrow1 = (x: number) => {return x +1;}
const incrementArrow2 = (x: number) => x +1;
const incrementArrow3 = x => x +1;
// використання => як функції зворотнього виклику
const myFunction = (callback: (x: number) => number): void => {
    console.log(callback(10));  // 11
}
myFunction(x => x+1);
function repeatOperation(count: number, callback: () => void): void {
    console.log("start");
    for (let i = 0; i < count; i++) {
        callback();
        // контекст функції - глоб обєкт
        // якщо в функції callback використовується контекст,
        // він теж буде посилатися на глоб обєкт
    }
    console.log("stop");
}
const settings = {
    displayName: "test",
    test1() {
        // в данному випадку this вказує на обєкт settings
        repeatOperation(3, function() {
            //console.log(this.displayName); // error
        });
    },
    test2() {
        // => захоплює контекст, у якому була створена
        repeatOperation(3, () => console.log(this.displayName));
    },
};
settings.test1();
settings.test2();
function showMessage(message: string): void;
function showMessage(message: number): void;
function showMessage(message: any): void {
    // безпосередньо реалізація функції не є перезавантаженням
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