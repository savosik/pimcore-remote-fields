pimcore.registerNS("pimcore.object.classes.data.remoteMultiSelect");
pimcore.object.classes.data.remoteMultiSelect = Class.create(pimcore.object.classes.data.data, {

    type: "remoteMultiSelect",
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

        this.type = "remoteMultiSelect";

        this.initData(initData);

        // overwrite default settings
        this.availableSettingsFields = ["name", "title", "tooltip", "mandatory", "noteditable", "invisible",
            "visibleGridView", "visibleSearch", "style"];

        this.treeNode = treeNode;

    },

    getTypeName: function () {
        return t("remoteMultiSelect");
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
            },
            {
                xtype: "numberfield",
                fieldLabel: t("maximum_items"),
                name: "maxItems",
                value: this.datax.maxItems,
                minValue: 0
            },
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