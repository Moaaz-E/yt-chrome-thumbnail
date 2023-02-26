<script lang="ts">
    import { SVG_ARROW } from "../SVGConsts";
    let rotated = false
    const onClick = () => {
        if(window.scrollY*2 <= document.body.scrollHeight/2) {
            window.scrollTo({behavior: "smooth", left: 0, top: document.body.scrollHeight});
        }
        else {
            window.scrollTo({behavior: "smooth", left: 0, top: 0});
        }
    }

    document.addEventListener("scroll", () => {
        if(window.scrollY*2 <= document.body.scrollHeight/2) {
            rotated = false;
        }
        else {
            rotated = true;
        }
    })
</script>

<svg on:click="{onClick}" viewBox="0 0 24 24" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg" class="z-10 transition-transform ease-in-out duration-300 fixed bottom-0 right-0 h-12 w-12 rounded-full ring-2 m-4 bg-white shadow-md ring-opacity-50 cursor-pointer ring-gray-200">
    <path class:rotate-180={rotated} stroke-linecap="round" stroke-linejoin="round" stroke-width="{2}"  d="{SVG_ARROW}"></path>
</svg>