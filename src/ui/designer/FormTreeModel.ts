import data from '../data';

class FormTreeModel extends data.TreeModel {
    function $prototype() {
        this.buildModel = function(comp, root){
            var b    = this.exclude != null && this.exclude(comp),
                item = b ? root : this.createItem(comp);

            for(var i = 0; i < comp.kids.length; i++) {
                var r = this.buildModel(comp.kids[i], item);
                if (r != null) {
                    r.parent = item;
                    item.kids.push(r);
                }
            }
            return b ? null : item;
        };

        this.itemByComponent = function (c, r){
            if (r == null) r = this.root;
            if (r.comp === c) return c;
            for(var i = 0;i < r.kids.length; i++) {
                var item = this.itemByComponent(c, r.kids[i]);
                if (item != null) return item;
            }
            return null;
        };

        this.createItem = function(comp){
            var name = comp.clazz.$name;
            if (name == null) name = comp.toString();
            var index = name.lastIndexOf('.'),
                item = new zebkit.data.Item(index > 0 ? name.substring(index + 1) : name);
            item.comp = comp;
            return item;
        };
    },

    function (target){
        this.$super(this.buildModel(target, null));
    }
}