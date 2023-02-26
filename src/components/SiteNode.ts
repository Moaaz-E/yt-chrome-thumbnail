import {IComponent, Append} from "./IComponent";
import { GetSharedMutable, Getter, MountableElement } from "./State";
import "../style/main.scss";
import { Component } from "./Core";

export default class SiteNode extends Component {
    private url : string;
    private depth : number;
    private title: string;
    private event : NodeJS.Timeout | undefined;
    private init = false;
    private date: number;
    private img! : HTMLImageElement;
    private filter :Getter<string>;
    element!: HTMLElement;

    constructor(url : string, title : string, date : number | undefined, depth : number, filter? : Getter<string>) {
        super()
        this.filter = filter ?? (() => "");
        window.addEventListener("scroll", (ev) => {
            this.Visibility(this.element);
        })
        this.url = "";
        this.title = "sample title";
        this.depth = depth; 
        this.date = date ?? 0;
        // MountableElement(this);
    }

    rendered : (element : HTMLElement) => void = (el) => {
        this.init = false;
        this.element = el;
        // console.log(el.firstChild);
        // console.log(this.init);
        el.addEventListener("click", (e) => {
            console.log(this.init);
            // el.remove();
            e.preventDefault();
        })
        this.Visibility(this.element);
    }

    Visibility(el : HTMLElement) {
        if(el.firstElementChild && (el = el.firstElementChild as HTMLElement)) {
            if(el.offsetTop < window.scrollY - window.innerHeight) {
                el.classList.add("invisible");
            }
            else if(el.offsetTop > window.scrollY + window.innerHeight) {
                el.classList.add("invisible");
            }
            else {
                el.classList.remove("invisible");
                if(!this.init) {
                    // this.img.src = `https://i.ytimg.com/vi/s/hqdefault.jpg`;
                    this.img.src = `https://i.ytimg.com/vi/${this.url.split("=")[1]}/hqdefault.jpg`;
                    // el.firstElementChild?.setAttribute("style", `background-size: contain;background-repeat: no-repeat;background-image: url(https://i.ytimg.com/vi/${this.url.split("=")[1]}/hqdefault.jpg)`);
                    // console.log(el.firstElementChild);
                    this.init = true;
                }
    
            }
        }
    }
    
    render(): Element | null {
        const filter = this.filter()
        if(!this.title.toLowerCase().includes(filter) && filter != "") {
            return null;
        }
        const wrapper = document.createElement("li");
        
        wrapper.setAttribute("style", `padding-left: ${this.depth*5}px`)
        wrapper.classList.add("flex", "relative", "justify-between", "items-center", "pl-32", "ml-10", "mr-10", "mb-2" ,"mu-2", "h-16" ,"text-lg", "bg-red-400", "rounded")
        wrapper.innerText = this.title
        wrapper.setAttribute("style", "background-size: content");

        this.img = document.createElement("img");
        this.img.className = "thumbnail transition-all	duration-500";
        // img.setAttribute("style", "height: 100%;");

        wrapper.addEventListener("mouseover", (ev) => {
            if(!this.event) {
                // img.setAttribute("style", "position: fixed; transform: scale(1.5) translate(50%, 50%);");
                this.event = setTimeout(() => {
                    // wrapper.setAttribute("style", `background-size: contain;background-repeat: no-repeat;background-image: url(https://i.ytimg.com/vi/${this.url.split("=")[1]}/hqdefault.jpg)`);
                }, 50);
            }
            console.log(this.event);
            
        });

        // const epoch_start = new Date(1601, 0, 1);
        const date_ = new Date(this.date);
        // const diff = Math.abs(date_.getTime() - epoch_start.getTime()) * 1000;
        
        
        const date = document.createElement("span");
        date.classList.add("mr-10");
        date.textContent = date_.toUTCString();

        wrapper.addEventListener("mouseleave", (ev) => {
            // img.setAttribute("style", "height: 100%;");
            if(this.event) {
                clearTimeout(this.event);
            }
            this.event = undefined;
        })
        const anchor = document.createElement("a");
        anchor.className = "contents";
        anchor.href = this.url;
        anchor.target = "_blank";

        // const text = document.createElement("span");
        // text.innerHTML = this.title;
        
        Append(anchor)
        (Append(wrapper)(this.img, date));
        return anchor;
    }

}

// <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
// </svg>

// <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
// </svg>