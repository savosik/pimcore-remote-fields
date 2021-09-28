pimcore.registerNS("pimcore.object.tags.remoteMultiSelect");
pimcore.object.tags.remoteMultiSelect = Class.create(pimcore.object.tags.abstract, {

    type: "remoteMultiSelect",

    initialize: function (data, fieldConfig) {
        this.data = data;
        this.fieldConfig = fieldConfig;

        console.log(data);
        console.log(fieldConfig);
    },

    getLayoutEdit: function () {

        var store = new Ext.data.JsonStore({
            proxy: {
                type: 'ajax',
                url: this.fieldConfig.remoteStorageUrl,
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            },
            fields: ["key", "value"],
            autoLoad: true
        });

        var options = {
            name: this.fieldConfig.name,
            triggerAction: "all",
            editable: false,
            fieldLabel: this.fieldConfig.title,
            store: store,
            componentCls: this.getWrapperClassNames(),
            valueField: 'value',
            labelWidth: this.fieldConfig.labelWidth ? this.fieldConfig.labelWidth : 100,
            listeners: {
                change : function  ( multiselect , newValue , oldValue , eOpts ) {
                    if (this.fieldConfig.maxItems && multiselect.getValue().length > this.fieldConfig.maxItems) {
                        // we need to set a timeout so setValue is applied when change event is totally finished
                        // without this, multiselect wont be updated visually with oldValue (but internal value will be oldValue)
                        setTimeout(function(multiselect, oldValue){
                            multiselect.setValue(oldValue);
                        }, 100, multiselect, oldValue);

                        Ext.Msg.alert(t("error"),t("limit_reached"));
                    }
                    return true;
                }.bind(this)
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

        options.height = this.fieldConfig.height;

        if (typeof this.data == "string" || typeof this.data == "number") {
            options.value = this.data;
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


    getValue:function () {
        if(this.isRendered()) {
            return this.component.getValue();
        }

        let res = [];
        if (this.data) {
            res = [this.data];
        }

        return res;
    },


    getName: function () {
        return this.fieldConfig.name;
    }


});