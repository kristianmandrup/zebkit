/**
 * Sequential tasks runner. Allows developers to execute number of tasks (async and sync) in the
 * the order they have been called by runner:

        var r = new zebkit.util.Runner();

        r.run(function() {
            // call three asynchronous HTTP GET requests to read three files
            zebkit.io.GET("http://test.com/a.txt", this.join());
            zebkit.io.GET("http://test.com/b.txt", this.join());
            zebkit.io.GET("http://test.com/c.txt", this.join());
        })
        .
        run(function(r1, r2, r3) {
            // handle completely read on previous step files
            r1.responseText  // "a.txt" file content
            r2.responseText  // "b.txt" file content
            r3.responseText  // "c.txt" file content
        })
        .
        error(function(e) {
            // called when an exception has occurred
            ...
        });


 * @class zebkit.ui.Runner
 */
export const Runner = function() {
    this.$tasks      = [];
    this.$results    = [];
    this.$error      = null;
    this.$busy       = 0;

    this.run = function(body) {
        this.$tasks.push(function() {
            // clean results of execution of a previous task
            this.$results = [];
            this.$busy    = 0;

            if (this.$error == null) {
                var r = null;
                try {
                    r = body.apply(this, arguments);
                }
                catch(e) {
                    this.fireError(e);
                    return;
                }

                // this.$busy === 0 means we have called synchronous task
                if (this.$busy === 0 && this.$error == null) {
                    // check if the task returned result
                    if (typeof r !== "undefined") {
                        this.$results[0] = r;
                    }
                }
            }
            this.$schedule();
        });

        this.$schedule();
        return this;
    };

    this.fireError = function(e) {
        if (this.$error == null) {
            this.$busy    = 0;
            this.$error   = e;
            this.$results = [];
        }
        this.$schedule();
    };

    this.join = function() {
        var $this = this,
            index = this.$busy++;

        return function() {
            $this.$results[index] = [];

            // since error can occur and times variable
            // can be reset to 0 we have to check it
            if ($this.$busy > 0) {
                if (arguments.length > 0) {
                    for(var i = 0; i < arguments.length; i++) {
                        $this.$results[index][i] = arguments[i];
                    }
                }

                if (--$this.$busy === 0) {
                    // make result
                    if ($this.$results.length > 0) {
                        var r = [];
                        for(var i = 0; i < $this.$results.length; i++) {
                            Array.prototype.push.apply(r, $this.$results[i]);
                        }
                        $this.$results = r;
                    }
                    $this.$schedule();
                }
            }
        };
    };

    this.error = function(callback) {
        var $this = this;
        this.$tasks.push(function() {
            if ($this.$error != null) {
                try {
                    callback.call($this, $this.$error);
                }
                finally {
                    $this.$error = null;
                }
            }
            $this.$schedule();
        });
        this.$schedule();
        return this;
    };

    this.$schedule = function() {
        if (this.$tasks.length > 0 && this.$busy === 0) {
            this.$tasks.shift().apply(this, this.$results);
        }
    };
};