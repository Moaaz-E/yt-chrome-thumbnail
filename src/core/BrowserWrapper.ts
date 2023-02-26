export type DefaultBookmarkNode = chrome.bookmarks.BookmarkTreeNode;
export async function GetBookmarksSvelte()
{
    let nodes = await chrome.bookmarks.getTree();
    return nodes;
}