import util from '../util';
import web from '../web';
import zebkit from '../';

export default class Bag extends util.Bag {
    url: string;
    globalPropertyLookup: boolean;
    usePropertySetters: boolean;

    constructor() {
        super();
        this.globalPropertyLookup = this.usePropertySetters = true;
    }

    loadImage(path) {
        if (this.url != null && zebkit.URL.isAbsolute(path) === false) {
            var base = (new zebkit.URL(this.url)).getParentURL();
            path = base.join(path);
        }
        return web.$loadImage(path);
    }

    // static

    load = (s, cb) => {
      if (cb != null) {
          zebkit.busy();
          try {
              return super.load(s, function(e) {
                  // if an error during loading has happened callback method
                  // gets the error as a single argument. The problem callback itself
                  // can triggers the error and than be called second time but
                  // with the error as argument. So we have to recognize the situation
                  // by analyzing if the callback gets an error as
                  if (e == null) {
                      zebkit.ready();
                  }
                  cb.call(this, e);
              });
          }
          catch(e) {
              zebkit.ready();
              throw e;
          }
      }

      return super.load(s, null);
    }
}