class CFGNode {
    constructor(statement, type) {
        this.statement = statement;
        this.next = [];
        this.prev = [];
        this.id = CFGNode.nextNodeId++;
        this.type = type || "statement"; // ノードの種類 (statement, entry, exit, merge)
    }

    toString() {

        if (this.statement !== null)
            return this.statement.label();
        else
            return this.type;

    }
}
CFGNode.nextNodeId = 0;

function buildCFG(ast) {
    const nodes = [];

    // 開始ノードの追加
    const entryNode = new CFGNode(null, "start");
    nodes.push(entryNode);

    let prevNode = entryNode;

    for (const statement of ast) {
        const node = new CFGNode(statement);
        nodes.push(node);

        prevNode.next.push(node);
        node.prev.push(prevNode);

        prevNode = node;

        if (statement instanceof IfElse) {
            const thenNodes = buildCFG(statement.thenBlock);
            const elseNodes = statement.elseBlock ? buildCFG(statement.elseBlock) : [];

            // 合流ノードの追加
            const mergeNode = new CFGNode(null, "merge");
            nodes.push(mergeNode);

            node.next.push(thenNodes[0]);
            thenNodes[0].prev.push(node);

            if (elseNodes.length > 0) {
                node.next.push(elseNodes[0]);
                elseNodes[0].prev.push(node);
            } else {
                node.next.push(mergeNode);
                mergeNode.prev.push(node);
            }

            thenNodes[thenNodes.length - 1].next.push(mergeNode);
            mergeNode.prev.push(thenNodes[thenNodes.length - 1]);

            if (elseNodes.length > 0) {
                elseNodes[elseNodes.length - 1].next.push(mergeNode);
                mergeNode.prev.push(elseNodes[elseNodes.length - 1]);
            }

            nodes.push(...thenNodes);
            nodes.push(...elseNodes);
            prevNode = mergeNode;
        } else if (statement instanceof WhileLoop) {
            const loopNodes = buildCFG(statement.block);
            // 合流ノードの追加
            const mergeNode = new CFGNode(null, "exitLoop");
            nodes.push(mergeNode);

            node.next.push(loopNodes[0]);
            loopNodes[0].prev.push(node);

            loopNodes[loopNodes.length - 1].next.push(node);
            node.prev.push(loopNodes[loopNodes.length - 1]);

            node.next.push(mergeNode);
            mergeNode.prev.push(node);

            nodes.push(...loopNodes);
            prevNode = mergeNode;
        }
    }

    // 終了ノードの追加
    const exitNode = new CFGNode(null, "end");
    nodes.push(exitNode);
    prevNode.next.push(exitNode);
    exitNode.prev.push(prevNode);

    return nodes;
}