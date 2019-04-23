<template>
<div>
    <a href="/">&larr; Examples index</a>
    <component :is="currentExample"></component>
</div>
</template>

<script>
export default {
    props: {
        example: String
    },

    computed: {
		currentExample() {
            return () => import(`./../examples/${ this.$route.params.example }.vue`);
		}
	}
}
</script>

<style scoped>
/deep/ .target {
    padding: 0.5rem;
    margin: 0.5rem 0;
    border: 1px solid black;
}

/deep/ .context-menu-overlay {
    background-color: rgba(0, 0, 0, 0.25);
}

/deep/ .context-menu {
    padding: 1rem;
    background-color: black;
    color: white;
    border: 1px solid white;
}
</style>
