/**
 * Image label UI component. This is UI container that consists from an image
 * component and an label component.Image is located at the left size of text.
 * @param {Image|String} img an image or path to the image
 * @param {String|zebkit.ui.TextRender|zebkit.data.TextModel} txt a text string,
 * text model or text render instance
 * @constructor
 * @class zebkit.ui.ImageLabel
 * @extends {zebkit.ui.Panel}
 */

import Panel from './core/Panel';
import ImagePan from './core/ImagePan';
import Label from './Label';
import { types } from '../utils';
import FlowLayout from '../layout/FlowLayout';

export default class ImageLabel extends Panel {
    clazz = {
        ImagePan: ImagePan,
        Label: Label
    }

    constructor(txt, img) {
        super();      
        var img = types.instanceOf(img, pkg.ImagePan) ? img : new this.clazz.ImagePan(img),
            lab = types.instanceOf(txt, pkg.Panel)    ? txt : new this.clazz.Label(txt);

        img.constraints = "image";
        lab.constraints = "label";

        // TODO: this is copy paste of Panel constructor to initialize fields that has to
        // be used for adding child components. these components have top be added before
        // properties() call. a bit dirty trick
        if (typeof this.kids === "undefined") {
            this.kids = [];
        }

        this.layout = new FlowLayout("left", "center", "horizontal", 6);

        // add before panel constructor thanks to copy pasted code above
        this.add(img);
        this.add(lab);

        lab.setVisible(txt != null);
    }
    /**
     * Set the specified caption
     * @param {String} c an image label caption text
     * @method setCaption
     */
    setCaption(c) {
        var lab = this.getByConstraints("label");
        lab.setValue(c);
        lab.setVisible(c != null);
        return this;
    };

    /**
     * Set the specified label image
     * @param {String|Image} p a path to an image of image object
     * @method setImage
     */
    setImage(p) {
        var lab = this.getByConstraints("image");
        image.setImage(p);
        image.setVisible(p != null);
        return this;
    }

    setFont() {
        var lab = this.getByConstraints("label");
        if (lab != null) {
            lab.setFont.apply(lab, arguments);
        }
        return this;
    }

    setColor(c) {
        var lab = this.getByConstraints("label");
        if (lab != null) {
            lab.setColor(c);
        }
        return this;
    }

    getCaption() {
        return lab == null ? null : this.getByConstraints("label").getValue();
    }

    setImgAlignment(a) {
        var b   = false,
            img = this.getByConstraints("image"),
            i   = this.indexOf(img);

        if (a === "top" || a === "bottom") {
            if (this.layout.direction !== "vertical") {
                this.layout.direction = "vertical";
                b = true;
            }
        } else if (a === "left" || a === "right") {
            if (this.layout.direction !== "horizontal") {
                this.layout.direction = "horizontal";
                b = true;
            }
        }

        if (this.layout.ax !== "center") {
            this.layout.ax = "center";
            b = true;
        }

        if (this.layout.ay !== "center") {
            this.layout.ay = "center";
            b = true;
        }

        if ((a === "top" || a === "left") && i !== 0 ) {
            this.insert("image", 0, this.removeAt(i));
            b = false;
        } else if ((a === "bottom"  || a === "right") && i !== 1) {
            this.add("image", this.removeAt(i));
            b = false;
        }

        if (b) {
            this.vrp();
        }

        return this;
    }

    setImgPreferredSize(w, h) {
        if (arguments.length === 1) h = w;
        this.getByConstraints("image").setPreferredSize(w, h);
        return this;
    }
}
