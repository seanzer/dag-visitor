# dag-visitor

A generic visitor library for directed-acyclic graphs in JavaScript. 
The purpose of this library is to use best practices for traversing 
a graph. It avoids using recursion to enable processing of large 
graphs.

## Example usage
```
// Setup a DAG
const a = { id: 'a', children: []};
const b = { id: 'b', children: []};
a.children.push(b);

const dfsVisitor = new DfsVisitor(
    (node) => { console.log(`previsit: ${node.id}`); },
    (node) => { console.log(`postvisit: ${node.id}`); });

dfsVisitor.visit([a, b]);

// previsit: a
// previsit: b
// postvisit: b
// postvisit: a
```
