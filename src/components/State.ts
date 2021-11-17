import { IComponent } from "./IComponent";

type internalState = {[id : number] : any}
type scopedInternalState = {[id : number] : {val: any, comp : IComponent}}
type SetMutable<T> = (mutable: T) => void;

class StateStore {
    private readonly updateCallback : ((options: {cancel : boolean}) => void)[] = [];
    private internalState : internalState = {};
    private counter = 0;
    private cancellationToken = {cancel: false};

    
    push(item: any) {
        this.internalState[this.counter] = item;
        return this.counter++;
    }

    update(id : number, item : any) {
        this.internalState[id] = item;
        this.cancellationToken.cancel = true;
        this.updateCallback.forEach((cb) => {
            this.cancellationToken = {cancel: false};
            cb(this.cancellationToken);   
        })
    }

    // TODO remove
    get(id : number) {
        return this.internalState[id];
    }

    addListener(cb : ((options : {cancel : boolean}) => void)) {
        this.updateCallback.push(cb);
    }
}


class ScopeStateStore {
    private readonly updateCallback : ((options: {cancel : boolean}) => void)[] = [];
    private stateCallback : { [key:string]:() => void; } = {};
    private internalState : scopedInternalState = {};
    private counter = 0;
    private cancellationToken = {cancel: false};

    
    push(component : IComponent,  item: any) {
        this.internalState[this.counter] = {val: item, comp: component};
        return this.counter++;
    }

    update(id : number, item : any) {
        this.internalState[id].val = item;
        this.internalState[id].comp.render();
        this.cancellationToken.cancel = true;
        // this.updateCallback.forEach((cb) => {
        //     this.cancellationToken = {cancel: false};
        //     cb(this.cancellationToken);   
        // })
    }

    // TODO remove
    get(id : number) {
        return this.internalState[id];
    }

    addListener(cb : ((options : {cancel : boolean}) => void)) {
        this.updateCallback.push(cb);
    }
}

export type Getter<T> = () => T;

const scopedState = new ScopeStateStore();
export class ScopedMutable<T> {
    private _value : T;
    private readonly _id : number;
    constructor(component : IComponent, initial? : T);
    constructor(component : IComponent, initial : T)
    constructor(component : IComponent, initial : T) {
        this._id = scopedState.push(component, initial);
        this._value = initial;
    }

    public set $(v : T) {
        this._value = v;
        scopedState.update(this._id, this._value);
    }

    public get $() : T {
        return this._value;
    }

    ReactiveGet() : Getter<T> {
        return (() => {
            return this.$;
        }).bind(this);
    }
}


export const state = new StateStore();


export class Mutable<T> {
    private _value : T;
    private readonly _id : number;
    constructor(initial? : T);
    constructor(initial : T)
    constructor(initial : T) {
        this._id = state.push(initial);
        this._value = initial;
    }

    public set $(v : T) {
        this._value = v;
        state.update(this._id, this._value);
    }

    public get $() : T {
        return this._value;
    }
}

class Observer {
    private callbacks : MutationCallback[] = [];
    private readonly observer = new MutationObserver((mutation, _observer) => {
        this.callbacks.forEach(cb => cb(mutation, _observer));
    })
    /**
     *
     */
    constructor() {
        this.observer.observe(document.getElementsByClassName("app")[0], {childList: true, subtree : true});        
    }
    Add(callback : MutationCallback) {
        this.callbacks.push(callback);
    }
}

const GlobalObserver = new Observer();

class MountStorage<T> {
    constructor() {
        GlobalObserver.Add((mutationList, observer) => {
            mutationList.forEach((mutation) => {
                const target = mutation.target
                if(mutation.type == "childList") {
                    document.querySelectorAll("[aria-identifier]").forEach((node) => {
                        const id = <string>(<HTMLElement>node).getAttribute("aria-identifier");
                        storage[id](<HTMLElement>node);
                        delete storage[id];
                        node.removeAttribute("aria-identifier");

                    })

                }
            })
        })
        
    }
    [id : string] : T
}

const storage = new MountStorage<(arg0 : HTMLElement) => void>();

export function MountableElement(mountable : IComponent) {
    
    const renderer = mountable.render.bind(mountable);

    mountable.render = () => {
        const element = <HTMLElement>renderer();
        if(mountable.rendered) {
            const id = Math.random().toString();
            element?.setAttribute("aria-identifier", id);
            storage[id] = mountable.rendered;
        }
        return element;
    }
    // private mountable;
    // private originalRender;
    // private element! : Element;
    // private observer = new MutationObserver((mutation, _observer) => {
    //     if(this.mountable.rendered && this.element) {
    //         this.mountable.rendered(<HTMLElement>this.element);
    //     } 
    //     _observer.disconnect();
    // })
    // constructor(mountable : IComponent) {
    //     this.mountable = mountable;
    //     this.originalRender = mountable.render;
    //     mountable.render = () => {
    //         this.element = this.originalRender();
    //         this.observer.observe(this.element, {characterData: true, subtree: true});
    //         return this.element;
    //     }
    // }

}

class LocalStorageSet {
    private storage = new Set<string>();
    readonly key : string;
    /**
     *
     */
    constructor(key : string) {
        this.key = key;
        const storage = window.localStorage.getItem(key);
        if(storage) {
            this.storage = new Set<string>(storage.split(","))
        }
        
    }
    Append(value : string) {
        this.storage.add(value);
        this.Save();
    }

    Delete(value  : string) {
        this.storage.delete(value);
        this.Save();
    }
    Toggle(treeId: string) {
        if(this.Has(treeId)) {
            this.Delete(treeId);
        }
        else {
            this.Append(treeId);
        }
    }

    Has(value : string) {
        return this.storage.has(value);
    }

    GetEntries() {
        return Array.from(this.storage)
    }

    private Save() {
        window.localStorage.setItem(this.key, Array.from(this.storage.values()).join(","));
    }
}

export const ExpandedLocalStorage = new LocalStorageSet("expanded");
export const StarredLocalStorage = new LocalStorageSet("starred");

export function GetMutable<T>(initial : T) : [T, SetMutable<T>];
export function GetMutable<T>(initial? : T) : [T | undefined, SetMutable<T>];
export function GetMutable<T>(initial : T) : [T, SetMutable<T>] {
    const num = state.push(initial);
    return [initial,  function(mutable : T) {
        state.update(num, mutable);
    }];
}


const sharedStorage = new MountStorage<number>();

export function SetSharedMutable(id : string, value? : any) : void;
export function SetSharedMutable(id : string, value : any) : void;
export function SetSharedMutable(id : string, value : any) {
    if(!(id in sharedStorage)) {
        const stateId = state.push(value);
        sharedStorage[id] = stateId;
    } else {
        const stateId = sharedStorage[id];
        state.update(stateId, value);
    }
}

export function GetSharedMutable(id : string) : any | null {
    if(id in sharedStorage) {
        const stateId = sharedStorage[id];
        return state.get(stateId);
    }
    return null;
}