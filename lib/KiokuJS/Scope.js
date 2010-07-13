Class('KiokuJS.Scope', {
    
    trait   : 'JooseX.CPS',
    
    use     : [ 'KiokuJS.Collapser' ],
    
    
    has : {
        backend         : null,
        resolver        : null,
        
        parent          : null,
        
        // only store the first class nodes (with ID), referenced by __REFADR__
        nodesByREFADR   : Joose.I.Object,
        nodesByID       : Joose.I.Object
    },
    
        
    methods : {
        
        getBackend : function () {
            return this.backend || this.parent.getBackend()
        },
        

        getResolver : function () {
            return this.resolver || this.parent.getResolver()
        },
        
        
        deriveChild : function () {
            return new this.constructor({
                parent      : this,
                
                objects     : Joose.O.getMutableCopy(this.objects)
            })
        },
        
        
        objectToId : function (obj) {
            return this.nodesByREFADR[ obj.__REFADR__ ].ID
        },
        
        
        idToObject : function (id) {
            return this.nodesByID[ obj.__REFADR__ ].object
        },
        
        
        pinNode : function (node) {
            this.objectsByREFADR[ object.__REFADR__ ]       = { ID : ID, object : object }
            
            this.objectsByID[ ID ]                          = object
        },
        
        
        unpinObject : function (object) {
            delete this.objectsByREFADR[ object.__REFADR__ ]
            
            delete this.objectsByID[ ID ]
        },
        
        
        idPinned : function (id) {
            return this.objectsByID[ id ] != null
        },
        
        
        objectPinned : function (object) {
            return this.objectsByREFADR[ object.__REFADR__ ] != null
        }
    },
    
    
    continued : {
        
        methods : {
            
            // XXX pass `linker` to the backend to limit prefetching
            // XXX or rather create a new scope for fetching and either "commit" it after successfull fetch
            // or rollback in full in case of exception 
            lookUp : function () {
//                var me          = this
//                var ids         = arguments
//                var idsToFetch  = []
//                
//                Joose.A.each(ids, function (id) {
//                    if (typeof id != 'string' && typeof id != 'number') throw "Can only use strings or numbers for ids" 
//                    
//                    if (!me.idPinned(id)) idsToFetch.push(id)
//                })
//                
//                
//                // making linker one-time usable for symmetry with collapser
//                var linker = new KiokuJS.Linker({
//                    scope       : this
//                })
//                
//                linker.link(idsToFetch).then(function () {
//                    
//                    var liveObjects = Joose.A.map(ids, function (id) {
//                        var object = me.idToObject(id)
//                        
//                        if (object == null) throw "Can't find the id [" + id + "] in the backend"
//                        
//                        return object
//                    })
//                    
//                    this.CONTINUE(liveObjects.length > 1 ? liveObjects : liveObjects[0])
//                    
//                }).now()
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
            
            
            // XXX pass mode to the backend and process the result
            storeObjects : function (args) {
                var objectsWithIDs      = args.objectsWithIDs
                var objectsWithOutIDs   = args.objectsWithOutIDs
                var mode                = args.mode    
                var shallow             = args.shallow
                
                
                var resolver    = this.getResolver()
                var backend     = this.getBackend()
                var self        = this
                
                resolver.fetchClasses().then(function () {
                    
                    var collapser = new KiokuJS.Collapser({
                        resolver            : resolver,
                        backend             : backend,
                        
                        scope               : self,
                        mode                : mode,
                        isShallow           : shallow
                    })
                    
                    var firstClassNodes = collapser.collapse(objectsWithIDs, objectsWithOutIDs)
                    
                    Joose.A.each(firstClassNodes, function (node) {
                        self.pinObject(node.object, node.ID)
                    })
                    
                    // saving only first-class nodes - by design they'll contain a description of the whole graph
                    backend.insert(firstClassNodes, self).then(function () {
                        
                        var assignedIDs = Joose.A.map(objectsWithOutIDs, function (obj) {
                            return obj.__ID__
                        })
                        
                        this.CONTINUE(assignedIDs.length > 1 ? assignedIDs : assignedIDs[0])
                        
                    }).now()
                }).now()
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
            
            
            update : function () {
//                var objects   = Array.prototype.slice.call(arguments)
//                var self      = this
//                
//                Joose.A.each(objects, function (object) {
//                    if (!self.objectPinned(object)) throw "Can't update object [" + object + "] - its not in scope"
//                })
//                
//                this.storeObjects({}, objects, 'update').now()
            },
            
            
            insert : function () {
//                var objects = Array.prototype.slice.call(arguments)
//                
//                objects.unshift({})
//                
//                this.insertAs.apply(this, objects).now()
            },
            
            
            insertAs : function () {
//                var objectsWithOutIDs   = Array.prototype.slice.call(arguments)
//                var objectsWithIDs      = objectsWithOutIDs.shift()
//                var self                = this
//                
//                Joose.A.each(objectsWithOutIDs, function (object) {
//                    if (self.objectPinned(object)) throw "Can't insert object [" + object + "] - its already in scope"
//                })
//                
//                Joose.O.each(objectsWithIDs, function (object) {
//                    if (self.objectPinned(object)) throw "Can't insert object [" + object + "] - its already in scope"
//                })
//                
//                this.storeObjects(objectsWithIDs, objectsWithOutIDs, 'insert').now()
            },
            
            
            search : function () {
            }
        }
    }

})


