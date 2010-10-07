Class('KiokuJS.Scope', {
    
    trait   : 'JooseX.CPS',
    
    use     : [ 
        'KiokuJS.Collapser', 
        'KiokuJS.Exception.LookUp',
        
        'KiokuJS.Collapser.Encoder', 
        'KiokuJS.Linker.Decoder', 
        'KiokuJS.Linker.RefGatherer' 
    ],
    
    
    has : {
        backend         : {
            is          : 'ro',
            required    : true
        },
        
//        parent          : null,        
        
        // only store the first class nodes (with ID) & live ones
        nodesByREFADR   : Joose.I.Object,
        nodesByID       : Joose.I.Object,
        
        encoder         : {
            handles     : 'encodeNodes',
            init        : Joose.I.FutureClass('KiokuJS.Collapser.Encoder')
        },
        decoder         : Joose.I.FutureClass('KiokuJS.Linker.Decoder'),
        
        gatherer        : {
            handles     : 'gatherReferences',
            init        : Joose.I.FutureClass('KiokuJS.Linker.RefGatherer')
        }
    },
    
        
    methods : {
        
        getResolver : function () {
            return this.backend.resolver
        },
        
        
        registerProxy : function (object, ID) {
            
            var node = this.backend.createNodeFromObject(object)
            
            // XXX proxy will currently only work, when linking with the `shallowLevel` == 0
            node.immutable  = true
            
            if (!node.isFirstClass()) node.acquireID(ID)
            
            this.pinNode(node)
        },
        
        
//        deriveChild : function (options) {
//            return new this.constructor(Joose.O.copy({
//                parent          : this,
//                
//                nodesByREFADR   : Joose.O.getMutableCopy(this.nodesByREFADR),
//                nodesByID       : Joose.O.getMutableCopy(this.nodesByID)
//            }, options))
//        },        
        
        
        // node *must* be live
        pinNode : function (node) {
            var nodeID = node.ID
            
//            if (!this.hasID(nodeID) || this.hasOwnID(nodeID)) {
                
                if (!node.isLive()) throw "Can pin only live nodes"
                
                this.nodesByID[ nodeID ] = node
                
                var object  = node.getObject()
                
                this.nodesByREFADR[ object.__REFADR__ ] = node
//            } else
//                // XXX no proto inheritance already
//                this.parent.pinNode(node)
        },
        
        
        unpinNode : function (node) {
            var nodeID = node.ID
            
//            if (this.hasOwnID( nodeID )) {
            
                if (!node.isLive()) throw "Can unpin only live node"
                
                delete this.nodesByID[ nodeID ]
                
                var REFADR  = node.getObject().__REFADR__
                
                delete this.nodesByREFADR[ REFADR ]
//            } else
//                // XXX no proto inheritance already
//                this.parent.unpinNode(node)
        },
        

        unpinID : function (id) {
            var node = this.idToNode(id)
            
            if (node) 
                this.unpinNode(node)
            else
                throw "ID [" + id + "] is not in scope - can't unpin it"
        },
        
        
        objectToNode : function (obj) {
            return this.nodesByREFADR[ obj.__REFADR__ ]
        },
        
        
        nodeToObject : function (node) {
            var ownNode     = this.nodesByID[ node.ID ]
            
            return ownNode && ownNode.getObject()
        },
        
        
        objectToId : function (obj) {
            return obj.__REFADR__ && this.nodesByREFADR[ obj.__REFADR__ ].ID || null
        },
        
        
        idToObject : function (id) {
            var node = this.nodesByID[ id ]
            
            return node && node.getObject()
        },
        
        
        idToNode : function (id) {
            return this.nodesByID[ id ]
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
        
        
//        getOwnNodes : function () {
//            return Joose.O.copyOwn(this.nodesByID)
//        },
//        
//        
//        
//        hasID : function (id) {
//            return this.nodesByID[ id ] != null
//        },
//        
//        
//        hasOwnID : function (id) {
//            return this.nodesByID.hasOwnProperty( id )
//        },
        
        
        collapse : function (wIDs, woIDs, options) {
            options             = options || {}
            
            options.backend     = this.getBackend()
            options.scope       = this
            
            return new KiokuJS.Collapser(options).collapse(wIDs, woIDs)
        },
        
        
        encodeNode : function (node) {
            return this.encoder.encodeNodes([ node ])[ 0 ]
        },
        
        
        decodeEntry : function (entry) {
            return this.decoder.decodeEntries([ entry ], this.getBackend())[ 0 ]
        },
        
        
        decodeEntries : function (entries) {
            return this.decoder.decodeEntries(entries, this.getBackend())
        },
        
        
        includeNewObjects : function (wIDs, woIDs) {
            var nodes   = this.collapse(wIDs, woIDs, { isShallow : true })
            
            Joose.A.each(nodes, this.pinNode, this)
            
            var customIDs = []
            
            Joose.O.each(wIDs, function (object, id) {
                customIDs.push(id)
            })
            
            return {
                entries     : this.encodeNodes(nodes),
                customIDs   : customIDs,
                IDs         : Joose.A.map(woIDs, this.objectToId, this)
            }
        }
    },
    
    
    continued : {
        
        methods : {
            
            store : function () {
                this.storeObjects({
                    
                    wIDs        : {},
                    woIDs       : Array.prototype.slice.call(arguments),
                    
                    mode        : 'store',
                    shallow     : false
                    
                }).now()
            },
            
            
            storeAs : function () {
                var woIDs = Array.prototype.slice.call(arguments)
                
                this.storeObjects({
                    
                    wIDs        : woIDs.shift(),
                    woIDs       : woIDs,
                    
                    mode        : 'store',
                    shallow     : false
                    
                }).now()
            },
            
            
            update : function () {
                this.storeObjects({
                    
                    wIDs        : {},
                    woIDs       : Array.prototype.slice.call(arguments),
                    
                    mode        : 'update',
                    shallow     : true
                    
                }).now()
            },
            
            
            deepUpdate : function () {
                this.storeObjects({
                    
                    wIDs        : {},
                    woIDs       : Array.prototype.slice.call(arguments),
                    
                    mode        : 'update',
                    shallow     : false
                    
                }).now()
            },
            
            
            insert : function () {
                this.storeObjects({
                    
                    wIDs        : {},
                    woIDs       : Array.prototype.slice.call(arguments),
                    
                    mode        : 'insert',
                    shallow     : true
                    
                }).now()
            },
            
            
            insertAs : function () {
                var woIDs = Array.prototype.slice.call(arguments)
                
                this.storeObjects({
                    
                    wIDs        : woIDs.shift(),
                    woIDs       : woIDs,
                    
                    mode        : 'insert',
                    shallow     : true
                    
                }).now()
            },
            
            
            
            storeObjects : function (args) {
                var wIDs        = args.wIDs     || {}
                var woIDs       = args.woIDs    || []
                var mode        = args.mode     || 'store'    
                var shallow     = args.shallow  || false
                var setRoot     = args.setRoot
                
                
                var resolver    = this.getResolver()
                var backend     = this.getBackend()
                var self        = this
                
                resolver.fetchClasses().andThen(function () {
                    
                    var firstClassNodes = self.collapse(wIDs, woIDs, {
                        isShallow           : shallow,
                        setRoot             : setRoot != null ? setRoot : true
                    })
                    
                    // saving only first-class nodes - by design they'll contain a description of the whole graph
                    backend.insert(self.encodeNodes(firstClassNodes), mode).andThen(function (entries) {
                        
                        // pin nodes only after successfull insert and only those not pinned yet 
                        Joose.A.each(firstClassNodes, function (node, index) {
                            
                            node.consumeEntry(entries[ index ])
                            
                            if (!self.nodePinned(node)) self.pinNode(node)
                        })
                        
                        this.CONTINUE.apply(this, Joose.A.map(woIDs, self.objectToId, self))
                    })
                })
            },
            
            
            remove : function () {
                var me          = this
                
                var entriesOrIds  = Joose.A.map(arguments, function (arg) {
                    // id
                    // trying to replace an ID with entry where possible, as it has more information attached
                    if (typeof arg == 'string') return me.idPinned(arg) ? me.idToNode(arg).getEntry() : arg
                    
                    // object
                    if (!me.objectPinned(arg)) 
                        throw new KiokuJS.Exception.Remove({
                            message : "Can't remove object [" + arg + "] - its not in the scope"
                        })
                    
                    return me.objectToNode(arg).getEntry()
                })
                
                
                var backend  = this.getBackend()
                
                backend.remove(entriesOrIds).andThen(function () {
                    
                    Joose.A.each(entriesOrIds, function (entryOrId) {
                        
                        me.unpinID(typeof entryOrId == 'string' ? entryOrId : entryOrId.ID)
                    })
                    
                    this.CONTINUE()
                })
            },
            
            
            animatePacket : function (packet) {
                var me          = this
                
                var linker = new KiokuJS.Linker({
                    scope       : this,
                    
                    entries     : packet.entries // entries will be converted from Array to Object (by ID)
                })
                
                var entries         = linker.entries
                var notFetchedRefs  = []
                
                Joose.A.each(this.gatherReferences(entries), function (refID) {
                    if (entries[ refID ]) return
                    
                    if (!me.idPinned(refID)) notFetchedRefs.push(refID)
                })
                
                
                linker.link(notFetchedRefs, 0).andThen(function () {
                    
                    var objects = {}
                    
                    Joose.A.each(packet.customIDs, function (id) { 
                        objects[ id ] = me.idToObject(id)
                    })
                    
                    this.CONTINUE.apply(this, [ objects, Joose.A.map(packet.IDs, me.idToObject, me) ])
                })
            },            
            
            
            // `idsToFetch` - array of ids to fetch and materialize from backend 
            // `shallowLevel == 0` - means stop fetching at the nodes already in scope 
            // `shallowLevel == 1` - means fetching the passed `idsToFetch` anyway, but stop on further references 
            // `shallowLevel == 2` - full deep refresh 
            fetch : function (idsToFetch, shallowLevel) {
                var me          = this
                
                // linker will have an access to backend through the scope
                var linker = new KiokuJS.Linker({
                    scope       : this
                })
                
                linker.link(idsToFetch, shallowLevel).andThen(function () {
                    
                    this.CONTINUE.apply(this, Joose.A.map(idsToFetch, me.idToObject, me))
                })
            },
            
            
            lookUp : function () {
                this.fetch(Array.prototype.slice.call(arguments), 0).now()
            },
            
            
            refresh : function () {
                var me              = this
                var idsToFetch      = []
                
                Joose.A.each(arguments, function (object) {
                    if (!me.objectPinned(object)) throw "Can only refresh objects in scope" 
                    
                    idsToFetch.push(me.objectToId(object))
                })
                
                this.fetch(idsToFetch, 1).now()
            },
            
            
            deepRefresh : function () {
                var me              = this
                var idsToFetch      = []
                
                Joose.A.each(arguments, function (object) {
                    if (!me.objectPinned(object)) throw "Can only refresh objects in scope" 
                    
                    idsToFetch.push(me.objectToId(object))
                })
                
                this.fetch(idsToFetch, 2).now()
            },
            
            
            search : function () {
                var backend = this.getBackend()
                
                backend.search(this, arguments).now()
            }
        }
    }

})


