import React, { Component } from "react";
import SortableTree from "react-sortable-tree";
import { ReactSortableTreeProps } from "react-sortable-tree";
import { TreeItem } from "react-sortable-tree";
import "react-sortable-tree/style.css"; // This only needs to be imported once in your app
export default class Tree extends Component<
  ReactSortableTreeProps,
  { treeData: TreeItem[] }
  > {
  constructor(props: ReactSortableTreeProps) {
    super(props);

    this.state = {
      treeData: [
        {
          title: "Chicken",
          children: [
            { title: "Egg", children: [{ title: "yolk", children: [] }] }
          ]
        },
        { title: "Fish", children: [{ title: "fingerline" }] }
      ]
    };
  }

  render() {
    return (
      <div style={{ height: 400 }}>
        <SortableTree
          treeData={this.state.treeData}
          onChange={(treeData) => this.setState({ treeData })}
        />
      </div>
    );
  }
}
