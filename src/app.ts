import { OnClick, OnScroll } from "./components/Core";
import { IComponent } from "./components/IComponent";
import InputField from "./components/InputField";
import StarredBookMarkWrapper from "./components/StarredBookMarkWrapper";
import { GetSharedMutable, Mutable, SetSharedMutable, StarredLocalStorage, state } from "./components/State";
import svg from "./components/svg";

export class App {
    private readonly mount : Element;
    private readonly elements : IComponent[] = [];
    private readonly ExpandedNodes : Set<string> = new Set<string>();
    private readonly filter = new Mutable<string>("");
    private renderId: number = 0;

    cb(node: chrome.bookmarks.BookmarkTreeNode, expanded: boolean) {
        if(expanded) {
            this.ExpandedNodes.add(node.id);
        }
        else {
            this.ExpandedNodes.delete(node.id);
        }
        window.localStorage.setItem("expanded", Array.from(this.ExpandedNodes.values()).join(","));
    };

    constructor(mountSelector: string) {
        /*
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
        */
        SetSharedMutable("search", "");
        this.mount = document.querySelector(mountSelector) ?? document.createElement("div")
        
        const scroll = new svg({className: "z-10 transition-transform ease-in-out duration-300 fixed bottom-0 right-0 h-12 w-12 rounded-full ring-2 m-4 bg-white shadow-md ring-opacity-50 cursor-pointer ring-gray-200", pathD: "M19 14l-7 7m0 0l-7-7m7 7V3"}); 
        OnClick(scroll, (ev) => {
            if(window.scrollY <= document.body.scrollHeight/2) {
                window.scrollTo({behavior: "smooth", left: 0, top: document.body.scrollHeight});
            }
            else {
                window.scrollTo({behavior: "smooth", left: 0, top: 0});
            }
            const target = <HTMLElement>ev.target;
            // target.classList.add("rotate-180", "transition-transform", "ease-in-out", "duration-300")
        })

        OnScroll(scroll, (el) => {
            if(window.scrollY <= document.body.scrollHeight/2) {
                el.classList.remove("rotate-180")
            }
            else {
                el.classList.add("rotate-180")
            }
        })

       

        // this.append(input);
        
        this.append(scroll);
        state.addListener((token) => this.render(token));
    }
    render(options? : {cancel : boolean}) {
        this.renderId = Math.random();
        const thisRenderId = this.renderId;

        if(!options) {
            options = {cancel : false};
        }
        if(this.mount) {
            while(this.mount.firstElementChild) {
                this.mount.firstElementChild.remove();
            }


            // TODO fix this prop
            this.mount.append(new InputField((el) => {
                // this.filter.$ = el.value;
                SetSharedMutable("search", el.value);
            }, GetSharedMutable("search")).render());
            

            this.elements.forEach((element) => 
            {
                const _element = element.render()
                // @ts-ignore
                if(this.renderId == thisRenderId && _element) {
                    this.mount.appendChild(_element);
                }
            })

        }
    }
    append(component : IComponent) {
        this.elements.push(component);
        this.render()
    }    
}