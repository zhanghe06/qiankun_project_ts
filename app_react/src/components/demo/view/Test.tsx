import React, { Component, useRef, useState } from 'react';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import { ActionType } from "@ant-design/pro-table";
import { ProFormInstance } from "@ant-design/pro-form"; // This only needs to be imported once in your app

export default () => {


  type Item = {
    title: string;
    children?: Item[];
  };

  const [treeData, setTreeData] = useState<Item[]>([
    { title: 'Chicken', children: [{ title: 'Egg' }] },
    { title: 'Fish', children: [{ title: 'fingerline' }] },
  ]);

  return (
    <div style={{ height: 400 }}>
    <SortableTree
      treeData={treeData}
      onChange={treeData => setTreeData(treeData)}
    />
    </div>
  )
}
