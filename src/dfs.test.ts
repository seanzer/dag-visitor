import { DfsVisitor } from './dfs';
import { IVisitor } from './visitor';

class Node {
    children: Node[] = [];
    constructor(readonly id: string) { }
}

describe('DfsVisitor', () => {
    function makeNode(id: string, map: Map<string, Node>): Node {
        const node = new Node(id);
        map.set(id, node);
        return node;
    }

    describe('on a simple graph with cycles', () => {
        const nodesById = new Map<string, Node>();
        beforeEach(() => {
            const a = makeNode('a', nodesById);
            const b = makeNode('b', nodesById);
            const c = makeNode('c', nodesById);
            const d = makeNode('d', nodesById);

            // {a: b}
            // {b: c, d}
            // {c: a, b}
            // {d: a}
            a.children.push(b);
            b.children.push(c);
            b.children.push(d);
            c.children.push(a);
            c.children.push(b);
            d.children.push(a);
        });

        it('should traverse a graph with cycles', () => {
            const order: string[] = [];
            const visitor: IVisitor<Node> = new DfsVisitor<Node>(
                (node) => {
                    order.push(`previsit: ${node.id}`);
                    // tslint:disable-next-line:no-console
                    // console.log(`previsit: ${node.id}`);
                    return node.children;
                },
                (node) => {
                    order.push(`postvisit: ${node.id}`);
                    // tslint:disable-next-line:no-console
                    // console.log(`postvisit: ${node.id}`);
                });

            visitor.visit([nodesById.get('a')!, nodesById.get('b')!]);
            expect(order).toEqual([
                'previsit: a',
                'previsit: b',
                'previsit: c',
                'postvisit: c',
                'previsit: d',
                'postvisit: d',
                'postvisit: b',
                'postvisit: a']);
        });
    });
});
