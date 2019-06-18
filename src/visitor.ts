export interface IVisitor<T> {
    visit(nodes: T[]): void;
}
