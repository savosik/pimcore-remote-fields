pimcore.registerNS("pimcore.object.tags.remoteSelect");
pimcore.object.tags.remoteSelect = Class.create(pimcore.object.tags.abstract, {

    type: "remoteSelect",

    initialize: function (data, fieldConfig) {
        if (data) {
            this.data = data;
        }

        this.fieldConfig = fieldConfig;
        console.log('ver 12:29');
        console.log('initialize');
        console.log(data);
        console.log(fieldConfig);
    },

    getLayoutEdit: function () {

        console.log('getLayoutEdit');
        console.log(this);

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
            autoLoad: false,
            listeners: {
                load: function (el){
                    console.log("store 'store' is loaded")
                }.bind(this)
            }
        });

        console.log(this.data);

        // main option
        var options = {
            name: this.fieldConfig.name,
            fieldLabel: this.fieldConfig.title,

            componentCls: this.getWrapperClassNames(),

            width: 250,
            labelWidth: 100,

            triggerAction: "all",
            editable: true,
            anyMatch: true,

            autoComplete: true,
            forceSelection: true,
            selectOnFocus: true,
            typeAhead: true,

            store: store,
            queryMode: 'remote',
            displayField: 'key',
            valueField: 'value',

            value: this.data
        };

        //resolve default system settings
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

        //adding component
        this.component = new Ext.form.ComboBox(options);

        // set value from backend without unnecessary store loading
        this.component.setRawValue(this.data);

        return this.component;
    },


    getLayoutShow: function () {
        console.log('getLayoutShow');

        this.component = this.getLayoutEdit();
        this.component.setReadOnly(true);
        return this.component;
    },

    getName: function () {
        console.log('getName');
        return this.fieldConfig.name;
    },

    getValue:function () {
        console.log('getValue');
        if (this.isRendered()) {
            return this.component.getValue();
        }
        return this.data;
    },

    getGridColumnConfig:function (field) {
       console.log('getGridColumnConfig');
       console.log(field);
    },

});