pimcore.registerNS("pimcore.object.tags.remoteSelect");
pimcore.object.tags.remoteSelect = Class.create(pimcore.object.tags.abstract, {

    type: "remoteSelect",

    initialize: function (data, fieldConfig) {

        this.jsondata.key = null;
        this.jsondata.value = null;

        if (data) {
            this.data = data;
            this.jsondata = JSON.parse(data);
        }

        this.fieldConfig = fieldConfig;
        console.log('ver 12:29');
        console.log('initialize');
        console.log(data);
        console.log(this.jsondata);
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

            value: this.jsondata.value
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
        this.component.setRawValue(this.jsondata.key);

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

            var valueToSave = null;

            if(this.component.getRawValue() && this.component.getValue()){
                valueToSave = {
                    key   : this.component.getRawValue(),
                    value : this.component.getValue()
                }

                valueToSave =  JSON.stringify(valueToSave);
            }

            console.log(valueToSave);

            return  valueToSave;
        }

        return this.data;
    }

});