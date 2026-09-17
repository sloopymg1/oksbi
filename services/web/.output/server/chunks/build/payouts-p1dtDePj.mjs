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

//#region src/pages/payouts.vue?vue&type=script&setup=true&lang.ts
var payouts_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "payouts",
	__ssrInlineRender: true,
	setup(__props) {
		const payoutResource = useApiResource(() => api.listPayouts());
		const rows = computed(() => payoutResource.data.value ?? []);
		function confirmRelease(creator) {
			if ((void 0).confirm(`Release payout for ${creator}? This action is operationally sensitive.`)) payoutResource.reload();
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(StatePanel_default, mergeProps({
				data: unref(rows),
				loading: unref(payoutResource).loading.value,
				error: unref(payoutResource).error.value,
				empty: unref(rows).length === 0,
				"empty-title": "No creator payouts are queued",
				"empty-body": "Approved royalty cycles will open settlement rows here when creators are ready for release.",
				"action-label": "Start payout run",
				onRetry: ($event) => unref(payoutResource).reload()
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<section class="workspace-copy"${_scopeId}><div class="detail-grid"${_scopeId}><article class="surface content-span-4 workspace-copy"${_scopeId}><span class="eyebrow"${_scopeId}>Settlement watch</span><h2 class="section-title"${_scopeId}>Compliance posture and payout scheduling stay adjacent to each creator row.</h2><div class="feed-list"${_scopeId}><article class="detail-card"${_scopeId}><span class="metric-label"${_scopeId}>Queued for approval</span><strong class="metric-value"${_scopeId}>2</strong><span class="helper-text"${_scopeId}>Next payment rail release is 20 Sep at 10:00 UTC.</span></article><article class="detail-card"${_scopeId}><span class="metric-label"${_scopeId}>Compliance holds</span><strong class="metric-value"${_scopeId}>1</strong><span class="helper-text"${_scopeId}>Banking mismatch blocks one EUR payout until reverified.</span></article></div></article><article class="table-shell content-span-8"${_scopeId}><div class="table-toolbar"${_scopeId}><div class="workspace-copy" style="${ssrRenderStyle({ "gap": "6px" })}"${_scopeId}><strong${_scopeId}>Creator payout queue</strong><span class="helper-text"${_scopeId}>Funds, rail, tax posture, and release state.</span></div><button class="secondary-button" type="button"${_scopeId}>Export payment file</button></div><table class="data-table"${_scopeId}><thead${_scopeId}><tr${_scopeId}><th${_scopeId}>Creator</th><th${_scopeId}>Amount</th><th${_scopeId}>Method</th><th${_scopeId}>Tax status</th><th${_scopeId}>Scheduled</th><th${_scopeId}>Status</th><th${_scopeId}></th></tr></thead><tbody${_scopeId}><!--[-->`);
						ssrRenderList(unref(rows), (row) => {
							_push(`<tr${_scopeId}><td${_scopeId}>${ssrInterpolate(row.creator)}</td><td${_scopeId}>${ssrInterpolate(row.amount)}</td><td${_scopeId}>${ssrInterpolate(row.method)}</td><td${_scopeId}>${ssrInterpolate(row.taxStatus)}</td><td${_scopeId}>${ssrInterpolate(row.scheduledFor)}</td><td${_scopeId}><span class="pill"${_scopeId}>${ssrInterpolate(row.status)}</span></td><td${_scopeId}><button class="ghost-button" type="button"${_scopeId}>Release</button></td></tr>`);
						});
						_push(`<!--]--></tbody></table></article></div></section>`);
					} else return [createVNode("section", { class: "workspace-copy" }, [createVNode("div", { class: "detail-grid" }, [createVNode("article", { class: "surface content-span-4 workspace-copy" }, [
						createVNode("span", { class: "eyebrow" }, "Settlement watch"),
						createVNode("h2", { class: "section-title" }, "Compliance posture and payout scheduling stay adjacent to each creator row."),
						createVNode("div", { class: "feed-list" }, [createVNode("article", { class: "detail-card" }, [
							createVNode("span", { class: "metric-label" }, "Queued for approval"),
							createVNode("strong", { class: "metric-value" }, "2"),
							createVNode("span", { class: "helper-text" }, "Next payment rail release is 20 Sep at 10:00 UTC.")
						]), createVNode("article", { class: "detail-card" }, [
							createVNode("span", { class: "metric-label" }, "Compliance holds"),
							createVNode("strong", { class: "metric-value" }, "1"),
							createVNode("span", { class: "helper-text" }, "Banking mismatch blocks one EUR payout until reverified.")
						])])
					]), createVNode("article", { class: "table-shell content-span-8" }, [createVNode("div", { class: "table-toolbar" }, [createVNode("div", {
						class: "workspace-copy",
						style: { "gap": "6px" }
					}, [createVNode("strong", null, "Creator payout queue"), createVNode("span", { class: "helper-text" }, "Funds, rail, tax posture, and release state.")]), createVNode("button", {
						class: "secondary-button",
						type: "button"
					}, "Export payment file")]), createVNode("table", { class: "data-table" }, [createVNode("thead", null, [createVNode("tr", null, [
						createVNode("th", null, "Creator"),
						createVNode("th", null, "Amount"),
						createVNode("th", null, "Method"),
						createVNode("th", null, "Tax status"),
						createVNode("th", null, "Scheduled"),
						createVNode("th", null, "Status"),
						createVNode("th")
					])]), createVNode("tbody", null, [(openBlock(true), createBlock(Fragment, null, renderList(unref(rows), (row) => {
						return openBlock(), createBlock("tr", { key: row.id }, [
							createVNode("td", null, toDisplayString(row.creator), 1),
							createVNode("td", null, toDisplayString(row.amount), 1),
							createVNode("td", null, toDisplayString(row.method), 1),
							createVNode("td", null, toDisplayString(row.taxStatus), 1),
							createVNode("td", null, toDisplayString(row.scheduledFor), 1),
							createVNode("td", null, [createVNode("span", { class: "pill" }, toDisplayString(row.status), 1)]),
							createVNode("td", null, [createVNode("button", {
								class: "ghost-button",
								type: "button",
								onClick: ($event) => confirmRelease(row.creator)
							}, "Release", 8, ["onClick"])])
						]);
					}), 128))])])])])])];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region src/pages/payouts.vue
var _sfc_setup = payouts_vue_vue_type_script_setup_true_lang_default.setup;
payouts_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/payouts.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var payouts_default = payouts_vue_vue_type_script_setup_true_lang_default;

export { payouts_default as default };
//# sourceMappingURL=payouts-p1dtDePj.mjs.map
