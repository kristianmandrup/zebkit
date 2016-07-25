export default class Bootstrap {
    constructor(urlPath = './zebkit.json') {
        this.urlPath = urlPath;
    }

    boot(loadFun) {
        this.load = loadFun || this.loadUrlPath;

        this.busy();
        this.load(urlPath).then(() => {
            this.ready();
        }.catch((e) => {
            console.log("Config JSON loading failed:" + (e.stack != null ? e.stack : e));
        }
    }

    // load json from a path or url
    loadUrlPath() {
    }

    busy() {
    }

    ready() {        
    }
}