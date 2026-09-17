import { A as AppIcon_default } from './AppIcon-CzcdSF-4.mjs';
import { a as api } from './api-GJQTpCzq.mjs';
import { u as useApiResource, S as StatePanel_default } from './useApiResource-CTH05IVH.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import '../virtual/entry.mjs';
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

//#region src/pages/catalog.vue?vue&type=script&setup=true&lang.ts
var catalog_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "catalog",
	__ssrInlineRender: true,
	setup(__props) {
		const catalogResource = useApiResource(() => api.listCatalog());
		const releases = computed(() => catalogResource.data.value ?? []);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_StatePanel = StatePanel_default;
			const _component_AppIcon = AppIcon_default;
			_push(ssrRenderComponent(_component_StatePanel, mergeProps({
				data: unref(releases),
				loading: unref(catalogResource).loading.value,
				error: unref(catalogResource).error.value,
				empty: unref(releases).length === 0,
				"empty-title": "No releases are staged for outbound delivery",
				"empty-body": "Use catalog intake to create a release, attach masters and artwork, then route it into provider QA.",
				"action-label": "Create release",
				onRetry: ($event) => unref(catalogResource).reload()
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<section class="workspace-copy"${_scopeId}><div class="release-grid"${_scopeId}><article class="surface content-span-4 workspace-copy"${_scopeId}><span class="eyebrow"${_scopeId}>Catalog command</span><h2 class="section-title"${_scopeId}>Release traffic is organized by next operational blocker.</h2><p class="helper-text"${_scopeId}>Dense working rows keep UPCs, territory counts, delivery windows, and revenue exposure visible without leaving the queue.</p><div class="button-row"${_scopeId}><button class="primary-button" type="button"${_scopeId}>`);
						_push(ssrRenderComponent(_component_AppIcon, {
							name: "plus",
							style: {
								"width": "18px",
								"height": "18px"
							}
						}, null, _parent, _scopeId));
						_push(` Start new release </button></div></article><article class="surface content-span-8 workspace-copy"${_scopeId}><div class="topline"${_scopeId}><h2 class="section-title"${_scopeId}>Queue posture</h2><span class="pill"${_scopeId}>43 active releases</span></div><div class="kpi-grid"${_scopeId}><div class="mini-card"${_scopeId}><span class="metric-label"${_scopeId}>Metadata holds</span><strong class="metric-value"${_scopeId}>7</strong><span class="helper-text"${_scopeId}>Priority before Friday deliveries</span></div><div class="mini-card"${_scopeId}><span class="metric-label"${_scopeId}>QA staging</span><strong class="metric-value"${_scopeId}>9</strong><span class="helper-text"${_scopeId}>Awaiting provider pack checks</span></div><div class="mini-card"${_scopeId}><span class="metric-label"${_scopeId}>Territory locks</span><strong class="metric-value"${_scopeId}>3</strong><span class="helper-text"${_scopeId}>Need rights clearance before export</span></div><div class="mini-card"${_scopeId}><span class="metric-label"${_scopeId}>Revenue at risk</span><strong class="metric-value"${_scopeId}>\$49k</strong><span class="helper-text"${_scopeId}>Weighted against next 7-day launches</span></div></div></article></div><section class="table-shell"${_scopeId}><div class="table-toolbar"${_scopeId}><div class="workspace-copy" style="${ssrRenderStyle({ "gap": "6px" })}"${_scopeId}><strong${_scopeId}>Release workspace</strong><span class="helper-text"${_scopeId}>Current delivery constraints and timing context.</span></div><div class="header-actions"${_scopeId}><button class="secondary-button" type="button"${_scopeId}>Filter by stage</button><button class="ghost-button" type="button"${_scopeId}>Export queue</button></div></div><table class="data-table"${_scopeId}><thead${_scopeId}><tr${_scopeId}><th${_scopeId}>Release</th><th${_scopeId}>UPC</th><th${_scopeId}>Stage</th><th${_scopeId}>Window</th><th${_scopeId}>Territories</th><th${_scopeId}>Revenue at risk</th></tr></thead><tbody${_scopeId}><!--[-->`);
						ssrRenderList(unref(releases), (release) => {
							_push(`<tr${_scopeId}><td${_scopeId}><div class="person-row" style="${ssrRenderStyle({ "grid-template-columns": "56px minmax(0, 1fr)" })}"${_scopeId}><img${ssrRenderAttr("src", release.artworkUrl)}${ssrRenderAttr("alt", release.title)} class="avatar" style="${ssrRenderStyle({
								"width": "56px",
								"height": "56px"
							})}"${_scopeId}><div class="workspace-copy" style="${ssrRenderStyle({ "gap": "4px" })}"${_scopeId}><strong${_scopeId}>${ssrInterpolate(release.title)}</strong><span class="helper-text"${_scopeId}>${ssrInterpolate(release.artist)}</span></div></div></td><td${_scopeId}>${ssrInterpolate(release.upc)}</td><td${_scopeId}><span class="pill"${_scopeId}>${ssrInterpolate(release.stage)}</span></td><td${_scopeId}>${ssrInterpolate(release.deliveryWindow)}</td><td${_scopeId}>${ssrInterpolate(release.territories)}</td><td${_scopeId}>${ssrInterpolate(release.revenueAtRisk)}</td></tr>`);
						});
						_push(`<!--]--></tbody></table></section></section>`);
					} else return [createVNode("section", { class: "workspace-copy" }, [createVNode("div", { class: "release-grid" }, [createVNode("article", { class: "surface content-span-4 workspace-copy" }, [
						createVNode("span", { class: "eyebrow" }, "Catalog command"),
						createVNode("h2", { class: "section-title" }, "Release traffic is organized by next operational blocker."),
						createVNode("p", { class: "helper-text" }, "Dense working rows keep UPCs, territory counts, delivery windows, and revenue exposure visible without leaving the queue."),
						createVNode("div", { class: "button-row" }, [createVNode("button", {
							class: "primary-button",
							type: "button"
						}, [createVNode(_component_AppIcon, {
							name: "plus",
							style: {
								"width": "18px",
								"height": "18px"
							}
						}), createTextVNode(" Start new release ")])])
					]), createVNode("article", { class: "surface content-span-8 workspace-copy" }, [createVNode("div", { class: "topline" }, [createVNode("h2", { class: "section-title" }, "Queue posture"), createVNode("span", { class: "pill" }, "43 active releases")]), createVNode("div", { class: "kpi-grid" }, [
						createVNode("div", { class: "mini-card" }, [
							createVNode("span", { class: "metric-label" }, "Metadata holds"),
							createVNode("strong", { class: "metric-value" }, "7"),
							createVNode("span", { class: "helper-text" }, "Priority before Friday deliveries")
						]),
						createVNode("div", { class: "mini-card" }, [
							createVNode("span", { class: "metric-label" }, "QA staging"),
							createVNode("strong", { class: "metric-value" }, "9"),
							createVNode("span", { class: "helper-text" }, "Awaiting provider pack checks")
						]),
						createVNode("div", { class: "mini-card" }, [
							createVNode("span", { class: "metric-label" }, "Territory locks"),
							createVNode("strong", { class: "metric-value" }, "3"),
							createVNode("span", { class: "helper-text" }, "Need rights clearance before export")
						]),
						createVNode("div", { class: "mini-card" }, [
							createVNode("span", { class: "metric-label" }, "Revenue at risk"),
							createVNode("strong", { class: "metric-value" }, "$49k"),
							createVNode("span", { class: "helper-text" }, "Weighted against next 7-day launches")
						])
					])])]), createVNode("section", { class: "table-shell" }, [createVNode("div", { class: "table-toolbar" }, [createVNode("div", {
						class: "workspace-copy",
						style: { "gap": "6px" }
					}, [createVNode("strong", null, "Release workspace"), createVNode("span", { class: "helper-text" }, "Current delivery constraints and timing context.")]), createVNode("div", { class: "header-actions" }, [createVNode("button", {
						class: "secondary-button",
						type: "button"
					}, "Filter by stage"), createVNode("button", {
						class: "ghost-button",
						type: "button"
					}, "Export queue")])]), createVNode("table", { class: "data-table" }, [createVNode("thead", null, [createVNode("tr", null, [
						createVNode("th", null, "Release"),
						createVNode("th", null, "UPC"),
						createVNode("th", null, "Stage"),
						createVNode("th", null, "Window"),
						createVNode("th", null, "Territories"),
						createVNode("th", null, "Revenue at risk")
					])]), createVNode("tbody", null, [(openBlock(true), createBlock(Fragment, null, renderList(unref(releases), (release) => {
						return openBlock(), createBlock("tr", { key: release.id }, [
							createVNode("td", null, [createVNode("div", {
								class: "person-row",
								style: { "grid-template-columns": "56px minmax(0, 1fr)" }
							}, [createVNode("img", {
								src: release.artworkUrl,
								alt: release.title,
								class: "avatar",
								style: {
									"width": "56px",
									"height": "56px"
								}
							}, null, 8, ["src", "alt"]), createVNode("div", {
								class: "workspace-copy",
								style: { "gap": "4px" }
							}, [createVNode("strong", null, toDisplayString(release.title), 1), createVNode("span", { class: "helper-text" }, toDisplayString(release.artist), 1)])])]),
							createVNode("td", null, toDisplayString(release.upc), 1),
							createVNode("td", null, [createVNode("span", { class: "pill" }, toDisplayString(release.stage), 1)]),
							createVNode("td", null, toDisplayString(release.deliveryWindow), 1),
							createVNode("td", null, toDisplayString(release.territories), 1),
							createVNode("td", null, toDisplayString(release.revenueAtRisk), 1)
						]);
					}), 128))])])])])];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region src/pages/catalog.vue
var _sfc_setup = catalog_vue_vue_type_script_setup_true_lang_default.setup;
catalog_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/catalog.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var catalog_default = catalog_vue_vue_type_script_setup_true_lang_default;

export { catalog_default as default };
//# sourceMappingURL=catalog-BVHrLN1O.mjs.map
