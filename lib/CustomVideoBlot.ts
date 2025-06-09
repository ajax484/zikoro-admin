// import Quill from "quill";

// // Cast BlockEmbed properly for TypeScript
// const BlockEmbed = Quill.import("blots/block/embed") as any;

// class CustomVideoBlot extends BlockEmbed {
//   static blotName = "customVideo";
//   static tagName = "div";
//   static className = "youtube-preview";

//   static create(value: string) {
//     const node = super.create() as HTMLElement;
//     const videoId = value.split("embed/")[1];
//     node.innerHTML = `
//       <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">
//         <iframe
//           src="https://www.youtube.com/embed/${videoId}"
//           frameborder="0"
//           allowfullscreen
//           style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
//         ></iframe>
//       </div>
//     `;
//     return node;
//   }

//   static value(node: HTMLElement) {
//     return node.querySelector("iframe")?.getAttribute("src") || "";
//   }
// }

// // Register with Quill
// Quill.register(CustomVideoBlot);
