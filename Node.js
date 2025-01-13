class Node {
    constructor(label){
        this.label = label;
        this.next = [];
        this.prev = [];
        this.degree = 0;
    }

    setDegree(n){
        this.degree = n;
    }

    incDegree(){
        this.degree++;
    }
}