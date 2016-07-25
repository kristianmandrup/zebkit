/**
 * Simple video panel that can be used to play a video:
 *

        // create canvas, add video panel to the center and
        // play video
        var canvas = zebkit.ui.zCanvas(500,500).root.properties({
            layout: new zebkit.layout.BorderLayout(),
            center: new zebkit.ui.VideoPan("trailer.mpg")
        });

 *
 * @param {String} url an URL to a video
 * @class zebkit.ui.VideoPan
 * @extends {zebkit.ui.Panel}
 * @constructor
 */
export default class VideoPan extends Panel {
    $clazz() {
        this.Listeners = zebkit.util.ListenersClass("playbackStateUpdated");

        this.SignLabel = Class(pkg.Panel, [
            function $clazz() {
                this.font = new pkg.Font("bold", 18);
            },

            function setColor(c) {
                this.kids[0].setColor(c);
                return this;
            },

            function(title) {
                this.$super(new zebkit.layout.FlowLayout("center", "center"));
                this.add(new pkg.Label(title).setFont(this.clazz.font));
                this.setBorder(new pkg.Border("gray", 1, 8));
                this.setPadding(6);
                this.setBackground("white");
                this.setColor("black");
            }
        ]);
    },

    constructor(clazz) {
        super();
        
        this.videoWidth = this.videoHeight = 0;

        this.cancelationTimeout = 20000 // 20 seconds

        this.showSign = true;

        this.$animStallCounter = this.$aspectRatio = 0;
        this.$adjustProportions = true;
        this.$lastError = this.$videoBound = this.$animTask = this.$cancelTask = null;
        this.$animCurrentTime = -1;

        this._ = new this.clazz.Listeners();

        this.views = {
            pause  : new clazz.SignLabel("Pause, press to continue").toView(),
            replay : new clazz.SignLabel("Press to re-play").toView(),
            play   : new clazz.SignLabel("Press to play").toView(),
            error  : new clazz.SignLabel("Failed, press to re-try").setColor("red").toView(),
            waiting: new clazz.SignLabel("Waiting ...").setColor("orange").toView()
        };

        this.paint = function(g) {
            if (this.$videoBound === null) {
                this.calcVideoBound();
            }

            g.drawImage(this.video, this.$videoBound.x,
                                    this.$videoBound.y,
                                    this.$videoBound.width,
                                    this.$videoBound.height);

            if (this.showSign === true) {
                var sign = null;

                if (this.$lastError !== null) {
                    sign = this.views.error;
                } else {
                    if (this.$cancelTask !== null) {
                        sign =  this.views.waiting;
                    } else if (this.video.ended) {
                        sign = this.views.replay;
                    } else if (this.video.paused) {
                        if (this.video.currentTime === 0) {
                            sign = this.views.play;
                        } else {
                            sign = this.views.pause;
                        }
                    }
                }

                if (sign !== null) {
                    this.paintViewAt(g, "center", "center",  sign);
                }
            }
        };

        this.autoplay = function(b) {
            this.video.autoplay = b;
            return this;
        };

        /**
         * Pause video
         * @method pause
         * @chainable
         */
        this.pause = function() {
            if (this.video.paused === false) {
                this.video.pause();
                this.repaint();
            }
            return this;
        };

        this.mute = function(b) {
            this.video.muted = b;
            return this;
        };

        /**
         * Start or continue playing video
         * @method play
         * @chainable
         */
        this.play = function() {
            if (this.video.paused === true) {
                if (this.$lastError != null) {
                    this.$lastError = null;
                    this.video.load();
                }

                this.video.play();
                this.repaint();
            }
            return this;
        };

        this.adjustProportions = function(b) {
            if (this.$adjustProportions !== b) {
                this.$adjustProportions = b;
                this.vrp();
            }
            return this;
        };

        this.calcPreferredSize = function(target) {
            return {
                width  : this.videoWidth,
                height : this.videoHeight
            };
        };

        this.pointerClicked = function(e) {
            if (this.isPaused()) {
                this.play();
            } else {
                this.pause();
            }
        };

        this.isPaused = function() {
            return this.video.paused;
        };

        this.isEnded = function() {
            return this.video.ended;
        };

        this.getDuration = function() {
            return this.video.duration;
        };

        this.compSized = function(e) {
            this.$calcVideoBound();
        };

        this.recalc = function() {
            this.$calcVideoBound();
        };

        this.$calcVideoBound = function() {
            this.$videoBound = {
                x      : this.getLeft(),
                y      : this.getTop(),
                width  : this.width  - this.getLeft() - this.getBottom(),
                height : this.height - this.getTop()  - this.getBottom()
            };

            if (this.$adjustProportions === true && this.$aspectRatio !== 0) {
                var ar = this.$videoBound.width / this.$videoBound.height;

                //    ar = 3:1       ar' = 10:3      ar' > ar
                //   +-------+   +--------------+
                //   | video |   |    canvas    |   =>  decrease canvas width proportionally ar/ar'
                //   +-------+   +--------------+
                //
                //    ar = 3:1       ar' = 2:1       ar' < ar
                //   +-----------+   +------+
                //   |  video    |   |canvas|   =>  decrease canvas height proportionally ar'/ar
                //   +-----------+   +------+
                if (ar < this.$aspectRatio) {
                    this.$videoBound.height = Math.floor((this.$videoBound.height * ar) / this.$aspectRatio);
                } else {
                    this.$videoBound.width = Math.floor((this.$videoBound.width * this.$aspectRatio)/ ar);
                }

                this.$videoBound.x = Math.floor((this.width  - this.$videoBound.width )/2);
                this.$videoBound.y = Math.floor((this.height - this.$videoBound.height)/2);
            }
        };

        this.$continuePlayback = function() {
            this.$interruptCancelTask();

            if (this.video.paused === false && this.video.ended === false) {
                if (this.$animTask === null) {
                    var $this = this;
                    this.$animCurrentTime  = this.video.currentTime;
                    this.$animStallCounter = 0;

                    this.$animTask = zebkit.web.$task(function anim() {
                        $this.$animTask = null;

                        if ($this.video.readyState > 1) {
                            if ($this.video.currentTime !== $this.$animCurrentTime) {
                                $this.$animStallCounter = 0;
                                $this.repaint();
                            } else {
                                $this.$animStallCounter++;
                                if ($this.$animStallCounter > 180) {
                                    $this.$cancelPlayback();
                                    return;
                                }
                            }
                        }

                        if ($this.video.paused === false &&
                            $this.video.ended  === false &&
                            $this.$cancelTask  === null    )
                        {
                            $this.$animTask = zebkit.web.$task(anim);
                        }
                    });
                }
            }
        };

        this.$cancelPlayback = function() {
            if (this.video.paused === true || this.video.ended === true) {
                this.$interruptCancelTask();
            } else {
                if (this.$cancelTask === null) {
                    var $this = this;
                    this.$postponedTime = new Date().getTime();

                    this.$cancelTask = setInterval(function() {
                        var dt = new Date().getTime() - $this.$postponedTime;
                        if (dt > $this.cancelationTimeout) {
                            try {
                                if ($this.video.paused === false) {
                                    $this.$lastError = "Playback failed";
                                    $this.pause();
                                    $this.repaint();
                                    $this._.playbackStateUpdated($this, "error");
                                }
                            } finally {
                                $this.$interruptCancelTask();
                            }
                        } else {
                            $this._.playbackStateUpdated($this, "wait");
                        }
                    }, 200);
                }
            }
        };

        this.$interruptCancelTask = function() {
            if (this.$cancelTask !== null) {
                clearInterval(this.$cancelTask);
                this.$postponedTime = this.$cancelTask = null;
            }
        };
    },

    function(src) {
        var $this = this;

        /**
         * Original video DOM element that is created
         * to play video
         * @type {Video}
         * @readOnly
         * @attribute video
         */
        this.video  = document.createElement("video");
        this.source = document.createElement("source");
        this.source.setAttribute("src", src);
        this.video.appendChild(this.source);

        this.$super();

        // canplaythrough is video event
        this.video.addEventListener("canplaythrough", function() {
            $this._.playbackStateUpdated($this, "ready");
            $this.repaint();
            $this.$continuePlayback();
        }, false);


        this.video.addEventListener("ended", function() {
            $this._.playbackStateUpdated($this, "end");
            $this.$interruptCancelTask();
        }, false);

        this.video.addEventListener("pause", function() {
            $this._.playbackStateUpdated($this, "pause");
            $this.$interruptCancelTask();
        }, false);

        this.video.addEventListener("play", function() {
            $this.$continuePlayback();
            $this._.playbackStateUpdated($this, "play");
        }, false);

        // progress event indicates a loading progress
        // the event is useful to detect recovering from network
        // error
        this.video.addEventListener("progress", function() {
            // if playback has been postponed due to an error
            // let's say that problem seems fixed and delete
            // the cancel task
            if ($this.$cancelTask !== null) {
                $this.$interruptCancelTask();

                // detect if progress event has to try to start animation that has not been
                // started yet or has been canceled for a some reason
                if ($this.$animTask === null && $this.video.paused === false) {
                    $this.$continuePlayback();
                    $this._.playbackStateUpdated($this, "continue");
                }
            }
        }, false);

        this.source.addEventListener("error", function(e) {
            $this.$interruptCancelTask();
            $this.$lastError = e.toString();
            $this._.playbackStateUpdated($this, "error");
            $this.repaint();
            $this.pause();
        }, false);

        this.video.addEventListener("stalled", function() {
            $this.$cancelPlayback();
        }, false);

        this.video.addEventListener("loadedmetadata", function (e) {
            $this.videoWidth   = this.videoWidth,
            $this.videoHeight  = this.videoHeight,
            $this.$aspectRatio = $this.videoHeight > 0 ? $this.videoWidth / $this.videoHeight : 0;
            $this.vrp();
        }, false);
    }
}