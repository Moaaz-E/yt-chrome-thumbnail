<script lang="ts">
    import { SVG_EXPAND_V, SVG_EXPAND_H } from "../SVGConsts";
    import { DefaultBookmarkNode } from "../core/BrowserWrapper";
    import VideoNode from "./VideoNode.svelte";
    import { ExpandedLocalStorage } from "../components/State";

    type child = DefaultBookmarkNode;
    export let bookmarkNode : DefaultBookmarkNode;
    export let depth = 0;
    export let filter = "";
    export let hidden = false;

    let expanded : boolean = ExpandedLocalStorage.Has(bookmarkNode.id);
    let title = bookmarkNode.title == "" ? "Folder" : bookmarkNode.title;
    let children : child[] = []
    let videoNodes : child[] = []

    const clickHandler = () => {
        ExpandedLocalStorage.Toggle(bookmarkNode.id);
        expanded = !expanded;
        onExpand();
    }

    const onExpand = () => {
        if(videoNodes.length === 0 && children.length === 0) {
            const childrenBuffer : child[] = [];

            bookmarkNode.children?.forEach((treeNode) => {
                if(treeNode.children) {
                    childrenBuffer.push(treeNode);
                }
                else if (treeNode.url && treeNode.url?.match(/youtube\.com/)) {
                    videoNodes.push(treeNode);
                }
            })

            children = childrenBuffer;
        }
    }
    
    if(expanded) {
        onExpand();
    }
</script>

<ul class="items-center" style="padding-left: {depth*5}px;" hidden={hidden}>
    <li class="flex items-center mr-10">
        <svg on:click={clickHandler} viewBox="0 0 24 24" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 rounded-full ring-2 m-2 shadow-md ring-opacity-50 cursor-pointer ring-gray-200">
            <path class:expanded="{expanded == true}" stroke-linecap="round" stroke-linejoin="round" stroke-width="{2}"  d="{SVG_EXPAND_V}"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="{2}"  d="{SVG_EXPAND_H}"></path>
        </svg>
        <span class="text-xl font-medium text-black">
            {title}
        </span>
    </li>

    {#each videoNodes as videoNode}
        <VideoNode videoNode={videoNode} depth={depth+1} hidden={!expanded} filter={filter}></VideoNode>
    {/each}

    {#each children as _child}
        <svelte:self bookmarkNode={_child} depth={depth+1} hidden={!expanded} filter={filter}/>
    {/each}
    <!-- {#if expanded}
    {/if} -->
</ul>

<style>
</style>