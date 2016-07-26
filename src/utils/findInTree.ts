
/**
 * Find by xpath-like path an element in a tree-like structure. The method is flexible way to look up
 * elements in tree structures. The only requirements the passed tree-like structure has to follow is
 * declaring a "kids" array field if the element has a children element. To understand if the given tree
 * element matches the current path fragment a special equality function has to be passed.

        var treeLikeRoot = {
            value : "Root",
            kids : [
                { value: "Item 1" },
                { value: "Item 2" }
            ]
        };

        zebkit.util.findInTree(treeLikeRoot,
                              "/Root/item1",
                              function(item, fragment) {
                                  return item.value == fragment;
                              },
                              function(foundElement) {
                                 ...
                                 // true means stop lookup
                                 return true;
                              });


 * @param  {Object} root a tree root element. If the element has a children element it has to
 * declare "kids" field. This field is an array of all children elements
 * @param  {String}   path a xpath-like path. The path has to satisfy number of requirements
 * and rules:

    - "/" means lookup among all direct children elements
    - "//" means lookup among all children elements recursively
    - "*" means any path value
    -[@attr=100] means number attribute
    -[@attr=true] means boolean attribute
    -[@attr='value'] means string attribute
    - Path has always starts from "/" or "//"
    - Path element always has to be defined: "*" or an symbolic name

 *
 * Path examples:

    - "//*" traverse all tree elements
    - "//*[@a=10]" traverse all tree elements that has an attribute "a" that equals 10
    - "/Root/Item" find an element by exact path

 * @param  {Function}  eq  an equality function. The function gets current evaluated tree element
 * and a path fragment against which the tree element has to be evaluated. It is expected the method
 * returns boolean value to say if the given passed tree element matches the path fragment.
 * @param  {Function} cb callback function that is called every time a new tree element
 * matches the given path fragment. The function has to return true if the tree look up
 * has to be stopped
 * @api  zebkit.util.findInTree()
 * @method findInTree
 */
export const findInTree = function(root, path, eq, cb) {
    var findRE = /(\/\/|\/)?([^\[\/]+)(\[\s*(\@[a-zA-Z_][a-zA-Z0-9_\.]*)\s*\=\s*([0-9]+|true|false|\'[^']*\')\s*\])?/g,
        m = null, res = [];

    function _find(root, ms, idx, cb) {
        function list_child(r, name, deep, cb) {
            if (r.kids != null) {
                for (var i = 0; i < r.kids.length; i++) {
                    var kid = r.kids[i];
                    if (name === '*' || eq(kid, name)) {
                        if (cb(kid)) return true;
                    }

                    if (deep && list_child(kid, name, deep, cb)) {
                        return true;
                    }
                }
            }
            return false;
        }

        if (ms == null || idx >= ms.length) {
            return cb(root);
        }

        var m = ms[idx];
        return list_child(root, m[2], m[1] === "//", function(child) {
            if (m[3] && child[m[4].substring(1)] != m[5]) return false;
            return _find(child, ms, idx + 1, cb);
        });
    }

    var c = 0;
    while (m = findRE.exec(path)) {
        if (m[1] == null || m[2] == null || m[2].trim().length === 0) {
            break;
        }

        c += m[0].length;

        if (m[3] && m[5][0] === "'") m[5] = m[5].substring(1, m[5].length - 1);
        res.push(m);
    }

    if (res.length === 0 || c < path.length) {
        throw new Error("Invalid path: '" + path + "'," + c);
    }

    _find({ kids:[root] }, res, 0, cb);
};

