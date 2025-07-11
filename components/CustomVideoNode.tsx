import {
  $applyNodeReplacement,
  DecoratorNode,
  LexicalEditor,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import * as React from "react";

export type SerializedVideoNode = Spread<
  {
    src: string;
    type: "video";
    version: 1;
  },
  SerializedLexicalNode
>;

export class VideoNode extends DecoratorNode<React.ReactNode> {
  __src: string;

  static getType(): string {
    return "video";
  }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode(node.__src, node.__key);
  }

  constructor(src: string, key?: string) {
    super(key);
    this.__src = src;
  }

  createDOM(_config: any): HTMLElement {
    return document.createElement("div");
  }

  updateDOM(_prevNode: VideoNode, _dom: HTMLElement): boolean {
    return false;
  }

  decorate(_editor: LexicalEditor): React.ReactNode {
    return (
      <div className="my-4">
        <iframe
          width="100%"
          height="300"
          src={this.__src}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  static importJSON(serializedNode: SerializedVideoNode): VideoNode {
    return new VideoNode(serializedNode.src);
  }

  exportJSON(): SerializedVideoNode {
    return {
      type: "video",
      src: this.__src,
      version: 1,
    };
  }
}

export function $createVideoNode(src: string): VideoNode {
  return $applyNodeReplacement(new VideoNode(src));
}
