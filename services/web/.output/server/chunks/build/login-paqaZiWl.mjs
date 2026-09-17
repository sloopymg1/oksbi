import { u as useRouter } from '../virtual/entry.mjs';
import { N as NuxtLink } from './nuxt-link-DbKUlfQ6.mjs';
import { u as useAuth } from './useAuth-iNi8ciI3.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import 'nostics';
import 'nostics/formatters/ansi';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'vue-router';
import 'unhead/utils';
import './api-GJQTpCzq.mjs';

//#region src/pages/login.vue?vue&type=script&setup=true&lang.ts
var login_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "login",
	__ssrInlineRender: true,
	setup(__props) {
		const auth = useAuth();
		useRouter();
		const email = ref("maya@oksbi.local");
		const password = ref("");
		const localError = ref(null);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<main${ssrRenderAttrs(mergeProps({
				class: "workspace-main",
				style: {
					"display": "grid",
					"min-height": "100vh",
					"align-items": "center"
				}
			}, _attrs))}><section class="auth-shell auth-grid"><div class="auth-panel workspace-copy"><span class="eyebrow">API login</span><h1 class="page-title" style="${ssrRenderStyle({ "color": "var(--ink)" })}">Sign in to the OKSBI operations workspace.</h1><p class="helper-text"> Sign in with your OKSBI account to access the operations workspace. </p><div class="button-row"><button class="primary-button" type="button">Sign in</button>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				class: "secondary-button",
				to: "/create-account"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Create account`);
					else return [createTextVNode("Create account")];
				}),
				_: 1
			}, _parent));
			_push(`</div></div><div class="auth-panel workspace-copy"><label class="form-label"> Email <input${ssrRenderAttr("value", unref(email))} class="form-field" type="email" placeholder="maya@oksbi.local"></label><label class="form-label"> Password <input${ssrRenderAttr("value", unref(password))} class="form-field" type="password" placeholder="Your password"></label>`);
			if (unref(localError) || unref(auth).error.value) _push(`<p class="validation-note">${ssrInterpolate(unref(localError) ?? unref(auth).error.value)}</p>`);
			else _push(`<!---->`);
			_push(`<button class="primary-button" type="button"${ssrIncludeBooleanAttr(unref(auth).pending.value) ? " disabled" : ""}>${ssrInterpolate(unref(auth).pending.value ? "Signing in..." : "Open dashboard")}</button></div></section></main>`);
		};
	}
});
//#endregion
//#region src/pages/login.vue
var _sfc_setup = login_vue_vue_type_script_setup_true_lang_default.setup;
login_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var login_default = login_vue_vue_type_script_setup_true_lang_default;

export { login_default as default };
//# sourceMappingURL=login-paqaZiWl.mjs.map
