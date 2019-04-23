<template>
    <div>
        <context-menu ref="cm-test">
            <context-menu-item>test</context-menu-item>
        </context-menu>

        <context-menu ref="wrapped-context-menu">
            <context-menu-item v-context-menu="'cm-test'">wrapped alpha 1</context-menu-item>
            <context-menu-item
                v-for="item in items"
            >
                {{ item }}
            </context-menu-item>
        </context-menu>
    </div>
</template>

<script>
import UsualComp from "./UsualComponent.vue";

export default {
    components: {
        UsualComp
    },

    data() {
        return {
            items: [

            ]
        }
    },

    mounted() {
        setTimeout(() => {
            this.items = [
                "added 1","added 2","added 3","added 4","added 5","added 6","added 7","added 8","added 9","added 10","added 11","added 12","added 13","added 14","added 15","added 16","added 17","added 18","added 19","added 20","added 21","added 22","added 23","added 24","added 25","added 26","added 27","added 28","added 29","added 30","added 31","added 32","added 33","added 34","added 35","added 36","added 37","added 38","added 39","added 40"
            ];
            // this.$nextTick(() => {
            //     this.$refs["wrapped-context-menu"].transpose();
            // });

        }, 1000);

        setTimeout(() => {
            this.items = [];
        }, 5000);
    }
}
</script>

<style scoped>
.context-menu {
    background-color: red;
}
</style>
