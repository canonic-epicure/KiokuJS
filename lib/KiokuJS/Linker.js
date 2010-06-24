Class('KiokuJS.Linker', {
    
    trait   : 'JooseX.CPS',
    
    
    has : {
        scope           : { required : true },
        
        nodes           : Joose.I.Object
    },
    
        
    methods : {
        
        pinNode : function (serializedEntry) {
            return this.nodes[ node.ID ] = node
        },
        
        
        idPinned : function (id) {
            return this.nodes[ id ] != null || this.scope.idPinned(id)
        },
        
        
        animateEntries : function (nodes) {
            var expander = new KiokuJS.Expander({
                scope   : this.scope
            })
            
            
            expander.visit(this.nodes)
        }
    },
    
    
    continued : {
        
        methods : {
            
            // at this point node should have classes fetched
            materialize : function (ids) {
                var me          = this
                var scope       = this.scope
                var backend     = scope.getBackend()
                var outliner    = backend.outliner
                var resolver    = scope.getResolver()
                
                backend.get(ids).then(function (nodes) {
                    
                    var notFetchedIds = []
                    
                    Joose.A.each(outliner.gatherReferences(deserializedEntries), function (refID) {
                        if (!me.idPinned(refID)) notFetchedIds.push(refID)
                    })
                    
                    if (notFetchedIds.length)
                        me.materialize(notFetchedIds).now()
                    else {
                        me.animateEntries()
                        
                        this.CONTINUE()
                    }
                })
            },
            
            
            prefetchClasses : function (nodes) {
                // gathering classes of the nodes, which needs to be loaded
                var classDescriptors = Joose.A.map(nodes, function (node) {
                    
                    if (node.classVersion) return { type : 'joose', token : node.className, version : node.classVersion }
                    
                    return node.className
                })
                
                use(classDescriptors, this.getCONTINUE())
            },
            
            
            link : function (ids) {
                // fetching resolver's classes (in case it has been mutated)
                this.scope.getResolver().fetchClasses().then(function () {
                    
                    this.materialize(ids).now()
                    
                }, this).now()
            }
        }
    }
    

})


