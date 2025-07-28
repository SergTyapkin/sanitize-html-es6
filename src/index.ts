// Use in all project only "<something>.js" imports. Yes, with .JS extension, no matter if it's .ts module


export default class YourPackage {
  a: number
  b: number

  constructor(paramA: number, paramB: number) {
    this.a = paramA;
    this.b = paramB;
  }

  getMultiplication() {
    return this.a * this.b;
  }

  getSum() {
    return this.a + this.b;
  }

  getDiff() {
    return this.a - this.b;
  }
};

