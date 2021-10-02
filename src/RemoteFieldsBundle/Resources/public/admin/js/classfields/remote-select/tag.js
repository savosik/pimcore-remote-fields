pimcore.registerNS("pimcore.object.tags.remoteSelect");
pimcore.object.tags.remoteSelect = Class.create(pimcore.object.tags.abstract, {

    type: "remoteSelect",

    getName: function () {
        return this.fieldConfig.name;
    },

    initialize: function (data, fieldConfig) {
        this.data = data;
        this.fieldConfig = fieldConfig;
    },


    //shows when user opens data object for editing
    getLayoutEdit: function () {

        //we accept only json values from db
        var dbValueObj = {key:'',value:''};
        try{
            dbValueObj = JSON.parse(this.data);
        }catch (e) {}


        //set two allowed variants for local storage (empty or data from db)
        var localData = [];

        if(!this.fieldConfig.mandatory) {
            localData.push({'key': "(" + t("empty") + ")", 'value': ''});
        }
        if(dbValueObj.value !== ''){
            localData.push(dbValueObj);
        }


        var localStore = Ext.create('Ext.data.Store', {
            autoDestroy:true,
            fields: ['value', 'key'],
            data : localData
        });

        var remoteStore = new Ext.data.JsonStore({
            autoDestroy:true,
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
            anyMatch: true,
            forceSelection: true,
            selectOnFocus: true,
            displayField: 'key',
            valueField: 'value',
            value: dbValueObj.value || null,
            componentCls: "object_field object_field_type_" + this.type,

            queryMode: 'local',
            store: localStore,
            listeners:{
                beforequery: function(qe){
                    delete qe.combo.lastQuery;
                },
                focus: function(element, event, eOpts){
                    element.queryMode = 'remote';
                    remoteStore.load();
                    element.store.add(remoteStore);
                }
            },
            getSubmitValue: function (){
                var me = this;
                var key = me.getRawValue();
                var value = me.getValue();

                return JSON.stringify({key:key,value:value})
            }
        };

        //resolve pimcore default settings
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

        return new Ext.form.ComboBox(options);
    },


    getValue:function () {
        if (this.isRendered()) {
            return this.component.getSubmitValue();
        }

        return this.data;
    },


    getLayoutShow: function () {

        this.component = this.getLayoutEdit();
        this.component.setReadOnly(true);

        return this.component;
    },

    getGridColumnFilter: function(field) {
        return {type: 'string', dataIndex: field.key};
    },

    getGridColumnConfig:function (field) {
        return this.getGridColumnConfigStatic(field);
    },

    getGridColumnConfigStatic: function(field) {

    },

    getGridColumnEditor: function(field) {

    },













});