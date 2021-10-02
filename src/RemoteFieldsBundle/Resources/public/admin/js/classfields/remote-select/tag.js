pimcore.registerNS("pimcore.object.tags.remoteSelect");
pimcore.object.tags.remoteSelect = Class.create(pimcore.object.tags.abstract, {

    type: "remoteSelect",

    initialize: function (data, fieldConfig) {

        if (data) {
            try{
                this.data = JSON.parse(data);
            }catch (e){
                this.data = data;
                colsole.log('data is not json');
            }
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

        console.log("remote:getValue");

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

            value: this.data.value,

            componentCls: "object_field object_field_type_" + this.type,
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


    getGridColumnFilter: function(field) {
        return {type: 'string', dataIndex: field.key};
    },

    getGridColumnConfig:function (field) {
        return this.getGridColumnConfigStatic(field);
    },

    getGridColumnConfigStatic: function(field) {
        console.log("getGridColumnConfigStatic");

        var renderer = function (key, value, metaData, record) {
            this.applyPermissionStyle(key, value, metaData, record);

            if (record.data.inheritedFields && record.data.inheritedFields[key] && record.data.inheritedFields[key].inherited == true) {
                try {
                    metaData.tdCls += " grid_value_inherited";
                } catch (e) {
                    console.log(e);
                }
            }

            if (value) {
                console.log("renderer value:");
                console.log(value);

                return replace_html_event_attributes(strip_tags(value, 'div,span,b,strong,em,i,small,sup,sub'));
            }
        }.bind(this, field.key);

        return {
            text: t(field.label),
            sortable: true,
            dataIndex: field.key,
            renderer: renderer,
            editor: this.getGridColumnEditor(field)
        };
    },

    getGridColumnEditor: function(field) {
        console.log("select:getGridColumnEditor");
        console.log(field);

        if(field.layout.noteditable) {
            return null;
        }

        var store = new Ext.data.JsonStore({
            proxy: {
                type: 'ajax',
                url: '/admin/remote-fields/store-data',
                extraParams : {
                    "url" : "" // todo: add this extra params
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            },
            fields: ["key", "value"],
            autoLoad: false
        });

        var editorConfig = {
            store: store,
            triggerAction: "all",
            editable: true,
            queryMode: 'remote',
            anyMatch: true,
            autoComplete: true,
            forceSelection: true,
            selectOnFocus: true,
            typeAhead: true,

            valueField: 'value',
            displayField: 'key',

            value: "",

            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '{[Ext.util.Format.stripTags(values.key)]}',
                '</tpl>'
            )

        };

        if (field.config) {
            if (field.config.width) {
                if (intval(field.config.width) > 10) {
                    editorConfig.width = field.config.width;
                }
            }
        }

        this.component = new Ext.form.ComboBox(editorConfig);

        return this.component;
    },













});