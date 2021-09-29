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
        this.id = this.type + "_" + treeNode.id;

        this.store = new Ext.data.JsonStore({
            proxy: {
                type: 'ajax',
                url: '/admin/remote-fields/stores-list',
                reader: {
                    type: 'json',
                    rootProperty: 'stores'
                }
            },
            fields: ["url", "name"],
            autoLoad: true
        });

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
        var specificItems = this.getSpecificPanelItems(this.datax, false);
        this.specificPanel.add(specificItems);

        return this.layout;
    },

    getSpecificPanelItems: function (datax, inEncryptedField) {
        return [
            new Ext.form.ComboBox({
                typeAhead: true,
                typeAheadDelay: 200,
                triggerAction: 'all',
                width: 600,
                store: this.store,
                valueField: 'url',
                editable: true,
                displayField: 'name',
                fieldLabel: t('remote_storage_url'),
                name: 'remoteStorageUrl',
                value: datax.remoteStorageUrl,
                forceSelection:true
            })
        ]
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