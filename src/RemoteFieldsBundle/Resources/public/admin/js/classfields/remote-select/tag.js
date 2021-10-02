pimcore.registerNS("pimcore.object.tags.remoteSelect");
pimcore.object.tags.remoteSelect = Class.create(pimcore.object.tags.abstract, {

    type: "remoteSelect",


    initialize: function (data, fieldConfig) {
        console.log('remoteselect:init');
        this.data = data;
        this.fieldConfig = fieldConfig;
    },

    getGridColumnConfigDynamic: function(field) {
        var renderer = function (key, data, metaData, record) {
            var value = data;
            var options = record.data[key + "%options"];

            if (data && typeof data.options !== "undefined") {
                options = data.options;
                value = data.value;
            }

            this.applyPermissionStyle(key, value, metaData, record);

            if (record.data.inheritedFields[key] && record.data.inheritedFields[key].inherited == true) {
                try {
                    metaData.tdCls += " grid_value_inherited";
                } catch (e) {
                    console.log(e);
                }
            }

            if (options) {
                for (var i = 0; i < options.length; i++) {
                    if (options[i]["value"] == value) {
                        return replace_html_event_attributes(strip_tags(options[i]["key"], 'div,span,b,strong,em,i,small,sup,sub'));
                    }
                }
            }

            if (value) {
                return replace_html_event_attributes(strip_tags(value, 'div,span,b,strong,em,i,small,sup,sub'));
            }
        }.bind(this, field.key);

        return {
            text: t(field.label),
            sortable:true,
            dataIndex:field.key,
            renderer: renderer,
            getEditor:this.getCellEditor.bind(this, field)
        };
    },

    getGridColumnConfigStatic: function(field) {
        var renderer = function (key, value, metaData, record) {
            this.applyPermissionStyle(key, value, metaData, record);

            if (record.data.inheritedFields && record.data.inheritedFields[key] && record.data.inheritedFields[key].inherited == true) {
                try {
                    metaData.tdCls += " grid_value_inherited";
                } catch (e) {
                    console.log(e);
                }
            }

            for(var i=0; i < field.layout.options.length; i++) {
                if(field.layout.options[i]["value"] == value) {
                    return replace_html_event_attributes(strip_tags(field.layout.options[i]["key"], 'div,span,b,strong,em,i,small,sup,sub'));
                }
            }

            if (value) {
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

    getGridColumnConfig:function (field) {
        if (field.layout.optionsProviderClass) {
            return this.getGridColumnConfigDynamic(field);
        } else {
            return this.getGridColumnConfigStatic(field);
        }
    },

    getCellEditor: function (field, record) {
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

    getGridColumnEditor: function(field) {
        if(field.layout.noteditable) {
            return null;
        }

        var storeData = this.prepareStoreDataAndFilterLabels(field.layout.options);
        var store = new Ext.data.Store({
            autoDestroy: true,
            fields: ['key', 'value'],
            data: storeData
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
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '{[Ext.util.Format.stripTags(values.key)]}',
                '</tpl>'
            )
        });

        return new Ext.form.ComboBox(editorConfig);
    },

    prepareStoreDataAndFilterLabels: function(options) {
        var filteredStoreData = [];
        if (options) {
            for (var i = 0; i < options.length; i++) {

                var label = t(options[i].key);
                if(label.indexOf('<') >= 0) {
                    label = replace_html_event_attributes(strip_tags(label, "div,span,b,strong,em,i,small,sup,sub2"));
                }

                filteredStoreData.push({'value': options[i].value, 'key': label});
            }
        }

        return filteredStoreData;
    },

    getGridColumnFilter: function(field) {
        if (field.layout.dynamicOptions) {
            return {type: 'string', dataIndex: field.key};
        } else {
            var store = Ext.create('Ext.data.JsonStore', {
                fields: ['key', "value"],
                data: this.prepareStoreDataAndFilterLabels(field.layout.options)
            });

            return {
                type: 'list',
                dataIndex: field.key,
                labelField: "key",
                idField: "value",
                options: store
            };
        }
    },

    getLayoutEdit: function () {
        console.log("remote:getLayoutEdit")

        var localData = [];

        //we accept only json values from db
        var dbValueObj = {key:'',value:''};

        console.log(this.data);

        if(this.data){
            try{
                dbValueObj = JSON.parse(this.data);
            }catch (e) {}
        }

        if(!this.fieldConfig.mandatory) {
            localData.push({'key': "(" + t("empty") + ")", 'value': ''});
        }
        if(dbValueObj.value !== ''){
            localData.push(dbValueObj);
        }


        var localStore = Ext.create('Ext.data.Store', {
            fields: ['value', 'key'],
            data : localData,
            autoDestroy:true
        });

        var remoteStore = new Ext.data.JsonStore({
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
            autoDestroy:true
        });


        var options = {
            name: this.fieldConfig.name,
            triggerAction: "all",
            editable: true,
            queryMode: 'local',
            anyMatch: true,
            autoComplete: false,
            forceSelection: true,
            selectOnFocus: true,
            fieldLabel: this.fieldConfig.title,
            store: localStore,
            componentCls: "object_field object_field_type_" + this.type,
            width: 250,
            displayField: 'key',
            valueField: 'value',
            labelWidth: 100,
            value: dbValueObj.value,
            getSubmitValue: function (){
                var me = this;
                var key = me.getRawValue();
                var value = me.getValue();

                return JSON.stringify({key:key,value:value})
            },
            listeners:{
                focus: function(element, event, eOpts){
                    console.log('focus');
                    element.queryMode = 'remote';
                    element.bindStore(remoteStore);
                }
            }
        };


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
        console.log('remote:getValue');
        if (this.isRendered()) {
            console.log(this.component.getSubmitValue());
            return this.component.getSubmitValue();
        }

        return this.data;
    },


    getName: function () {
        return this.fieldConfig.name;
    },

    isDirty:function () {
        var dirty = false;

        if(this.defaultValue) {
            return true;
        }

        if (this.component && typeof this.component.isDirty == "function") {
            if (this.component.rendered) {
                dirty = this.component.isDirty();

                // once a field is dirty it should be always dirty (not an ExtJS behavior)
                if (this.component["__pimcore_dirty"]) {
                    dirty = true;
                }
                if (dirty) {
                    this.component["__pimcore_dirty"] = true;
                }

                return dirty;
            }
        }

        return false;
    },

    applyDefaultValue: function() {

        this.defaultValue = null;
        if ((typeof this.data === "undefined" || this.data === null) && this.fieldConfig.defaultValue) {
            this.data = this.fieldConfig.defaultValue;
            this.defaultValue = this.data;
        }
    }

});

