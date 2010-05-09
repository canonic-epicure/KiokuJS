Class('JiojuDB.Reference', {
    
    has : {
        ID          : { required : true }
    }
    
});
Role('JiojuDB.Serializer', {
    
    requires : [ 'serialize', 'deserialize' ]
})

;
Class('JiojuDB.Serializer.JSON', {
    
    isa         : 'Data.Visitor',
    
    does        : 'JiojuDB.Serializer',
    
    
    has : {
        results     : Joose.I.Array,
        
        result      : null
    },
    
        
    methods : {
        
        serialize   : function (data) {
            this.seen       = {}
            this.result     = []
            
            this.visit(data)
            
            return this.result.join('')
        },
        
        
        deserialize : function (string) {
            return eval("var res = " + string + "; res")
        },
        
        
        write : function (str) {
            this.result.push(str)
        },
        
        
        visitValue : function (value) {
            this.write(typeof value == 'string' ? '"' + value.replace(/\"/g, '\\"') + '"' : value)
        },
        
        
        visitObjectKey : function (key, value, object) {
            this.write('"' + key + '":')
        }
    },
    
    
    before : {
        visitObject : function () {
            this.write('{')
        },
        
        
        visitArray : function () {
            this.write('[')
        }
    },
    
    
    after : {
        visitObject : function () {
            var result = this.result
            
            if (result[ result.length - 1 ] == ',') result.pop()
            
            this.write('}')
        },
        
        
        visitArray : function () {
            var result = this.result
            
            if (result[ result.length - 1 ] == ',') result.pop()
            
            this.write(']')
        },
        
        
        visitObjectValue : function () {
            this.write(',')
        },
        
        
        visitArrayEntry : function () {
            this.write(',')
        }
    }
})
;
Class('JiojuDB.TypeMap', {
    
    use     : 'Data.UUID',
    
    
    has : {
        inherit     : false,
        
        intrinsic   : false,
        
        forClass    : {
            required    : true
        },
        
        classVersion    : null,
        isVersionExact  : true 
    },
    
    
    methods : {
        
        getRequiredClasses : function () {
            if (this.classVersion) {
                var obj = {}
                
                obj[ this.forClass ] = this.classVersion
                
                return [ obj ]
            }
            
            return [ this.forClass ]
        },
        
        
        // XXX add versions check
        canHandle : function (className) {
            if (className == this.forClass) return true
            
            if (this.inherit) {
                var classConstructor    = eval(className)
                var forClass            = eval(this.forClass)
                
                if (classConstructor.meta) return classConstructor.meta.isa(forClass)
            }
            
            return false
        },
        
        
        acquireIDFor : function (instance, desiredId) {
            return desiredId != null ? desiredId : Data.UUID.uuid()
        },
        
        
        collapse : function (instance, collapser) {
            throw "Abstract method 'collapse' called for " + this
        },
        
        
//        refresh : function (instance, data, linker) {
//            throw "Abstract method 'refresh' called for " + this
//        },
        
        
        expand : function (data, linker) {
            throw "Abstract method 'expand' called for " + this
        }
        
    }
})
;
Role('JiojuDB.TypeMap.Feature.NoDeps', {
        
    methods : {
        
        getRequiredClasses : function () {
            return []
        }
    }
})
;
Class('JiojuDB.TypeMap.Array', {
    
    isa     : 'JiojuDB.TypeMap',
    
    does    : 'JiojuDB.TypeMap.Feature.NoDeps',
    
    
    has : {
        forClass    : 'Array'
    },
    
        
    methods : {
        
        canHandle : function (className) {
            return className == 'Array'
        },
        
        
        collapse : function (instance, collapser) {
            return Joose.A.map(instance, function (value) {
                
                return collapser.visit(value)
            })
        },
        
        
        refresh : function (instance, data, linker) {
        },
        
        
        expand : function (data, linker) {
        }
    }

})
;
Class('JiojuDB.TypeMap.Object', {
    
    isa     : 'JiojuDB.TypeMap',
    
    does    : 'JiojuDB.TypeMap.Feature.NoDeps',
    
    
    has : {
        forClass    : 'Object'
    },
    
        
    methods : {
        
        canHandle : function (className) {
            return className == 'Object'
        },
        
        
        collapse : function (instance, collapser) {
            var data = {}
            
            Joose.O.eachOwn(instance, function (value, key) {

                data[ key ] = collapser.visit(value)
            })
            
            return data
        },
        
        
        refresh : function (instance, data, linker) {
        },
        
        
        expand : function (data, linker) {
        }
    }

})
;
Class('JiojuDB.TypeMap.Joose', {
    
    isa     : 'JiojuDB.TypeMap',
    
    
    has : {
        forClass    : 'Joose.Meta.Object',
        inherit     : false
    },
    
        
    methods : {
        
        acquireIDFor : function (instance, desiredId) {
            if (instance.meta.does('JiojuDB.Feature.OwnID')) return instance.acquireID(desiredId)
            
            return this.SUPER(instance, desiredId)
        },
        
        
        collapse : function (instance, collapser) {
            
            var data = {}
            
            instance.meta.getAttributes().each(function (attribute, name) {
                
                data[ name ] = collapser.visit(attribute.getRawValueFrom(instance))
            })
            
            return data
        },
        
        
//        refresh : function (instance, collapser) {
//        },
        
        
        expand : function (data, linker) {
        }
    }

})
;
Class('JiojuDB.Resolver', {
    
    trait   : 'JooseX.CPS',
    
    
    has : {
        entries             : Joose.I.Array,
        
        parent              : null,
        
        cache               : Joose.I.Object,
        
        classesFetched      : false
    },
    
    
    methods : {
        
        BUILD   : function (param) {
            if (param instanceof Array) return {
                entries : param
            }
            
            return this.SUPERARG(arguments)
        },
        
        
        initialize : function () {
            
            var entries     = this.entries
            
            Joose.A.each(entries, function (entry, index) {
                    
                entries[ index ] = this.prepareEntry(entry)
                
            }, this)
        },
        
        
        prepareEntry : function (entry) {
            if (!entry) throw "Can't add empty entry to resolver : " + this
            
            if (!Joose.O.isInstance(entry)) {
                var entryClass = eval(entry.meta)
                delete entry.meta
                
                entry = new entryClass(entry)
            }
            
            if (entry instanceof JiojuDB.Resolver) entry.parent = this 
            
            return entry
        },
        

        //XXX implement full CRUD for entries
        addEntry : function (entry) {
            this.entries.push(this.prepareEntry(entry))
            
            this.discardCache()
        },
        
        
        getEntryAt : function (index) {
            return this.entries[ index ]
        },
        
        
        discardCache : function () {
            this.cache              = {}
            this.classesFetched     = false
            
            if (this.parent) this.parent.discardCache()
        },
        
        
        each : function (func, scope) {
            scope = scope || this
            
            return Joose.A.each(this.entries, function (entry) {
                
                if (entry instanceof JiojuDB.Resolver) 
                    return entry.each(func, scope)
                else 
                    return func.call(scope, entry)
            })
        },
        
        
        resolveSingle : function (className) {
            var cache = this.cache
            
            if (cache[ className ]) return cache[ className ]
            
            var typeMap
            
            this.each(function (entry) {
                
                if (entry instanceof JiojuDB.Resolver) { 
                    typeMap = entry.resolveSingle(className)
                    
                    if (typeMap) return false
                } else 
                    if (entry instanceof JiojuDB.TypeMap) { 
                        
                        if (entry.canHandle(className)) {
                            typeMap = entry
                            
                            return false
                        }
                    } else
                        throw "Invalid entry [" + entry + "] in resolver + [" + this + "]"
            })
            
            if (typeMap) return cache[ className ] = typeMap
        },
        
        
        resolveSync : function (classNames) {
            return Joose.A.map(classNames, this.resolveSingle, this)
        }
        
    },
    
    
    continued : {
        
        methods : {
        

            fetchClasses : function () {
                if (this.classesFetched) {
                    this.CONTINUE()
                    
                    return
                }
                
                
                var classes = []
                
                this.each(function (entry) {
                    classes.push.apply(classes, entry.getRequiredClasses())
                })

                
                var me      = this
                var CONT    = this.CONT
                
                use(classes, function () {
                    me.classesFetched = true
                    
                    CONT.CONTINUE()
                })
            },

            
            resolve : function (classNames) {
                (this.classesFetched ? this : this.fetchClasses()).THEN(function () {
                    
                    this.CONTINUE(this.resolveSync(classNames))
                }).now()
            }
        }
    }

})
;
Class('JiojuDB.Resolver.Standard', {
    
    isa         : 'JiojuDB.Resolver',
    
    
    use         : [
        'JiojuDB.TypeMap.Feature.NoDeps',
    
        'JiojuDB.TypeMap.Joose',
        'JiojuDB.TypeMap.Object',
        'JiojuDB.TypeMap.Array'
    ],
    

    
    after : {
        
        initialize : function () {
            
            // the order matter
            
            this.addEntry(new JiojuDB.TypeMap.Joose({
                trait : JiojuDB.TypeMap.Feature.NoDeps,
                
                inherit : true
            }))
            
            this.addEntry(new JiojuDB.TypeMap.Object())
            
            this.addEntry(new JiojuDB.TypeMap.Array())
        }
    }

})
;
Class('JiojuDB.Collapser.Inliner', {
    
    isa         : 'Data.Visitor',
    
    use         : 'JiojuDB.Reference',
    
    
    methods : {
        
        visitFirstClassNode : function (node) {
            return new JiojuDB.Reference({
                ID : node.ID
            })
        },
        
        
        visitJooseInstance : function (node, className) {
            if (!(node instanceof JiojuDB.Node)) throw "Invalid Joose instance [" + node + "] encountered during inlining"
            
            if (node.isFirstClass()) return this.visitFirstClassNode(node)
            
            return node.getEntry()
        },
        
        
        visitArray  : function (array, className) {
            return Joose.A.map(array, function (value, index) {
                
                return this.visit(value)
                
            }, this)
        },
        
        
        visitObject : function (object, className) {
            var res = {}
            
            Joose.O.eachOwn(object, function (value, key) {
                
                res[ key ] = this.visit(value)
            }, this)
            
            return res
        }
    }
})
;
Class('JiojuDB.Collapser.Inliner.JSPON', {
    
    isa         : 'JiojuDB.Collapser.Inliner',
    
    
    methods : {
        
        visitFirstClassNode : function (node) {
            return {
                '$ref' : node.ID
            }
        }
    }
})
;
Class('JiojuDB.Backend', {
    
    trait   : 'JooseX.CPS',
    
    use     : [ 'JiojuDB.Serializer.JSON', 'JiojuDB.Collapser.Inliner.JSPON' ],
    
    
    has : {
        serializer      : function () { return new JiojuDB.Serializer.JSON() }, 
        inliner         : Joose.I.FutureClass('JiojuDB.Collapser.Inliner.JSPON')
    },
    
        
    methods : {
        
        // XXX implement 'handles' for attributes
        serialize : function (entry) {
            return this.serializer.serialize(entry)
        }
    },
    
    
    continued : {
        
        methods : {
            
            get     : function () {
                throw "Abstract method 'get' called for " + this
            },
            
            
            insert  : function () {
                throw "Abstract method 'insert' called for " + this
            },
            
            
            remove  : function () {
                throw "Abstract method 'remove' called for " + this
            },
            
            
            exists  : function () {
                throw "Abstract method 'exists' called for " + this
            }
        }
    }

})
;
Class('JiojuDB.Backend.Hash', {
    
    isa   : 'JiojuDB.Backend',
    
    
    has : {
        entries         : Joose.I.Object
    },
    
        
    continued : {
        
        methods : {
            
            get     : function (idsToGet) {
                var entries = this.entries
                var me      = this
                
                this.CONTINUE(Joose.A.map(idsToGet, function (id) {
                    return entries[ id ] != null ? me.serializer.deserialize(entries[ id ]) : null 
                }))
            },
            
            
            insert  : function (entriesToInsert) {
                var entries         = this.entries
                var serializer      = this.serializer
                
                var res = Joose.A.map(entriesToInsert, function (entry) {
                    entries[ entry.ID ] = serializer.serialize(entry)
                    
                    return entry.ID
                })
                
                this.CONTINUE(res)
            },
            
            
            remove  : function (idsToRemove) {
                var entries = this.entries
                
                Joose.A.each(idsToRemove, function (id) {
                    delete entries[ id ]
                })
                
                this.CONTINUE()
            },
            
            
            exists  : function (idsToCheck) {
                var entries = this.entries
                
                this.CONTINUE(Joose.A.map(idsToCheck, function (id) {
                    return entries[ id ] != null
                }))
            }
        }
    }

})
;
Class('JiojuDB.Node', {
    
    
    has : {
        
        ID          : null,
        
        object      : { required    : true },
        className   : { required    : true },
        
        typeMap     : { required    : true },
        inliner     : { required    : true },
        
        data        : { required    : true },
        
        isRoot      : false,
        
        entry       : {
            is      : 'ro',
            lazy    : 'this.buildEntry'
        }
    },
    

    methods : {
        
        isFirstClass : function () {
            return this.ID != null
        },
        
        
        acquireID : function (desiredId) {
            var object  = this.object
            var ID      = object.__ID__
            
            if (ID) {
                if (ID != desiredId) throw "Attempt to redefine the ID of [" + object + "] from [" + ID + "] to [" + desiredId + "]"
                
                this.ID = ID
                
                return
            }
            
            
            this.ID = object.__ID__ = this.typeMap.acquireIDFor(object, desiredId)
        },
        
        
        buildEntry   : function () {
            
            var entry = {
                
                className       : this.className,
                
                // XXX extract version and traits
                classVersion    : null,
                traits          : null,
                
                data            : this.inliner.visit(this.data)
            }
            
            if (this.ID) entry.ID = this.ID
            
            return entry
        }
    }
});
Class('JiojuDB.Collapser', {
    
    isa         : 'Data.Visitor',
    
    
    use     : [ 'JiojuDB.Node' ],
    
    
    has : {
        refCounts           : Joose.I.Object,
        nodes               : Joose.I.Object, //vertexes
        
        compact             : true,
        
        resolver            : { required : true },
        inliner             : { required : true }
    },
    
        
    
    before : {
        
        markSeen    : function (object) {
            this.refCounts[ object.__REFADR__ ] = 1
        }
        
    },
    
    
    methods : {
        
        visitSeen : function (object) {
            var refAdr = object.__REFADR__
            
            this.refCounts[ refAdr ]++
            
            return this.nodes[ refAdr ]
        },
        
        
        // calls `func` with (object, desiredID) signature for each passed argument
        eachArgument : function (objectWithIds, objectsWithOutIDs, func, scope) {
            Joose.O.each(objectWithIds      || {}, func, scope || this)
            
            Joose.A.each(objectsWithOutIDs  || [], function (argument) {
                
                func.call(scope || this, argument)
            })
        },
        
        
        collapse : function (objectWithIds, objectsWithOutIDs) {
            // sanity checks 
            
            var objectsCounter = 0
            
            this.eachArgument(objectWithIds, objectsWithOutIDs, function (argument) {
                if (argument == null || (typeof argument != 'object' && typeof argument != 'function') ) debugger //throw "Invalid argument [" + argument + "]  to 'collapse'. Can only collapse objects, not values."
                
                objectsCounter++
            })
            
            if (!objectsCounter) throw "Invalid arguments to 'collapse' - no objects to collapse"

            
            // recurse through the graph, accumulating nodes and counting refs
            
            this.visit(objectWithIds, objectsWithOutIDs)
            

            // assume all passed objects are first class, so we need to acquire IDs for them
            
            var nodes               = this.nodes
            var firstClassNodes     = []
            
            this.eachArgument(objectWithIds, objectsWithOutIDs, function (argument, desiredId) {
                var node = nodes[ argument.__REFADR__ ]
                
                node.acquireID(desiredId)
                node.isRoot = true
                
                firstClassNodes.push(node)
            })


            // also marks shared nodes (refCount > 1) and Joose instances (unless intrinsic) as first class (if we are in compact mode) 
            
            var refCounts           = this.refCounts
            
            Joose.O.each(nodes, function (node, refadr) {
                
                if (node.ID != null) return

                if ( (refCounts[ refadr ] > 1 || Joose.O.isInstance(node.object)) && !node.typeMap.intrinsic || !this.compact) {
                    // this makes this node `firstClass` (but not roos
                    node.acquireID()
                    
                    firstClassNodes.push(node)
                }
            }, this)
            
            
            return firstClassNodes
        },
     
        
        getTypeMapFor : function (className) {
            var typeMap = this.resolver.resolveSingle(className)
            
            if (!typeMap) throw "Can't find TypeMap entry for className = [" + className + "]"
            
            return typeMap
        },
        
        
        visitArray : function (instance, className) {
            return this.visitObject(instance, className)
        },
        
        
        visitObject : function (instance, className) {
            var typeMap         = this.getTypeMapFor(className)
            
            var data            = typeMap.collapse(instance, this)
            
            return this.createNode(instance, data, typeMap, className)
        },
        
        
        createNode : function (object, data, typeMap, className) {
            
            return this.nodes[ object.__REFADR__ ] = new JiojuDB.Node({
                object      : object,
                className   : className,
                
                data        : data,
                typeMap     : typeMap,
                inliner     : this.inliner
            })
        }
    }

})


;
Class('JiojuDB.LiveObjects', {
    
    
    has : {
        
//        scope           : {
//            init : function () { return new JiojuDB.LiveObjects.Scope() }
//        },
        
        entries         : Joose.I.Object
        
//        ,
//        
//        objects         : Joose.I.Object
    },
    
        
    methods : {
        
//        newScope    : function () {
//            this.scope = this.scope.deriveChild()
//        },
//        
//        
//        unnestScope : function () {
//            this.scope = this.scope.parent
//        },
        

//        objectToId : function (obj) {
//            
//            return this.objects[ obj.__ID__ ]
//        },
//        
//        
//        idToObject : function (id) {
//            
//            return this.objects[ id ]
//        },
//        
//        
//        idToEntry : function (id) {
//
//            return this.entries[ id ]
//        },
        
        
        store : function (entry) {
//            var ID = entry.ID
//            
//            if (!ID) throw "Can't save entry [" + entry + "] in LiveObjects - it hasn't 'ID'" 
//            
//            this.entries[ ID ] = entry
////            this.objects[ ID ] = entry.object
        }
        
//        ,
//        
//        
//        remove : function () {
//        }
        
//        ,
//        remove : function () {
//        }
    }

})


;
Class('JiojuDB', {
    
    traits  : 'JooseX.CPS',
    
    
    use     : [ 'JiojuDB.Resolver', 'JiojuDB.Resolver.Standard', 'JiojuDB.LiveObjects', 'JiojuDB.Collapser' ],
    
    
    has : {
        resolver            : null,
        backend             : null,
        
        liveObjects         : {
            init    : function () { return new JiojuDB.LiveObjects() }
        }
    },
    
        
    methods : {
        
        initialize : function () {
            
            // wrapping the resolver with the another one, also containig the standard resolving as the lowest-priority
            this.resolver = new JiojuDB.Resolver( 
                (this.resolver ? [ this.resolver ] : []).concat( new JiojuDB.Resolver.Standard() )
            )
        }
    },
    
    
    continued : {
        
        methods : {
            
            lookUp : function () {
            },
            
            
            store : function () {
                this.storeObjects({}, Array.prototype.slice.call(arguments)).now()
            },
            
            
            storeAs : function () {
                var objectsWithOutIDs = Array.prototype.slice.call(arguments)
                
                this.storeObjects(objectsWithOutIDs.shift(), objectsWithOutIDs).now()
            },
            
            
            storeObjects : function (objectWithIds, objectsWithOutIDs) {
                
                this.resolver.fetchClasses().then(function () {
                
                    var collapser = new JiojuDB.Collapser({
                        resolver            : this.resolver,
                        inliner             : this.backend.inliner
                    })
                    
                    var firstClassNodes = collapser.collapse(objectWithIds, objectsWithOutIDs)
                    
                    
                    // extracting entry from each first-class node
                    
                    var liveObjects = this.liveObjects
                    
                    var entries     = Joose.A.map(firstClassNodes, function (node) {
                            
                        var entry = node.getEntry()
                        
                        liveObjects.store(entry)
                        
                        return entry
                    })
                    
                    this.backend.insert(entries).now()
                    
                }, this).now()
            },
            
            
            update : function () {
            },
            
            
            insert : function () {
            },
            
            
            remove : function () {
            },
            
            
            search : function () {
            }
        }
    }

})


// XXX need to keep in sync with original `Joose.O.each`
Joose.O.each = function (object, func, scope) {
    scope = scope || this
    
    for (var i in object) 
        if (i != '__ID__' && i != '__REFADR__')
            if (func.call(scope, object[i], i) === false) return false
    
    if (Joose.is_IE) 
        return Joose.A.each([ 'toString', 'constructor', 'hasOwnProperty' ], function (el) {
            
            if (object.hasOwnProperty(el)) return func.call(scope, object[el], el)
        })
}


Joose.O.isEmpty = function (object) {
    for (var i in object) if (object.hasOwnProperty(i) && i != '__ID__' && i != '__REFADR__') return false
    
    return true
}
;
