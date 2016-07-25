/**
 *  Image panel UI component class. The component renders an image.
 *  @param {String|Image} [img] a path or direct reference to an image object.
 *  If the passed parameter is string it considered as path to an image.
 *  In this case the image will be loaded using the passed path.
 *  @class zebkit.ui.ImagePan
 *  @constructor
 *  @extends zebkit.ui.ViewPan
 */
import ViewPan from './ViewPan';
import Picture from './Picture';
import * as web from '../../web';
import * as utils from '../utils';

export default class ImagePan extends ViewPan {
    $runner: any;

    constructor(img, w, h) {
        super();
        this.$runner = null;
        this.setImage(img != null ? img : null);
        if (arguments.length > 2) this.setPreferredSize(w, h);
    }

    /**
     * Set image to be rendered in the UI component
     * @method setImage
     * @param {String|Image|zebkit.ui.Picture} img a path or direct reference to an
     * image or zebkit.ui.Picture render.
     * If the passed parameter is string it considered as path to an image.
     * In this case the image will be loaded using the passed path
     * @chainable
     */
    setImage(img) {
        if (img != null) {
            var $this     = this,
                isPic     = utils.instanceOf(img, Picture),
                imgToLoad = isPic ? img.target : img ;

            if (this.$runner == null) {
                this.$runner = new util.Runner();
            }

            this.$runner.run(function() {
                web.$loadImage(imgToLoad, this.join());
            })
            .
            run(function(p, b, i) {
                $this.$runner = null;
                if (b) {
                    $this.setView(isPic ? img : new pkg.Picture(i));
                    $this.vrp();
                }

                if ($this.imageLoaded != null) {
                    $this.imageLoaded(p, b, i);
                }

                // TODO: should be generalized for the whole hierarchy, not only for one
                // parent
                if ($this.parent !== null && $this.parent.childImageLoaded != null) {
                     $this.parent.childImageLoaded(p, b, i);
                }
            })
            .
            error(function() {
                this.$runner = null;
                $this.setView(null);
            });
        } else {
            if (this.$runner == null) {
                this.setView(null);
            } else {
                var $this = this;
                this.$runner.run(function() {
                    $this.setView(null);
                });
            }
        }
        return this;
    }
}