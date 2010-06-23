Class('KiokuJS.Scope', {
    
    has : {
        backend         : { required : true },
        resolver        : { required : true },
        
        parent          : null,
        
        nodes           : Joose.I.Object
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
                
                nodes       : Joose.O.getMutableCopy(this.nodes)
            })
        },
        
        
        objectToId : function (obj) {
            
            return obj.__ID__
        },
        
        
        idToObject : function (id) {
            
            return this.nodes[ id ].object
        },
        
        
        idToNode : function (id) {

            return this.nodes[ id ]
        },
        
        
        store : function (firstClassNode) {
            this.nodes[ firstClassNode.ID ]    = firstClassNode
        },
        
        
        remove : function () {
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
                
                var resolver    = this.getResolver()
                var backend     = this.getBackend()
                var self        = this
                
                resolver.fetchClasses().then(function () {
                    
                    var collapser = new KiokuJS.Collapser({
                        resolver            : resolver,
                        inliner             : backend.inliner
                    })
                    
                    var firstClassNodes = collapser.collapse(objectWithIds, objectsWithOutIDs)
                    
                    
                    // extracting entry from each first-class node - by design they'll contain a description of whole graph
                    
                    var entries     = Joose.A.map(firstClassNodes, function (node) {
                            
                        self.store(node)
                        
                        return node.getEntry()
                    })
                    
                    backend.insert(entries, self).now()
                    
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


