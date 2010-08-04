Class('KiokuJS.Scope', {
    
    trait   : 'JooseX.CPS',
    
    use     : [ 'KiokuJS.Collapser' ],
    
    
    has : {
        backend         : null,
        
        parent          : null,
        
        // only store the first class nodes (with ID)
        nodesByREFADR   : Joose.I.Object,
        nodesByID       : Joose.I.Object
    },
    
        
    methods : {
        
        getBackend : function () {
            return this.backend || this.parent.getBackend()
        },
        

        getResolver : function () {
            return this.getBackend().resolver
        },
        
        
        deriveChild : function () {
            return new this.constructor({
                parent          : this,
                
                nodesByREFADR   : Joose.O.getMutableCopy(this.nodesByREFADR),
                nodesByID       : Joose.O.getMutableCopy(this.nodesByID)
            })
        },
        
        
        objectToNode : function (obj) {
            return this.nodesByREFADR[ obj.__REFADR__ ]
        },
        
        
        nodeToObject : function (node) {
            var ownNode     = this.nodesByID[ node.ID ]
            
            return ownNode && ownNode.object
        },
        
        
        objectToId : function (obj) {
            return obj.__REFADR__ && this.nodesByREFADR[ obj.__REFADR__ ].ID || null
        },
        
        
        idToObject : function (id) {
            return this.nodesByID[ id ].object
        },
        
        
        idToNode : function (id) {
            return this.nodesByID[ id ]
        },
        
        
        pinNode : function (node) {
            if (node.isLive() && node.object.__REFADR__) this.nodesByREFADR[ node.object.__REFADR__ ] = node
            
            this.nodesByID[ node.ID ] = node
        },
        
        
//        unpinObject : function (object) {
//            delete this.nodesByID[ this.objectToId(object) ]
//            
//            delete this.nodesByREFADR[ object.__REFADR__ ]
//        },
        
        
        idPinned : function (id) {
            return this.nodesByID[ id ] != null
        },
        
        
        nodePinned : function (node) {
            return node.ID && this.nodesByID[ node.ID ] != null
        },
        
        
        objectPinned : function (object) {
            return object.__REFADR__ && this.nodesByREFADR[ object.__REFADR__ ] != null || false
        },
        
        
        getOwnNodes : function () {
            return Joose.O.copyOwn(this.nodesByID)
        },
        
        
        commit : function () {
            var parent = this.parent
            
            if (!parent) throw "Can't commit scope [" + this + "] - no parent scope"
            
            Joose.O.eachOwn(this.nodesByID, function (node, refadr) {
                if (!node.isLive()) throw "Some nodes weren't animated - can't commit scope [" + this + "]"
                
                parent.pinNode(node)
            }, this)
        }
    },
    
    
    continued : {
        
        methods : {
            
            // XXX pass `linker` to the backend to limit prefetching
            lookUp : function () {
                var me          = this
                var ids         = arguments
                var idsToFetch  = []
                
                debugger
                
                Joose.A.each(ids, function (id) {
                    if (typeof id != 'string' && typeof id != 'number') throw "Can only use strings or numbers for ids" 
                    
                    if (!me.idPinned(id)) idsToFetch.push(id)
                })
                
                
                // making linker one-time usable for symmetry with collapser
                var linker = new KiokuJS.Linker({
                    scope       : this.deriveChild()
                })
                
                linker.link(idsToFetch).andThen(function () {
                    
                    linker.scope.commit()
                    
                    var liveObjects = Joose.A.map(ids, function (id) {
                        var object = me.idToObject(id)
                        
                        if (object == null) throw "Can't find the id [" + id + "] in the backend"
                        
                        return object
                    })
                    
                    this.CONTINUE(liveObjects.length > 1 ? liveObjects : liveObjects[0])
                })
            },
            
            
            store : function () {
                this.storeObjects({
                    
                    objectsWithIDs      : {},
                    objectsWithOutIDs   : Array.prototype.slice.call(arguments),
                    
                    mode                : 'store',
                    shallow             : false
                    
                }).now()
            },
            
            
            storeAs : function () {
                var objectsWithOutIDs = Array.prototype.slice.call(arguments)
                
                this.storeObjects({
                    
                    objectsWithIDs      : objectsWithOutIDs.shift(),
                    objectsWithOutIDs   : objectsWithOutIDs,
                    
                    mode                : 'store',
                    shallow             : false
                    
                }).now()
            },
            
            
            update : function () {
                this.storeObjects({
                    
                    objectsWithIDs      : {},
                    objectsWithOutIDs   : Array.prototype.slice.call(arguments),
                    
                    mode                : 'update',
                    shallow             : true
                    
                }).now()
            },
            
            
            deepUpdate : function () {
                this.storeObjects({
                    
                    objectsWithIDs      : {},
                    objectsWithOutIDs   : Array.prototype.slice.call(arguments),
                    
                    mode                : 'update',
                    shallow             : false
                    
                }).now()
            },
            
            
            insert : function () {
                this.storeObjects({
                    
                    objectsWithIDs      : {},
                    objectsWithOutIDs   : Array.prototype.slice.call(arguments),
                    
                    mode                : 'insert',
                    shallow             : true
                    
                }).now()
            },
            
            
            insertAs : function () {
                var objectsWithOutIDs = Array.prototype.slice.call(arguments)
                
                this.storeObjects({
                    
                    objectsWithIDs      : objectsWithOutIDs.shift(),
                    objectsWithOutIDs   : objectsWithOutIDs,
                    
                    mode                : 'insert',
                    shallow             : true
                    
                }).now()
            },
            
            
            // XXX pass mode to the backend and process the result
            storeObjects : function (args) {
                var objectsWithIDs      = args.objectsWithIDs       || {}
                var objectsWithOutIDs   = args.objectsWithOutIDs    || []
                var mode                = args.mode                 || 'store'    
                var shallow             = args.shallow              || false
                
                
                var resolver    = this.getResolver()
                var backend     = this.getBackend()
                var self        = this
                
                resolver.fetchClasses().andThen(function () {
                    
                    var collapser = new KiokuJS.Collapser({
                        backend             : backend,
                        
                        scope               : self,
                        isShallow           : shallow
                    })
                    
                    var firstClassNodes = collapser.collapse(objectsWithIDs, objectsWithOutIDs)
                    
                    // saving only first-class nodes - by design they'll contain a description of the whole graph
                    backend.insert(firstClassNodes, self, mode).andThen(function () {
                        
                        // only pin nodes after successfull insert
                        Joose.A.each(firstClassNodes, self.pinNode, self)
                        
                        var assignedIDs = Joose.A.map(objectsWithOutIDs, self.objectToId, self)
                        
                        this.CONTINUE(assignedIDs.length > 1 ? assignedIDs : assignedIDs[0])
                    })
                })
            },
            
            
            refresh : function () {
            },
            
            
            remove : function () {
//                var self    = this
//                
//                var ids     = Joose.A.map(arguments, function (arg) {
//                    // id
//                    if (typeof arg == 'string') return arg
//                    
//                    // object
//                    return self.objectToId(arg)
//                })
//                
//                
//                var backend  = this.getBackend()
//                
//                backend.remove(ids).now()
            },
            
            
            search : function () {
            }
        }
    }

})


