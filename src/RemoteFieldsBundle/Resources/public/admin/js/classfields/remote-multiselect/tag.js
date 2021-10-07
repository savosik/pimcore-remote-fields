pimcore.registerNS("pimcore.object.tags.remoteMultiSelect");
pimcore.object.tags.remoteMultiSelect = Class.create(pimcore.object.tags.abstract, {

    type: "remoteMultiSelect",
    allowBatchAppend: true,
    allowBatchRemove: true,

    initialize: function (data, fieldConfig) {
        this.data = data;
        this.fieldConfig = fieldConfig;
    },

    getGridColumnConfig: function(field) {


        return {
            text: t(field.label),
            width: 150,
            sortable: false,
            dataIndex: field.key,
            getEditor:this.getWindowCellEditor.bind(this, field),
            renderer: function (key, value, metaData, record) {


                try {
                    if(record.data.inheritedFields && record.data.inheritedFields[key] && record.data.inheritedFields[key].inherited == true) {
                        metaData.tdCls += " grid_value_inherited";
                    }
                } catch (e) {
                    console.log(e);
                }

                if (value) {

                    var render_str = '';
                    var objects_arr = [];

                    try{
                        objects_arr = JSON.parse(value);
                    }catch (e){}

                    if(objects_arr.length > 0){
                        var _tmp = [];

                        objects_arr.forEach(function (item,i,array){
                            _tmp.push(item.key);
                        });
                        render_str = _tmp.join(", ");
                    }


                    return replace_html_event_attributes(strip_tags(render_str, 'div,span,b,strong,em,i,small,sup,sub'));
                } else {
                    return "";
                }
            }.bind(this, field.key)};

    },


    /*  realised methods */

    getGridColumnFilter: function(field) {
        return {type: 'string', dataIndex: field.key};
    },

    prepareStoreDataAndFilterLabels: function(data) {

        var storeData = [];

        if(data){
            var dataitems = JSON.parse(data);
            for (var i = 0; i < dataitems.length; i++){
                var value = dataitems[i].value;
                var key = dataitems[i].key;
                if(key.indexOf('<') >= 0){
                    key = replace_html_event_attributes(strip_tags(key, "div,span,b,strong,em,i,small,sup,sub2"));
                }
                storeData.push({key: key, value: value});
            }

        }

        return storeData;

    },

    getLayoutEdit: function () {

        // generate store
        var validValues = [];
        var hasHTMLContent = false;
        var storeData = this.prepareStoreDataAndFilterLabels(this.data);
        for (var i = 0; i < storeData.length; i++) {
            validValues.push(storeData[i].value);
            if(storeData[i].value.indexOf('<') >= 0) {
                hasHTMLContent = true;
            }
        }

        var store = Ext.create('Ext.data.Store', {
            fields: ['key', 'value'],
            data: storeData
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
            editable: false,
            fieldLabel: this.fieldConfig.title,
            store: store,
            componentCls: "object_field object_field_type_" + this.type,
            displayField: 'key',
            valueField: 'value',
            labelWidth: this.fieldConfig.labelWidth ? this.fieldConfig.labelWidth : 100,
            listeners: {
                change : function  ( remoteMultiselect , newValue , oldValue , eOpts ) {
                    console.log('remoteMultiselect.getValue');
                    console.log(remoteMultiselect.getValue());

                    if (this.fieldConfig.maxItems && remoteMultiselect.getValue().length > this.fieldConfig.maxItems) {
                        Ext.Msg.alert(t("error"),t("limit_reached"));
                    }
                    return true;
                }.bind(this),
                focus: function(element, event, eOpts){
                    element.queryMode = 'remote';
                    element.bindStore(remoteStore);
                }
            },
            getSubmitValue: function (){
                var curr_values = this.getValue();
                var curr_labels = this.getRawValue();
                var result = [];
                if(curr_values.length > 0){
                    var labels = curr_labels.split(",");

                    curr_values.forEach(function(item, i, arr){
                        result.push(JSON.stringify({
                            'key' : labels[i],
                            'value' : item
                        }));
                    });
                }
                console.log(result);
                return result;
            }
        };

        if (this.fieldConfig.width) {
            options.width = this.fieldConfig.width;
        } else {
            options.width = 300;
        }

        if (this.fieldConfig.labelAlign) {
            options.labelAlign = this.fieldConfig.labelAlign;
        }

        if (!this.fieldConfig.labelAlign || 'left' === this.fieldConfig.labelAlign) {
            options.width = this.sumWidths(options.width, options.labelWidth);
        }

        if (this.fieldConfig.height) {
            options.height = this.fieldConfig.height;
        }

        if (typeof this.data == "string" || typeof this.data == "number") {
            options.value = validValues.join(",");
        }

        options.queryMode = 'local';
        options.editable = true;
        if(hasHTMLContent) {
            options.labelTpl = '{[Ext.util.Format.stripTags(values.key)]}';
        }
        this.component = Ext.create('Ext.form.field.Tag', options);

        return this.component;
    },

    getLayoutShow: function () {

        this.component = this.getLayoutEdit();

        this.component.on("afterrender", function () {
            this.component.disable();
        }.bind(this));

        return this.component;
    },

    getValue: function () {
        if(this.isRendered()) {
            return this.component.getSubmitValue();
        }

        let res = [];
        if (this.data) {
            res = [this.data];
        }

        return res;
    },

    getName: function () {
        return this.fieldConfig.name;
    },

    getCellEditValue: function () {
        return this.getValue();
    }
});
