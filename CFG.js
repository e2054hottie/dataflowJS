function Edge(next,label){
    if(label === undefined){
        return {next:next,label:""};
    }else {
        return {next:next,label:label};
    }
}

class CFGNode extends Node {
    constructor(id,statement, type) {
        super();
        this.statement = statement;
        // 次のノードとエッジに対するラベル
        this.next = [];
        this.prev = [];
        this.id = id;
        this.type = type || "statement"; // ノードの種類 (statement, entry, exit, merge)
    }

    toString() {

        if (this.statement !== null){
            return this.statement.label();
        }
        else
            return this.type;

    }
}

class CFGBuilder {
    constructor() {
        this.nextNodeId = 0;
    }

    buildCFG(ast) {
        const nodes = [];

        // 開始ノードの追加
        const entryNode = new CFGNode(this.nextNodeId++, null, "start");
        nodes.push(entryNode);

        let prevNode = entryNode;

        for (const statement of ast) {
            const node = new CFGNode(this.nextNodeId++, statement);
            nodes.push(node);

            prevNode.next.push(Edge(node));
            node.prev.push(prevNode);

            prevNode = node;

            if (statement instanceof IfElse) {
                const thenNodes = this.buildCFG(statement.thenBlock);
                const elseNodes = statement.elseBlock ? this.buildCFG(statement.elseBlock) : [];

                // 合流ノードの追加
                const mergeNode = new CFGNode(this.nextNodeId++, null, "merge");
                nodes.push(mergeNode);

                node.next.push(Edge(thenNodes[0],true));
                thenNodes[0].prev.push(node);

                if (elseNodes.length > 0) {
                    node.next.push(Edge(elseNodes[0],false));
                    elseNodes[0].prev.push(node);
                } else {
                    node.next.push(Edge(mergeNode));
                    mergeNode.prev.push(node);
                }

                thenNodes[thenNodes.length - 1].next.push(Edge(mergeNode));
                mergeNode.prev.push(thenNodes[thenNodes.length - 1]);

                if (elseNodes.length > 0) {
                    elseNodes[elseNodes.length - 1].next.push(Edge(mergeNode));
                    mergeNode.prev.push(elseNodes[elseNodes.length - 1]);
                }

                nodes.push(...thenNodes);
                nodes.push(...elseNodes);
                prevNode = mergeNode;
            } else if (statement instanceof WhileLoop) {
                const loopNodes = this.buildCFG(statement.block);
                // 合流ノードの追加
                const mergeNode = new CFGNode( this.nextNodeId++, null, "exitLoop");
                nodes.push(mergeNode);

                node.next.push(Edge(loopNodes[0],true));
                loopNodes[0].prev.push(node);

                loopNodes[loopNodes.length - 1].next.push(Edge(node));
                node.prev.push(loopNodes[loopNodes.length - 1]);

                node.next.push(Edge(mergeNode,false));
                mergeNode.prev.push(node);

                nodes.push(...loopNodes);
                prevNode = mergeNode;
            }
        }

        // 終了ノードの追加
        const exitNode = new CFGNode(this.nextNodeId++, null, "end");
        nodes.push(exitNode);
        prevNode.next.push(Edge(exitNode));
        exitNode.prev.push(prevNode);

        return nodes;
    }
}