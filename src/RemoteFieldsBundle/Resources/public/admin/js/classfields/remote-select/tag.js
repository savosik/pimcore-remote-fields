pimcore.registerNS("pimcore.object.tags.remoteSelect");
pimcore.object.tags.remoteSelect = Class.create(pimcore.object.tags.abstract, {

    type: "remoteSelect",

    initialize: function (data, fieldConfig) {
        console.log("remoteSelect:initialize");
        if (data) {
            this.data = JSON.parse(data);
        }else{
            this.data = {
                key   : '',
                value : ''
            }
        }

        this.fieldConfig = fieldConfig;
    },

    getName: function () {
        return this.fieldConfig.name;
    },

    getValue: function () {

        if (this.isRendered()) {

            var valueToSave = null;

            if(this.component.getRawValue() !== "" && this.component.getValue() !== ""){
                valueToSave = {
                    key   : this.component.getRawValue(),
                    value : this.component.getValue()
                }

                valueToSave =  JSON.stringify(valueToSave);
            }

            return  valueToSave;
        }

        return this.data;
    },


    // next render component for different layouts

    getLayoutShow: function () {
        console.log("remoteSelect:getLayoutShow");

        this.component = this.getLayoutEdit();
        this.component.setReadOnly(true);

        return this.component;
    },


    //shows when user opens data object for editing
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
            autoLoad: false
        });

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

            value: this.data.value
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
        this.component.setRawValue(this.data.key);

        return this.component;
    },








});