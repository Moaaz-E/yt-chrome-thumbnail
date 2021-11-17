import { App } from "./app";
import BookMarkParentNode from "./components/BookmarkParentNode";
import { Component, OnClick, Renderer } from "./components/Core";
import { Append, AppendAny, IComponent } from "./components/IComponent";
import { InputFieldImp } from "./components/InputField";
import Scroll from "./components/Scroll";
import StarredBookMarkWrapper from "./components/StarredBookMarkWrapper";
import { Mutable } from "./components/State";
import { Button, Div } from "./HTMLTags";


// const app = new App("div.app");


// (async () => {
//     let bookmarks = await chrome.bookmarks.getTree();
//     bookmarks.forEach((bookmark) => {
//         // app.append(new BookMarkParentNode(bookmark, (n, e) => app.cb(n, e)));   
//         app.append(new StarredBookMarkWrapper(bookmark));
//         app.append(new BookMarkParentNode(bookmark));   
//     })
// })();

// PROTOTYPE FUNC



class PROTOTYPE_ONE implements IComponent {
    private draw_count = 0;
    private inner = new PROTOTYPE_TWO();
    private second_inner = new PROTOTYPE_THREE();
    render() {
        this.draw_count++;
        const div = Div();
        div.innerText = `OUTER DIV DRAWN ${this.draw_count} time(s)`;
        
        AppendAny(div)(this.inner, this.second_inner)
        
        return div;
    }
}

class PROTOTYPE_TWO implements IComponent {
    private drawn_count = 0;
    private uniqueId = Math.floor(Math.random()*100);
    private inner_state = new Mutable<boolean>(false);
    render() {
        this.drawn_count++;
        const div = Div();
        div.innerText = `INNER DIV ${this.uniqueId} DRAWN ${this.drawn_count} time(s)
        With state ${this.inner_state.$}
        `;

        const button = Button();
        button.innerText = "Click me";
        button.addEventListener("click", () => {
            this.inner_state.$ = !this.inner_state.$;

        })
        
        return Append(div)
        (button);
    }
}

class PROTOTYPE_THREE extends Component {
    private drawn_count = 0;
    private uniqueId = Math.floor(Math.random()*100);
    private inner_state = this.NewState<boolean>(false);
    private string_state = this.NewState<string>("hello, people");
    private input = new InputFieldImp(this.onInputChange.bind(this), this.string_state.ReactiveGet());

    render(): Element | null {
        this.drawn_count++;
        const div = Div();
        div.innerText = `INNER P3 DIV ${this.uniqueId} DRAWN ${this.drawn_count} time(s)
        With state ${this.inner_state.$}
        `;

        const button = Button();
        button.innerText = "Click me";
        button.addEventListener("click", () => {
            this.inner_state.$ = !this.inner_state.$;

        })
        
        return AppendAny(div)
        (button, this.input);
    }

    onInputChange(el : HTMLInputElement) {
        this.string_state.$ = "#" + el.value + "#"
    }
}
const app = new Renderer(new Scroll(), <HTMLElement>document.querySelector("div.app"));

// (async () => {
//     let bookmarks = await chrome.bookmarks.getTree();
//     const input = new InputFieldImp((el) => {});
//     bookmarks.forEach((bookmark) => {
//         // app.Append(new StarredBookMarkWrapper(bookmark));
//         app.Append(new BookMarkParentNode(bookmark));   
//     })
// })();


class Wrapper extends Component {
    private readonly input : InputFieldImp
    private readonly filter = this.NewState<string>("");
    private bookmarks : BookMarkParentNode[] = []
    constructor()
    {
        super()
        this.input = new InputFieldImp((el) => {
            this.filter.$ = el.value;
        }, this.filter.ReactiveGet());
        chrome.bookmarks.getTree().then((bookmarks) => {
            this.bookmarks = bookmarks.map((bookmark) => {
                // app.Append(new StarredBookMarkWrapper(bookmark));
                return new BookMarkParentNode(bookmark, undefined, undefined, undefined, this.filter.ReactiveGet());   
            })
            this.render();            
        });
    }

    render() {
        let div = Div()
        let ele = AppendAny(div)(this.input,...this.bookmarks);
        return ele;
    }
}

app.Append(new Wrapper());

app.Render();

// @ts-ignore
// import App  from "./test.svelte"
// const app = new App({
    // 	target: document.body,
    // 	props: {
        // 		name: 'world'
// 	}
// });

// export default app;