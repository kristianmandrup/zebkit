(function() {
    var quantum = 40, tasks = Array(5), count = 0, pid = -1;

    function dispatcher() {
        var c = 0;
        for(var i = 0; i < tasks.length; i++) {
            var t = tasks[i];

            if (t.isStarted === true) {
                c++;
                if (t.si <= 0) {
                    try {
                        if (t.ctx == null) t.task(t);
                        else               t.task.call(t.ctx, t);
                    }
                    catch(e) {
                        console.log(e.stack ? e.stack : e);
                    }

                    t.si += t.ri;
                }
                else {
                    t.si -= quantum;
                }
            }
        }

        if (c === 0 && pid >= 0) {
            window.clearInterval(pid);
            pid = -1;
        }
    }

    /**
     * Task is keeps a context of and allows developers
     * to run, shutdown, pause a required method as a task
     * Developer cannot instantiate the class directly.
     * Use "zebkit.util.task(...)" method to do it:

        var t = zebkit.util.task(function(context) {
            // task body
            ...
        });

        // run task in 1 second and repeat the task execution
        // every half second
        t.run(1000, 500);
        ...

        t.shutdown(); // stop the task

     * @class zebkit.util.TaskCotext
     */
    function Task() {
        this.ctx = this.task = null;
        this.ri  = this.si  = 0;

        /**
         * Indicates if the task is executed (active)
         * @type {Boolean}
         * @attribute isStarted
         * @readOnly
         */
        this.isStarted = false;
    }

    pkg.TaskCotext = Task;

    /**
     * Shutdown the given task.
     * @method shutdown
     */
    Task.prototype.shutdown = function() {
        if (this.task != null) {
            count--;
            this.ctx = this.task = null;
            this.isStarted = false;
            this.ri = this.si = 0;
        }

        if (count === 0 && pid  >= 0) {
            window.clearInterval(pid);
            pid = -1;
        }
    };

    /**
     * Run the task
     * @param {Integer} [startIn] a time (in milliseconds) in which the task has to be started
     * @param {Integer} [repeatIn] a period (in milliseconds) the task has to be executed
     * @method run
     */
    Task.prototype.run = function(startIn, repeatIn) {
        if (this.task == null) {
            throw new Error("Task body has not been defined");
        }

        if (arguments.length > 0) this.si = startIn;
        if (arguments.length > 1) this.ri = repeatIn;
        if (this.ri <= 0) this.ri = 150;

        this.isStarted = true;

        if (count > 0 && pid < 0) {
            pid = window.setInterval(dispatcher, quantum);
        }

        return this;
    };

    /**
     * Pause the given task.
     * @method pause
     */
    Task.prototype.pause = function(t) {
        if (this.task == null) {
            throw new Error("Stopped task cannot be paused");
        }

        if (arguments.length === 0) {
            this.isStarted = false;
        }
        else {
            this.si = t;
        }
    };

    // pre-fill tasks pool
    for(var i = 0; i < tasks.length; i++) {
        tasks[i] = new Task();
    }

    /**
     * Take a free task from pool and run it with the specified
     * body and the given context.

        // allocate task
        var task = zebkit.util.task(function (ctx) {
            // do something

            // complete task if necessary
            ctx.shutdown();
        });

        // run task in second and re-run it every 2 seconds
        task.run(1000, 2000);

        ...

        // pause the task
        task.pause();

        ...
        // run it again
        task.run();

     * @param  {Function|Object} f a function that has to be executed
     * @param  {Object} [ctx]  a context the task has to be executed
     * @return {zebkit.util.Task} an allocated task
     * @method task
     * @api zebkit.util.task
     */
    pkg.task = function(f, ctx){
        if (typeof f != "function") {
            ctx = f;
            f = f.run;
        }

        if (f == null) {
            throw new Error("" + f);
        }

        // find free and return free task
        for(var i=0; i < tasks.length; i++) {
            var j = (i + count) % tasks.length, t = tasks[j];
            if (t.task == null) {
                t.task = f;
                t.ctx  = ctx;
                count++;
                return t;
            }
        }

        throw new Error("Out of tasks limit");
    };

    /**
     * Shut down all active at the given moment tasks
     * body and the given context.
     * @method shutdownAll
     * @api zebkit.util.shutdownAll
     */
    pkg.shutdownAll = function() {
        for(var i=0; i < tasks.length; i++) {
            tasks[i].shutdown();
        }
    };
})();