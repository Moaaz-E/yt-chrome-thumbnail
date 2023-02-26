<script lang="ts">
    export let date : number | undefined;
    let parsedDate : Date = date === undefined ? new Date(0) : new Date(date);
</script>

<span class="mr-10">
    {parsedDate.toUTCString()}
</span>