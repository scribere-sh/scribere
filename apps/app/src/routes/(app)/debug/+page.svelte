<script lang="ts">
    import type { PageProps } from './$types';

    const { data }: PageProps = $props();

    const { rendered } = data;

    const encodedRendered = encodeURIComponent(rendered);
</script>

<div class="flex h-screen w-screen flex-row">
    <pre class="h-screen w-1/2 overflow-y-auto text-sm">{rendered}</pre>
    <iframe
        class="h-screen w-1/2 border-l-2 border-l-red-500"
        title="rendered output"
        src={`data:text/html;charset=utf-8,${encodedRendered}`}
        frameborder="0"
    ></iframe>
</div>
