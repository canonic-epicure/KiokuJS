Class('KiokuJS.Scope', {
    
    trait   : 'JooseX.CPS',
    
    use     : [ 'KiokuJS.Collapser', 'KiokuJS.Exception.LookUp' ],
    
    
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
            var node = this.nodesByID[ id ]
            
            return node && node.object
        },
        
        
        idToNode : function (id) {
            return this.nodesByID[ id ]
        },
        
        
        pinNode : function (node) {
            if (node.isLive() && node.object.__REFADR__) this.nodesByREFADR[ node.object.__REFADR__ ] = node
            
            this.nodesByID[ node.ID ] = node
        },
        
        
        unpinID : function (id) {
            var node = this.idToNode(id)
            
            if (node) this.unpinNode(node)
        },
        
        
        unpinNode : function (node) {
            if (this.nodesByID.hasOwnProperty( node.ID )) {
            
                delete this.nodesByID[ node.ID ]
                
                if (!node.isLive() || !node.object.__REFADR__) throw "Can't unpin node w/o object" 
                
                delete this.nodesByREFADR[ node.object.__REFADR__ ]
            } else
                this.parent.unpinNode(node)
        },
        
        
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
        
        
        hasOwnID : function (id) {
            return this.nodesByID.hasOwnProperty( id )
        },
        
        
        // XXX should re-pin nodes to the scope which `hasOwn` them (or to up-nearest parent) 
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
                        
                        // pin nodes only after successfull insert and only those not pinned yet 
                        Joose.A.each(firstClassNodes, function (node) {
                            
                            if (!self.nodePinned(node)) self.pinNode(node)
                        })
                        
                        var assignedIDs = Joose.A.map(objectsWithOutIDs, self.objectToId, self)
                        
                        this.CONTINUE(assignedIDs.length > 1 ? assignedIDs : assignedIDs[0])
                    })
                })
            },
            
            
            remove : function () {
                var me          = this
                
                var nodesOrIds  = Joose.A.map(arguments, function (arg) {
                    // id
                    // trying to replace an ID with Node where possible, as it has more information attached
                    if (typeof arg == 'string') return me.idPinned(arg) ? me.idToNode(arg) : arg
                    
                    // object
                    if (!me.objectPinned(arg)) 
                        throw new KiokuJS.Exception.Remove({
                            message : "Can't remove object [" + arg + "] - its not in the scope"
                        })
                    
                    return me.objectToNode(arg)
                })
                
                
                var backend  = this.getBackend()
                
                backend.remove(nodesOrIds).andThen(function () {
                    
                    Joose.A.each(nodesOrIds, function (nodeOrId) {
                        // id
                        if (typeof nodeOrId == 'string')
                            me.unpinID(nodeOrId)
                        // node
                        else
                            me.unpinNode(nodeOrId)
                    })
                    
                    this.CONTINUE()
                })
            },
            
            
            // `idsToFetch` - array of ids to fetch and materialize from backend 
            // `idsToMap`   - array of ids to convert into objects after fetch operation 
            // `shallowLevel == 0` - means stop fetching at the nodes already in scope 
            // `shallowLevel == 1` - means fetching the passed `idsToFetch` anyway, but stop on further references 
            // `shallowLevel == 2` - full deep refresh 
            fetch : function (idsToFetch, idsToMap, shallowLevel) {
                var me          = this
                
                var child       = this.deriveChild()
                
                // linker will have an access to backend through the scope
                var linker = new KiokuJS.Linker({
                    scope       : child
                })
                
                linker.link(idsToFetch, shallowLevel).andThen(function () {
                    
                    var liveObjects = Joose.A.map(idsToMap, function (id) {
                        var object = child.idToObject(id)
                        
                        if (object == null) throw new KiokuJS.Exception.LookUp({ message : "Can't find the id [" + id + "] in the backend" })
                        
                        return object
                    })
                    
                    // only commit the newly fetched objects after fully successfull link
                    child.commit()
                    
                    this.CONTINUE(liveObjects.length > 1 ? liveObjects : liveObjects[0])
                })
            },
            
            
            lookUp : function () {
                var me          = this
                var ids         = arguments
                var idsToFetch  = []
                
                Joose.A.each(ids, function (id) {
                    if (typeof id != 'string' && typeof id != 'number') throw "Can only use strings or numbers for ids in `lookUp`" 
                    
                    if (!me.idPinned(id)) idsToFetch.push(id)
                })
                
                this.fetch(idsToFetch, ids, 0).now()
            },
            
            
            refresh : function () {
                var me              = this
                var idsToFetch      = []
                
                Joose.A.each(arguments, function (object) {
                    if (!me.objectPinned(object)) throw "Can only refresh objects in scope" 
                    
                    idsToFetch.push(me.objectToId(object))
                })
                
                this.fetch(idsToFetch, idsToFetch, 1).now()
            },
            
            
            deepRefresh : function () {
                var me              = this
                var idsToFetch      = []
                
                Joose.A.each(arguments, function (object) {
                    if (!me.objectPinned(object)) throw "Can only refresh objects in scope" 
                    
                    idsToFetch.push(me.objectToId(object))
                })
                
                this.fetch(idsToFetch, idsToFetch, 2).now()
            },
            
            
            search : function () {
                var backend = this.getBackend()
                
                backend.search(this, arguments).now()
            }
        }
    }

})


