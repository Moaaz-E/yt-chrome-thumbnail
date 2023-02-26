import "svelte"
import Test from './test.svelte';
import {App} from "./app"
import "./style/_main.css"
import "./style/main.scss"
const app = new Test({
	target: document.body,
	props: {
		// we'll learn about props later
		answer: 42
	}
});


// export default app

// const l = new App(".app")

// const app = new Renderer(new Scroll(), <HTMLElement>document.querySelector("div.app"));

// // (async () => {
// //     let bookmarks = await chrome.bookmarks.getTree();
// //     const input = new InputFieldImp((el) => {});
// //     bookmarks.forEach((bookmark) => {
// //         // app.Append(new StarredBookMarkWrapper(bookmark));
// //         app.Append(new BookMarkParentNode(bookmark));   
// //     })
// // })();


// class Wrapper extends Component {
//     private readonly input : InputFieldImp
//     private readonly filter = this.NewState<string>("");
//     private bookmarks : BookMarkParentNode[] = []
//     constructor()
//     {
//         super()
//         this.input = new InputFieldImp((el) => {
//             this.filter.$ = el.value;
//         }, this.filter.ReactiveGet());
//         chrome.bookmarks.getTree().then((bookmarks) => {
//             this.bookmarks = bookmarks.map((bookmark) => {
//                 // app.Append(new StarredBookMarkWrapper(bookmark));
//                 return new BookMarkParentNode(bookmark, undefined, undefined, undefined, this.filter.ReactiveGet());   
//             })
//             this.render();            
//         });
//     }

//     render() {
//         let div = Div()
//         let ele = AppendAny(div)(this.input,...this.bookmarks);
//         return ele;
//     }
// }

// app.Append(new Wrapper());

// app.Render();