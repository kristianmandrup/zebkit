import { types } from '../../utils';
import { web } from '../../';

export function decodeSize(s, defaultHeight) {
    if (types.isString(s)) {
        var size = Number(s);
        if (isNaN(size)) {
            var m = s.match(/^([0-9]+)(%)$/);
            if (m != null && m[1] != null && m[2] != null) {
                size = Math.floor((defaultHeight * parseInt(m[1], 10)) / 100);
                return size + "px";
            }
            return /^([0-9]+)(em|px)$/.test(s) === true ? s : null;
        } else {
            if (s[0] === '+') {
                size = defaultHeight + size;
            } else if (s[0] === '-') {
                size = defaultHeight - size;
            }
            return size + "px";
        }
    }
    return s == null ? null : s + "px";
}



export let $canvases = [];
// canvases location has to be corrected if document layout is invalid
export const $elBoundsUpdated = function() {
    for(var i = $canvases.length - 1; i >= 0; i--) {
        var c = $canvases[i];
        if (c.isFullSize === true) {
            //c.setLocation(window.pageXOffset, -window.pageYOffset);

            var ws = web.$viewPortSize();

            // browser (mobile) can reduce size of browser window by
            // the area a virtual keyboard occupies. Usually the
            // content scrolls up to the size the VK occupies, so
            // to leave zebkit full screen content in the window
            // with the real size (not reduced) size take in account
            // scrolled metrics
            c.setSize(ws.width  + window.pageXOffset,
                        ws.height + window.pageYOffset);
        }
        c.recalcOffset();
    }
};

var $wrt = null, $winSizeUpdated = false, $wpw = -1, $wph = -1;
window.addEventListener("resize", function(e) {
    var ws = web.$viewPortSize();
    if ($wpw !== window.innerWidth || $wph !== window.innerHeight) {
        $wpw = window.innerWidth;
        $wph = window.innerHeight;

        if ($wrt != null) {
            $winSizeUpdated = true;
        }
        else {
            $wrt = util.task(
                function(t) {
                    if ($winSizeUpdated === false) {
                        pkg.$elBoundsUpdated();
                        t.shutdown();
                        $wrt = null;
                    }
                    $winSizeUpdated = false;
                }
            ).run(200, 150);
        }
    }
}, false);

window.onbeforeunload = function(e) {
    var msgs = [];
    for(var i = $canvases.length - 1; i >= 0; i--) {
        if ($canvases[i].saveBeforeLeave != null) {
            var m = $canvases[i].saveBeforeLeave();
            if (m != null) {
                msgs.push(m);
            }
        }
    }

    if (msgs.length > 0) {
        var message = msgs.join("  ");
        if (typeof e === 'undefined') {
            e = window.event;
        }

        if (e) e.returnValue = message;
        return message;
    }
};

// TODO: this is depricated events that can have significant impact to
// page performance. That means it has to be removed and replace with soemting
// else
//
// bunch of handlers to track HTML page metrics update
// it is necessary since to correct zebkit canvases anchor
// and track when a canvas has been removed
document.addEventListener("DOMNodeInserted", function(e) {
    $elBoundsUpdated();
}, false);

document.addEventListener("DOMNodeRemoved", function(e) {
    // remove canvas from list
    for(var i = $canvases.length - 1; i >= 0; i--) {
        var canvas = $canvases[i];
        if (web.$contains(canvas.element) !== true) {
            $canvases.splice(i, 1);
            if (canvas.saveBeforeLeave != null) {
                canvas.saveBeforeLeave();
            }
        }
    }

    $elBoundsUpdated();
}, false);
