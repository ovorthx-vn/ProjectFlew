"use client"

import React from 'react';

interface MindMapDisplayProps {
  mindMapText: string;
}

interface MindMapNode {
  text: string;
  level: number;
  children: MindMapNode[];
}

// Function to parse the text into a tree structure
const parseMindMapText = (text: string): MindMapNode[] => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const rootNodes: MindMapNode[] = [];
  const nodeStack: MindMapNode[] = [];

  lines.forEach(line => {
    const level = (line.match(/^\t*/)?.[0].length || 0);
    const text = line.trim();

    const newNode: MindMapNode = { text, level, children: [] };

    while (nodeStack.length > 0 && nodeStack[nodeStack.length - 1].level >= level) {
      nodeStack.pop();
    }

    if (nodeStack.length > 0) {
      nodeStack[nodeStack.length - 1].children.push(newNode);
    } else {
      rootNodes.push(newNode);
    }

    nodeStack.push(newNode);
  });

  return rootNodes;
};

// Recursive component to render the nodes
const renderNode = (node: MindMapNode, isRoot: boolean = false) => {
  return (
    <div key={node.text + node.level} className={`relative ${isRoot ? '' : 'pl-8'}`}>
        {!isRoot && (
            <div className="absolute left-3 top-2.5 h-full w-px bg-border"></div>
        )}
        {!isRoot && (
             <div className="absolute left-3 top-2.5 h-px w-5 bg-border"></div>
        )}
        <div className="relative flex items-center">
             <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary/20 border-2 border-primary"></div>
            <div className="ml-4 p-1 rounded-md text-sm font-medium">{node.text}</div>
        </div>
        
        {node.children.length > 0 && (
            <div className="mt-1">
                {node.children.map(child => renderNode(child))}
            </div>
        )}
    </div>
  );
};


export function MindMapDisplay({ mindMapText }: MindMapDisplayProps) {
    if (!mindMapText || mindMapText.trim() === '') {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>No mind map created yet. Use the editor below to create one.</p>
            </div>
        );
    }
  const tree = parseMindMapText(mindMapText);

  return (
    <div className="space-y-2">
      {tree.map(node => renderNode(node, true))}
    </div>
  );
}