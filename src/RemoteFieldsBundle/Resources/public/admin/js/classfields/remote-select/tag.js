pimcore.registerNS("pimcore.object.tags.remoteSelect");
pimcore.object.tags.remoteSelect = Class.create(pimcore.object.tags.abstract, {

    type: "remoteSelect",

    initialize: function (data, fieldConfig) {

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


    //shows in grid view (list of object in folder)
    getCellEditor: function (field, record) {
        console.log('getCellEditor');

        console.log(field);
        console.log(record);

        var key = field.key;

        if(field.layout.noteditable) {
            return null;
        }

        var value = record.data[key];
        var options = record.data[key +  "%options"];
        options = this.prepareStoreDataAndFilterLabels(options);

        var store = new Ext.data.Store({
            autoDestroy: true,
            fields: ['key', 'value'],
            data: options
        });

        var editorConfig = {};

        if (field.config) {
            if (field.config.width) {
                if (intval(field.config.width) > 10) {
                    editorConfig.width = field.config.width;
                }
            }
        }

        editorConfig = Object.assign(editorConfig, {
            store: store,
            triggerAction: "all",
            editable: false,
            mode: "local",
            valueField: 'value',
            displayField: 'key',
            value: value,
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '{[Ext.util.Format.stripTags(values.key)]}',
                '</tpl>'
            )
        });

        return new Ext.form.ComboBox(editorConfig);
    },







});