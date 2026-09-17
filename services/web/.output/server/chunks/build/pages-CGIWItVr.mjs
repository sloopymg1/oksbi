import { u as useRouter } from '../virtual/entry.mjs';
import { N as NuxtLink } from './nuxt-link-DbKUlfQ6.mjs';
import { A as AppIcon_default } from './AppIcon-CzcdSF-4.mjs';
import { u as useAuth } from './useAuth-iNi8ciI3.mjs';
import { a as api } from './api-GJQTpCzq.mjs';
import { u as useApiResource, S as StatePanel_default } from './useApiResource-CTH05IVH.mjs';
import { defineComponent, watchEffect, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderStyle, ssrRenderClass, ssrRenderAttrs } from 'vue/server-renderer';
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

//#region src/components/StatusPill.vue?vue&type=script&setup=true&lang.ts
var StatusPill_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "StatusPill",
	__ssrInlineRender: true,
	props: {
		tone: {},
		label: {}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_AppIcon = AppIcon_default;
			_push(`<span${ssrRenderAttrs(mergeProps({ class: ["status-pill", __props.tone] }, _attrs))}>`);
			_push(ssrRenderComponent(_component_AppIcon, {
				name: __props.tone === "ok" ? "check" : __props.tone === "warning" ? "warning" : "spark",
				style: {
					"width": "14px",
					"height": "14px"
				}
			}, null, _parent));
			_push(` ${ssrInterpolate(__props.label)}</span>`);
		};
	}
});
//#endregion
//#region src/components/StatusPill.vue
var _sfc_setup$1 = StatusPill_vue_vue_type_script_setup_true_lang_default.setup;
StatusPill_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StatusPill.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var StatusPill_default = Object.assign(StatusPill_vue_vue_type_script_setup_true_lang_default, { __name: "StatusPill" });
//#endregion
//#region src/pages/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const router = useRouter();
		const auth = useAuth();
		const dashboardResource = useApiResource(() => api.getDashboardSnapshot());
		watchEffect(() => {
			if (auth.ready.value && !auth.user.value) router.replace("/login");
		});
		const snapshot = computed(() => dashboardResource.data.value);
		const isEmpty = computed(() => !snapshot.value || snapshot.value.metrics.length === 0);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_StatePanel = StatePanel_default;
			const _component_NuxtLink = NuxtLink;
			const _component_AppIcon = AppIcon_default;
			const _component_StatusPill = StatusPill_default;
			_push(ssrRenderComponent(_component_StatePanel, mergeProps({
				data: unref(snapshot),
				loading: unref(dashboardResource).loading.value || !unref(auth).ready.value,
				error: unref(auth).error.value ?? unref(dashboardResource).error.value,
				empty: unref(isEmpty),
				"empty-title": "No operational data is staged yet",
				"empty-body": "When release intake, rights claims, and royalty imports are connected, this command surface will summarize the work here.",
				"action-label": "Create first release",
				onRetry: ($event) => unref(dashboardResource).reload()
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (unref(snapshot)) {
							_push(`<section class="workspace-copy"${_scopeId}><div class="hero-card"${_scopeId}><svg class="hero-mesh" aria-hidden="true" viewBox="0 0 800 400" preserveAspectRatio="none"${_scopeId}><defs${_scopeId}><radialGradient id="m1" cx="0%" cy="0%" r="80%"${_scopeId}><stop offset="0%" stop-color="#e7654b" stop-opacity="0.55"${_scopeId}></stop><stop offset="100%" stop-color="#e7654b" stop-opacity="0"${_scopeId}></stop></radialGradient><radialGradient id="m2" cx="100%" cy="100%" r="80%"${_scopeId}><stop offset="0%" stop-color="#8bbda7" stop-opacity="0.46"${_scopeId}></stop><stop offset="100%" stop-color="#8bbda7" stop-opacity="0"${_scopeId}></stop></radialGradient></defs><rect width="800" height="400" fill="url(#m1)"${_scopeId}></rect><rect width="800" height="400" fill="url(#m2)"${_scopeId}></rect></svg><div class="hero-grid"${_scopeId}><div class="hero-copy workspace-copy"${_scopeId}><span class="eyebrow"${_scopeId}>Release + rights + finance</span><h1 class="page-title"${_scopeId}>Landing view for the full music operations cycle.</h1><p class="page-subtitle"${_scopeId}>${ssrInterpolate(unref(auth).user.value?.fullName)} is signed in, so the dashboard opens directly into delivery risk, split health, royalty close posture, and payout readiness. </p><div class="button-row"${_scopeId}>`);
							_push(ssrRenderComponent(_component_NuxtLink, {
								class: "primary-button",
								to: "/catalog"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) {
										_push(ssrRenderComponent(_component_AppIcon, {
											name: "plus",
											style: {
												"width": "18px",
												"height": "18px"
											}
										}, null, _parent, _scopeId));
										_push(` Review release queue `);
									} else return [createVNode(_component_AppIcon, {
										name: "plus",
										style: {
											"width": "18px",
											"height": "18px"
										}
									}), createTextVNode(" Review release queue ")];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(ssrRenderComponent(_component_NuxtLink, {
								class: "secondary-button",
								to: "/rights"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) {
										_push(ssrRenderComponent(_component_AppIcon, {
											name: "arrow",
											style: {
												"width": "18px",
												"height": "18px"
											}
										}, null, _parent, _scopeId));
										_push(` Resolve rights exceptions `);
									} else return [createVNode(_component_AppIcon, {
										name: "arrow",
										style: {
											"width": "18px",
											"height": "18px"
										}
									}), createTextVNode(" Resolve rights exceptions ")];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div></div><div class="hero-side workspace-copy"${_scopeId}><!--[-->`);
							ssrRenderList(unref(snapshot).spotlightReleases, (release) => {
								_push(`<div class="release-tile"${_scopeId}><img${ssrRenderAttr("src", release.artworkUrl)}${ssrRenderAttr("alt", release.title)} class="release-art"${_scopeId}><div class="workspace-copy" style="${ssrRenderStyle({ "gap": "8px" })}"${_scopeId}><strong${_scopeId}>${ssrInterpolate(release.title)}</strong><span${_scopeId}>${ssrInterpolate(release.artist)}</span><div class="stats-inline"${_scopeId}><span class="pill"${_scopeId}>${ssrInterpolate(release.stage)}</span><span class="pill"${_scopeId}>${ssrInterpolate(release.revenueAtRisk)} at risk</span></div></div></div>`);
							});
							_push(`<!--]--></div></div></div><div class="stat-grid"${_scopeId}><!--[-->`);
							ssrRenderList(unref(snapshot).metrics, (metric) => {
								_push(`<article class="surface metric-card"${_scopeId}><div class="topline"${_scopeId}><span class="metric-label"${_scopeId}>${ssrInterpolate(metric.label)}</span>`);
								_push(ssrRenderComponent(_component_StatusPill, {
									label: metric.tone,
									tone: metric.tone
								}, null, _parent, _scopeId));
								_push(`</div><div class="metric-value"${_scopeId}>${ssrInterpolate(metric.value)}</div><p class="helper-text"${_scopeId}>${ssrInterpolate(metric.trend)}</p></article>`);
							});
							_push(`<!--]--></div><div class="content-grid"${_scopeId}><section class="surface content-span-8 workspace-copy"${_scopeId}><div class="topline"${_scopeId}><h2 class="section-title"${_scopeId}>Operational signal board</h2>`);
							_push(ssrRenderComponent(_component_NuxtLink, {
								to: "/royalties",
								class: "secondary-button"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`Open ledger`);
									else return [createTextVNode("Open ledger")];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div><div class="alert-list"${_scopeId}><!--[-->`);
							ssrRenderList(unref(snapshot).notices, (notice) => {
								_push(`<article class="${ssrRenderClass([notice.tone, "alert-row"])}"${_scopeId}><div class="topline"${_scopeId}><strong${_scopeId}>${ssrInterpolate(notice.title)}</strong>`);
								_push(ssrRenderComponent(_component_StatusPill, {
									label: notice.tone,
									tone: notice.tone
								}, null, _parent, _scopeId));
								_push(`</div><p class="helper-text"${_scopeId}>${ssrInterpolate(notice.detail)}</p></article>`);
							});
							_push(`<!--]--></div></section><section class="surface content-span-4 workspace-copy"${_scopeId}><div class="topline"${_scopeId}><h2 class="section-title"${_scopeId}>Activity</h2><span class="pill"${_scopeId}>Live feed</span></div><div class="feed-list"${_scopeId}><!--[-->`);
							ssrRenderList(unref(snapshot).activity, (item) => {
								_push(`<article class="feed-row"${_scopeId}><strong${_scopeId}>${ssrInterpolate(item.title)}</strong><p class="helper-text"${_scopeId}>${ssrInterpolate(item.detail)}</p><span class="muted"${_scopeId}>${ssrInterpolate(item.timestamp)}</span></article>`);
							});
							_push(`<!--]--></div></section><section class="surface content-span-12 workspace-copy"${_scopeId}><div class="topline"${_scopeId}><h2 class="section-title"${_scopeId}>Royalty health watch</h2>`);
							_push(ssrRenderComponent(_component_NuxtLink, {
								to: "/payouts",
								class: "secondary-button"
							}, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(`Prep payout cycle`);
									else return [createTextVNode("Prep payout cycle")];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div><div class="detail-grid"${_scopeId}><!--[-->`);
							ssrRenderList(unref(snapshot).royaltyHealth, (item) => {
								_push(`<article class="detail-card content-span-6"${_scopeId}><div class="topline"${_scopeId}><strong${_scopeId}>${ssrInterpolate(item.title)}</strong>`);
								_push(ssrRenderComponent(_component_StatusPill, {
									label: item.tone,
									tone: item.tone
								}, null, _parent, _scopeId));
								_push(`</div><p class="helper-text"${_scopeId}>${ssrInterpolate(item.detail)}</p></article>`);
							});
							_push(`<!--]--></div></section></div></section>`);
						} else _push(`<!---->`);
					} else return [unref(snapshot) ? (openBlock(), createBlock("section", {
						key: 0,
						class: "workspace-copy"
					}, [
						createVNode("div", { class: "hero-card" }, [(openBlock(), createBlock("svg", {
							class: "hero-mesh",
							"aria-hidden": "true",
							viewBox: "0 0 800 400",
							preserveAspectRatio: "none"
						}, [
							createVNode("defs", null, [createVNode("radialGradient", {
								id: "m1",
								cx: "0%",
								cy: "0%",
								r: "80%"
							}, [createVNode("stop", {
								offset: "0%",
								"stop-color": "#e7654b",
								"stop-opacity": "0.55"
							}), createVNode("stop", {
								offset: "100%",
								"stop-color": "#e7654b",
								"stop-opacity": "0"
							})]), createVNode("radialGradient", {
								id: "m2",
								cx: "100%",
								cy: "100%",
								r: "80%"
							}, [createVNode("stop", {
								offset: "0%",
								"stop-color": "#8bbda7",
								"stop-opacity": "0.46"
							}), createVNode("stop", {
								offset: "100%",
								"stop-color": "#8bbda7",
								"stop-opacity": "0"
							})])]),
							createVNode("rect", {
								width: "800",
								height: "400",
								fill: "url(#m1)"
							}),
							createVNode("rect", {
								width: "800",
								height: "400",
								fill: "url(#m2)"
							})
						])), createVNode("div", { class: "hero-grid" }, [createVNode("div", { class: "hero-copy workspace-copy" }, [
							createVNode("span", { class: "eyebrow" }, "Release + rights + finance"),
							createVNode("h1", { class: "page-title" }, "Landing view for the full music operations cycle."),
							createVNode("p", { class: "page-subtitle" }, toDisplayString(unref(auth).user.value?.fullName) + " is signed in, so the dashboard opens directly into delivery risk, split health, royalty close posture, and payout readiness. ", 1),
							createVNode("div", { class: "button-row" }, [createVNode(_component_NuxtLink, {
								class: "primary-button",
								to: "/catalog"
							}, {
								default: withCtx(() => [createVNode(_component_AppIcon, {
									name: "plus",
									style: {
										"width": "18px",
										"height": "18px"
									}
								}), createTextVNode(" Review release queue ")]),
								_: 1
							}), createVNode(_component_NuxtLink, {
								class: "secondary-button",
								to: "/rights"
							}, {
								default: withCtx(() => [createVNode(_component_AppIcon, {
									name: "arrow",
									style: {
										"width": "18px",
										"height": "18px"
									}
								}), createTextVNode(" Resolve rights exceptions ")]),
								_: 1
							})])
						]), createVNode("div", { class: "hero-side workspace-copy" }, [(openBlock(true), createBlock(Fragment, null, renderList(unref(snapshot).spotlightReleases, (release) => {
							return openBlock(), createBlock("div", {
								key: release.id,
								class: "release-tile"
							}, [createVNode("img", {
								src: release.artworkUrl,
								alt: release.title,
								class: "release-art"
							}, null, 8, ["src", "alt"]), createVNode("div", {
								class: "workspace-copy",
								style: { "gap": "8px" }
							}, [
								createVNode("strong", null, toDisplayString(release.title), 1),
								createVNode("span", null, toDisplayString(release.artist), 1),
								createVNode("div", { class: "stats-inline" }, [createVNode("span", { class: "pill" }, toDisplayString(release.stage), 1), createVNode("span", { class: "pill" }, toDisplayString(release.revenueAtRisk) + " at risk", 1)])
							])]);
						}), 128))])])]),
						createVNode("div", { class: "stat-grid" }, [(openBlock(true), createBlock(Fragment, null, renderList(unref(snapshot).metrics, (metric) => {
							return openBlock(), createBlock("article", {
								key: metric.id,
								class: "surface metric-card"
							}, [
								createVNode("div", { class: "topline" }, [createVNode("span", { class: "metric-label" }, toDisplayString(metric.label), 1), createVNode(_component_StatusPill, {
									label: metric.tone,
									tone: metric.tone
								}, null, 8, ["label", "tone"])]),
								createVNode("div", { class: "metric-value" }, toDisplayString(metric.value), 1),
								createVNode("p", { class: "helper-text" }, toDisplayString(metric.trend), 1)
							]);
						}), 128))]),
						createVNode("div", { class: "content-grid" }, [
							createVNode("section", { class: "surface content-span-8 workspace-copy" }, [createVNode("div", { class: "topline" }, [createVNode("h2", { class: "section-title" }, "Operational signal board"), createVNode(_component_NuxtLink, {
								to: "/royalties",
								class: "secondary-button"
							}, {
								default: withCtx(() => [createTextVNode("Open ledger")]),
								_: 1
							})]), createVNode("div", { class: "alert-list" }, [(openBlock(true), createBlock(Fragment, null, renderList(unref(snapshot).notices, (notice) => {
								return openBlock(), createBlock("article", {
									key: notice.id,
									class: ["alert-row", notice.tone]
								}, [createVNode("div", { class: "topline" }, [createVNode("strong", null, toDisplayString(notice.title), 1), createVNode(_component_StatusPill, {
									label: notice.tone,
									tone: notice.tone
								}, null, 8, ["label", "tone"])]), createVNode("p", { class: "helper-text" }, toDisplayString(notice.detail), 1)], 2);
							}), 128))])]),
							createVNode("section", { class: "surface content-span-4 workspace-copy" }, [createVNode("div", { class: "topline" }, [createVNode("h2", { class: "section-title" }, "Activity"), createVNode("span", { class: "pill" }, "Live feed")]), createVNode("div", { class: "feed-list" }, [(openBlock(true), createBlock(Fragment, null, renderList(unref(snapshot).activity, (item) => {
								return openBlock(), createBlock("article", {
									key: item.id,
									class: "feed-row"
								}, [
									createVNode("strong", null, toDisplayString(item.title), 1),
									createVNode("p", { class: "helper-text" }, toDisplayString(item.detail), 1),
									createVNode("span", { class: "muted" }, toDisplayString(item.timestamp), 1)
								]);
							}), 128))])]),
							createVNode("section", { class: "surface content-span-12 workspace-copy" }, [createVNode("div", { class: "topline" }, [createVNode("h2", { class: "section-title" }, "Royalty health watch"), createVNode(_component_NuxtLink, {
								to: "/payouts",
								class: "secondary-button"
							}, {
								default: withCtx(() => [createTextVNode("Prep payout cycle")]),
								_: 1
							})]), createVNode("div", { class: "detail-grid" }, [(openBlock(true), createBlock(Fragment, null, renderList(unref(snapshot).royaltyHealth, (item) => {
								return openBlock(), createBlock("article", {
									key: item.id,
									class: "detail-card content-span-6"
								}, [createVNode("div", { class: "topline" }, [createVNode("strong", null, toDisplayString(item.title), 1), createVNode(_component_StatusPill, {
									label: item.tone,
									tone: item.tone
								}, null, 8, ["label", "tone"])]), createVNode("p", { class: "helper-text" }, toDisplayString(item.detail), 1)]);
							}), 128))])])
						])
					])) : createCommentVNode("", true)];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region src/pages/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var pages_default = index_vue_vue_type_script_setup_true_lang_default;

export { pages_default as default };
//# sourceMappingURL=pages-CGIWItVr.mjs.map
