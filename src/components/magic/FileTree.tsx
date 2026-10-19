export type TreeNode = { name: string; children?: TreeNode[] };

// After Magic UI's File Tree (MIT, https://magicui.design), built on native <details> so folders open
// with mouse, keyboard and screen readers without any script.
function Node({ node, open = false }: { node: TreeNode; open?: boolean }) {
  if (!node.children) return <li className="file-tree-file">{node.name}</li>;
  return (
    <li>
      <details open={open}>
        <summary className="file-tree-folder">{node.name}</summary>
        <ul className="file-tree-children">
          {node.children.map((c) => (
            <Node key={c.name} node={c} />
          ))}
        </ul>
      </details>
    </li>
  );
}

export function FileTree({ root }: { root: TreeNode }) {
  return (
    <ul data-file-tree className="file-tree" aria-label={`Files in ${root.name}`}>
      <Node node={root} open />
    </ul>
  );
}
