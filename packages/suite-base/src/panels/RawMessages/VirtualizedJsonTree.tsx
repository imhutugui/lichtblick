// SPDX-FileCopyrightText: Copyright (C) 2023-2025 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MPL-2.0

/* eslint-disable no-empty-pattern */

/* eslint-disable @typescript-eslint/strict-boolean-expressions */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { useMemo } from "react";
import { FixedSizeTree } from "react-vtree";

import { DiffSpan } from "./DiffSpan";

type TreeNode = {
  id: string;
  name: string;
  value: unknown;
  nestingLevel: number;
  isLeaf: boolean;
  isOpenByDefault: boolean;
};

function* jsonTreeWalker(
  {}: { _refresh: boolean },
  props?: { root?: unknown; maxInitialDepth?: number },
) {
  const root = props?.root ?? {};
  const maxInitialDepth = props?.maxInitialDepth ?? 2;

  function* walk(node: unknown, path: string, nestingLevel: number): Generator<TreeNode> {
    const isObject = node && typeof node === "object";
    const keys = isObject ? Object.keys(node) : [];

    const currentName = path === "" ? "(root)" : path.split(".").pop() ?? "(unknown)";

    yield {
      id: path || "(root)",
      name: currentName,
      value: node,
      nestingLevel,
      isLeaf: !isObject || keys.length === 0,
      isOpenByDefault: nestingLevel < maxInitialDepth,
    };

    if (isObject) {
      const limitedKeys = keys.slice(0, 100);
      for (const key of limitedKeys) {
        const child = node[key];
        const childPath = path ? `${path}.${key}` : key;
        yield* walk(child, childPath, nestingLevel + 1);
      }
    }
  }

  yield* walk(root, "", 0);
}

type VirtualizedJsonTreeProps = {
  data: unknown;
  fontSize?: number;
  renderValue: (label: string, value: unknown) => React.ReactNode;
  height?: number;
  width?: number;
};

export default function VirtualizedJsonTree({
  data,
  fontSize = 12,
  renderValue,
  height = 800,
  width = 800,
}: VirtualizedJsonTreeProps) {
  const treeWalker = useMemo(() => jsonTreeWalker, []);

  return (
    <FixedSizeTree<TreeNode>
      itemSize={28}
      height={height}
      width={width}
      treeWalker={() => treeWalker(true, { root: data })}
    >
      {({ data: nodeData, isOpen, toggle, style }) => {
        const { nestingLevel, name, value, isLeaf } = nodeData;

        const isComplex = value && typeof value === "object";

        return (
          <div
            style={{
              ...style,
              paddingLeft: nestingLevel * 20,
              fontFamily: "monospace",
              display: "flex",
              alignItems: "center",
              fontSize,
              whiteSpace: "nowrap",
            }}
          >
            {!isLeaf && (
              <span onClick={toggle} style={{ cursor: "pointer", marginRight: 4 }}>
                {isOpen ? "▼" : "▶"}
              </span>
            )}
            <DiffSpan>
              {name}
              {!isComplex ? ":" : ""}
            </DiffSpan>
            {!isComplex && <span style={{ marginLeft: 8 }}>{renderValue(name, value)}</span>}
          </div>
        );
      }}
    </FixedSizeTree>
  );
}
