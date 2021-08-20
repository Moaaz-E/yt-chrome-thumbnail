import { Append, IComponent } from "./IComponent";
// import "../style/main.scss";
import "../style/_main.css"
import svg from "./svg"
import { GetMutable, ExpandedLocalStorage, Mutable, StarredLocalStorage, GetSharedMutable } from "./State";
import SiteNode from "./SiteNode";
import { TreeNode } from "./Core";


export default class BookMarkParentNode implements IComponent {
    private _children  = new Mutable<IComponent[]>([]);
    private _treeNode : chrome.bookmarks.BookmarkTreeNode;
    private _title : string;
    private depth;
    private expanded = new Mutable<boolean>(false);
    private path : TreeNode<string>
    starred: boolean | undefined;
    // private expansionCallback: (node: chrome.bookmarks.BookmarkTreeNode, expanded : boolean) => void;
    // constructor(treeNode : chrome.bookmarks.BookmarkTreeNode, expansionCallback : (node : chrome.bookmarks.BookmarkTreeNode, expoanded : boolean) => void, depth? : number) {

    constructor(treeNode : chrome.bookmarks.BookmarkTreeNode, depth? : number, parentNode? : TreeNode<string>, starred? : boolean) {
        const starredBookmarks = StarredLocalStorage.GetEntries();
        this.starred = starred;
        if(GetSharedMutable(treeNode.id)) {
            this.render = () => null;
            this.expand = () => {};
        } 

        this._title = treeNode.title == "" ? "Folder" : treeNode.title;
        this._treeNode = treeNode;
        this.depth = depth ?? 0;
        this.path = new TreeNode<string>(this._treeNode.id, parentNode);
        parentNode?.AddChild(this.path);
        if(ExpandedLocalStorage.Has(this._treeNode.id)) {
            this.expand();
        }

    }
    render(): Element | null {

        const outerWrapper = document.createElement("div")

        const wrapper = document.createElement("ul");
        wrapper.setAttribute("style", `padding-left: ${this.depth*5}px`)
        wrapper.classList.add("items-center")

        const group = document.createElement("li");
        group.classList.add("flex", "items-center", "mr-10");

        const _svg = new svg({className: "h-8 w-8 rounded-full ring-2 m-2 shadow-md ring-opacity-50 cursor-pointer ring-gray-200", pathD: "M12 4v16m8-8H4"});
        const svgElement = _svg.render();
        
        const title = document.createElement("span");
        title.classList.add("text-xl", "font-medium", "text-black")
        title.innerText = this._title;

        const star = new svg({className: "star h-8 w-8 ml-auto", pathD: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"});
        const starEle = <HTMLElement>star.render();
        if(this.starred) {
            starEle.classList.toggle("starred");
        }
        starEle.addEventListener("click", () => {
            starEle.classList.toggle("starred");
            // TODO walk the tree
            let treeId = "";
            // if(this._treeNode.parentId) {
            for(const parentId of this.path.ReverseValues()) {
                treeId += `${parentId}|`;
            }
            treeId += this.path.Value;
            StarredLocalStorage.Toggle(treeId);
        });
        
        Append(wrapper)
        (
            Append(group)
            (
                svgElement,
                title,
                starEle
            )
        );

        (<HTMLElement>svgElement).addEventListener("click", () => this.expand())
        if(this.expanded.$)
        {
            // var refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + '?arg=1';    
            // window.history.pushState({ path: refresh }, '', refresh)
            this._children.$.forEach((child) => {
                const el = child.render();
                if(el) {
                    wrapper.appendChild(el);
                }
            })
        }
        return wrapper;
    }

    expand() {
        this.expanded.$ = !this.expanded.$;
        if(this.expanded.$) {
            ExpandedLocalStorage.Append(this._treeNode.id);
        }
        else {
            ExpandedLocalStorage.Delete(this._treeNode.id);
        }
        if(this._children.$.length == 0) {
            const children : IComponent[] = [];
            let youtubePages : IComponent[] = []
            this._treeNode.children?.forEach((treeNode) => {
                if(treeNode.children) {
                    children.push(new BookMarkParentNode(treeNode, this.depth+1, this.path));
                }
                else if (treeNode.url && treeNode.url?.match(/youtube\.com/)) {
                    const line = new SiteNode(treeNode.url, treeNode.title, treeNode.dateAdded, this.depth+1);
                    youtubePages.push(line);
                }
            })
            youtubePages.push(...children)
            // if(youtubePages.length > 1000) {
            //     youtubePages = youtubePages.slice(0, 1000);
            // }
            this._children.$ = youtubePages;
        }
    }

}