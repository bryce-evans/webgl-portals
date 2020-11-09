class s{
    constructor(a, b=3) {
        this.a = a;
        this.b= b;
    }
}

class c extends s{
    constructor(x, ...args) {
        super(...args);
        this.x = x;
        console.log("a=", this.a);
    }
}

console.log(new c(5, a=2)) // error

var a = 10;
console.log(new c(5, a=2)) // succeeds

console.log(a) // 2