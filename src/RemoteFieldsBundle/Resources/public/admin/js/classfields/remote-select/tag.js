pimcore.registerNS("pimcore.object.tags.remoteSelect");
pimcore.object.tags.remoteSelect = Class.create(pimcore.object.tags.abstract, {

    type: "remoteSelect",

    initialize: function (data, fieldConfig) {
        this.data = data;
        this.fieldConfig = fieldConfig;

        console.log(data);
        console.log(fieldConfig);

    },

    getLayoutEdit: function () {

        var store = new Ext.data.JsonStore({
            proxy: {
                type: 'ajax',
                url: '/admin/remote-fields/store-data',
                extraParams : {
                    "url" : this.fieldConfig.remoteStorageUrl
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            },
            fields: ["key", "value"],
            autoLoad: true
        });


        var options = {
            name: this.fieldConfig.name,
            triggerAction: "all",
            editable: true,
            anyMatch: true,
            autoComplete: true,
            forceSelection: true,
            selectOnFocus: true,
            fieldLabel: this.fieldConfig.title,
            store: store,
            width: 250,
            displayField: 'key',
            valueField: 'value',
            labelWidth: 100,
            value: this.data,
            autoLoadOnValue: false
        };

        //some styles
        if (this.fieldConfig.labelWidth) {
            options.labelWidth = this.fieldConfig.labelWidth;
        }
        if (this.fieldConfig.width) {
            options.width = this.fieldConfig.width;
        }
        if (this.fieldConfig.labelAlign) {
            options.labelAlign = this.fieldConfig.labelAlign;
        }
        if (!this.fieldConfig.labelAlign || 'left' === this.fieldConfig.labelAlign) {
            options.width = this.sumWidths(options.width, options.labelWidth);
        }

        this.component = new Ext.form.ComboBox(options);

        return this.component;
    },

    getLayoutShow: function () {
        this.component = this.getLayoutEdit();
        this.component.setReadOnly(true);
        return this.component;
    },

    getValue:function () {
        if (this.isRendered()) {
            return this.component.getValue();
        }
        return this.data;
    },

    getName: function () {
        return this.fieldConfig.name;
    }

});