// export function GetMutable<T>(impl? : T) : [T, SetMutable<T>] {
//     let func : SetMutable<T> = function(mutable : T) {
        
//     }
//     if(impl)
//         return [impl, ];
//     else null;
// }

// type SetMutable<T> = (T) => void;
import {IComponent} from "./IComponent"

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
