Class('KiokuJS.Linker', {
    
    trait   : 'JooseX.CPS',
    
    
    use     : 'KiokuJS.Linker.Expander',
    
    
    has : {
        scope           : { required : true },
        
        nodes           : Joose.I.Object
    },
    
        
    methods : {
        
        pinNode : function (node) {
            // ignore nodes for objects in scope
            if (this.scope.idPinned(node.ID)) return
            
            return this.nodes[ node.ID ] = node
        },
        
        
        idPinned : function (id) {
            return this.nodes[ id ] != null || this.scope.idPinned(id)
        },
        
        
        animateEntries : function () {
            var expander = new KiokuJS.Linker.Expander({
                scope   : this.scope
            })
            
            expander.visit(this.nodes)
        }
    },
    
    
    continued : {
        
        methods : {
            
            materialize : function (ids) {
                var me          = this
                var scope       = this.scope
                var backend     = scope.getBackend()
                
                backend.get(ids).then(function (firstClassNodes) {
                    
                    var notFetchedIds   = []
                    
                    // filter the nodes returned from backend to only new ones
                    // (which don't alreday have corresponding object in the scope)
                    // this should allow backends to pre-fetch references (potentially
                    // with extra nodes)
                    var newNodes        = Joose.A.map(firstClassNodes, me.pinNode, me)
                    
                    Joose.A.each(backend.gatherReferences(newNodes), function (refID) {
                        if (!me.idPinned(refID)) notFetchedIds.push(refID)
                    })
                    
                    if (notFetchedIds.length)
                        me.materialize(notFetchedIds).now()
                    else {
                        me.prefetchClasses(me.nodes).then(function () {
                            
                            me.animateEntries()
                            
                            this.CONTINUE()
                        }).now()
                    }
                })
            },
            
            
            prefetchClasses : function (nodes) {
                // gathering classes of the nodes, which needs to be loaded
                var classDescriptors = Joose.O.each(nodes, function (node, id) {
                    
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


