// // lib/CustomVideoBlot.ts
// import Quill from 'quill';

// const BlockEmbed = Quill.import('blots/block/embed');

// class VideoBlot extends BlockEmbed {
//   static blotName = 'video';
//   static tagName = 'iframe';

//   static create(value: string) {
//     const node = super.create() as HTMLIFrameElement;
//     node.setAttribute('src', value);
//     node.setAttribute('frameborder', '0');
//     node.setAttribute('allowfullscreen', 'true');
//     node.setAttribute('width', '100%');
//     node.setAttribute('height', '400');
//     return node;
//   }

//   static value(node: HTMLIFrameElement) {
//     return node.getAttribute('src');
//   }
// }

// Quill.register(VideoBlot);
