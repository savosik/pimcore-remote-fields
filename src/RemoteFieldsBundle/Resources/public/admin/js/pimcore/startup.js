pimcore.registerNS("pimcore.plugin.RemoteFieldsBundle");

pimcore.plugin.RemoteFieldsBundle = Class.create(pimcore.plugin.admin, {
    getClassName: function () {
        return "pimcore.plugin.RemoteFieldsBundle";
    },

    initialize: function () {
        pimcore.plugin.broker.registerPlugin(this);
    },

    pimcoreReady: function (params, broker) {
        console.log("RemoteFieldsBundle ready!");
    }
});

var RemoteFieldsBundlePlugin = new pimcore.plugin.RemoteFieldsBundle();
