/**
 * List component consider its children UI components as a list model items. Every added to the component
 * UI children component becomes a list model element. The implementation allows developers to use
 * other UI components as its elements what makes list item view customization very easy and powerful:

        // use image label as the component list items
        var list = new zebkit.ui.CompList();
        list.add(new zebkit.ui.ImageLabel("Caption 1", "icon1.gif"));
        list.add(new zebkit.ui.ImageLabel("Caption 2", "icon2.gif"));
        list.add(new zebkit.ui.ImageLabel("Caption 3", "icon3.gif"));


 * @class zebkit.ui.CompList
 * @extends zebkit.ui.BaseList
 * @param {zebkit.data.ListModel|Array} [model] a list model that should be passed as an instance
 * of zebkit.data.ListModel or as an array.
 * @param {Boolean} [isComboMode] true if the list navigation has to be triggered by
 * pointer cursor moving
 */
import BaseList from './BaseList';
import Label from './ui/Label';
import ImageLabel from './ui/ImageLabel';

export default class CompList extends BaseList {
    $clazz = {
        Label: Label,
        ImageLabel: ImageLabel, 
        Listeners: this.$parent.Listeners.ListenersClass("elementInserted", "elementRemoved", "elementSet")
    }

    model: any;
    max: number;

    constructor(m, b?) {
        super(m, b);
        this.model = this;
        this.max   = null;
        this.setViewProvider(new zebkit.Dummy([
            function $prototype() {
                this.render = new pkg.CompRender();
                this.getView = function (target,obj,i) {
                    this.render.setTarget(obj);
                    return this.render;
                };
            }
        ]));        
    }

    at(i) {
        if (i < 0 || i >= this.kids.length) {
            throw new RangeError(i);
        }
        return this.kids[i];
    }

    contains(c) {
        return this.indexOf(c) >= 0;
    }

    count() {
        return this.kids.length;
    }

    catchScrolled(px, py) {};

    getItemLocation(i) {
        return { x:this.kids[i].x, y:this.kids[i].y };
    }

    getItemSize(i) {
        return this.kids[i].isVisible === false ? { width:0, height: 0 }
                                                : { width:this.kids[i].width, height:this.kids[i].height};
    }

    recalc(){
        this.max = zebkit.layout.getMaxPreferredSize(this);
    }

    calcMaxItemSize(){
        this.validate();
        return { width:this.max.width, height:this.max.height };
    }

    getItemIdxAt(x,y){
        return zebkit.layout.getDirectAt(x, y, this);
    }

    isItemSelectable(i) {
        return this.model.get(i).isVisible === true &&
                this.model.get(i).isEnabled === true;
    }

    catchInput(child){
        if (this.isComboMode !== true) {
            var p = child;
            while (p != this) {
                if (p.stopCatchInput === true) return false;
                p = p.parent;
            }
        }
        return true;
    }

    setModel(m){
        if (Array.isArray(m)) {
            for(var i=0; i < m.length; i++) {
                this.add(m[i]);
            }
        } else {
            throw new Error("Invalid comp list model");
        }
        return this;
    }

    // static?

    setPosition(c){
        if (c != this.position){
            if (zebkit.instanceOf(this.layout, zebkit.util.Position.Metric)) {
                c.setMetric(this.layout);
            }
            super.setPosition(c);
        }
    }

    setLayout(layout){
        if (layout != this.layout){
            this.scrollManager = new pkg.ScrollManager(this, [
                function $prototype() {
                    this.calcPreferredSize = function(t) {
                        return layout.calcPreferredSize(t);
                    };

                    this.doLayout = function(t){
                        layout.doLayout(t);
                        for(var i = 0; i < t.kids.length; i++){
                            var kid = t.kids[i];
                            if (kid.isVisible === true) {
                                kid.setLocation(kid.x + this.getSX(),
                                                kid.y + this.getSY());
                            }
                        }
                    };

                    this.scrollStateUpdated = function(sx,sy,px,py){
                        this.target.vrp();
                    };
                }
            ]);

            super.setLayout(this.scrollManager);
            if (this.position != null) {
                this.position.setMetric(zebkit.instanceOf(layout, zebkit.util.Position.Metric) ? layout : this);
            }
        }

        return this;
    }

    setAt(i, item) {
        if (i < 0 || i >= this.kids.length) {
            throw new RangeError(i);
        }
        return super.setAt(i, item);
    }

    insert(i, constr, e) {
        if (arguments.length == 2) {
            e = constr;
            constr = null;
        }

        if (i < 0 || i > this.kids.length) {
            throw new RangeError(i);
        }
        return super.insert(i, constr, zebkit.instanceOf(e, pkg.Panel) ? e : new this.clazz.Label("" + e));
    }

    kidAdded(index,constr,e){
        super.kidAdded(index,constr,e);
        this.model._.elementInserted(this, e, index);
    }

    kidRemoved(index,e) {
        super.kidRemoved(index,e);
        this.model._.elementRemoved(this, e, index);
    }
}