class Node {
    use() {
        return new Set();
    }

    def() {
        return new Set();
    }

    label(){
        return "label";
    }
}

class Expression extends Node { }
class Statement extends Node { }

class Variable extends Expression {
    constructor(name) {
        super();
        this.name = name;
    }

    use() {
        return new Set([this.name]); // Setを返すように修正
    }

    toString() {
        return this.name;
    }
}

class Arith extends Expression {
    constructor(op, e1, e2) {
        super();
        this.op = op;
        this.e1 = e1;
        this.e2 = e2;
    }

    use() {
        let useSet = new Set();
        for (let item of this.e1.use()){
            useSet.add(item);
        }
        for (let item of this.e2.use()){
            useSet.add(item);
        }
        return useSet; // 正しい結合
    }

    toString() {
        return this.e1.toString() + " " + this.op + " " + this.e2.toString();
    }
}

class DecVariable extends Statement {
    constructor(type, name, init) {
        super();
        this.type = type;
        this.name = name;
        this.init = init;
    }

    use() {
        return this.init.use();
    }

    def() {
        return new Set([this.name]);
    }

    toString(){
        return this.type + " " + this.name + " = " + this.init.toString();
    }

    label(){
        return this.toString();
    }
}

class IfElse extends Statement {
    constructor(cond, thenBlock, elseBlock) {
        super();
        this.cond = cond;
        this.thenBlock = thenBlock;
        this.elseBlock = elseBlock;
    }

    use() {
        let useSet = this.cond.use();
        for(const statement of this.thenBlock){
            for(const use of statement.use()){
                useSet.add(use);
            }
        }
        if(this.elseBlock){
            for(const statement of this.elseBlock){
                for(const use of statement.use()){
                    useSet.add(use);
                }
            }
        }
        return useSet;
    }
    toString(){
        let str = "if (" + this.cond.toString() + ") {\n";
        for(const statement of this.thenBlock){
            str += "    " + statement.toString() + ";\n";
        }
        str += "} else {\n";
        if(this.elseBlock){
            for(const statement of this.elseBlock){
                str += "    " + statement.toString() + ";\n";
            }
        }
        str += "}\n";
        return str;
    }
}

class WhileLoop extends Statement{
    constructor(cond, block){
        super();
        this.cond = cond;
        this.block = block;
    }

    use(){
        let useSet = this.cond.use();
        for(const statement of this.block){
            for(const use of statement.use()){
                useSet.add(use);
            }
        }
        return useSet;
    }

    toString(){
        let str = "while (" + this.cond.toString() + ") {\n";
        for(const statement of this.block){
            str += "    " + statement.toString() + ";\n";
        }
        str += "}\n";
        return str;
    }

    label(){
        return `while(${this.cond.toString()})`
    }
}