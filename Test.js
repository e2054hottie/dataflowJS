// 複雑なASTの生成
const a = new Variable("a");
const b = new Variable("b");
const c = new Variable("c");
const d = new Variable("d");

ast = [
    new DecVariable("int", a.name, new Integer(10)), // int a = 10;
    new DecVariable("int", b.name, new Integer(20)), // int b = 20;
    new IfElse(
        new Arith(">", a, b), // if (a > b)
        [
            new DecVariable("int", c.name, new Arith("*", a, a)), // int c = a * a;
            new WhileLoop(
                new Arith(">", c, new Integer(0)), // while (c > 0)
                [
                    new Assign(b, new Arith("-", b, new Integer(1))), // b = b - 1;
                    new Assign(c, new Arith("-", c, new Integer(1))), // c = c - 1;
                    new IfElse(
                        new Arith("==", b, new Integer(15)),
                        [
                            new Assign( a, new Integer(100))
                        ],
                        []
                    )
                ]
            ),
            new Assign(d, new Arith("+", a, b))
        ],
        [
            new Assign(a, new Arith("+", b, new Integer(5))), // a = b + 5;
        ]
    ),
];