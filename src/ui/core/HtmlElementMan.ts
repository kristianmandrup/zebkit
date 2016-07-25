import Manager from './Manager';
import * as web from '../../web';

export default class HtmlElementMan extends Manager {
//
// HTML element integrated into zebkit layout has to be tracked regarding:
//    1) DOM hierarchy. New added into zebkit layout DOM element has to be
//       attached to the first found parent DOM element
//    2) Visibility. If a zebkit UI component change its visibility state
//       it has to have side effect to all children HTML elements on any
//       subsequent hierarchy level
//    3) Moving a zebkit UI component has to correct location of children
//       HTML element on any subsequent hierarchy level.
//
//  The implementation of HTML element component has the following specific:
//    1) Every original HTML is wrapped with "div" element. It is necessary since
//       not all HTML element has been designed to be a container for another
//       HTML element. By adding extra div we can consider the wrapper as container.
//       The wrapper element is used to control visibility, location, enabled state
//    2) HTML element has "isDOMElement" property set to true
//    3) HTML element visibility depends on an ancestor component visibility.
//       HTML element is visible if:
//          -- the element isVisible property is true
//          -- the element has a parent DOM element set
//          -- all his ancestors are visible
//          -- size of element is more than zero
//          -- getCanvas() != null
//       The visibility state is controlled with "e.style.visibility"
//
//   To support effective DOM hierarchy tracking a zebkit UI component can
//   host "$domKid" property that contains direct DOM element the UI component
//   hosts and other UI components that host DOM element. So it is sort of tree.
//   For instance:
//
//    +---------------------------------------------------------
//    |  p1 (zebkit component)
//    |   +--------------------------------------------------
//    |   |  p2 (zebkit component)
//    |   |    +---------+      +-----------------------+
//    |   |    |   h1    |      | p3 zebkit component    |
//    |   |    +---------+      |  +---------------+    |
//    |   |                     |  |    h3         |    |
//    |   |    +---------+      |  |  +---------+  |    |
//    |   |    |   h2    |      |  |  |   p4    |  |    |
//    |   |    +---------+      |  |  +---------+  |    |
//    |   |                     |  +---------------+    |
//    |   |                     +-----------------------+
//
//     p1.$domKids : {
//         p2.$domKids : {
//             h1,   // leaf elements are always DOM element
//             h2,
//             p3.$domKids : {
//                h3
//             }
//         }
//     }
    constructor() {
      super();
    }
    
    
    $isInInvisibleState(c) {
        if (c.isVisible === false           ||
            c.$container.parentNode == null ||
            c.width       <= 0              ||
            c.height      <= 0              ||
            c.parent      == null           ||
            web.$contains(c.$container) === false)
        {
            return true;
        }

        var p = c.parent;
        while (p != null && p.isVisible === true && p.width > 0 && p.height > 0) {
            p = p.parent;
        }

        return p != null || pkg.$cvp(c) == null;
    }

    // attach to appropriate DOM parent if necessary
    // c parameter has to be DOM element
    $resolveDOMParent(c) {
        // try to find an HTML element in zebkit (pay attention, in zebkit hierarchy !)
        // hierarchy that has to be a DOM parent for the given component
        var parentElement = null;
        for(var p = c.parent; p != null; p = p.parent) {
            if (p.isDOMElement === true) {
                parentElement = p.$container;
                break;
            }
        }

        // parentElement is null means the component has
        // not been inserted into DOM hierarchy
        if (parentElement != null && c.$container.parentNode == null) {
            // parent DOM element of the component is null, but a DOM container
            // for the element has been detected. We need to add it to DOM
            // than we have to add the DOM to the found DOM parent element
            parentElement.appendChild(c.$container);

            // adjust location of just attached DOM component
            this.$adjustLocation(c);
        } else {
            // test consistency whether the DOM element already has
            // parent node that doesn't match the discovered
            if (parentElement           != null &&
                c.$container.parentNode != null &&
                c.$container.parentNode !== parentElement)
            {
                throw new Error("DOM parent inconsistent state ");
            }
        }
    }

    //    +----------------------------------------
    //    |             ^      DOM1
    //    |             .
    //    |             .  (x,y) -> (xx,yy) than correct left
    //                  .  and top of DOM2 relatively to DOM1
    //    |    +--------.--------------------------
    //    |    |        .       zebkit1
    //    |    |        .
    //    |    |  (left, top)
    //    |<............+-------------------------
    //    |    |        |           DOM2
    //    |    |        |
    //
    //  Convert DOM (x, y) zebkit coordinates into appropriate CSS top and left
    //  locations relatively to its immediate DOM element. For instance if a
    //  zebkit component contains DOM component every movement of zebkit component
    //  has to bring to correction of the embedded DOM elements
    $adjustLocation(c) {
        if (c.$container.parentNode != null) {
            // hide DOM component before move
            // makes moving more smooth
            var prevVisibility = c.$container.style.visibility;
            c.$container.style.visibility = "hidden";

            // find a location relatively to the first parent HTML element
            var p = c, xx = c.x, yy = c.y;
            while (((p = p.parent) != null) && p.isDOMElement !== true) {
                xx += p.x;
                yy += p.y;
            }

            c.$container.style.left = "" + xx + "px";
            c.$container.style.top  = "" + yy + "px";
            c.$container.style.visibility = prevVisibility;
        }
    }

    // iterate over all found children HTML elements
    // !!! pay attention you have to check existence
    // of "$domKids" field before the method calling
    $domElements(c, callback) {
        for (var k in c.$domKids) {
            var e = c.$domKids[k];
            if (e.isDOMElement === true) {
                callback.call(this, e);
            } else {
                // prevent unnecessary method call by condition
                if (e.$domKids != null) {
                    this.$domElements(e, callback);
                }
            }
        }
    }

    compShown(e) {
        // 1) if c is DOM element than we have make it is visible if
        //      -- c.isVisible == true : the component visible  AND
        //      -- all elements in parent chain is visible      AND
        //      -- the component is in visible area
        //
        // 2) if c is not a DOM component his visibility state can have
        //    side effect to his children HTML elements (on any level)
        //    In this case we have to do the following:
        //      -- go through all children HTML elements
        //      -- if c.isVisible == false: make invisible every children element
        //      -- if c.isVisible != false: make visible every children element whose
        //         visibility state satisfies the following conditions:
        //          -- kid.isVisible == true
        //          -- all parent to c are in visible state
        //          -- the kid component is in visible area
        var c = e.source;
        if (c.isDOMElement === true) {
            c.$container.style.visibility = c.isVisible === false || this.$isInInvisibleState(c) ? "hidden"
                                                                                            : "visible";
        } else {
            if (c.$domKids != null) {
                this.$domElements(c, function(e) {
                    e.$container.style.visibility = e.isVisible === false || this.$isInInvisibleState(e) ? "hidden" : "visible";
                });
            }
        }
    }

    compMoved(e) {
        var c = e.source;

        // if we move a zebkit component that contains
        // DOM element(s) we have to correct the DOM elements
        // locations relatively to its parent DOM
        if (c.isDOMElement === true) {
            // root canvas location cannot be adjusted since it is up to DOM tree to do it
            if (c.$isRootCanvas !== true) {
                var dx   = e.prevX - c.x,
                    dy   = e.prevY - c.y,
                    cont = c.$container;

                cont.style.left = ((parseInt(cont.style.left, 10) || 0) - dx) + "px";
                cont.style.top  = ((parseInt(cont.style.top,  10) || 0) - dy) + "px";
            }
        } else {
            if (c.$domKids != null) {
                this.$domElements(c, function(e) {
                    this.$adjustLocation(e);
                });
            }
        }
    }

    detachFromParent(p, c) {
        // DOM parent means the detached element doesn't
        // have upper parents since it is relative to the
        // DOM element
        if (p.isDOMElement !== true && p.$domKids != null) {
            // delete from parent
            delete p.$domKids[c];

            // parent is not DOM and doesn't have kids anymore
            // what means the parent has to be also detached
            if (this.isLeaf(p)) {
                // parent of parent is not null and is not a DOM element
                if (p.parent != null && p.parent.isDOMElement !== true) {
                    this.detachFromParent(p.parent, p);
                }

                // remove $domKids from parent since the parent is leaf
                delete p.$domKids;
            }
        }
    }

    isLeaf(c) {
        if (c.$domKids != null) {
            for(var k in c.$domKids) {
                if (c.$domKids.hasOwnProperty(k)) return false;
            }
        }
        return true;
    }

    removeDOMChildren(c) {
        // DOM element cannot have children dependency tree
        if (c.isDOMElement !== true && c.$domKids != null) {
            for(var k in c.$domKids) {
                if (c.$domKids.hasOwnProperty(k)) {
                    var kid = c.$domKids[k];

                    // DOM element
                    if (kid.isDOMElement === true) {
                        kid.$container.parentNode.removeChild(kid.$container);
                        kid.$container.parentNode = null;
                    } else {
                        this.removeDOMChildren(kid);
                    }
                }
            }
            delete c.$domKids;
        }
    }

    compRemoved(e) {
        var c = e.kid;

        // if detached element is DOM element we have to
        // remove it from DOM tree
        if (c.isDOMElement === true) {
            c.$container.parentNode.removeChild(c.$container);
            c.$container.parentNode = null;
        } else {
            this.removeDOMChildren(c);
        }

        this.detachFromParent(e.source, c);
    }

    compAdded(e) {
        var p = e.source,  c = e.kid;
        if (c.isDOMElement === true) {
            this.$resolveDOMParent(c);
        } else {
            if (c.$domKids != null) {
                this.$domElements(c, function(e) {
                    this.$resolveDOMParent(e);
                });
            } else {
                return;
            }
        }

        if (p.isDOMElement !== true) {
            // we come here if parent is not a DOM element and
            // inserted children is DOM element or an element that
            // embeds DOM elements
            while (p != null && p.isDOMElement !== true) {
                if (p.$domKids == null) {
                    // if reference to kid DOM element or kid DOM elements holder
                    // has bot been created we have to continue go up to parent of
                    // the parent to register the whole chain of DOM and DOM holders
                    p.$domKids = {};
                    p.$domKids[c] = c;
                    c = p;
                    p = p.parent;
                } else {
                    if (p.$domKids.hasOwnProperty(c)) {
                        throw new Error("Inconsistent state for " + c + ", " + c.clazz.$name);
                    }
                    p.$domKids[c] = c;
                    break;
                }
            }
        }
    }
}