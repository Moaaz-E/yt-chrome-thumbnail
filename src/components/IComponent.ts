export interface IComponent {
    render() : Element | null;
    rendered? : (element : HTMLElement) => void;
    // addChild? : (child : IComponent | Element) => IComponent | Element;
}


// export class Component implements IComponent {
//     render(): Element {
//         return document.createElement("");
//     }

// }

export function Append<T extends Element | IComponent>(element : T) {
    const _element = (<IComponent>element).render != null ? (<IComponent>element).render() : <Element>element;
    return <T extends Element | IComponent>(...children : T[]) => {

        for (const child of children) {
            const _child = (<IComponent>child).render != null ? (<IComponent>child).render() : <Element>child;
            if(_element && _child) {
                _element.appendChild(_child);
            }
        }
        return element;
    };
}

interface IComponen<MutableState = {}> {
    mutable : MutableState;
    render() : Element;
}

// class Component<MutableState> implements IComponent<MutableState> {
//     Mutable: MutableState;
//     /**
//      *
//      */
//     constructor() {
//         Object.keys(this.Mutable)        
//     }
//     render(): Element {
//         throw new Error("Method not implemented.");
//     }

// }