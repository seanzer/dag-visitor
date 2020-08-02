import {IVisitor} from './visitor';

export class DfsVisitor<T> implements IVisitor<T> {
    constructor(
        private readonly preVisit: (node: T) => T[],
        private readonly postVisit: (node: T) => void) { }

    public visit(nodes: T[]): void {
        const nodesToVisit = nodes.slice();
        const visited = new Set<T>();
        const stack: T[] = [];
        while (nodesToVisit.length > 0) {
            const current = nodesToVisit[0];

            // If the stackTop matches current, then we are returning from traversal.
            const stackTop = stack[stack.length - 1];
            if (stackTop !== current) {
                // If node was alrady visited, skip re-visiting.
                if (visited.has(current)) {
                    nodesToVisit.shift();
                    continue;
                }

                visited.add(current);
                stack.push(current);

                // Previsit should return the reachable nodes to visit
                const reachable = this.preVisit(current);
                nodesToVisit.unshift(...reachable);
            } else {
                this.postVisit(current);

                nodesToVisit.shift();
                stack.pop();
            }
        }
    }
}
