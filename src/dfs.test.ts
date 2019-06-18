import {DfsVisitor} from "./dfs";
import {IVisitor} from "./visitor";

class Node {
    children: Node[] = [];
    constructor(readonly id: string) {}
}

function makeNode(id: string): Node {
    return new Node(id);
}

const a = makeNode("1");
const b = makeNode("2");
const c = makeNode("3");
const d = makeNode("4");

a.children.push(b);
c.children.push(a);
b.children.push(c);
b.children.push(d);
d.children.push(a);

const visitor: IVisitor<Node> = new DfsVisitor<Node>((node) => {
    // tslint:disable-next-line:no-console
    console.log(`previsit: ${node.id}`);
    return node.children;
},
    // tslint:disable-next-line:no-console
    (node) => console.log(`postvisit: ${node.id}`));

visitor.visit([a, c]);
