// TODO: this is the new code that has to be documented, covered with test cases
// and most likely the code has  to replace tasks !
export default function Runner() {
    this.$tasks   = [];
    this.$results = [];
    this.$head    = -1;
    this.$ecb     = null;

    function $args(a) {
        if (a == null || a.length === 0) return null;
        var args = [];
        for(var i=0; i < a.length; i++) args[i] = a[i];
        return args;
    }

    this.run = function(body) {
        return this.$run(function() {
            var times = 0,
                $this = this,
                ctx   = {
                    join: function() {
                        times++;
                        return function() {
                            $this.$results.push($args(arguments));
                            if (--times === 0) {
                                $this.$complete();
                            }
                        }
                    }
                },
                r = null;

            try {
                r = body.apply(ctx, this.$results);
            }
            catch(e) {
                if (this.$error(e) == false) throw e;
            }

            this.$results = [];
            if (times === 0) {
                if (r != null) this.$results.push(r);
                this.$complete();
            }
        });
    };

    this.end = function(cb) {
        var $this = this;
        this.$run(function() {
            $this.$tasks = [];
            $this.$head  = -1;
            try {
                cb.apply($this, $this.$results);
                $this.$results = [];
            }
            catch(e) {
                $this.$results = [];
                if ($this.$error(e) == false) {
                    throw e;
                }
            }
        });
        return this;
    };

    this.error = function(cb) {
        this.$ecb = cb;
    };

    this.$run = function(f) {
        this.$tasks.push({ $func: f });
        this.$schedule();
        return this;
    };

    this.$schedule = function() {
        if (this.$tasks.length > 0 &&
            this.$head < this.$tasks.length - 1)
        {
            var task = null;
            if (this.$head < 0) {
                this.$head = 0;
                task = this.$tasks[this.$head];
            }
            else {
                if (this.$tasks[this.$head].$func == null) {
                    task = this.$tasks[++this.$head];
                }
            }

            if (task != null) {
                // call registered tasks
                task.$func.call(this);
                return task;
            }
        }
        return null;
    };

    this.$complete = function() {
        var task = this.$tasks[this.$head];
        task.$func = null;
        this.$schedule();
    };

    this.$error = function(e) {
        if (this.$ecb != null) {
            this.$ecb(e, this.$head);
            return true;
        }
        return false;
    };
}