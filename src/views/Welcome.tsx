import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import s from "./Welcome.module.scss";
import logo from "../assets/svg/logo.svg";

export const Welcome = defineComponent({
  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>
        <header>
          <img src={logo} />
          <h1>星空记账</h1>
        </header>
        <main>
          <RouterView />
        </main>
      </div>
    );
  },
});