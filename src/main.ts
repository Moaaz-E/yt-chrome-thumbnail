import { App } from "./app";
import BookMarkParentNode from "./components/BookmarkParentNode";
import StarredBookMarkWrapper from "./components/StarredBookMarkWrapper";

// (async () => {
//     let bookmarks = await chrome.bookmarks.getTree();
//     const app = <HTMLDivElement>document.querySelector("div.app");
//     bookmarks.forEach((bookmark) => {
//         app.appendChild(new BookMarkParentNode(bookmark).render());
//         // console.log(bookmark);
//         // let div = document.createElement("div");
//         // div.innerText = bookmark.title;
        
//     })
// })();

const app = new App("div.app");


(async () => {
    let bookmarks = await chrome.bookmarks.getTree();
    bookmarks.forEach((bookmark) => {
        // app.append(new BookMarkParentNode(bookmark, (n, e) => app.cb(n, e)));   
        app.append(new StarredBookMarkWrapper(bookmark));
        app.append(new BookMarkParentNode(bookmark));   
    })
})();



// @ts-ignore
// import App  from "./test.svelte"
// const app = new App({
// 	target: document.body,
// 	props: {
// 		name: 'world'
// 	}
// });

// export default app;