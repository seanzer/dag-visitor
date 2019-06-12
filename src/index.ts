export enum VisitorMode {
    BFS,
    DFS,
}

export class Visitor<T> {
    constructor(
        private readonly mode: VisitorMode,
        private readonly preVisit: (node: T) => T[],
        private readonly postVisit: (node: T) => void) { }

    visit(nodes: T[]): void {
        // clone to avoid client modifying the visitor
        const nodesToVisit = nodes.slice();

        // track visited nodes
        const visited = new Set<T>();

        // track nodes on the stack
        const stack = new Set<T>();
        while (nodesToVisit.length > 0) {
            const current = this.peek(nodesToVisit);

            // first time seeing this node, so put it on the stack and perform a previsit
            if (!stack.has(current)) {
                stack.add(current);
                const children = this.preVisit(current);
                for (const child of children) {
                    if (!stack.has(child)) {
                        this.add(nodesToVisit, child);
                    }
                }
            } else {
                this.pop(nodesToVisit);

                if (visited.has(current)) continue;
                visited.add(current);
                this.postVisit(current);
            }
        }
    }

    visit2(nodes: T[]): void {
        const nodesToVisit = nodes.slice();
        const visited = new Set<T>();
        const stack: T[] = [];
        while (nodesToVisit.length > 0) {
            const current = nodesToVisit[0];

            // if not yet visited, push it onto the stack and perform a previsit
            if (!visited.has(current)) {
                stack.push(current);
                visited.add(current);

                const children = this.preVisit(current);

                // previsit should return the children to visit
                for (const child of children.reverse()) {
                    if (!visited.has(child)) {
                        nodesToVisit.unshift(child);
                    }
                }

                continue;
            }

            // check if stack exists, otherwise node is likely already via another path
            const stackLen = stack.length;
            if (stackLen > 0) {
                // if the current was already visited, it should also be top of the stack
                const stackTop = stack[stackLen - 1];
                if (current !== stackTop) {
                    throw new Error(`Invalid stack: [current: ${current}, stackTop: ${stackTop}`);
                }

                this.postVisit(current);

                nodesToVisit.shift();
                stack.pop();
                continue;
            }

            nodesToVisit.shift();
        }
    }

    private add(nodes: T[], node: T): void {
        switch (this.mode) {
            case VisitorMode.DFS:
                nodes.unshift(node);
                break;
            case VisitorMode.BFS:
                nodes.push(node);
                break;
            default:
                throw new Error("invalid mode");
        }
    }

    private pop(nodes: T[]): T {
        const node = nodes.shift();
        if (!node) {
            throw new Error("Nodes is empty");
        }

        return node;
    }

    private peek(nodes: T[]): T {
        return nodes[0];
    }
}

interface Node {
    id: string;
    children: Node[];
}

function makeNode(id: string): Node {
    return {
        id: id,
        children: []
    };
}

const a = makeNode("1");
const b = makeNode("2");
const c = makeNode("3");

a.children.push(b);
c.children.push(a);
b.children.push(c);

const visitor = new Visitor<Node>(VisitorMode.DFS, node => {
    console.log(`previsit: ${node.id}`);
    return node.children;
},
    node => console.log(`postvisit: ${node.id}`));
visitor.visit2([a, c]);