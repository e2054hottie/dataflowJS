const ast = [
    new DecVariable("int", "x", new Variable("1")),
    new DecVariable("int", "y", new Arith("+", new Variable("x"), new Variable("3"))),
    new WhileLoop(

      new Arith(">", new Variable("z"), new Variable("5")),
      [new IfElse(
        new Arith(">", new Variable("y"), new Variable("4")),
        [new DecVariable("int", "z", new Variable("10"))],
        [new DecVariable("int", "z", new Variable("20"))]
      ),
      new DecVariable("int", "z", new Arith("-", new Variable("z"), new Variable("1")))]
    )
  ];

// CFGを構築
const cfgNodes = buildCFG(ast);

// GraphvizのDOT形式に変換
let dot = 'digraph CFG {\n';
cfgNodes.forEach(node => {
    dot += `  ${node.id} [label="${node.toString()}"];\n`;
    node.next.forEach(nextNode => {
        dot += `  ${node.id} -> ${nextNode.id};\n`;
    });
});
dot += '}';
console.log(dot);
// Viz.jsを使ってグラフを描画
const viz = new Viz();
viz.renderSVGElement(dot)
    .then(element => {
        console.log(document.getElementById('graph'));
        document.getElementById('graph').appendChild(element);
    })
    .catch(error => {
        console.error(error);
    });