import { a as api } from './api-GJQTpCzq.mjs';
import { u as useApiResource, S as StatePanel_default } from './useApiResource-CTH05IVH.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import './AppIcon-CzcdSF-4.mjs';
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

//#region src/pages/royalties.vue?vue&type=script&setup=true&lang.ts
var royalties_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "royalties",
	__ssrInlineRender: true,
	setup(__props) {
		const royaltyResource = useApiResource(() => api.listRoyalties());
		const rows = computed(() => royaltyResource.data.value ?? []);
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(StatePanel_default, mergeProps({
				data: unref(rows),
				loading: unref(royaltyResource).loading.value,
				error: unref(royaltyResource).error.value,
				empty: unref(rows).length === 0,
				"empty-title": "No royalty statements are loaded",
				"empty-body": "Imports, reserves, and net postings will appear after provider statements are staged for reconciliation.",
				"action-label": "Import statement",
				onRetry: ($event) => unref(royaltyResource).reload()
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<section class="workspace-copy"${_scopeId}><div class="content-grid"${_scopeId}><article class="surface content-span-4 workspace-copy"${_scopeId}><span class="eyebrow"${_scopeId}>Royalty close</span><h2 class="section-title"${_scopeId}>Gross-to-net movement is visible before anything hits payout approval.</h2><div class="feed-list"${_scopeId}><div class="detail-card"${_scopeId}><span class="metric-label"${_scopeId}>Reserve ratio</span><strong class="metric-value"${_scopeId}>5.0%</strong><span class="helper-text"${_scopeId}>Down 0.8 pts after August source imports</span></div><div class="detail-card"${_scopeId}><span class="metric-label"${_scopeId}>Out-of-tolerance lines</span><strong class="metric-value"${_scopeId}>11</strong><span class="helper-text"${_scopeId}>8 belong to a single TikTok Europe statement</span></div></div></article><article class="table-shell content-span-8"${_scopeId}><div class="table-toolbar"${_scopeId}><div class="workspace-copy" style="${ssrRenderStyle({ "gap": "6px" })}"${_scopeId}><strong${_scopeId}>Statement ledger</strong><span class="helper-text"${_scopeId}>Provider source, reserve posture, and posting state.</span></div><div class="header-actions"${_scopeId}><button class="secondary-button" type="button"${_scopeId}>Variance report</button><button class="ghost-button" type="button"${_scopeId}>Hold adjustments</button></div></div><table class="data-table"${_scopeId}><thead${_scopeId}><tr${_scopeId}><th${_scopeId}>Month</th><th${_scopeId}>Source</th><th${_scopeId}>Gross</th><th${_scopeId}>Reserves</th><th${_scopeId}>Net</th><th${_scopeId}>Status</th></tr></thead><tbody${_scopeId}><!--[-->`);
						ssrRenderList(unref(rows), (row) => {
							_push(`<tr${_scopeId}><td${_scopeId}>${ssrInterpolate(row.statementMonth)}</td><td${_scopeId}>${ssrInterpolate(row.source)}</td><td${_scopeId}>${ssrInterpolate(row.gross)}</td><td${_scopeId}>${ssrInterpolate(row.reserves)}</td><td${_scopeId}>${ssrInterpolate(row.net)}</td><td${_scopeId}><span class="pill"${_scopeId}>${ssrInterpolate(row.status)}</span></td></tr>`);
						});
						_push(`<!--]--></tbody></table></article></div></section>`);
					} else return [createVNode("section", { class: "workspace-copy" }, [createVNode("div", { class: "content-grid" }, [createVNode("article", { class: "surface content-span-4 workspace-copy" }, [
						createVNode("span", { class: "eyebrow" }, "Royalty close"),
						createVNode("h2", { class: "section-title" }, "Gross-to-net movement is visible before anything hits payout approval."),
						createVNode("div", { class: "feed-list" }, [createVNode("div", { class: "detail-card" }, [
							createVNode("span", { class: "metric-label" }, "Reserve ratio"),
							createVNode("strong", { class: "metric-value" }, "5.0%"),
							createVNode("span", { class: "helper-text" }, "Down 0.8 pts after August source imports")
						]), createVNode("div", { class: "detail-card" }, [
							createVNode("span", { class: "metric-label" }, "Out-of-tolerance lines"),
							createVNode("strong", { class: "metric-value" }, "11"),
							createVNode("span", { class: "helper-text" }, "8 belong to a single TikTok Europe statement")
						])])
					]), createVNode("article", { class: "table-shell content-span-8" }, [createVNode("div", { class: "table-toolbar" }, [createVNode("div", {
						class: "workspace-copy",
						style: { "gap": "6px" }
					}, [createVNode("strong", null, "Statement ledger"), createVNode("span", { class: "helper-text" }, "Provider source, reserve posture, and posting state.")]), createVNode("div", { class: "header-actions" }, [createVNode("button", {
						class: "secondary-button",
						type: "button"
					}, "Variance report"), createVNode("button", {
						class: "ghost-button",
						type: "button"
					}, "Hold adjustments")])]), createVNode("table", { class: "data-table" }, [createVNode("thead", null, [createVNode("tr", null, [
						createVNode("th", null, "Month"),
						createVNode("th", null, "Source"),
						createVNode("th", null, "Gross"),
						createVNode("th", null, "Reserves"),
						createVNode("th", null, "Net"),
						createVNode("th", null, "Status")
					])]), createVNode("tbody", null, [(openBlock(true), createBlock(Fragment, null, renderList(unref(rows), (row) => {
						return openBlock(), createBlock("tr", { key: row.id }, [
							createVNode("td", null, toDisplayString(row.statementMonth), 1),
							createVNode("td", null, toDisplayString(row.source), 1),
							createVNode("td", null, toDisplayString(row.gross), 1),
							createVNode("td", null, toDisplayString(row.reserves), 1),
							createVNode("td", null, toDisplayString(row.net), 1),
							createVNode("td", null, [createVNode("span", { class: "pill" }, toDisplayString(row.status), 1)])
						]);
					}), 128))])])])])])];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region src/pages/royalties.vue
var _sfc_setup = royalties_vue_vue_type_script_setup_true_lang_default.setup;
royalties_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/royalties.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var royalties_default = royalties_vue_vue_type_script_setup_true_lang_default;

export { royalties_default as default };
//# sourceMappingURL=royalties-B7ntqLw3.mjs.map
