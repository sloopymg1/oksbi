import { a as useRoute$1, s as stateDiagnostics, b as useNuxtApp, u as useRouter } from '../virtual/entry.mjs';
import { N as NuxtLink } from './nuxt-link-DbKUlfQ6.mjs';
import { A as AppIcon_default } from './AppIcon-CzcdSF-4.mjs';
import { u as useAuth } from './useAuth-iNi8ciI3.mjs';
import { defineComponent, computed, withAsyncContext, unref, mergeProps, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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

//#region src/components/AppSidebar.vue?vue&type=script&setup=true&lang.ts
var AppSidebar_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AppSidebar",
	__ssrInlineRender: true,
	setup(__props) {
		const route = useRoute$1();
		const navItems = [
			{
				to: "/",
				label: "Dashboard",
				icon: "dashboard",
				badge: "live"
			},
			{
				to: "/catalog",
				label: "Catalog",
				icon: "catalog",
				badge: "43"
			},
			{
				to: "/rights",
				label: "Rights",
				icon: "rights",
				badge: "18"
			},
			{
				to: "/royalties",
				label: "Royalties",
				icon: "royalties",
				badge: "3"
			},
			{
				to: "/payouts",
				label: "Payouts",
				icon: "payouts",
				badge: "2"
			},
			{
				to: "/support",
				label: "Support",
				icon: "support",
				badge: "4"
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			const _component_AppIcon = AppIcon_default;
			_push(`<aside${ssrRenderAttrs(mergeProps({ class: "workspace-sidebar" }, _attrs))}><div class="brand-lockup workspace-copy"><span class="eyebrow">Music operations</span><div class="brand-wordmark">OKSBI</div><p class="muted">Distribution, rights, royalties, and payout control in one dense working surface.</p></div><div class="sidebar-panel workspace-copy" style="${ssrRenderStyle({ "margin-bottom": "18px" })}"><div class="topline"><strong>Workspace</strong><span class="pill">Creator ops</span></div><p class="muted">Accra distribution desk</p></div><nav class="workspace-copy" aria-label="Primary navigation"><!--[-->`);
			ssrRenderList(navItems, (item) => {
				_push(ssrRenderComponent(_component_NuxtLink, {
					key: item.to,
					to: item.to,
					class: ["nav-item", { active: unref(route).path === item.to }]
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(ssrRenderComponent(_component_AppIcon, {
								name: item.icon,
								style: {
									"width": "18px",
									"height": "18px"
								}
							}, null, _parent, _scopeId));
							_push(`<span${_scopeId}>${ssrInterpolate(item.label)}</span><span class="pill" style="${ssrRenderStyle({ "justify-self": "end" })}"${_scopeId}>${ssrInterpolate(item.badge)}</span>`);
						} else return [
							createVNode(_component_AppIcon, {
								name: item.icon,
								style: {
									"width": "18px",
									"height": "18px"
								}
							}, null, 8, ["name"]),
							createVNode("span", null, toDisplayString(item.label), 1),
							createVNode("span", {
								class: "pill",
								style: { "justify-self": "end" }
							}, toDisplayString(item.badge), 1)
						];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></nav><div class="sidebar-stack" style="${ssrRenderStyle({ "margin-top": "22px" })}"><div class="sidebar-panel workspace-copy" style="${ssrRenderStyle({ "width": "100%" })}"><span class="eyebrow">Signal</span><strong>Royalty close in 36h</strong><p class="muted">Ledger variance is within threshold except TikTok Europe and Japan publishing receipts.</p></div></div></aside>`);
		};
	}
});
//#endregion
//#region src/components/AppSidebar.vue
var _sfc_setup$2 = AppSidebar_vue_vue_type_script_setup_true_lang_default.setup;
AppSidebar_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppSidebar.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var AppSidebar_default = Object.assign(AppSidebar_vue_vue_type_script_setup_true_lang_default, { __name: "AppSidebar" });
//#endregion
//#region src/components/AppHeader.vue?vue&type=script&setup=true&lang.ts
var AppHeader_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "AppHeader",
	__ssrInlineRender: true,
	setup(__props) {
		useAuth();
		useRouter();
		const route = useRoute$1();
		const pageTitles = {
			"/": {
				title: "Creator operations dashboard",
				subtitle: "Release delivery, publishing rights, royalty close, and payout readiness tracked in one operational surface."
			},
			"/catalog": {
				title: "Catalog command",
				subtitle: "Release traffic, metadata holds, and delivery windows aligned for outbound distribution."
			},
			"/rights": {
				title: "Rights control room",
				subtitle: "Versioned splits, society alignment, and claims review staged with effective-date context."
			},
			"/royalties": {
				title: "Royalty ledger",
				subtitle: "Statement imports, reserve posture, and reconciliation status kept audit-ready."
			},
			"/payouts": {
				title: "Payout center",
				subtitle: "Approval queues, KYC posture, and settlement scheduling remain visible before release."
			},
			"/support": {
				title: "Support and takedowns",
				subtitle: "Operational cases stay mapped to queue ownership, SLA risk, and provider escalation."
			}
		};
		const pageMeta = computed(() => pageTitles[route.path] ?? pageTitles["/"]);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_AppIcon = AppIcon_default;
			_push(`<header${ssrRenderAttrs(mergeProps({ class: "workspace-header" }, _attrs))}><div class="workspace-copy"><span class="eyebrow">Authenticated workspace</span><strong>${ssrInterpolate(unref(pageMeta).title)}</strong><p class="helper-text">${ssrInterpolate(unref(pageMeta).subtitle)}</p></div><div class="workspace-copy" style="${ssrRenderStyle({ "align-content": "center" })}"><div class="header-actions" style="${ssrRenderStyle({ "justify-content": "flex-end" })}"><label style="${ssrRenderStyle({
				"position": "relative",
				"min-width": "min(420px, 100%)"
			})}">`);
			_push(ssrRenderComponent(_component_AppIcon, {
				name: "search",
				style: {
					"position": "absolute",
					"left": "14px",
					"top": "14px",
					"width": "18px",
					"height": "18px",
					"color": "rgba(23, 33, 31, 0.52)"
				}
			}, null, _parent));
			_push(`<input class="search-field" style="${ssrRenderStyle({ "padding-left": "42px" })}" placeholder="Search releases, creators, claims, or payout runs"></label><button class="secondary-button" type="button" aria-label="Notifications">`);
			_push(ssrRenderComponent(_component_AppIcon, {
				name: "bell",
				style: {
					"width": "18px",
					"height": "18px"
				}
			}, null, _parent));
			_push(` 4 alerts </button><button class="ghost-button" type="button">`);
			_push(ssrRenderComponent(_component_AppIcon, {
				name: "logout",
				style: {
					"width": "18px",
					"height": "18px"
				}
			}, null, _parent));
			_push(` Sign out </button></div></div></header>`);
		};
	}
});
//#endregion
//#region src/components/AppHeader.vue
var _sfc_setup$1 = AppHeader_vue_vue_type_script_setup_true_lang_default.setup;
AppHeader_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppHeader.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var AppHeader_default = Object.assign(AppHeader_vue_vue_type_script_setup_true_lang_default, { __name: "AppHeader" });
//#endregion
//#region node_modules/nuxt/dist/app/composables/once.js
async function callOnce(...args) {
	const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
	if (typeof args[0] !== "string") args.unshift(autoKey);
	const [_key, fn, options] = args;
	if (!_key || typeof _key !== "string") throw stateDiagnostics.NUXT_E7010({ key: _key });
	if (fn !== void 0 && typeof fn !== "function") throw stateDiagnostics.NUXT_E7008({ type: typeof fn });
	const nuxtApp = useNuxtApp();
	if (options?.mode === "navigation") {
		const removeGuard = useRouter().beforeResolve(() => {
			nuxtApp.payload.once.delete(_key);
			removeGuard();
		});
	}
	if (nuxtApp.payload.once.has(_key)) return;
	nuxtApp._once ||= {};
	nuxtApp._once[_key] ||= fn() || true;
	try {
		await nuxtApp._once[_key];
	} catch (e) {
		delete nuxtApp._once[_key];
		throw e;
	}
	nuxtApp.payload.once.add(_key);
	delete nuxtApp._once[_key];
}
//#endregion
//#region src/layouts/default.vue?vue&type=script&setup=true&lang.ts
var default_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "default",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		const auth = useAuth();
		const route = useRoute$1();
		const isAuthPage = computed(() => route.path === "/login" || route.path === "/create-account");
		[__temp, __restore] = withAsyncContext(async () => callOnce(async () => {
			await auth.ensureSession();
		}, "$7YxQk3UdZG")), await __temp, __restore();
		return (_ctx, _push, _parent, _attrs) => {
			const _component_AppSidebar = AppSidebar_default;
			const _component_AppHeader = AppHeader_default;
			if (unref(isAuthPage)) {
				_push(`<div${ssrRenderAttrs(_attrs)}>`);
				ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
				_push(`</div>`);
			} else {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: "page-shell" }, _attrs))}>`);
				_push(ssrRenderComponent(_component_AppSidebar, null, null, _parent));
				_push(`<main class="workspace-main">`);
				_push(ssrRenderComponent(_component_AppHeader, null, null, _parent));
				ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
				_push(`</main></div>`);
			}
		};
	}
});
//#endregion
//#region src/layouts/default.vue
var _sfc_setup = default_vue_vue_type_script_setup_true_lang_default.setup;
default_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var default_default = default_vue_vue_type_script_setup_true_lang_default;

export { default_default as default };
//# sourceMappingURL=default-CCR-7ltU.mjs.map
