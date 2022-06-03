import { Hello } from './hello.model';

const amount = 100;

function fibonacci(num){
  let a = 1;
  let b = 0;
  let temp;

  while (num >= 0){
    temp = a;
    a = a + b;
    b = temp;
    num--;
  }

  return b;
}

export default (next) => (create) => {
    const path = `hellos/hellosList.json`;
    const data = (amnt) => {
        const temp = [];
        for (let i = 0; i < amnt; i++) {
            temp.push(new Hello(
                i,
                `hello user ${i}`,
                fibonacci(i),
            ));
        }
        return temp;
    };
    create({ data: { hellos: data(amount) }, path });
    next(create);

};
