import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { mergeProps, defineComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';

//#region src/components/AppIcon.vue?vue&type=script&lang.ts
var iconPaths = {
	dashboard: "M3 13h8V3H3zm10 8h8V3h-8zm0-10h8V3h-8zM3 21h8v-6H3z",
	catalog: "M5 4h11a4 4 0 0 1 4 4v11H9a4 4 0 0 0-4 4z",
	rights: "M12 3l8 4v6c0 5-3.4 9.7-8 11-4.6-1.3-8-6-8-11V7z",
	royalties: "M4 19h16M7 16V8m5 8V5m5 11v-6",
	payouts: "M4 8h16M6 12h7m-7 4h4M4 6h16v12H4z",
	support: "M12 3a9 9 0 0 0-9 9c0 2.2.8 4.2 2.1 5.7L4 21l3.6-1.1A8.9 8.9 0 0 0 12 21a9 9 0 0 0 0-18Zm0 12.2a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm1.4-4.6h-1.8a3.4 3.4 0 1 1 3.2-4.6l-1.7.6a1.6 1.6 0 1 0-1.5 2.2h1.8Z",
	search: "m21 21-4.3-4.3M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z",
	bell: "M15 17H9m9-1H6l1.2-1.2A2 2 0 0 0 8 13.4V10a4 4 0 1 1 8 0v3.4a2 2 0 0 0 .8 1.6Z",
	logout: "M14 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2m-3 4h10m0 0-3-3m3 3-3 3",
	plus: "M12 5v14m7-7H5",
	spark: "m12 2 2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2Z",
	check: "m5 12 4 4L19 6",
	warning: "M12 3 2.6 19h18.8Zm0 5v5m0 3h.01",
	arrow: "m9 6 6 6-6 6",
	user: "M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8a7 7 0 0 1 14 0Z"
};
var AppIcon_vue_vue_type_script_lang_default = defineComponent({
	props: { name: {
		type: String,
		required: true
	} },
	setup() {
		return { iconPaths };
	}
});
//#endregion
//#region src/components/AppIcon.vue
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<svg${ssrRenderAttrs(mergeProps({
		"aria-hidden": "true",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		"stroke-width": "1.8"
	}, _attrs))}><path${ssrRenderAttr("d", _ctx.iconPaths[_ctx.name])}></path></svg>`);
}
var _sfc_setup = AppIcon_vue_vue_type_script_lang_default.setup;
AppIcon_vue_vue_type_script_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppIcon.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var AppIcon_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(AppIcon_vue_vue_type_script_lang_default, [["ssrRender", _sfc_ssrRender]]), { __name: "AppIcon" });

export { AppIcon_default as A };
//# sourceMappingURL=AppIcon-CzcdSF-4.mjs.map
