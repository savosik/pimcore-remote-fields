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

        this.type = "remoteSelect";

        this.initData(initData);

        this.treeNode = treeNode;

    },

    getTypeName: function () {
        return t("remoteSelect");
    },

    getGroup: function () {
        return "select";
    },

    getIconClass: function () {
        return "pimcore_icon_select";
    },

    getLayout: function ($super) {

        $super();

        this.specificPanel.removeAll();

        this.specificPanel.add([
            {
                xtype: "textfield",
                fieldLabel: t("remote_storage_url"),
                width: 600,
                name: "remoteStorageUrl",
                value: this.datax.remoteStorageUrl
            }
        ]);

        return this.layout;
    },


    applyData: function ($super) {
        $super();
    },


    applySpecialData: function (source) {

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