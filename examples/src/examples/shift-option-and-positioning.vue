<template>
<div>
    <h1>Shift option and positioning</h1>

    <p>
        Normally all the context menus are opened wherever the right-click happened. But in cases when right-click
        happens very close to the edge of the viewport (more precisely closer to the edge than the context menu's actual size is)
        the context menu is transposed (i.e. shifted). The behavior of the transposing process is controlled by the <code>shift</code> option.

        <ul>
            <li>
                With <code>shift="fit"</code> the context menu will be transposed in such a manner that it will be rendered right in the bottom
                right corner of the viewport
            </li>
            <li>
                <code>shift="x"</code> (default) only transposes the context menu by the x-axis and <code>fit</code>s it vertically
            </li>
            <li>
                <code>shift="y"</code> is opposite to "x". Only transposes the context menu by the y-axis and <code>fit</code>s it horizontally
            </li>
            <li>
                <code>shift="both"</code> acts in both axes. The context menu's bottom right corner will be at the point the right-click happened
            </li>
        </ul>

        The same applies to nested context menus but their inital positions are calculated considering their callers positions.
        So in normal circumstances a nested context menu will open at the caller's top right corner. If the nested context menu
        has to be transposed horizontally then it will be opened at the caller's top left corner. If vertiaclly - at the bottom
        right. And so on.

        The context-menu height is also treated automatically. If the context menu appers to overflow the viewport then it will be
        shrinked down and occupy only the avaialable amount of space. Check out the last test-field.

        The following placeholder-text is added to stress out that the context menu position is relative to the viewport and not influenced by the scrolling.

        <em>Scroll down to see the test-field. Fit it in the viewport and right-click it at different coordinates (at least near to the top-left corner and to the bottom-right)</em>
    </p>

    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel excepturi minima consequatur recusandae ullam magnam commodi harum culpa consequuntur totam accusantium eum, possimus eius ratione soluta autem esse, ipsum dolor.</p>
    <p>Nisi fugiat ex quidem quod, illum dolorum. Temporibus consequuntur magnam id! Unde doloribus quibusdam totam. Minima amet molestias neque distinctio dolore, quod, odit adipisci, nobis totam pariatur sunt velit veniam!</p>
    <p>Impedit nostrum distinctio provident aspernatur soluta repudiandae doloribus eos magni, ducimus ipsum laudantium iure, corporis aperiam cumque, exercitationem reiciendis saepe error necessitatibus maxime perferendis eaque minima. Optio, qui officiis beatae.</p>
    <p>Blanditiis, rem obcaecati ab odit, ea doloremque omnis deserunt porro eaque neque libero possimus. Doloremque laborum porro adipisci laudantium praesentium minus, harum, qui velit dolore illum. Doloremque aliquid exercitationem ad!</p>
    <p>Voluptatum explicabo fuga neque blanditiis aliquam optio est labore nobis autem, quo deleniti harum sapiente iusto beatae, accusantium ad dolor voluptas quae sequi enim aliquid sit natus quisquam necessitatibus. Esse.</p>
    <p>Suscipit, dolore! Quisquam a, natus saepe ratione unde, iure mollitia vero placeat illum aperiam esse. Natus illum, molestias quos odio temporibus tempora. Illum maxime voluptatibus delectus aut et aliquam rerum!</p>
    <p>Vel tempore voluptatem tempora ipsum quasi suscipit, quaerat error ex veniam recusandae dicta adipisci omnis deserunt, nisi magni tenetur quidem. Voluptatum quas itaque commodi facilis animi nisi quibusdam ad culpa!</p>
    <p>Facere unde nisi magnam impedit velit doloribus fuga atque dicta, quo sed voluptatem inventore, voluptatibus laborum incidunt, reprehenderit optio ut aut repellat quisquam deleniti itaque commodi maxime eos. Necessitatibus, explicabo!</p>
    <p>Praesentium possimus deserunt consectetur itaque porro reiciendis odit esse ad voluptatibus illo fugiat ipsa libero similique, aut corrupti autem velit dolor molestias. Quisquam accusamus obcaecati, unde voluptas a quos soluta!</p>
    <p>Aperiam accusantium autem nisi debitis libero illum sapiente! Perferendis, eveniet quasi, delectus ex hic deleniti fugit, ipsam, itaque veritatis natus expedita laudantium. Accusantium magni ad, cumque totam voluptas iusto nesciunt!</p>

    <form>
        <fieldset>
            <legend>Root context menu settings</legend>
            <p>
                <label for="root-items-number">Number of items: {{ rootItemsNumber }}</label>
            </p>
            <p>
                <input id="root-items-number" type="range" min="10" max="100" step="10" v-model="rootItemsNumber">
            </p>

            <p>
                <label>Shift option: {{ rootShift }}</label>
            </p>
            <p>
                <select v-model="rootShift">
                    <option value="fit">fit</option>
                    <option value="x">x</option>
                    <option value="y">y</option>
                    <option value="both">both</option>
                </select>
            </p>
        </fieldset>

        <fieldset>
            <legend>Nested context menu settings</legend>
            <p>
                <label for="nested-items-number">Number of items: {{ nestedItemsNumber }}</label>
            </p>
            <p>
                <input id="nested-items-number" type="range" min="10" max="100" step="10" v-model="nestedItemsNumber">
            </p>

            <p>
                <label>Shift option: {{ nestedShift }}</label>
            </p>
            <p>
                <select v-model="nestedShift">
                    <option value="fit">fit</option>
                    <option value="x">x</option>
                    <option value="y">y</option>
                    <option value="both">both</option>
                </select>
            </p>
        </fieldset>
    </form>

    <context-menu
        ref="cm-main"
        :shift="rootShift"
    >
        <context-menu-item v-for="item in rootItems" :key="item">
            {{ item }}
        </context-menu-item>
        <context-menu-item v-context-menu="'cm-nested'">Open the nested context menu ({{ nestedItemsNumber }} items, <code>shift="{{ nestedShift }}"</code>)</context-menu-item>
    </context-menu>

    <context-menu
        ref="cm-nested"
        :shift="nestedShift"
    >
        <context-menu-item v-for="item in nestedItems" :key="item">
            {{ item }}
        </context-menu-item>
    </context-menu>

    <div
        class="field"
        v-context-menu="'cm-main'"
    >
        Open a context menu with <strong>{{ rootItemsNumber }} items</strong> and <strong>shift="{{ rootShift }}"</strong>
    </div>

    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, dolore, mollitia. Totam eos omnis cupiditate ab labore laudantium magnam itaque velit tempora, suscipit, voluptates in distinctio ducimus, quos eligendi provident.</p>
    <p>Omnis nihil iusto exercitationem. Culpa eaque obcaecati eius, ullam, facilis voluptas exercitationem dignissimos molestiae harum, sapiente praesentium consectetur ipsa ad atque optio magnam quod rem nostrum quibusdam nulla delectus? Distinctio.</p>
    <p>Rerum dignissimos repellat sapiente corporis nisi quo dolor ducimus tempora ipsum qui odio aperiam, explicabo nobis. Voluptatibus eaque facilis consequuntur doloribus doloremque totam error sapiente, tempora aspernatur incidunt itaque vero.</p>
    <p>Odit dolores, distinctio deleniti neque. Nesciunt nam, eos quo cupiditate consequatur doloribus eius blanditiis odio, reiciendis modi velit ipsum id obcaecati quae molestias rerum voluptatibus rem qui laborum non voluptate.</p>
    <p>Eos voluptatum eligendi quae velit, nam laboriosam repudiandae quibusdam aliquid! Mollitia nihil saepe deserunt tempore incidunt reiciendis reprehenderit repellendus voluptas iusto, ratione amet! Amet nemo temporibus corporis, labore omnis eaque?</p>
    <p>Fuga saepe, ipsum temporibus non dolor tempore! Aut, perferendis dolorem vero alias possimus error! Enim laboriosam suscipit nobis consequuntur obcaecati eius ut, tempore incidunt magni officia, eveniet dolorem voluptatum reprehenderit.</p>
    <p>Aspernatur perspiciatis alias tempore cumque asperiores veniam pariatur nam consequatur et commodi totam numquam impedit, beatae nostrum obcaecati quasi. Iure maxime voluptas in numquam architecto molestias dolor placeat rem excepturi.</p>
    <p>Maxime, et architecto officiis quasi animi sequi nulla, beatae dicta dolore iure itaque provident eveniet pariatur sapiente placeat! Alias, doloribus. Saepe quidem veniam mollitia debitis reiciendis cumque fugit consectetur praesentium!</p>
    <p>Quia officiis possimus, unde nostrum sint, dignissimos deserunt rem fuga dolor dolorum est, ducimus quo earum voluptas explicabo deleniti ratione reiciendis sapiente. Consequatur iure, perferendis enim soluta odio dolore rerum.</p>
    <p>Placeat eveniet molestias quas in fuga veniam quaerat veritatis autem enim nulla, sit aperiam perspiciatis, accusamus at a nesciunt neque beatae vero ex. Explicabo dolores, maiores laboriosam ratione laudantium accusantium.</p>
</div>
</template>

<script>
export default {
    data() {
        return {
            rootItemsNumber: 10,
            rootShift: "fit",
            nestedItemsNumber: 10,
            nestedShift: "fit"
        }
    },

    computed: {
        rootItems() {
            return new Array(this.rootItemsNumber - 1)
            .fill(undefined)
            .map((item, i) => {
                return `Item ${i + 1}`;
            });
        },

        nestedItems() {
            return new Array(this.nestedItemsNumber - 0) // - 0 === toNumber()
            .fill(undefined)
            .map((item, i) => {
                return `Item ${i + 1}`;
            });
        }
    }
}
</script>

<style scoped>
.field {
    margin: 1rem 0;
    width: 100%;
    height: 100vh;
    background-color: lightgray;
}

/deep/ .context-menu {
    width: 200px;
}
</style>
