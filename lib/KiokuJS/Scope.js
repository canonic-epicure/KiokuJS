Class('KiokuJS.Scope', {
    
    trait : 'JooseX.CPS',
    
    use     : [ 'KiokuJS.Collapser' ],
    
    
    has : {
        backend         : null,
        resolver        : null,
        
        parent          : null,
        
        // only store the first class objects (with ID)
        objects         : Joose.I.Object
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
                
                objects       : Joose.O.getMutableCopy(this.objects)
            })
        },
        
        
        objectToId : function (obj) {
            
            return obj.__ID__
        },
        
        
        idToObject : function (id) {
            
            return this.objects[ id ]
        },
        
        
        pinObject : function (object) {
            this.objects[ object.__ID__ ]    = object
        },
        
        
        unpinObject : function (object) {
            delete this.objects[ object.__ID__ ]
        },
        
        
        idPinned : function (id) {
            return this.objects[ id ] != null
        }
    },
    
    
    continued : {
        
        methods : {
            
            lookUp : function () {
                var me          = this
                var ids         = arguments
                var idsToFetch  = []
                
                Joose.A.each(ids, function (id) {
                    if (typeof id != 'string' && typeof id != 'number') throw "Can only use strings or numbers for ids" 
                    
                    if (!me.idPinned(id)) idsToFetch.push(id)
                })
                
                
                // making linker one-time usable for symmetry with collapser
                var linker = new KiokuJS.Linker({
                    scope       : this
                })
                
                linker.link(idsToFetch).then(function () {
                    
                    var liveObjects = Joose.A.map(ids, me.idToObject, me)
                    
                    this.CONTINUE(liveObjects.length > 1 ? liveObjects : liveObjects[0])
                    
                }).now()
            },
            
            
            store : function () {
                this.storeObjects({}, Array.prototype.slice.call(arguments)).now()
            },
            
            
            storeAs : function () {
                var objectsWithOutIDs = Array.prototype.slice.call(arguments)
                
                this.storeObjects(objectsWithOutIDs.shift(), objectsWithOutIDs).now()
            },
            
            
            storeObjects : function (objectWithIds, objectsWithOutIDs) {
                
                var resolver    = this.getResolver()
                var backend     = this.getBackend()
                var self        = this
                
                resolver.fetchClasses().then(function () {
                    
                    var collapser = new KiokuJS.Collapser({
                        resolver            : resolver,
                        inliner             : backend.inliner
                    })
                    
                    var firstClassNodes = collapser.collapse(objectWithIds, objectsWithOutIDs)
                    
                    
                    // extracting entry from each first-class node - by design they'll contain a description of the whole graph
                    
                    Joose.A.each(firstClassNodes, function (node) {
                        self.pinObject(node.object)
                    })
                    
                    backend.insert(firstClassNodes, self).then(function () {
                        
                        var assignedIDs = Joose.A.map(objectsWithOutIDs, function (obj) {
                            return obj.__ID__
                        })
                        
                        this.CONTINUE(assignedIDs.length > 1 ? assignedIDs : assignedIDs[0])
                        
                    }).now()
                }).now()
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


