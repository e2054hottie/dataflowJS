const defaultData = 
`
int a = 112 + 332 * 334 + 32;
int b = a;
int c = a + b ;
int d = 3 + a + d;

while(a > b){
  if(c > d){
    while(d > d){
      int f = 22;
      a = f + b;
      c = d + a;
    }
  }else {
    if(a>b){
      int a = 11;
    }else {
      b = 22;
    }
  }
}
`
const programTextarea = document.getElementById("program")
programTextarea.value = defaultData;

function processProgram() {
  document.getElementById('graph').innerHTML = "";
  const prog = document.getElementById("program").value ;
  const ast = peg$parse(prog);
  // CFGを構築
  const builder = new CFGBuilder();
  const cfgNodes = builder.buildCFG(ast);

  // GraphvizのDOT形式に変換
  let dot =
    'digraph CFG {\nnode [shape="polygon"]\n';
  cfgNodes.forEach(node => {
    dot += `  ${node.id} [label="${node.toString()}"];\n`;
    node.next.forEach(nextNode => {
      console.log(nextNode);
      dot += `  ${node.id} -> ${nextNode.next.id} [label="${nextNode.label}"];\n`;
    });
  });
  dot += '}';
  console.log(dot);
  // Viz.jsを使ってグラフを描画
  const viz = new Viz();
  viz.renderSVGElement(dot)
    .then(element => {
      document.getElementById('graph').appendChild(element);
    })
    .catch(error => {
      console.error(error);
    });
}

programTextarea.addEventListener('input', processProgram);
processProgram();