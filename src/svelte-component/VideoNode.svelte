<script lang="ts">
import { onMount } from "svelte";

import { DefaultBookmarkNode } from "../core/BrowserWrapper";
import DateNode from "./DateNode.svelte";


    export let videoNode : DefaultBookmarkNode;
    export let depth = 0;
    export let hidden = false;
    export let filter = "";
    // videoNode.title = "Very loooong sample";
    // videoNode.url = "";
    let src : string | null;
    let normalizedTitle = videoNode.title.toLowerCase();
    let init = false;
    let c = ["flex", "relative", "justify-between", "items-center", "pl-32", "ml-10", "mr-10", "mb-2" ,"mu-2", "h-16" ,"text-lg", "bg-red-400", "rounded"].join(" ");
    
    let wrapper : HTMLLIElement;
    window.addEventListener("scroll", () => {
        const el = wrapper;
        if(el.offsetTop < window.scrollY - window.innerHeight) {
            el.classList.add("invisible");
        }
        else if(el.offsetTop > window.scrollY + window.innerHeight) {
            el.classList.add("invisible");
        }
        else {
            el.classList.remove("invisible");
            if(!init) {
                // this.img.src = `https://i.ytimg.com/vi/s/hqdefault.jpg`;
                src = `https://i.ytimg.com/vi/${videoNode.url?.split("=")[1]}/hqdefault.jpg`;
                // el.firstElementChild?.setAttribute("style", `background-size: contain;background-repeat: no-repeat;background-image: url(https://i.ytimg.com/vi/${this.url.split("=")[1]}/hqdefault.jpg)`);
                // console.log(el.firstElementChild);
                init = true;
            }

        }
    })
    onMount(() => {
        const el = wrapper;
        if(el.offsetTop < window.scrollY - window.innerHeight) {
            el.classList.add("invisible");
        }
        else if(el.offsetTop > window.scrollY + window.innerHeight) {
            el.classList.add("invisible");
        }
        else {
            el.classList.remove("invisible");
            if(!init) {
                // this.img.src = `https://i.ytimg.com/vi/s/hqdefault.jpg`;
                src = `https://i.ytimg.com/vi/${videoNode.url?.split("=")[1]}/hqdefault.jpg`;
                // el.firstElementChild?.setAttribute("style", `background-size: contain;background-repeat: no-repeat;background-image: url(https://i.ytimg.com/vi/${this.url.split("=")[1]}/hqdefault.jpg)`);
                // console.log(el.firstElementChild);
                init = true;
            }

        }
    })
    const onScroll = (event : UIEvent & { currentTarget: EventTarget & HTMLLIElement }) => {
        const el = event.currentTarget;
        if(el.offsetTop < window.scrollY - window.innerHeight) {
            el.classList.add("invisible");
        }
        else if(el.offsetTop > window.scrollY + window.innerHeight) {
            el.classList.add("invisible");
        }
        else {
            el.classList.remove("invisible");
            if(!init) {
                // this.img.src = `https://i.ytimg.com/vi/s/hqdefault.jpg`;
                src = `https://i.ytimg.com/vi/${videoNode.url?.split("=")[1]}/hqdefault.jpg`;
                // el.firstElementChild?.setAttribute("style", `background-size: contain;background-repeat: no-repeat;background-image: url(https://i.ytimg.com/vi/${this.url.split("=")[1]}/hqdefault.jpg)`);
                // console.log(el.firstElementChild);
                init = true;
            }

        }
    }
</script>
<div hidden={hidden || (filter != "" && !normalizedTitle.includes(filter))}>
    <a href={videoNode.url} target="_blank" class="contents">
        <li bind:this={wrapper} on:scroll={onScroll} style="background-size: content" class={c}>
            {videoNode.title}
            <img alt="{videoNode.title}" src="{src}" class="thumbnail transition-all duration-500">
            <DateNode date={videoNode.dateAdded}></DateNode>
        </li>
    </a>
</div>