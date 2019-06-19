import {IVisitor} from './visitor';

export class DfsVisitor<T> implements IVisitor<T> {
    constructor(
        private readonly preVisit: (node: T) => T[],
        private readonly postVisit: (node: T) => void) { }

    visit(nodes: T[]): void {
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
                for (let i = children.length - 1; i >= 0; i--) {
                    const child = children[i];
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

            // The node was already visited, and is not on the stack, so just remove it.
            nodesToVisit.shift();
        }
    }
}
