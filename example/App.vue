<template>
<div>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad obcaecati adipisci, in excepturi? Qui repellendus recusandae eum cumque amet nemo, eius temporibus tempora voluptatibus doloribus necessitatibus doloremque labore sapiente excepturi.</p>
    <p>Qui magnam asperiores nulla sit velit consequatur, impedit, accusantium quas earum aliquid facilis ullam dolore a doloremque dolores delectus, distinctio dicta! Praesentium exercitationem enim aspernatur voluptatem illum, ipsum harum dolorum.</p>
    <p>Eaque aspernatur sequi explicabo neque accusantium expedita at. Iure saepe fugit consequatur at animi tempore, quidem, dolorum maiores delectus vel magni obcaecati laboriosam deleniti voluptatem voluptatum optio! Soluta eum, nisi!</p>
    <p>Dolorem neque impedit, consequatur rem optio culpa explicabo deleniti cumque! Omnis, tempore dignissimos magni, architecto soluta repellendus ab itaque odit ipsum, aspernatur eos animi repudiandae. Possimus enim tenetur maiores illo!</p>
    <p>Quibusdam laboriosam illo explicabo, corporis commodi nihil deserunt eius! Id distinctio rem, doloribus obcaecati quod explicabo ipsum ipsa. Eius temporibus, dolore perspiciatis recusandae quibusdam error quia perferendis, ullam libero nesciunt.</p>
    <p>Non ab officiis dolorem quasi, reiciendis id ad repudiandae voluptas dolorum eos voluptatum libero, pariatur in quis. Ex magni inventore temporibus quae, maxime facere rem totam minus modi at? Optio.</p>
    <p>Molestiae architecto quod adipisci libero nulla fuga repudiandae magni ab ex. Ipsam, nobis eum in consequatur reiciendis possimus porro nostrum veniam numquam enim iste neque asperiores, earum expedita dolores ducimus!</p>
    <p>Praesentium odio dolorem quo magni eaque, eligendi laborum, qui libero minima voluptate nobis reiciendis illo ipsam velit impedit non aperiam saepe. Illum dicta unde aliquid debitis doloremque reiciendis, sit sapiente.</p>
    <p>Provident quam neque laborum possimus modi excepturi ipsa cumque odit repudiandae in. Non laboriosam, hic praesentium illo! Ex earum similique optio, debitis necessitatibus harum consectetur repudiandae, laboriosam praesentium, omnis ab!</p>
    <p>Tempora doloribus molestias, quam. Facilis iste distinctio suscipit quos incidunt libero beatae in dicta repudiandae, optio alias cumque iure dolores quibusdam eos adipisci officia tenetur ut deserunt ab cupiditate expedita.</p>

    <context-menu ref="cm-inline-nested-gamma">
        <context-menu-item>inline nested gamma 1</context-menu-item>
        <context-menu-item>inline nested gamma 2</context-menu-item>
        <context-menu-item>inline nested gamma 3</context-menu-item>
        <context-menu-item>inline nested gamma 4</context-menu-item>
        <context-menu-item>inline nested gamma 5</context-menu-item>
    </context-menu>

    <context-menu ref="cm-inline-nested-alpha">
        <context-menu-item v-context-menu="'cm-inline-nested-gamma'">inline nested alpha 1 (calls "cm-inline-nested-gamma")</context-menu-item>
        <context-menu-item>inline nested alpha 2</context-menu-item>
        <context-menu-item>inline nested alpha 3</context-menu-item>
        <context-menu-item>inline nested alpha 4</context-menu-item>
        <context-menu-item>inline nested alpha 5</context-menu-item>
    </context-menu>

    <context-menu ref="cm-inline-nested-beta">
        <context-menu-item v-context-menu="'cm-inline-nested-gamma'">inline nested beta 1 (calls "cm-inline-nested-gamma")</context-menu-item>
        <context-menu-item>inline nested beta 2</context-menu-item>
        <context-menu-item>inline nested beta 3</context-menu-item>
        <context-menu-item>inline nested beta 4</context-menu-item>
        <context-menu-item>inline nested beta 5</context-menu-item>
    </context-menu>

    <context-menu ref="cm-inline-alpha">
        <context-menu-item v-context-menu="'cm-inline-nested-alpha'">inline alpha 1 (calls "cm-inline-nested-alpha")</context-menu-item>
        <context-menu-item v-context-menu="'cm-inline-nested-beta'">inline alpha 2 (calls "cm-inline-nested-beta")</context-menu-item>
        <context-menu-item>inline alpha 3</context-menu-item>
        <context-menu-item>inline alpha 4</context-menu-item>
        <context-menu-item>inline alpha 5</context-menu-item>
    </context-menu>

    <context-menu ref="cm-inline-beta">
        <context-menu-item>inline beta 1</context-menu-item>
        <context-menu-item>inline beta 2</context-menu-item>
        <context-menu-item>inline beta 3</context-menu-item>
        <context-menu-item>inline beta 4</context-menu-item>
        <context-menu-item>inline beta 5</context-menu-item>
    </context-menu>

    <cm-wrapped-alpha ref="cm-wrapped-alpha" />
    <cm-wrapped-beta ref="cm-wrapped-beta" />

    <div class="target" v-context-menu="null">disabled</div>

    <div class="target" v-context-menu="'cm-inline-alpha'">inline "cm-inline-alpha" (1st target)</div>
    <div class="target" v-context-menu="'cm-inline-alpha'">inline "cm-inline-alpha" (2nd target)</div>

    <div class="target" v-context-menu="'cm-inline-beta'">inline "cm-inline-beta" (1st target)</div>
    <div class="target" v-context-menu="'cm-inline-beta'">inline "cm-inline-beta" (2nd target)</div>

    <div class="target" v-context-menu="'cm-wrapped-alpha'">wrapped "cm-wrapped-alpha" (1st target)</div>
    <div class="target" v-context-menu="'cm-wrapped-alpha'">wrapped "cm-wrapped-alpha" (2nd target)</div>

    <div class="target" v-context-menu="'cm-wrapped-beta'">wrapped "cm-wrapped-beta" (1st target)</div>
    <div class="target" v-context-menu="'cm-wrapped-beta'">wrapped "cm-wrapped-beta" (2nd target)</div>

    <div class="target" v-context-menu="dynamicValue1"><strong>toggles</strong> from "cm-inline-alpha" to "cm-inline-beta" [5 second delay]</div>
    <div class="target" v-context-menu="dynamicValue2"><strong>toggles</strong> from "cm-inline-alpha" to "cm-wrapped-alpha" [5 second delay]</div>
    <div class="target" v-context-menu="dynamicValue3"><strong>toggles</strong> from "cm-wrapped-alpha" to "cm-wrapped-beta" [5 second delay]</div>
    <div class="target" v-context-menu="dynamicValue4"><strong>toggles</strong> from "cm-wrapped-alpha" to "cm-inline-alpha" [5 second delay]</div>
    <div class="target" v-context-menu="dynamicValue5"><strong>toggles</strong> from disabled to "cm-inline-alpha" [5 second delay]</div>
    <div class="target" v-context-menu="dynamicValue6"><strong>toggles</strong> from disabled to "cm-wrapped-alpha" [5 second delay]</div>
    <div class="target" v-context-menu="dynamicValue7"><strong>toggles</strong> from "cm-inline-alpha" to disabled [5 second delay]</div>
    <div class="target" v-context-menu="dynamicValue8"><strong>toggles</strong> from "cm-wrapped-alpha" to disabled [5 second delay]</div>

    <div class="target" v-if="visible" v-context-menu="null"><strong>disappears</strong> disabled [5 second delay]</div>
    <div class="target" v-if="visible" v-context-menu="'cm-inline-alpha'"><strong>disappears</strong> "cm-inline-alpha" [5 second delay]</div>
    <div class="target" v-if="visible" v-context-menu="'cm-wrapped-alpha'"><strong>disappears</strong> "cm-wrapped-alpha" [5 second delay]</div>

    <p>Perferendis veritatis temporibus omnis quidem porro, commodi molestiae, labore voluptate nulla. Est, aliquid rerum dolorem corporis quibusdam perspiciatis tempore nulla commodi nobis, quae repellendus! Quaerat corrupti quod explicabo atque ex.</p>
    <p>Aspernatur ipsam atque voluptatem non quae iste nesciunt enim quo quaerat quasi totam, obcaecati itaque autem dignissimos modi, sapiente dolorem. Doloribus ipsum tempore magnam error autem sed quisquam maxime veritatis!</p>
    <p>Sequi soluta, exercitationem iusto recusandae magni voluptas expedita placeat fugit, animi fugiat ipsum. Alias necessitatibus aliquid amet. Aut laborum consectetur tempore nemo quod inventore porro impedit, harum sed nobis omnis.</p>
    <p>Ullam consequatur nisi labore adipisci repellat esse aliquid architecto eligendi quia, consectetur delectus earum, rem odio at pariatur iure autem odit, cupiditate modi, voluptatum fuga dignissimos nobis laborum cum! Nobis!</p>
    <p>Assumenda, aperiam magnam enim repellendus fugiat optio temporibus quaerat molestias hic. Dolorem sunt fugit, impedit, quod delectus unde velit neque voluptas illo alias maxime ipsa eligendi molestiae, vel cupiditate. Sequi.</p>
    <p>Doloribus cum, placeat accusamus omnis maiores nam. Asperiores magnam modi dolorem atque. Repudiandae similique atque, nostrum quidem, in tenetur nihil! Temporibus maiores, quidem inventore ab earum ipsam accusantium facere illum.</p>
    <p>Incidunt doloremque expedita id culpa, natus quo, deleniti enim itaque cumque, optio tempore ullam dicta quae perspiciatis, eius soluta maxime dignissimos aliquam reiciendis magni! Assumenda, quod, veritatis. Omnis, aperiam, veritatis.</p>
    <p>Repellat nemo ut consequatur culpa soluta eos deleniti ea, quibusdam, ad maxime, aut iusto nisi dolor corporis, sapiente est. Doloribus ut, iste tempora? At earum blanditiis quos itaque aut dolore.</p>
    <p>Tempora quis aspernatur tenetur, maiores, sit asperiores, quaerat atque ad accusantium vero corrupti? Assumenda facilis, impedit dicta repudiandae blanditiis rem error inventore voluptas rerum, modi dolores veniam, in reprehenderit debitis?</p>
    <p>Unde veritatis excepturi, sapiente temporibus consequuntur nostrum nihil, ad nisi dolore ea tenetur ab quo omnis, nam dolor? Praesentium ullam molestiae nobis quidem suscipit odio in fugiat vel laudantium aspernatur?</p>
</div>
</template>

<script>
import CmWrappedAlpha from "./components/ContextMenuWrappedAlpha.vue";
import CmWrappedBeta from "./components/ContextMenuWrappedBeta.vue";

export default {
    components: {
        CmWrappedAlpha,
        CmWrappedBeta
    },

    data() {
        return {
            visible: true,
            dynamicValue1: "cm-inline-alpha",
            dynamicValue2: "cm-inline-alpha",
            dynamicValue3: "cm-wrapped-alpha",
            dynamicValue4: "cm-wrapped-alpha",
            dynamicValue5: null,
            dynamicValue6: null,
            dynamicValue7: "cm-inline-alpha",
            dynamicValue8: "cm-wrapped-alpha"
        }
    },

    mounted() {
        setTimeout(() => {
            this.visible = false;

            this.dynamicValue1 = "cm-inline-beta";
            this.dynamicValue2 = "cm-wrapped-alpha";
            this.dynamicValue3 = "cm-wrapped-beta";
            this.dynamicValue4 = "cm-inline-alpha";
            this.dynamicValue5 = "cm-inline-alpha";
            this.dynamicValue6 = "cm-wrapped-alpha";
            this.dynamicValue7 = null;
            this.dynamicValue8 = null;
        }, 5000);
    }
}
</script>

<style scoped>
.target {
    margin: 0.5rem;
    padding: 0.5rem;
    border: 1px solid black;
}

/deep/ .context-menu-overlay {
    background-color: rgba(0, 0, 0, 0.25);
}

/deep/ .context-menu {
    background-color: black;
    color: white;
}
</style>
