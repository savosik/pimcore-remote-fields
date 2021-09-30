pimcore.registerNS("pimcore.object.tags.remoteSelect");
pimcore.object.tags.remoteSelect = Class.create(pimcore.object.tags.abstract, {

    type: "remoteSelect",
    dataChanged: false,

    initialize: function (data, fieldConfig) {
        if (data) {
            this.data = data;
        }

        this.fieldConfig = fieldConfig;
        console.log('ver 11:28');
        console.log('initialize');
        console.log(data);
        console.log(fieldConfig);
    },

    getLayoutEdit: function () {

        console.log('getLayoutEdit');

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
            queryMode: 'remote',
            listeners: {

                select: function (el) {
                    console.log("remoteSelect changed");
                    this.dataChanged = true;
                }.bind(this),

                load: function (el){
                    console.log("combo is loaded");
                    this.component.setRawValue(this.data);
                }.bind(this)
            }
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
        console.log('getLayoutShow');

        this.component = this.getLayoutEdit();
        this.component.setReadOnly(true);
        return this.component;
    },

    getValue:function () {

        console.log('getValue');
        if (this.isRendered()) {
            return this.component.getValue();
        }
        return this.data;
    },

    getName: function () {
        console.log('getName');
        return this.fieldConfig.name;
    },

    isDirty:function () {
        console.log('isDirty');
        if (this.component) {
            if (!this.component.rendered) {
                return false;
            } else {
                return this.dataChanged;
            }
        }
    }

});