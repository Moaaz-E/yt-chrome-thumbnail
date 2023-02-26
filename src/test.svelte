<script lang="ts">
	import Scrolly from "./svelte-component/Scrolly.svelte";
	import InputField from "./svelte-component/InputField.svelte";	
	import BookmarkParent from "./svelte-component/BookmarkParent.svelte";
	import { GetBookmarksSvelte } from "./core/BrowserWrapper";
	import { ExpandedLocalStorage } from "./components/State";
	// import "./style/_main.css"
	// import "./style/main.scss"
	let filter : string = "";
	
</script>

<main style="height: 200vh">
	<Scrolly></Scrolly>
	<InputField bind:val={filter}></InputField>
	{#await GetBookmarksSvelte()}
		<h1 style="center">Loading</h1>
	{:then nodes}
		{#each nodes as node}	
			<BookmarkParent bookmarkNode={node} filter={filter}></BookmarkParent>
		{/each}
	{/await}
</main>

<style>
</style>