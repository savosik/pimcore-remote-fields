pimcore.registerNS("pimcore.object.tags.remoteSelect");
pimcore.object.tags.remoteSelect = Class.create(pimcore.object.tags.abstract, {

    type: "remoteSelect",

    initialize: function (data, fieldConfig) {
        this.data = data;
        this.fieldConfig = fieldConfig;
    },

    getCellEditor: function (field, record) {
        var key = field.key;
        if(field.layout.noteditable) {
            return null;
        }
        var cellValue = record.data[key];

        var localData = [];

        var dbValueObj = {key:'',value:''};

        if(cellValue){
            try{
                dbValueObj = JSON.parse(cellValue);
            }catch (e) {}
        }

        if(!field.layout.mandatory) {
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
                    "url" : field.layout.remoteStorageUrl
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
            triggerAction: "all",
            editable: true,
            queryMode: 'local',
            anyMatch: true,
            autoComplete: true,
            forceSelection: true,
            selectOnFocus: true,
            store: localStore,
            displayField: 'key',
            valueField: 'value',
            value: dbValueObj.value,
            getValue: function (){
                return JSON.stringify({key:this.getRawValue(),value:this.value})
            },
            listeners:{
                focus: function(element, event, eOpts){
                    element.queryMode = 'remote';
                    element.bindStore(remoteStore);
                }
            },
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '{[Ext.util.Format.stripTags(values.key)]}',
                '</tpl>'
            )
        };

        if (field.config) {
            if (field.config.width) {
                if (intval(field.config.width) > 10) {
                    options.width = field.config.width;
                }
            }
        }


        return new Ext.form.ComboBox(options);
    },

    getGridColumnConfig: function(field) {

        var renderer = function (key, data, metaData, record) {

            var value = {key:'',value:''};

            if(data){
                try{
                    value = JSON.parse(data);
                }catch (e) {}
            }

            this.applyPermissionStyle(key, value, metaData, record);

            if (record.data.inheritedFields[key] && record.data.inheritedFields[key].inherited == true) {
                try {
                    metaData.tdCls += " grid_value_inherited";
                } catch (e) {
                    console.log(e);
                }
            }

            return value.key;

        }.bind(this, field.key);

        return {
            text: t(field.label),
            sortable:true,
            dataIndex:field.key,
            renderer: renderer,
            getEditor:this.getCellEditor.bind(this, field)
        };
    },

    getGridColumnFilter: function(field) {
        return {type: 'string', dataIndex: field.key};
    },

    getLayoutEdit: function () {

        var localData = [];

        //we accept only json values from db
        var dbValueObj = {key:'',value:''};


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
            autoComplete: true,
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
            getSubmitData: function (){
                var submitData = null;
                submitData = Ext.encode(this.getData());
                console.log(submitData);
                return submitData;
            },
            listeners:{
                focus: function(element, event, eOpts){
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
        if (this.isRendered()) {
            return this.component.getSubmitData();
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
    }
});

