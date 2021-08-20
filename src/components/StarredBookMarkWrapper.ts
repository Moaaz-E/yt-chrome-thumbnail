import BookMarkParentNode from "./BookmarkParentNode";
import { StringArrayToTreeNode } from "./Core";
import { Append, IComponent } from "./IComponent";
import { SetSharedMutable, StarredLocalStorage } from "./State";




export default class StarredBookMarkWrapper implements IComponent {
    private starredBookmarks = StarredLocalStorage.GetEntries();
    private parentNode: chrome.bookmarks.BookmarkTreeNode;
    starred: BookMarkParentNode[] = [];
    init = false;

    constructor(parentNode : chrome.bookmarks.BookmarkTreeNode) {
        this.parentNode = parentNode;
    }
    render(): Element | null {
        const wrapper = document.createElement("div");
        if(!this.init) {
            this.init = true;
            const starredNodes : BookMarkParentNode[] = []
            this.starredBookmarks.forEach((entry) => {
                let currentNode = this.parentNode;
                let childNode = currentNode;
                const entries = entry.split("|");
                let index = 0;
                let childrenIndex = 0;
                while(childNode && currentNode && childNode && index < entries.length) {
                    if(childNode.id == entries[index]) {
                        index++;
                        if(index == entries.length) {
                            starredNodes.push(new BookMarkParentNode(childNode, undefined, StringArrayToTreeNode(entries.slice(0, -1)), true));
                            SetSharedMutable(entries[index-1], true);
                            
                        }
                        currentNode = childNode;
                        childrenIndex = 0;
                    }
                    if(currentNode.children) {
                        childNode = currentNode.children[childrenIndex++];
                    }
                    else {
                        index = 10e2;
                    }
                }
            })
            this.starred = starredNodes;
        }

        return Append(wrapper)
        (...this.starred);
    }

}