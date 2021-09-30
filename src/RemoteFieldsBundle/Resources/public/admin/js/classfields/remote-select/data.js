pimcore.registerNS("pimcore.object.classes.data.remoteSelect");
pimcore.object.classes.data.remoteSelect = Class.create(pimcore.object.classes.data.data, {

    type: "remoteSelect",
    /**
     * define where this datatype is allowed
     */
    allowIn: {
        object: true,
        objectbrick: true,
        fieldcollection: true,
        localizedfield: true,
        classificationstore: true,
        block: true,
        encryptedField: true
    },

    initialize: function (treeNode, initData) {
        console.log('initialize');
        this.type = "remoteSelect";

        this.initData(initData);

        this.treeNode = treeNode;
        this.id = this.type + "_" + treeNode.id;
    },

    getTypeName: function () {
        console.log('getTypeName');
        return t("remoteSelect");
    },

    getGroup: function () {
        console.log('getGroup');
        return "select";
    },

    getIconClass: function () {
        console.log('getIconClass');
        return "pimcore_icon_select";
    },

    getLayout: function ($super) {
        console.log('getLayout');

        $super();

        this.specificPanel.removeAll();

        this.specificPanel.add([
            {
                xtype: "textfield",
                fieldLabel: t("options_provider_class"),
                width: 600,
                name: "remoteStorageUrl",
                value: datax.remoteStorageUrl
            }
        ]);

        return this.layout;
    },


    applySpecialData: function (source) {
        console.log('applySpecialData');

        if (source.datax) {
            if (!this.datax) {
                this.datax = {};
            }
            Ext.apply(this.datax,{
                remoteStorageUrl: source.datax.remoteStorageUrl
            });
        }
    }
});