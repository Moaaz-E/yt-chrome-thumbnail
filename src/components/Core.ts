// export function GetMutable<T>(impl? : T) : [T, SetMutable<T>] {
//     let func : SetMutable<T> = function(mutable : T) {
        
//     }
//     if(impl)
//         return [impl, ];
//     else null;
// }

// type SetMutable<T> = (T) => void;
// import { Div } from "@/HTMLTags";
import { Div } from "../HTMLTags";
import {IComponent} from "./IComponent"
import { ScopedMutable, state } from "./State";

export function OnClick(component : IComponent, listener : EventListenerOrEventListenerObject) {
    const renderer = component.render.bind(component);
    component.render = () => {
        const element = renderer();
        if(element) {
            element.addEventListener("click", listener);
        }
        return element;
    }
}
export function StringArrayToTreeNode(stringArr : string[]) {
    return stringArr.slice(1).reduce((previousVal, cur, ind, arr) => {
        return new TreeNode<string>(cur, previousVal);
    }, new TreeNode<string>(stringArr[0]))
}
export class TreeNode<T> {
    Children : Set<TreeNode<T>> = new Set<TreeNode<T>>();
    Parent : TreeNode<T> | undefined;
    Value : T;

    constructor(value : T, parent? : TreeNode<T>) {
        this.Value = value;        
        this.Parent = parent;
    }
    [Symbol.iterator](): Iterator<TreeNode<T>, any, undefined> {
        throw new Error("Method not implemented.");
    }
    
    ReverseValues() : T[] {
        let node = this.Parent;
        let ancestorValues : T[] = [];
        while(node != undefined) {
            ancestorValues.push(node.Value);
            node = node.Parent;
        }
        return ancestorValues.reverse();
    }

    // *WalkChildTree(filter? : T[]) : Generator<TreeNode<T>, void, undefined> {
    //     for (const child of this.Children)
    // }
    FindChild(filter : T[], filterIndex : number = 0) : T | undefined {
        for(const childNode of this.Children) {
            if(childNode.Value == filter[filterIndex]) {
                return this.FindChild(filter, filterIndex+1);
            }
        }
    }
    AddChild(childNode : TreeNode<T>) {
        this.Children.add(childNode);
    }
}


export function OnScroll(component : IComponent, listener : (element : HTMLElement) => void) {
    const renderer = component.render.bind(component);
    component.render = () => {
        const element = renderer();
        document.addEventListener("scroll", (ev) => {
            listener(<HTMLElement>element);
        });
        return element;
    }    
}

export class Renderer {
    private component : IComponent[] = [];
    private mountRoot : HTMLElement;
    private initialRender: boolean = false;
    constructor(component? : IComponent, mountRoot? : HTMLElement | null) {
        if(component) {
            this.component.push(component);
        }
        if(mountRoot) {
            this.mountRoot = mountRoot;
        }
        else {
            this.mountRoot = Div()
        }
        const render = this.Render.bind(this)
        state.addListener(() => render());
    }

    Render() {
        // TODO
        this.initialRender = true;
        this.Clear();
        const rootComponent = this.component.map((c) => c.render());
        rootComponent.forEach((c) => {if(c) this.mountRoot.appendChild(c)});
        // if(rootComponent) {
        //     this.mountRoot.appendChild(rootComponent);
        // }
    }

    Append(component : Component) {
        this.component.push(component);
        // Do not render appended components until we have called the main rendered
        if(this.initialRender == true) {
            let rendered = component.render();
            if(rendered) {
                this.mountRoot.appendChild(rendered);
            } 
        }
    }

    private Clear() {
        while(this.mountRoot.firstElementChild) {
            this.mountRoot.firstElementChild.remove();
        }
    }
}

export class Component implements IComponent {
    private _render? : (() => Element | null);
    private readonly id : number = 0;
    private drawn = 0;

    constructor() {
        // Add this component to the virtual dom
        this.id = DOM.NewComponent(this);

        // Change the renderer, to call the virtual renderer first
        this._render = this.render.bind(this);
        this.render = () => {
            // @ts-ignore
            const element = this._render();
            DOM.Rendered(this.id, element);
            if(this.rendered && element) {
                this.rendered(<HTMLElement>element);
            }
            element?.setAttribute("Drawn", (this.drawn++).toString(10))            
            element?.setAttribute("Id", this.id.toString(10))            
            return element;
        }
    }
    
    render(): Element | null {
        return null;
    }
    rendered?: ((element: HTMLElement) => void) | undefined;


    NewState<T>(initial? : T) {
        return new ScopedMutable<T>(this, initial);
    }
    
}

export function Transition<T extends Component>(component : T, classBefore : string | undefined, classAfter : string | undefined) : T {
    AddRenderedHandler(component, (el) => {
        if(classBefore) {
            el.classList.add(classBefore)
        }
        
        setTimeout(() => {
            if(classAfter) {
                el.classList.add(classAfter)
            }
            else if(classBefore) {
                el.classList.remove(classBefore)
            }
        }, 16)
    })
    // const renderd = component
    // if(element) {
    //     if(classBefore) {
    //         element.classList.add(classBefore);
    //     }
    //     const rendered = 
    // }
    return component
}

function AddRenderedHandler<T extends Component>(component : Component, cb : (el : HTMLElement) => void) {
    const rendered = component.rendered?.bind(component);
    component.rendered = (el) => {
        cb(el);
        if(rendered) {
            rendered(el);
        }
    }
}

class ComponentStore {
    private identifier = 0;
    private readonly Components : {[id : number] : {comp : Component, ele : Element | null}} = {}
    
    NewComponent(comp : Component) {
        console.log(`Adding new component Name:${comp.constructor.name} ID:${this.identifier}`);
        
        this.Components[this.identifier++] = {comp: comp, ele: null};
        return this.identifier-1;
    }

    Rendered(id : number, ele : Element | null) {
        let parent : Node | null | undefined;
        if(this.Components[id] && this.Components[id].ele) {
            if(parent = this.Components[id].ele?.parentNode) {
                if(ele)
                {
                    // console.log(<Element>this.Components[id].ele);
                    // console.log(parent);
                    parent.replaceChild(ele, <Element>this.Components[id].ele);
                }
                    // parent.child(ele);
            }
        }
        this.Components[id].ele = ele;
    }
}

const DOM = new ComponentStore();